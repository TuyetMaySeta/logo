// authService.ts
import { AUTH_CONFIG } from '@/config/authConfig';
import type { LoginFormData, AuthResponse } from '@/types/login';
import axios from 'axios';

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

  redirectToMicrosoftLogin(): void {
    window.location.href = `${AUTH_CONFIG.backendUrl}${AUTH_CONFIG.loginEndpoint}`;
  },

  getRedirectUrl(): string {
    return new URLSearchParams(window.location.search).get('redirect') || '/';
  }
};
