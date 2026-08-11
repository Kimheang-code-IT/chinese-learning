import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCookie, navigateTo } from '#app';
import type { User } from '~/types/user';
import type { LoginPayload, LoginResponse } from '~/types/auth';
import { useApi } from '~/composables/useApi';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = useCookie<string | null>('auth_token', { default: () => null });
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isEmployee = computed(() => user.value?.role === 'employee');
  const isUser = computed(() => user.value?.role === 'user');
  const userRole = computed(() => user.value?.role);

  async function login(payload: LoginPayload) {
    const api = useApi();
    loading.value = true;
    try {
      const data = await api.post<LoginResponse>('/auth/login', payload);
      
      const tokenCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      tokenCookie.value = data.access_token;
      
      token.value = data.access_token;
      user.value = data.user;
      
      return data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return;
    
    const api = useApi();
    try {
      const userData = await api.get<User>('/auth/me');
      user.value = userData;
    } catch {
      logout();
    }
  }

  function logout() {
    const tokenCookie = useCookie('auth_token');
    tokenCookie.value = null;
    token.value = null;
    user.value = null;
    navigateTo('/login');
  }

  function hasRole(roles: string | string[]) {
    if (!user.value) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.value.role);
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isEmployee,
    isUser,
    userRole,
    login,
    fetchMe,
    logout,
    hasRole
  };
});
