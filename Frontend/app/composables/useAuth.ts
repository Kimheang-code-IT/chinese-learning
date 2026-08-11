import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

export const useAuth = () => {
  const authStore = useAuthStore();
  
  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    loading: computed(() => authStore.loading),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isEmployee: computed(() => authStore.isEmployee),
    isUser: computed(() => authStore.isUser),
    
    login: authStore.login,
    logout: authStore.logout,
    fetchMe: authStore.fetchMe,
    hasRole: authStore.hasRole,
  };
};
