// Login.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LoginFormData } from "@/types/login";
import { useFormValidation } from "@/hooks/useFormValidation";
import { urlUtils } from "@/utils/urlUtils";
import { authService } from "@/service/auth";
import { MicrosoftIcon } from "./common/icon/Microsoft";
import useAuthStore from "@/stores/authStore";
import { guestOnlyPage } from "./auth/GuestWrapper";
import {
  getAndClearRedirectUrl,
  storeRedirectUrl,
} from "@/utils/redirectUtils";

const Login = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading: authLoading } = useAuthStore();

  const [formData, setFormData] = React.useState<LoginFormData>({
    employee_id: null,
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [generalError, setGeneralError] = React.useState<string | null>(null);
  const { errors, validateEmployeeId, validatePassword, clearErrors } =
    useFormValidation();

  // Check for error in URL params (from callback failures)
  React.useEffect(() => {
    const error = urlUtils.getErrorFromUrl();
    if (error) {
      const errorMessage = urlUtils.getErrorMessage(error);
      toast.error("Login Error", {
        description: errorMessage,
      });
      urlUtils.cleanUrl();
    }
  }, []);

  const handleInputChange =
    (field: keyof LoginFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        setGeneralError(null);

        // Clear field-specific error when user starts typing
        if (errors[field]) {
          const newErrors = { ...errors };
          delete newErrors[field];
        }
      };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    clearErrors();

    // Validate form
    const isEmployeeIdValid = validateEmployeeId(formData.employee_id);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmployeeIdValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      const data = await authService.loginWithEmployeeId(formData);

      if (data.employee && data.access_token && data.refresh_token) {
        // Update auth store
        login({
          employee: data.employee,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        toast.success("Login successful 🎉", {
          description: `Welcome back, ${data.employee.full_name}!`,
        });

        // Get redirect URL from stored session or default to home
        const redirectTo = getAndClearRedirectUrl("/");

        // Navigate to intended page using TanStack Router

        // Use TanStack Router navigate
        setTimeout(() => {
          navigate({ to: redirectTo as any });
        }, 100); // Small delay to ensure state is updated
      } else {
        const errorMessage = data.error || "Login failed";
        setGeneralError(errorMessage);
        toast.error("Login failed", {
          description: errorMessage || "Invalid employee ID or password",
        });
      }
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401
      ) {
        const errorMessage = "Invalid employee ID or password";
        setGeneralError(errorMessage);
        toast.error("Authentication Error", {
          description: errorMessage,
        });
        return;
      }
      console.error("Employee login error:", error);
      const errorMessage = "Unable to connect to server. Please try again.";
      setGeneralError(errorMessage);
      toast.error("Connection Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    setGeneralError(null);

    try {
      // Store current URL for redirect after Microsoft login (if not already stored)
      if (typeof window !== "undefined") {
        const currentRedirect = sessionStorage.getItem("login_redirect");
        if (!currentRedirect) {
          storeRedirectUrl("/");
        }
      }

      await authService.redirectToMicrosoftLogin();
    } catch (error) {
      console.error("Microsoft login error:", error);
      setIsMicrosoftLoading(false);
      toast.error("Microsoft Login Error", {
        description: "Failed to redirect to Microsoft login",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show loading if auth is still loading
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* General Error Alert */}
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {/* Microsoft Login Button */}
          <Button
            variant="outline"
            onClick={handleMicrosoftLogin}
            disabled={isLoading || isMicrosoftLoading}
            className="w-full relative"
          >
            {isMicrosoftLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MicrosoftIcon />
            )}
            <span className="ml-2">
              {isMicrosoftLoading
                ? "Redirecting..."
                : "Continue with Microsoft"}
            </span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with Employee ID
              </span>
            </div>
          </div>

          {/* Employee ID/Password Form */}
          <form onSubmit={handleEmployeeLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                type="text"
                value={formData.employee_id ?? ""}
                onChange={handleInputChange("employee_id")}
                placeholder="Enter your employee ID"
                disabled={isLoading || isMicrosoftLoading}
                className={errors.employee_id ? "border-destructive" : ""}
                autoComplete="username"
              />
              {errors.employee_id && (
                <p className="text-sm text-destructive">{errors.employee_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  placeholder="Enter your password"
                  disabled={isLoading || isMicrosoftLoading}
                  className={
                    errors.password ? "border-destructive pr-10" : "pr-10"
                  }
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading || isMicrosoftLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isMicrosoftLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <Link
            to="/auth/forgot-password"
            className=" text-sm  block text-right underline  hover:text-primary"
          >
            Forgot password?
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default guestOnlyPage(Login);
