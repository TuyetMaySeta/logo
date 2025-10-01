import { useEffect } from "react";
import { redirect } from "@tanstack/react-router";
import useAuthStore from "@/stores/authStore";

export function useAuthGuard() {
  const { isAuthenticated, access_token, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    isAuthenticated: isAuthenticated && !!access_token,
    isLoading: useAuthStore(state => state.isLoading),
  };
}

// Auth Context cho beforeLoad
export const authGuard = () => {
  const { isAuthenticated, access_token } = useAuthStore.getState();
  
  if (!isAuthenticated || !access_token) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: window.location.pathname,
      },
    });
  }
};

// Guest guard - redirect nếu đã đăng nhập
export const guestGuard = () => {
  const { isAuthenticated, access_token } = useAuthStore.getState();
  
  if (isAuthenticated && access_token) {
    throw redirect({
      to: '/',
    });
  }
};
