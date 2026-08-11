import { ref } from 'vue'
import { normalizeText } from '~/utils/string'

// Temporary user role management for development
const userRole = ref<'user' | 'admin'>('admin') // Default to admin for now

export function useUser() {
  function setRole(role: 'user' | 'admin') {
    userRole.value = role
  }

  const isAdmin = computed(() => userRole.value === 'admin')
  const input = ref('') // Added ref for input state

  function onUserInput(val: string) {
    input.value = normalizeText(val)
  }

  return {
    userRole,
    isAdmin,
    setRole,
    input,
    onUserInput
  }
}
