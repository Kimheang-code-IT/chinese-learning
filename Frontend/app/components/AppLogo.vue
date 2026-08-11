<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useColorMode } from '#imports'

const colorMode = useColorMode()
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const logoSrc = computed(() => {
  if (!isMounted.value) return '/logo.svg'
  return colorMode.value === 'dark'
    ? '/domanksiksaa.svg'
    : '/logo.svg'
})
</script>

<template>
  <img
    :src="logoSrc"
    alt="Logo"
    class="w-auto h-full object-contain"
    loading="eager"
  >
</template>
