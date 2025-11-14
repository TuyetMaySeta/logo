import { useState } from "react";

interface ValidationErrors {
  email?: string;
  otp?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Constants
const VALIDATION_CONSTANTS = {
  OTP_LENGTH: 6,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UPPERCASE_REGEX: /[A-Z]/,
  LOWERCASE_REGEX: /[a-z]/,
  DIGIT_REGEX: /[0-9]/,
};

export const useForgotPasswordValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    
    if (!VALIDATION_CONSTANTS.EMAIL_REGEX.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });
    return true;
  };

  const validateOtp = (otp: string): boolean => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      return false;
    }
    
    if (otp.length !== VALIDATION_CONSTANTS.OTP_LENGTH) {
      setErrors((prev) => ({ ...prev, otp: `OTP must be ${VALIDATION_CONSTANTS.OTP_LENGTH} digits` }));
      return false;
    }
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.otp;
      return newErrors;
    });
    return true;
  };

  const validatePasswords = (
    newPassword: string,
    confirmPassword: string
  ): boolean => {
    let isValid = true;
    const newErrors: ValidationErrors = { ...errors };

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
      isValid = false;
    } else if (newPassword.length < VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH) {
      newErrors.newPassword = `Password must be at least ${VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH} characters`;
      isValid = false;
    } else if (!VALIDATION_CONSTANTS.UPPERCASE_REGEX.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!VALIDATION_CONSTANTS.LOWERCASE_REGEX.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!VALIDATION_CONSTANTS.DIGIT_REGEX.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least one digit";
      isValid = false;
    } else {
      delete newErrors.newPassword;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateEmail,
    validateOtp,
    validatePasswords,
    clearError,
    clearAllErrors,
  };
};