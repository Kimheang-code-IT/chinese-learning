<template>
  <UModal v-model:open="open" :ui="{ content: 'sm:max-w-md' }">
    <template #body>
      <div class="flex flex-col items-center text-center p-2">
        <!-- Visual Icon Indicator -->
        <div class="mb-4 size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
          <UIcon name="i-lucide-help-circle" class="size-10" />
        </div>

        <!-- Title & Description -->
        <h3 class="text-xl font-bold text-highlighted mb-2">{{ title }}</h3>
        <p class="text-muted text-sm px-4 mb-8 leading-relaxed">
          {{ description }}
        </p>

        <!-- Custom Slot for extra content if needed -->
        <slot />

        <!-- Actions moved to Body -->
        <div class="flex flex-row-reverse sm:flex-row gap-3 w-full">
          <UButton 
            :label="confirmLabel" 
            :color="confirmColor" 
            :icon="confirmIcon"
            size="xl"
            class="flex-1 justify-center order-1 sm:order-2 font-bold" 
            @click="onConfirm" 
          />
          <UButton 
            :label="cancelLabel || 'បោះបង់'" 
            color="neutral" 
            variant="soft" 
            size="xl"
            class="flex-1 justify-center order-2 sm:order-1 font-bold" 
            @click="onCancel" 
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning' | 'success' | 'info' | 'neutral'
  confirmIcon?: string
}>(), {
  description: '',
  confirmLabel: 'យល់ព្រម',
  cancelLabel: 'បោះបង់',
  confirmColor: 'primary',
  confirmIcon: undefined
})
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm' | 'cancel'): void
}>()

const open = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  open.value = val
})
watch(open, (val) => {
  emit('update:modelValue', val)
})

function onConfirm() {
  emit('confirm')
  open.value = false
}
function onCancel() {
  emit('cancel')
  open.value = false
}
</script>
