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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import * as React from "react";
import { guestOnlyPage } from "./auth/GuestWrapper";
import {
  useForgotPassword,
  ForgotPasswordStep,
} from "@/hooks/useForgotPassword";
import { PasswordRequirements } from "./employee/password/PasswordRequirement";
const ForgotPassword = () => {
  const {
    currentStep,
    email,
    otpCode,
    newPassword,
    confirmPassword,
    isLoading,
    generalError,
    errors,
    otpTimer,
    canResendOtp,
    setEmail,
    setOtpCode,
    setNewPassword,
    setConfirmPassword,
    setGeneralError,
    setOtpTimer,
    setCanResendOtp,
    handleVerifyEmail,
    handleVerifyOtp,
    handleResetPassword,
    handleResendOtp,
    handleBackToLogin,
    clearError,
    formatOtpTimer,
    successRedirectDelay,
  } = useForgotPassword();

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Auto redirect after success
  React.useEffect(() => {
    if (currentStep === ForgotPasswordStep.SUCCESS) {
      const timer = setTimeout(() => {
        handleBackToLogin();
      }, successRedirectDelay);

      return () => clearTimeout(timer);
    }
  }, [currentStep, handleBackToLogin, successRedirectDelay]);

  // OTP Timer countdown
  React.useEffect(() => {
    if (currentStep === ForgotPasswordStep.OTP && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, otpTimer, setOtpTimer, setCanResendOtp]);

  const getStepTitle = () => {
    const titles = {
      [ForgotPasswordStep.EMAIL]: "Forgot Password",
      [ForgotPasswordStep.OTP]: "Verify OTP",
      [ForgotPasswordStep.NEW_PASSWORD]: "Reset Password",
      [ForgotPasswordStep.SUCCESS]: "Success",
    };
    return titles[currentStep];
  };

  const getStepDescription = () => {
    const descriptions = {
      [ForgotPasswordStep.EMAIL]: "Enter your email to receive an OTP code",
      [ForgotPasswordStep.OTP]: "Enter the OTP code sent to your email",
      [ForgotPasswordStep.NEW_PASSWORD]:
        "Create a new password for your account",
      [ForgotPasswordStep.SUCCESS]: "",
    };
    return descriptions[currentStep];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyEmail();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setGeneralError(null);
                  if (errors.email) {
                    clearError("email");
                  }
                }}
                placeholder="Enter your email"
                disabled={isLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        );

      case ForgotPasswordStep.OTP:
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpCode(value);
                  setGeneralError(null);
                  if (errors.otp) {
                    clearError("otp");
                  }
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                disabled={isLoading}
                className={errors.otp ? "border-destructive" : ""}
              />
              {errors.otp && (
                <p className="text-sm text-destructive">{errors.otp}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  OTP expires in: {formatOtpTimer(otpTimer)}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResendOtp || isLoading}
                  className={`transition-colors ${
                    canResendOtp
                      ? "text-primary hover:underline cursor-pointer"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        );

      case ForgotPasswordStep.NEW_PASSWORD:
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setGeneralError(null);
                    if (errors.newPassword) {
                      clearError("newPassword");
                    }
                  }}
                  placeholder="Min 6 chars, 1 digit, 1 uppercase"
                  disabled={isLoading}
                  className={
                    errors.newPassword ? "border-destructive pr-10" : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setGeneralError(null);
                    if (errors.confirmPassword) {
                      clearError("confirmPassword");
                    }
                  }}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  className={
                    errors.confirmPassword
                      ? "border-destructive pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}

            <PasswordRequirements
              newPassword={newPassword}
              confirmPassword={confirmPassword}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        );

      case ForgotPasswordStep.SUCCESS:
        return (
          <div className="flex flex-col items-center space-y-4 py-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                Password Reset Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your password has been reset. You can now log in with your new
                password.
              </p>
            </div>
            <Button
              onClick={handleBackToLogin}
              className="w-full cursor-pointer"
            >
              Go to Login
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 ">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 ">
          {currentStep !== ForgotPasswordStep.SUCCESS && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToLogin}
              className="w-fit mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          )}
          <CardTitle className="text-2xl font-bold text-center">
            {getStepTitle()}
          </CardTitle>
          {getStepDescription() && (
            <CardDescription className="text-center">
              {getStepDescription()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {renderStepContent()}

          {currentStep !== ForgotPasswordStep.SUCCESS && (
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default guestOnlyPage(ForgotPassword);
