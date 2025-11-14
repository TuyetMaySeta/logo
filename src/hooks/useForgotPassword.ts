import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { forgotPasswordService } from "@/service/auth/forgot-passwordService";
import { useForgotPasswordValidation } from "./useForgotPasswordValidation";

export enum ForgotPasswordStep {
  EMAIL = "email",
  OTP = "otp",
  NEW_PASSWORD = "new_password",
  SUCCESS = "success",
}

// Constants
const FORGOT_PASSWORD_CONFIG = {
  OTP_TIMER_DURATION: 300, // 5 minutes
  SUCCESS_REDIRECT_DELAY: 2000, // 2 seconds
};

// Utility functions
const formatOtpTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const extractErrorMessage = (error: any, defaultMessage: string): string => {
  return error.response?.data?.detail || error.message || defaultMessage;
};

export const useForgotPassword = () => {
  const navigate = useNavigate();
  const {
    errors,
    validateEmail,
    validateOtp,
    validatePasswords,
    clearError,
    clearAllErrors,
  } = useForgotPasswordValidation();

  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL
  );

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(FORGOT_PASSWORD_CONFIG.OTP_TIMER_DURATION);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const handleVerifyEmail = useCallback(async () => {
    setGeneralError(null);

    if (!validateEmail(email)) return;

    setIsLoading(true);

    try {
      await forgotPasswordService.verifyEmail({ email });

      toast.success("Success!", {
        description: "OTP has been sent to your email",
      });
      
      setCurrentStep(ForgotPasswordStep.OTP);
      setOtpTimer(FORGOT_PASSWORD_CONFIG.OTP_TIMER_DURATION);
      setCanResendOtp(false);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Failed to send OTP. Please try again.");
      setGeneralError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmail]);

  const handleVerifyOtp = useCallback(async () => {
    setGeneralError(null);

    if (!validateOtp(otpCode)) return;

    setIsLoading(true);

    try {
      await forgotPasswordService.verifyOtp({
        email,
        otp_code: otpCode,
      });

      toast.success("Success!", {
        description: "OTP verified successfully",
      });
      
      setCurrentStep(ForgotPasswordStep.NEW_PASSWORD);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Invalid or expired OTP");
      setGeneralError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, otpCode, validateOtp]);

  const handleResetPassword = useCallback(async () => {
    setGeneralError(null);

    if (!validatePasswords(newPassword, confirmPassword)) return;

    setIsLoading(true);

    try {
      await forgotPasswordService.resetPassword({
        email,
        otp_code: otpCode,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      toast.success("Success!", {
        description: "Password has been reset successfully",
      });
      
      setCurrentStep(ForgotPasswordStep.SUCCESS);
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Failed to reset password. Please try again.");
      setGeneralError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, otpCode, newPassword, confirmPassword, validatePasswords]);

  const handleResendOtp = useCallback(async () => {
    setIsLoading(true);
    setGeneralError(null);

    try {
      await forgotPasswordService.verifyEmail({ email });

      toast.success("Success!", {
        description: "New OTP has been sent to your email",
      });
      
      setOtpTimer(FORGOT_PASSWORD_CONFIG.OTP_TIMER_DURATION);
      setCanResendOtp(false);
      setOtpCode("");
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Failed to resend OTP");
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleBackToLogin = useCallback(() => {
    navigate({ to: "/auth/login" });
  }, [navigate]);

  return {
    // State
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
    
    // Setters
    setEmail,
    setOtpCode,
    setNewPassword,
    setConfirmPassword,
    setGeneralError,
    setOtpTimer,
    setCanResendOtp,
    
    // Actions
    handleVerifyEmail,
    handleVerifyOtp,
    handleResetPassword,
    handleResendOtp,
    handleBackToLogin,
    clearError,
    clearAllErrors,
    
    // Utils
    formatOtpTimer,
    
    // Config
    successRedirectDelay: FORGOT_PASSWORD_CONFIG.SUCCESS_REDIRECT_DELAY,
  };
};