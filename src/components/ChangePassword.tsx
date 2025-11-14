import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { authService } from "@/service/auth";
import { toast } from "sonner";
import { PasswordRequirements } from "./employee/password/PasswordRequirement";

export default function ChangePasswordPage() {
  // States for form fields
  const [oldPassword, setOldPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States for UI
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for steps
  const [isOldPasswordVerified, setIsOldPasswordVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Loading states
  const [isVerifyingOldPassword, setIsVerifyingOldPassword] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    oldPassword: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Countdown OTP
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  // Handle verify old password
  // Format timer (mm:ss)
  const formatOtpTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOldPassword = async () => {
    if (!oldPassword) {
      setErrors((prev) => ({
        ...prev,
        oldPassword: "Please enter your old password",
      }));
      return;
    }

    setIsVerifyingOldPassword(true);

    try {
      const data = await authService.verifyOldPassword(oldPassword);

      setIsOldPasswordVerified(true);
      setIsOtpSent(true);
      setOtpTimer(300);
      setCanResendOtp(false);

      toast.success("Password Verified!", {
        description: data.message || "OTP has been sent to your email",
      });

      setErrors((prev) => ({ ...prev, oldPassword: "" }));
    } catch (error: any) {
      console.error("=== ERROR CAUGHT ===");
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      const errorMsg = "Incorrect password. Please try again.";

      toast.error("Verification Failed", {
        description: errorMsg,
      });

      setErrors((prev) => ({ ...prev, oldPassword: errorMsg }));
    } finally {
      setIsVerifyingOldPassword(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    try {
      toast.info("Resending OTP...");
      await authService.verifyOldPassword(oldPassword);

      setOtpTimer(300);
      setCanResendOtp(false);
      setOtp("");
      setIsOtpVerified(false);

      toast.success("OTP Resent!", {
        description: "A new OTP has been sent to your email",
      });
    } catch (error: any) {
      toast.error("Failed to resend OTP", {
        description: "Please try again later",
      });
    }
  };

  // Handle OTP input with verification
  const handleOtpChange = async (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      setIsVerifyingOtp(true);
      setErrorMessage("");

      try {
        await authService.verifyOtp(value);

        setIsOtpVerified(true);
        setSuccessMessage("OTP verified! You can now set your new password.");
        setErrors((prev) => ({ ...prev, otp: "" }));
      } catch (error: any) {
        console.error("Verify OTP error:", error);

        let errorMsg = "Invalid or expired OTP";

        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          if (typeof detail === "string") {
            errorMsg = detail;
          }
        }

        setErrors((prev) => ({ ...prev, otp: errorMsg }));
        setIsOtpVerified(false);
      } finally {
        setIsVerifyingOtp(false);
      }
    } else {
      setIsOtpVerified(false);
      if (successMessage.includes("OTP")) {
        setSuccessMessage("");
      }
    }
  };

  // Validate new password with all rules
  const validateNewPasswordField = (password: string) => {
    if (!password) {
      return "";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one digit";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (password === oldPassword) {
      return "New password must be different from old password";
    }
    return "";
  };

  // Validate new password
  const validateNewPassword = () => {
    let isValid = true;

    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      isValid = false;
    } else {
      const error = validateNewPasswordField(newPassword);
      if (error) {
        setErrors((prev) => ({ ...prev, newPassword: error }));
        isValid = false;
      } else {
        setErrors((prev) => ({ ...prev, newPassword: "" }));
      }
    }

    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }

    return isValid;
  };

  // Handle save new password
  const handleSavePassword = async () => {
    if (!validateNewPassword()) {
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Validation Error", {
        description: "OTP is required to change password",
      });
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await authService.changePassword(
        newPassword,
        confirmPassword,
        otp
      );

      toast.success("Password Changed Successfully!", {
        description: data.message || "You can now login with your new password",
      });

      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (error: any) {
      console.error("Save password error:", error);

      let errorMsg = "Failed to change password. Please try again.";

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        if (Array.isArray(detail)) {
          let hasFieldError = false;
          detail.forEach((err: any) => {
            const field = err.loc?.[1];
            const message = err.msg;

            if (field === "new_password") {
              setErrors((prev) => ({ ...prev, newPassword: message }));
              hasFieldError = true;
            } else if (field === "confirm_password") {
              setErrors((prev) => ({ ...prev, confirmPassword: message }));
              hasFieldError = true;
            }
          });

          if (hasFieldError) {
            // ❌ TOAST ERROR CHO VALIDATION
            toast.error("Validation Error", {
              description: "Please check the highlighted fields",
            });
            return;
          }
        } else if (typeof detail === "string") {
          errorMsg = detail;
        } else if (typeof detail === "object" && detail.message) {
          errorMsg = detail.message;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      // ❌ TOAST ERROR CHUNG
      toast.error("Failed to Change Password", {
        description: errorMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };
  // Reset form
  const resetForm = () => {
    setOldPassword("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setIsOldPasswordVerified(false);
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setErrors({
      oldPassword: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
    setSuccessMessage("");
    setErrorMessage("");
  };

  useEffect(() => {
    if (isOtpSent && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOtpSent, otpTimer]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Follow the steps below to securely change your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success/Error Messages */}
            {successMessage && (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Verify Old Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    isOldPasswordVerified
                      ? "bg-green-500 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {isOldPasswordVerified ? "✓" : "1"}
                </div>
                <h3 className="font-medium">Verify Old Password</h3>
              </div>

              <div className="ml-8 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Old Password *</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !isOldPasswordVerified &&
                          !isVerifyingOldPassword
                        ) {
                          e.preventDefault();
                          handleVerifyOldPassword();
                        }
                      }}
                      placeholder="Enter your current password"
                      disabled={isOldPasswordVerified}
                      className={errors.oldPassword ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      disabled={isOldPasswordVerified}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-sm text-destructive">
                      {errors.oldPassword}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleVerifyOldPassword}
                  disabled={isOldPasswordVerified || isVerifyingOldPassword}
                  className="w-full sm:w-auto"
                >
                  {isVerifyingOldPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : isOldPasswordVerified ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4 " />
                      Verify & Send OTP
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Step 2: Verify OTP */}
            {isOtpSent && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isOtpVerified
                        ? "bg-green-500 text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {isOtpVerified ? "✓" : "2"}
                  </div>
                  <h3 className="font-medium">Verify OTP</h3>
                </div>

                <div className="ml-8 space-y-2">
                  <Label htmlFor="otp">Enter OTP from Email *</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      handleOtpChange(value);
                    }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    disabled={isOtpVerified || isVerifyingOtp}
                    className={errors.otp ? "border-destructive" : ""}
                  />
                  {errors.otp && (
                    <p className="text-sm text-destructive">{errors.otp}</p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {otpTimer > 0 ? (
                        <>OTP expires in: {formatOtpTimer(otpTimer)}</>
                      ) : (
                        <>OTP expired</>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResendOtp || isVerifyingOtp}
                      className={`transition-colors ${
                        canResendOtp
                          ? "text-primary hover:underline cursor-pointer"
                          : "text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>

                  {isVerifyingOtp && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying OTP...
                    </p>
                  )}
                  {isOtpVerified && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      OTP verified
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {isOtpVerified && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="font-medium">Set New Password</h3>
                </div>

                <div className="ml-8 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewPassword(value);

                          // Realtime validation
                          if (value.length > 0) {
                            const error = validateNewPasswordField(value);
                            setErrors((prev) => ({
                              ...prev,
                              newPassword: error,
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, newPassword: "" }));
                          }
                        }}
                        onBlur={() => {
                          if (!newPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              newPassword: "New password is required",
                            }));
                          }
                        }}
                        placeholder="Min 6 chars, 1 digit, 1 uppercase"
                        className={
                          errors.newPassword ? "border-destructive" : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setConfirmPassword(value);

                          // Realtime validation
                          if (value.length > 0) {
                            if (value !== newPassword) {
                              setErrors((prev) => ({
                                ...prev,
                                confirmPassword: "Passwords do not match",
                              }));
                            } else {
                              setErrors((prev) => ({
                                ...prev,
                                confirmPassword: "",
                              }));
                            }
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: "",
                            }));
                          }
                        }}
                        onBlur={() => {
                          if (!confirmPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: "Please confirm your password",
                            }));
                          }
                        }}
                        placeholder="Re-enter new password"
                        className={
                          errors.confirmPassword ? "border-destructive" : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements  */}
                  <PasswordRequirements
                    newPassword={newPassword}
                    confirmPassword={confirmPassword}
                    oldPassword={oldPassword}
                    showDifferentFromOld={true}
                  />
                  <Button
                    onClick={handleSavePassword}
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save New Password
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
