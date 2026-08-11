<script setup lang="ts">
import type { Final, Initial } from '../utils/pinyinTone'
import { hasCombination, getPinyinForCell, getKhmerForCell, getKhmerForInitial, getKhmerForFinal } from '../utils/pinyinData'

const props = defineProps<{
  initials: Initial[]
  finals: Final[]
  query?: string
}>()

const emit = defineEmits<{
  select: [initial: Initial, final: Final]
}>()

const normalizedQuery = computed(() => (props.query || '').trim().toLowerCase())

function isVisible(initial: Initial, final: Final): boolean {
  if (!hasCombination(initial, final)) return false
  if (!normalizedQuery.value) return true
  return getPinyinForCell(initial, final).includes(normalizedQuery.value)
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-275 border-collapse text-center text-xs sm:text-sm">
      <thead>
        <tr>
          <th class="sticky left-0 z-10 border border-default bg-default px-3 py-2 text-left" />
          <th
            v-for="finalValue in finals"
            :key="`head-${finalValue}`"
            class="border border-default bg-default px-2 py-2 font-semibold"
          >
            <div>{{ finalValue }}</div>
            <div v-if="getKhmerForFinal(finalValue)" class="khmer-text text-[12px] font-normal text-muted leading-none mt-0.5">
              {{ getKhmerForFinal(finalValue) }}
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="initial in initials"
          :key="`row-${initial || 'empty'}`"
        >
          <th class="sticky left-0 z-10 border border-default bg-default px-3 py-2 text-left font-semibold">
            <template v-if="initial">
              <div>{{ initial }}</div>
              <div v-if="getKhmerForInitial(initial)" class="khmer-text text-[12px] font-normal text-muted leading-none mt-0.5">
                {{ getKhmerForInitial(initial) }}
              </div>
            </template>
            <span v-else>none</span>
          </th>

          <td
            v-for="finalValue in finals"
            :key="`cell-${initial || 'empty'}-${finalValue}`"
            class="border border-default px-1 py-1"
          >
            <template v-if="isVisible(initial, finalValue)">
              <UButton
                size="xs"
                variant="soft"
                color="primary"
                class="w-full justify-center font-medium"
                :label="getPinyinForCell(initial, finalValue)"
                :aria-label="`Open detail for ${getPinyinForCell(initial, finalValue)}`"
                @click="emit('select', initial, finalValue)"
              />
              <span
                v-if="getKhmerForCell(initial, finalValue)"
                class="khmer-text block text-center text-[12px] leading-none text-muted mt-0.5"
              >{{ getKhmerForCell(initial, finalValue) }}</span>
            </template>

            <span
              v-else-if="hasCombination(initial, finalValue)"
              class="inline-block w-full rounded px-1 py-1 text-muted"
            >
              ...
            </span>

            <span
              v-else
              class="inline-block w-full rounded bg-elevated px-1 py-1 text-muted"
            >
              -
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
