<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { applyToneMark } from '../utils/pinyinTone'

type ToneButton = {
  label: string
  value: 0 | 1 | 2 | 3 | 4
}

type SelectedCell = {
  initial: string
  final: string
  baseSyllable: string
  khmer?: string
}

const props = defineProps<{
  open: boolean
  selected: SelectedCell | null
  selectedTone: 0 | 1 | 2 | 3 | 4
  selectedWithTone: string
  toneButtons: ToneButton[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'update:selectedTone': [value: 0 | 1 | 2 | 3 | 4]
}>()

const modalOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

function pickTone(value: 0 | 1 | 2 | 3 | 4) {
  emit('update:selectedTone', value)
}

const tonePreview = computed(() => {
  const selected = props.selected
  if (!selected) return []

  return props.toneButtons.map((button: ToneButton) => ({
    ...button,
    text: applyToneMark(selected.baseSyllable, button.value)
  }))
})

const splitPreview = computed(() => {
  if (!props.selected) return ''
  return `${props.selected.initial || 'none'} + ${props.selected.final}`
})
</script>

<template>
  <UModal
    v-model:open="modalOpen"
    :title="undefined"
    :close="false"
    :ui="{ body: 'p-0' }"
  >
    <template #body>
      <div
        v-if="selected"
        class="bg-muted/40"
      >
        <div class="flex items-center justify-between border-b border-default px-4 py-3">
          <div class="flex items-center gap-4">
            <div class="flex flex-col">
              <span class="text-2xl font-semibold">{{ selected.baseSyllable }}</span>
              <span v-if="selected.khmer" class="khmer-text text-sm text-muted leading-tight mt-0.5">{{ selected.khmer }}</span>
            </div>
            <span class="text-lg font-medium text-muted">{{ splitPreview }}</span>
          </div>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Close dialog"
            @click="modalOpen = false"
          />
        </div>


        <div class="flex flex-wrap items-center gap-5 px-4 py-4">
          <div
            v-for="tone in tonePreview"
            :key="`tone-${tone.value}`"
            class="flex items-center gap-1"
          >
            <button
              type="button"
              class="text-4 font-semibold leading-none"
              :class="selectedTone === tone.value ? 'text-primary' : 'text-highlighted'"
              @click="pickTone(tone.value)"
            >
              {{ tone.text }}
            </button>

            
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>