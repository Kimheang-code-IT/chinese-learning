<script setup lang="ts">
/**
 * SafeInlineSvg.client.vue
 * High-performance, lightweight SVG renderer.
 * Optimized to use v-html for trusted content, avoiding expensive DOMParser overhead.
 */
defineProps<{
  svg: string
}>()
</script>

<template>
  <div 
    v-if="svg" 
    v-html="svg"
    class="inline-block"
  />
</template>
