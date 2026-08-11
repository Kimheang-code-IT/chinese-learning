import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, _from) => {
  const authStore = useAuthStore();
  
  if (!authStore.token) {
    return navigateTo('/login');
  }

  const allowedRoles = to.meta.roles as string[];
  
  if (allowedRoles && !authStore.hasRole(allowedRoles)) {
    return navigateTo('/');
  }
});
