<script setup lang="ts">
import type { TableApiLike } from '~/types'

defineProps<{
  modelValue: string
  table?: { tableApi?: TableApiLike }
}>()

const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

const statusItems = [
  { label: 'ទាំងអស់', value: 'all' },
  { label: 'Admin', value: 'admin' },
  { label: 'Employee', value: 'employee' },
  { label: 'User', value: 'user' }
]
</script>

<template>
  <div class="flex items-center gap-2">
    <USelect
      :model-value="modelValue"
      :items="statusItems"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      placeholder="ចម្រោះតាមប្រភេទ"
      class="min-w-24"
      @update:model-value="(value) => emits('update:modelValue', value as string)"
    />
  </div>
</template>
