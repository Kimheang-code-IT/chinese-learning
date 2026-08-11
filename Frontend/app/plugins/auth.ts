import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore();
  
  // Only skip if we are on the server and token is not present
  // But typically we want to try fetching if a token exists in cookies
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (e) {
      console.error('Initial user fetch failed', e);
    }
  }
});
