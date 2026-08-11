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
  title: 'មានបញ្ហា'
})
</script>

<template>
  <div>
    <AppHeader />
    <UMain>
      <UContainer>
        <UPageCard
          title="អូ! មានបញ្ហាមួយកើតឡើង។"
          description="សូមព្យាយាមម្តងទៀត ឬត្រឡប់ទៅទំព័រដើម។"
          variant="subtle"
          class="mx-auto my-16 max-w-lg text-center"
        >
          <img :src="logo" alt="រៀនកុំព្យូទ័រ" class="mx-auto mb-4 size-28 object-contain">
          <template #footer>
            <UButton to="/" color="primary" icon="i-lucide-home" block>
              ត្រឡប់ទៅទំព័រដើម
            </UButton>
          </template>
        </UPageCard>
      </UContainer>
    </UMain>
  </div>
</template>
