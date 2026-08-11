<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { z } from 'zod'
import { useAuth } from '~/composables/useAuth'
import { useToast, useRouter, useSeoMeta, definePageMeta } from '#imports'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

useSeoMeta({
  title: 'ចូលគណនី',
  description: 'សូមចូលគណនីរបស់អ្នក ដើម្បីបន្តប្រើប្រាស់'
})

// 1. Define Validation Schema (Best Practice)
const schema = z.object({
  phone: z.string().min(1, 'សូមបញ្ចូលលេខទូរស័ព្ទ'),
  password: z.string().min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ'),
  remember: z.boolean().optional()
})

type Schema = z.output<typeof schema>

const auth = useAuth()
const toast = useToast()
const router = useRouter()

// 2. Define Form Fields for Nuxt UI
const fields = [{
  name: 'phone',
  type: 'text' as const,
  label: 'លេខទូរស័ព្ទ',
  size: 'lg' as const,
  placeholder: 'បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក',
  icon: 'i-lucide-phone'
}, {
  name: 'password',
  label: 'ពាក្យសម្ងាត់',
  size: 'lg' as const,
  type: 'password' as const,
  placeholder: 'បញ្ចូលពាក្យសម្ងាត់របស់អ្នក',
  icon: 'i-lucide-lock'
}, {
  name: 'remember',
  label: 'ចងចាំខ្ញុំ',
  type: 'checkbox' as const
}]

const REMEMBER_PHONE_KEY = 'login:remember:phone'
const REMEMBER_ENABLED_KEY = 'login:remember:enabled'

// 3. Reactive state with local storage persistence
const state = reactive({
  phone: '',
  password: '',
  remember: false
})

const loading = computed(() => auth.loading.value)

onMounted(() => {
  if (!import.meta.client) return
  const rememberEnabled = localStorage.getItem(REMEMBER_ENABLED_KEY) === '1'
  const rememberedPhone = localStorage.getItem(REMEMBER_PHONE_KEY) || ''

  if (rememberEnabled && rememberedPhone) {
    state.phone = rememberedPhone
    state.remember = true
  }
})

// 4. Clean onSubmit handler
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  // Handle "Remember Me"
  if (import.meta.client) {
    if (payload.data.remember) {
      localStorage.setItem(REMEMBER_ENABLED_KEY, '1')
      localStorage.setItem(REMEMBER_PHONE_KEY, payload.data.phone)
    } else {
      localStorage.removeItem(REMEMBER_ENABLED_KEY)
      localStorage.removeItem(REMEMBER_PHONE_KEY)
    }
  }

  try {
    // API Call via Auth Store
    await auth.login({
      phone: payload.data.phone.trim(),
      password: payload.data.password
    });

    // Redirect based on role (no toast on success)
    if (auth.isAdmin.value || auth.isEmployee.value) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error: unknown) {
    console.error('Login error:', error)
    toast.add({
      title: 'កំហុស',
      description: 'លេខទូរស័ព្ទ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="min-h-full flex flex-col justify-center">
    <UAuthForm
      v-model="state"
      :schema="schema"
      :fields="fields"
      :loading="loading"
      title="ចូលប្រើប្រាស់"
      :submit="{
        label: 'ចូលគណនី',
        class: 'w-full h-10! text-xl font-medium khmer-text'
      }"
      @submit="onSubmit"
    >
      <template #leading>
        <AppLogo class="h-14! w-auto mx-auto mb-4" />
      </template>

      <template #footer>
        <div class="text-center mt-4">
          <p class="khmer-text text-sm text-gray-500">
            © រក្សាសិទ្ធិគ្រប់យ៉ាងដោយ 
            <span class="text-primary font-medium khmer-text">ដំណាក់សិក្សា</span>
          </p>
        </div>
      </template>
    </UAuthForm>
  </div>
</template>
