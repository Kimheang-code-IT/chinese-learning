<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const props = withDefaults(defineProps<{
  fetch?: () => Promise<unknown[]>
  columns: unknown[]
  loading?: boolean
  ui?: {
    base?: string
    tbody?: string
    th?: string
    td?: string
    separator?: string
  }
}>(), {
  fetch: undefined,
  loading: false,
  ui: () => ({})
})

const data = ref<unknown[]>([])
const internalLoading = ref(false)

async function reloadData() {
  if (props.fetch) {
    internalLoading.value = true
    try {
      data.value = await props.fetch()
    } finally {
      internalLoading.value = false
    }
  }
}

onMounted(reloadData)
watch(() => props.fetch, reloadData)

const table = useTemplateRef('table')

const defaultUi = {
  base: 'table-fixed border-separate border-spacing-0',
  tbody: '[&>tr:last-child>td]:border-b-0',
  th: 'bg-elevated/95 py-3 border-b border-default text-xs uppercase tracking-wide',
  td: 'border-b border-default py-3',
  separator: 'h-0'
}

const mergedUi = computed(() => ({
  ...defaultUi,
  ...props.ui
}))

defineExpose({
  get tableApi() {
    return table.value?.tableApi
  }
})
</script>

<template>
  <ClientOnly>
    <UTable
      ref="table"
      sticky
      class="h-full w-full overflow-auto"
      :data="data as Record<string, unknown>[]"
      :columns="columns as TableColumn<Record<string, unknown>>[]"
      :loading="internalLoading || loading"
      loading-color="primary"
      loading-animation="carousel"
      :ui="mergedUi"
    />
  </ClientOnly>
</template>
