// useFormValidation.ts
import * as React from "react";

export const useFormValidation = () => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateEmployeeId = (employee_id: number | null): boolean => {
    if (employee_id === null) {
      setErrors(prev => ({ ...prev, employee_id: 'Employee ID is required' }));
      return false;
    }
    if (isNaN(employee_id)) {
      setErrors(prev => ({ ...prev, employee_id: 'Employee ID is not valid' }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.employee_id;
      return newErrors;
    });
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.password;
      return newErrors;
    });
    return true;
  };

  const clearErrors = () => setErrors({});

  return { errors, validateEmployeeId, validatePassword, clearErrors };
};