import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/config/config";
import useAuthStore from "@/stores/authStore";

export const Route = createFileRoute("/oauth/microsoft")({
  component: RouteComponent,
});

interface OAuthCallbackResponse {
  success: boolean;
  message?: string;
  employee?: {
    id: string;
    full_name: string;
    email: string;
    current_position: string;
  };
  access_token?: string;
  refresh_token?: string;
}

function RouteComponent() {
  const navigate = useNavigate();
  const { login, setLoading, logout } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const hasProcessedRef = useRef(false);

  const handleOAuthCallback = useCallback(
    async (code: string, state: string) => {
      try {
        setStatus("loading");
        setLoading(true);

        const response = await axios.post<OAuthCallbackResponse>(
          `${API_URL}/auth/microsoft/callback`,
          {
            code,
            state,
          },
          {
            timeout: 15000, // 15 seconds timeout for OAuth
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Check if we have all required auth data
          if (
            response.data.employee &&
            response.data.access_token &&
            response.data.refresh_token
          ) {
            // Update auth store with login data
            login({
              employee: response.data.employee,
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            });

            setStatus("success");
            setMessage(
              response.data.message ||
                `Chào mừng, ${response.data.employee.full_name}!`
            );

            // Show success toast
            toast.success("Đăng nhập thành công! 🎉", {
              description: `Chào mừng trở lại, ${response.data.employee.full_name}`,
            });

            // Get redirect URL from session storage or default to home
            const redirectUrl = sessionStorage.getItem("login_redirect") || "/";
            sessionStorage.removeItem("login_redirect");

            // Redirect after 2 seconds
            setTimeout(() => {
              navigate({ to: redirectUrl });
            }, 2000);
          } else {
            throw new Error("Dữ liệu xác thực không đầy đủ từ server");
          }
        } else {
          throw new Error(response.data.message || "Xác thực thất bại");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");

        // Make sure to logout any partial auth state
        logout();

        let errorMessage = "Có lỗi không xác định xảy ra";

        if (axios.isAxiosError(error)) {
          if (error.code === "ECONNABORTED") {
            errorMessage =
              "Timeout: Không thể kết nối đến server. Vui lòng thử lại.";
          } else if (error.response?.status === 400) {
            errorMessage =
              "Thông tin xác thực không hợp lệ. Vui lòng đăng nhập lại.";
          } else if (error.response?.status === 401) {
            errorMessage =
              "Xác thực thất bại. Vui lòng kiểm tra tài khoản Microsoft.";
          } else if (
            error.response?.status !== undefined &&
            error.response.status >= 500
          ) {
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = `Lỗi kết nối: ${error.message}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setMessage(errorMessage);

        // Show error toast
        toast.error("Đăng nhập thất bại", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading, navigate, logout]
  );

  const handleRetry = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      setIsRetrying(true);
      hasProcessedRef.current = false; // Reset để cho phép retry
      handleOAuthCallback(code, state).finally(() => {
        setIsRetrying(false);
      });
    } else {
      toast.error("Không thể thử lại", {
        description: "Thiếu thông tin xác thực. Vui lòng đăng nhập lại.",
      });
      handleGoBack();
    }
  };

  const handleGoBack = () => {
    // Clear any partial auth state
    logout();

    // Clear the redirect URL since we're going back to login
    sessionStorage.removeItem("login_redirect");

    // Navigate to login page
    navigate({ to: "/auth/login" });
  };

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const processOAuthCallback = async () => {
      // Get parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      // Check for OAuth errors from Microsoft
      if (error) {
        setStatus("error");
        let errorMessage = `OAuth Error: ${error}`;

        // Handle specific OAuth errors
        switch (error) {
          case "access_denied":
            errorMessage =
              "Bạn đã từ chối quyền truy cập. Vui lòng thử lại và chấp nhận quyền truy cập.";
            break;
          case "invalid_request":
            errorMessage = "Yêu cầu không hợp lệ. Vui lòng thử đăng nhập lại.";
            break;
          case "invalid_client":
            errorMessage =
              "Ứng dụng không được cấu hình đúng. Vui lòng liên hệ quản trị viên.";
            break;
          case "server_error":
            errorMessage = "Lỗi server Microsoft. Vui lòng thử lại sau.";
            break;
          default:
            if (errorDescription) {
              errorMessage += ` - ${errorDescription}`;
            }
        }

        setMessage(errorMessage);
        toast.error("Lỗi Microsoft OAuth", {
          description: errorMessage,
        });
        return;
      }

      // Validate required parameters
      if (!code) {
        setStatus("error");
        setMessage(
          "Không nhận được mã xác thực từ Microsoft. Vui lòng thử đăng nhập lại."
        );
        toast.error("Lỗi xác thực", {
          description: "Thiếu mã xác thực từ Microsoft",
        });
        return;
      }

      if (!state) {
        setStatus("error");
        setMessage(
          "Thiếu thông tin state. Có thể có lỗi bảo mật. Vui lòng thử lại."
        );
        toast.error("Lỗi bảo mật", {
          description: "Thiếu thông tin state trong callback",
        });
        return;
      }

      // Process the OAuth callback
      await handleOAuthCallback(code, state);
    };

    processOAuthCallback();
  }, [handleOAuthCallback]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Đang xác thực với Microsoft...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium text-green-700">{message}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Đang chuyển hướng đến trang chủ...
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={handleGoHome} variant="outline" size="sm">
                Đi đến trang chủ ngay
              </Button>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <Alert variant="destructive">
              <AlertDescription className="text-center">
                {message}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                variant="outline"
                className="flex-1"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang thử lại...
                  </>
                ) : (
                  "Thử lại"
                )}
              </Button>
              <Button onClick={handleGoBack} variant="ghost" className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <img
              src="/1-1694049602.png"
              alt="EMS Logo"
              className="h-8 rounded-lg"
            />
            Microsoft OAuth
          </CardTitle>
          <CardDescription>
            Đang xử lý thông tin đăng nhập Microsoft của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
