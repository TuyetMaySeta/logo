import useAuthStore from "@/stores/authStore";

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
