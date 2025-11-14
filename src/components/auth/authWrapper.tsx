// File: src/utils/withAuth.tsx
import React, { useEffect, type ComponentType } from "react";
import { redirect, useRouter, useLocation } from "@tanstack/react-router";
import useAuthStore from "@/stores/authStore";
import { storeRedirectUrl } from "@/utils/redirectUtils";
import { LoadingState } from "../common/Loading";

interface ProtectedOptions {
  requiredRoles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
  unauthorized?: string;
}

// Higher-order function for protected routes with Tanstack Router
export function protectedPage<T extends object>(
  Component: ComponentType<T>,
  options: ProtectedOptions = {}
) {
  const {
    requiredRoles = [],
    redirectTo = "/auth/login",
    fallback = <LoadingState />,
    unauthorized = "/unauthorized",
  } = options;

  return function ProtectedComponent(props: T) {
    const router = useRouter();
    const location = useLocation();
    const { isAuthenticated, isLoading, isInitialized, user, initializeAuth } =
      useAuthStore();

    // Initialize auth on component mount
    useEffect(() => {
      if (!isInitialized) {
        initializeAuth();
      }
    }, [isInitialized, initializeAuth]);

    // Handle redirects after auth state is loaded
    useEffect(() => {
      if (!isInitialized || isLoading) return;

      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        // Store current location for redirect after login
        
        // Check if we're already on login page to avoid infinite loop
        if (location.pathname === redirectTo) {
          return;
        }
        
        const currentUrl = location.pathname + location.searchStr;
        storeRedirectUrl(currentUrl);
        router.navigate({ to: redirectTo, replace: true });
        return;
      }

      // Check role-based access if required roles are specified
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(
          user.current_position || ""
        );

        if (!hasRequiredRole) {
          router.navigate({ to: unauthorized, replace: true });
          return;
        }
      }
    }, [
      isAuthenticated,
      isInitialized,
      isLoading,
      user.current_position,
      router,
      location.pathname,
      location.search,
    ]);

    // Show loading while initializing or loading
    if (!isInitialized || isLoading) {
      return <>{fallback}</>;
    }

    // Don't render if not authenticated or no permission (redirect will happen)
    if (!isAuthenticated) {
      return null;
    }

    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(
        user.current_position || ""
      );
      if (!hasRequiredRole) {
        return null;
      }
    }

    // User is authenticated and has required permissions
    return <Component {...props} />;
  };
}

// Alternative approach using Tanstack Router's beforeLoad
export function createProtectedRoute(options: ProtectedOptions = {}) {
  const {
    requiredRoles = [],
    redirectTo = "/auth/login",
    unauthorized = "/unauthorized",
  } = options;

  return {
    beforeLoad: async () => {
      const { isInitialized, initializeAuth } = useAuthStore.getState();

      // Initialize if not done
      if (!isInitialized) {
        await initializeAuth();
      }

      const state = useAuthStore.getState();

      // Check authentication
      if (!state.isAuthenticated) {
        // Store current location for redirect after login
        if (typeof window !== "undefined") {
          storeRedirectUrl(window.location.pathname + window.location.search);
        }
        throw redirect({ to: redirectTo });
      }

      // Check role-based access
      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.includes(
          state.user.current_position || ""
        );

        if (!hasRequiredRole) {
          throw redirect({ to: unauthorized });
        }
      }

      return {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      };
    },
  };
}

// Alias for shorter syntax
export const withAuth = protectedPage;
