<script setup lang="ts">
import type { NuxtError } from '#app'
import logo from '~/assets/images/logo.png'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useSeoMeta({
  title: 'An error occurred'
})
</script>

<template>
  <div>
    <AppHeader />
    <UMain>
      <UContainer>
        <UPage>
          <div class="flex flex-col items-center justify-center min-h-[60vh] py-12 text-center khmer-text">
            <div v-if="$route.path !== '/favicon.ico'" class="w-40 h-40 mb-6 opacity-90 flex items-center justify-center">
              <img :src="logo" alt="ដំណាក់សិក្សា" class="w-full h-full object-contain">
            </div>
            <h1 class="text-3xl font-bold text-error mb-2">អូ! មានបញ្ហាមួយកើតឡើង។</h1>
            <UButton to="/" color="primary" icon="i-lucide-home" class="mt-14">ត្រឡប់ទៅទំព័រដើម</UButton>
          </div>
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
