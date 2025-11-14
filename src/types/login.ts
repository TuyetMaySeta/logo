// types.ts
export interface LoginFormData {
  employee_id: number | null;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  employee?: {
    id: number;
    full_name: string;
    email: string;
    current_position: string;
  };
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  session_id?: string;
  error?: string;
}