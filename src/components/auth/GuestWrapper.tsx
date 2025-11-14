// File: src/utils/withGuest.tsx
import React, { useEffect, type ComponentType } from "react";
import { redirect, useRouter } from "@tanstack/react-router";
import useAuthStore from "@/stores/authStore";
import { LoadingState } from "../common/Loading";

interface GuestOnlyOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// Higher-order function for guest-only routes with Tanstack Router
export function guestOnlyPage<T extends object>(
  Component: ComponentType<T>,
  options: GuestOnlyOptions = {}
) {
  const { redirectTo = "/", fallback = <LoadingState /> } = options;

  return function GuestOnlyComponent(props: T) {
    const router = useRouter();
    const { isAuthenticated, isLoading, isInitialized, initializeAuth } =
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

      // Redirect to home if already authenticated
      if (isAuthenticated) {
        router.navigate({ to: redirectTo, replace: true });
        return;
      }
    }, [isAuthenticated, isInitialized, isLoading, router]);

    // Show loading while initializing or loading
    if (!isInitialized || isLoading) {
      return <>{fallback}</>;
    }

    // Don't render if authenticated (redirect will happen)
    if (isAuthenticated) {
      return null;
    }

    // User is not authenticated, show the guest-only component
    return <Component {...props} />;
  };
}

// Alternative approach using Tanstack Router's beforeLoad
export function createGuestOnlyRoute(options: GuestOnlyOptions = {}) {
  const { redirectTo = "/" } = options;

  return {
    beforeLoad: async () => {
      const { isInitialized, initializeAuth } = useAuthStore.getState();

      // Initialize if not done
      if (!isInitialized) {
        await initializeAuth();
      }

      const state = useAuthStore.getState();

      // Check authentication - if authenticated, redirect away
      if (state.isAuthenticated) {
        throw redirect({ to: redirectTo });
      }

      return {
        isGuest: true,
        isAuthenticated: false,
      };
    },
  };
}

// Alias for shorter syntax
export const withGuest = guestOnlyPage;
