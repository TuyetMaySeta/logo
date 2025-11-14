import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/config/config';
import usePermissionStore from './permissionStore';
import { clearStoredRedirectUrl } from '@/utils/redirectUtils';
import { authService } from '@/service/auth';
import { fetchCurrentUserProfile } from '@/service/employeeService';
import { useDeveloperStore } from './developerStore';

// Constants
const TOKEN_STORAGE_KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

// State mặc định cho user
const INITIAL_USER: UserState = {
  id: null,
  full_name: null,
  email: null,
  current_position: null,
  avatar_url: null,
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  access_token: null,
  refresh_token: null,
  loginError: null,
};

export interface UserState {
  id: number | null;
  full_name: string | null;
  email: string | null;
  current_position: string | null;
  avatar_url: string | null;
}

interface LoginData {
  employee: {
    id: number;
    full_name: string;
    email: string;
    current_position: string;
  };
  access_token: string;
  refresh_token: string;
}

interface AuthState {
  user: UserState;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  access_token: string | null;
  refresh_token: string | null;
  loginError: string | null;

  // Actions
  login: (loginData: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserState>) => void;
  setLoading: (loading: boolean) => void;
  setLoginError: (error: string | null) => void;
  refreshToken: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  checkTokenValidity: () => boolean;
  reset: () => void;
  reloadUser: () => Promise<void>;
}

// Helper functions
const tokenStorage = {
  set: (access: string, refresh: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, access);
    localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH, refresh);
  },
  get: () => ({
    access: localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS),
    refresh: localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH),
  }),
  clear: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH);
  },
};

const isUserEqual = (a: UserState, b: UserState): boolean => {
  return (
    a.id === b.id &&
    a.full_name === b.full_name &&
    a.email === b.email &&
    a.current_position === b.current_position &&
    a.avatar_url === b.avatar_url
  );
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // State
      ...INITIAL_STATE,

      // Actions
      login: async (loginData: LoginData) => {
        try {
          const { fetchPermissions } = usePermissionStore.getState();
          const { fetchAccessiblePartner } = useDeveloperStore.getState();

          // Set initial auth state
          set({
            user: { ...loginData.employee, avatar_url: null },
            access_token: loginData.access_token,
            refresh_token: loginData.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            loginError: null,
          });

          // Persist tokens
          tokenStorage.set(loginData.access_token, loginData.refresh_token);

          // Fetch user profile and permissions in parallel
          const [userProfile] = await Promise.allSettled([
            fetchCurrentUserProfile(),
            fetchPermissions(),
            fetchAccessiblePartner(),
          ]);

          // Update user with avatar if profile fetch succeeded
          if (userProfile.status === 'fulfilled') {
            set((state) => ({
              user: { ...state.user, avatar_url: userProfile.value.avatar_url || null },
            }));
          }
        } catch (error) {
          console.error('Login failed:', error);
          set({ loginError: 'Login failed. Please try again.' });
          throw error;
        }
      },

      logout: async () => {
        const { setPermission } = usePermissionStore.getState();
        const currentAccessToken = get().access_token;

        // Attempt API logout (non-blocking)
        if (currentAccessToken) {
          authService.logout().catch((error) => {
            console.warn('Logout API call failed:', error);
          });
        }

        // Clear state immediately
        set(INITIAL_STATE);
        setPermission([]);

        // Clear storage
        tokenStorage.clear();
        clearStoredRedirectUrl();
      },

      updateUser: (userData) => {
        const current = get().user;
        const next = { ...current, ...userData };

        // Avoid unnecessary updates
        if (isUserEqual(current, next)) {
          return;
        }

        set({ user: next });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setLoginError: (error) => {
        set({ loginError: error });
      },

      refreshToken: async () => {
        const { refresh_token } = get();

        if (!refresh_token) {
          console.warn('No refresh token available');
          await get().logout();
          return false;
        }

        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token,
          });

          const { access_token } = response.data;

          set({
            access_token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Update only access token in storage
          localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS, access_token);

          return true;
        } catch (error) {
          console.error('Token refresh failed:', error);
          set({ isLoading: false });
          await get().logout();
          return false;
        }
      },

      checkTokenValidity: () => {
        const token = get().access_token;

        if (!token || token.length === 0) {
          return false;
        }

        // Optional: Add JWT expiry check here
        // const payload = JSON.parse(atob(token.split('.')[1]));
        // if (payload.exp * 1000 < Date.now()) return false;

        return true;
      },

      initializeAuth: async () => {
        // Prevent multiple initializations
        if (get().isInitialized) {
          return;
        }

        set({ isLoading: true });

        try {
          const { access, refresh } = tokenStorage.get();

          if (!access || !refresh) {
            set({
              isInitialized: true,
              isLoading: false,
            });
            return;
          }

          // Validate token
          set({
            access_token: access,
            refresh_token: refresh,
          });

          if (!get().checkTokenValidity()) {
            // Try to refresh if invalid
            const refreshSuccess = await get().refreshToken();

            if (!refreshSuccess) {
              await get().logout();
            }

            set({ isInitialized: true, isLoading: false });
            return;
          }

          // Fetch user profile if token is valid
          const userProfile = await fetchCurrentUserProfile();

          set({
            user: {
              id: userProfile.id,
              full_name: userProfile.full_name,
              email: userProfile.email,
              current_position: userProfile.current_position,
              avatar_url: userProfile.avatar_url || null,
            },
            isAuthenticated: true,
            isInitialized: true,
            isLoading: false,
          });

          // Fetch permissions in background
          usePermissionStore.getState().fetchPermissions();
          useDeveloperStore.getState().fetchAccessiblePartner();
        } catch (error) {
          console.error('Auth initialization failed:', error);
          await get().logout();
          set({
            isInitialized: true,
            isLoading: false,
          });
        }
      },

      reset: () => {
        set(INITIAL_STATE);
      },

      reloadUser: async () => {
        try {
          const userProfile = await fetchCurrentUserProfile();

          set({
            user: {
              id: userProfile.id,
              full_name: userProfile.full_name,
              email: userProfile.email,
              current_position: userProfile.current_position,
              avatar_url: userProfile.avatar_url || null,
            },
          });
        } catch (error) {
          console.error('Failed to reload user profile:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);

export default useAuthStore;
