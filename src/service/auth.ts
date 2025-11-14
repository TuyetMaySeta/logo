// authService.ts
import { AUTH_CONFIG } from '@/config/authConfig';
import type { LoginFormData, AuthResponse } from '@/types/login';
import axios from 'axios';
import emsClient from "./emsClient";


// Interface cho response từ API
interface VerifyOldPasswordResponse {
  success: boolean;
  message: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyOTPResponse {
  valid: boolean;
  message: string;
}

export const authService = {
  async loginWithEmployeeId(formData: LoginFormData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
      `${AUTH_CONFIG.backendUrl}${AUTH_CONFIG.employeeLoginEndpoint}`,
      {
        employee_id: formData.employee_id,
        password: formData.password
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      }
    );
    return response.data;
  },

  async redirectToMicrosoftLogin(): Promise<void> {
    const response = await axios.get<{ auth_url: string }>(`${AUTH_CONFIG.backendUrl}/auth/login/microsoft`);

    window.location.href = response.data.auth_url;
  },

  getRedirectUrl(): string {
    return new URLSearchParams(window.location.search).get('redirect') || '/';
  },

  /**
   * Verify old password và gửi OTP qua email
   */
  async verifyOldPassword(oldPassword: string): Promise<VerifyOldPasswordResponse> {
    const response = await emsClient.post('/auth/verify-old-password', {
      old_password: oldPassword
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to verify old password");
    }

    return response.data as VerifyOldPasswordResponse;
  },

  /**
 * Verify OTP code
 */
  async verifyOtp(otp: string): Promise<VerifyOTPResponse> {
    const response = await emsClient.post(`/auth/verify-otp?otp=${otp}`);

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to verify OTP");
    }

    return response.data as VerifyOTPResponse;
  },

  async changePassword(
    newPassword: string,
    confirmPassword: string,
    otp: string
  ): Promise<ChangePasswordResponse> {
    const response = await emsClient.post('/auth/change-password', {
      new_password: newPassword,
      confirm_password: confirmPassword,
      otp_code: otp // Gửi OTP code cùng với yêu cầu đổi mật khẩu
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error("Failed to change password");
    }

    return response.data as ChangePasswordResponse;
  },

  async logout(): Promise<void> {
    const respone = await emsClient.delete('/auth/logout');
    if (respone.status < 500) {
    } else {
      throw new Error("Failed to logout");
    }
  }
};
