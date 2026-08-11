<script setup lang="ts">
import type { Range, TableApiLike } from '~/types'

const search = defineModel<string>('search', { required: true })
const status = defineModel<string>('status', { required: true })
const dateRange = defineModel<Range>('dateRange', { required: true })

defineProps<{
  table?: { tableApi?: TableApiLike }
}>()
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
    <!-- Row 1: Search & Actions -->
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <UInput
        v-model="search"
        class="flex-1 sm:w-64"
        icon="i-lucide-search"
        placeholder="ស្វែងរក..."
      />
      <slot name="actions" />
    </div>

    <!-- Row 2: Date + Status -->
    <div class="flex items-center gap-2 w-full sm:w-auto">
      <CommonDateRangePicker v-model="dateRange" class="flex-1 sm:flex-none" />
      <CommonTableFilters
        v-model="status"
        :table="table"
        class="flex-1 sm:flex-none h-10"
      />
    </div>
  </div>
</template>
