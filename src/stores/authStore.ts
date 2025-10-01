// File: src/stores/authStore.ts - Enhanced version
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { API_URL } from '@/config/config';

// State mặc định cho user
const initialUser = {
    id: null,
    full_name: null,
    email: null,
    current_position: null,
};

interface UserState {
    id: string | null;
    full_name: string | null;
    email: string | null;
    current_position: string | null;
}

interface LoginData {
    employee: {
        id: string;
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
    login: (loginData: LoginData) => void;
    logout: () => void;
    updateUser: (userData: Partial<UserState>) => void;
    setLoading: (loading: boolean) => void;
    setLoginError: (error: string | null) => void;
    refreshToken: () => Promise<boolean>;
    initializeAuth: () => Promise<void>;
    checkTokenValidity: () => boolean;
    reset: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // State
            user: initialUser,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            access_token: null,
            refresh_token: null,
            loginError: null,

            // Actions
            login: (loginData: LoginData) => {
                set({
                    user: loginData.employee,
                    access_token: loginData.access_token,
                    refresh_token: loginData.refresh_token,
                    isAuthenticated: true,
                    isLoading: false,
                    loginError: null,
                });

                // Also store in localStorage for persistence
                localStorage.setItem('access_token', loginData.access_token);
                localStorage.setItem('refresh_token', loginData.refresh_token);
            },

            logout: () => {
                set({
                    user: initialUser,
                    access_token: null,
                    refresh_token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    loginError: null,
                });

                // Clear localStorage
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                // Clear any stored redirect URLs
                sessionStorage.removeItem('login_redirect');
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData },
                }));
            },

            setLoading: (loading) => {
                set({ isLoading: loading });
            },

            setLoginError: (error) => {
                set({ loginError: error });
            },

            refreshToken: async () => {
                try {
                    const refresh_token = get().refresh_token;
                    if (!refresh_token) {
                        console.warn("No refresh token available");
                        get().logout();
                        return false;
                    }

                    set({ isLoading: true });

                    // Use axios to refresh the token
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refresh_token,
                    });

                    if (response.status !== 200) {
                        throw new Error("Failed to refresh token");
                    }

                    const { access_token } = response.data;

                    set({
                        access_token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Update localStorage
                    localStorage.setItem("access_token", access_token);

                    return true;
                } catch (error) {
                    console.error("Token refresh failed:", error);
                    set({ isLoading: false });
                    get().logout();
                    return false;
                }
            },

            checkTokenValidity: () => {
                const token = get().access_token;
                if (!token) return false;

                try {
                    // Basic token validation - you might want to decode JWT here
                    const isValid = token.length > 0;
                    
                    if (!isValid) {
                        get().logout();
                        return false;
                    }

                    return true;
                } catch (error) {
                    console.error('Token validation failed:', error);
                    get().logout();
                    return false;
                }
            },

            initializeAuth: async () => {
                if (get().isInitialized) return;

                set({ isLoading: true });

                try {
                    const accessToken = localStorage.getItem('access_token');
                    const refreshToken = localStorage.getItem('refresh_token');

                    if (accessToken && refreshToken) {
                        // Check if token is still valid
                        const isValid = get().checkTokenValidity();
                        
                        if (isValid) {
                            set({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                                isAuthenticated: true,
                                isInitialized: true,
                                isLoading: false,
                            });
                        } else {
                            // Try to refresh token
                            const refreshSuccess = await get().refreshToken();
                            
                            if (!refreshSuccess) {
                                get().logout();
                            }
                            
                            set({ isInitialized: true });
                        }
                    } else {
                        set({ 
                            isInitialized: true,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    get().logout();
                    set({ 
                        isInitialized: true,
                        isLoading: false,
                    });
                }
            },

            reset: () => {
                set({
                    user: initialUser,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: false,
                    access_token: null,
                    refresh_token: null,
                    loginError: null,
                });
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
                    console.log('Auth state rehydrated:', state.isAuthenticated);
                    // Mark as initialized after rehydration
                    state.isInitialized = true;
                }
            },
        }
    )
);

export default useAuthStore;

// Utility functions for external use
export const authUtils = {
    isLoggedIn: () => {
        const state = useAuthStore.getState();
        return state.isAuthenticated && !!state.access_token;
    },
    
    getUser: () => {
        return useAuthStore.getState().user;
    },
    
    getToken: () => {
        return useAuthStore.getState().access_token;
    },
    
    hasRole: (role: string) => {
        const user = useAuthStore.getState().user;
        return user.current_position === role;
    },
    
    canAccess: (requiredRoles: string[]) => {
        const user = useAuthStore.getState().user;
        if (!user.current_position) return false;
        return requiredRoles.includes(user.current_position);
    }
};
