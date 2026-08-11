<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
const { openSearch } = useSearch()
const { items } = useMenu()
const auth = useAuth()

// 1. Dynamic User Menu Items based on Auth Store
const userMenuItems = computed(() => [
  [
    {
      label: auth.user.value?.name || 'អ្នកប្រើប្រាស់',
      icon: 'i-lucide-user',
      type: 'label' as const
    },
    {
      label: auth.user.value?.phone || '',
      icon: 'i-lucide-phone',
      type: 'label' as const
    }
  ],
  [
    {
      label: 'ចាកចេញ',
      icon: 'i-lucide-log-out',
      color: 'error' as const,
      onClick: () => {
        auth.logout()
      }
    }
  ]
])

const isAuthenticated = computed(() => auth.isAuthenticated.value)
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-10! sm:h-12! shrink-0 transition-transform active:scale-95" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" class="khmer-nav hidden md:flex [&_a]:px-5 [&_a]:text-[16px]" />

    <template #right>
      <UColorModeButton />

      <UButton
icon="i-lucide-search" color="neutral" variant="ghost" aria-label="បើកការស្វែងរក"
        @click="openSearch()" />

      <!-- Keep this ClientOnly to prevent user data mismatch between server/client -->
      <ClientOnly>
        <UDropdownMenu v-if="isAuthenticated" :items="userMenuItems" :content="{ align: 'end' }">
          <UButton icon="i-lucide-user-round" color="neutral" variant="ghost" aria-label="បើកម៉ឺនុយអ្នកប្រើ" />
        </UDropdownMenu>

        <div v-else class="flex items-center gap-1">
          <UButton
icon="i-simple-icons-telegram" color="primary" variant="ghost" to="https://t.me/damanksiksaa"
            target="_blank" aria-label="ទាក់ទងតាម Telegram" />
          <UButton icon="i-lucide-log-in" color="primary" variant="solid" to="/login" label="ចូល" class="khmer-text" />
        </div>
        <!-- Fallback to avoid DOM shifting -->
        <template #fallback>
          <div class="w-10 h-10" />
        </template>
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="khmer-nav md:hidden [&_a]:py-2 [&_a]:text-[16px]" />
      <USeparator class="md:hidden my-6" />
    </template>
  </UHeader>
</template>
