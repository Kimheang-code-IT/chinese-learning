<script setup lang="ts">
interface StrokeRow {
  id: number
  shape: string
  chinese: string
  pinyin: string
  english: string
  khmer: string
}

defineProps<{
  rows: StrokeRow[]
}>()

const selectedRow = ref<StrokeRow | null>(null)
const isDialogOpen = ref(false)
const chineseVoice = ref<SpeechSynthesisVoice | null>(null)

function openRowDialog(row: StrokeRow) {
  selectedRow.value = row
  isDialogOpen.value = true
}

function closeRowDialog() {
  isDialogOpen.value = false
}

function pickBestChineseVoice(): SpeechSynthesisVoice | null {
  if (!import.meta.client || !('speechSynthesis' in window)) return null

  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const exactCn = voices.find((voice) => voice.lang.toLowerCase() === 'zh-cn')
  if (exactCn) return exactCn

  const anyChinese = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'))
  if (anyChinese) return anyChinese

  return null
}

onMounted(() => {
  if (!import.meta.client || !('speechSynthesis' in window)) return

  const updateVoice = () => {
    chineseVoice.value = pickBestChineseVoice()
  }

  updateVoice()
  window.speechSynthesis.addEventListener('voiceschanged', updateVoice)

  onUnmounted(() => {
    window.speechSynthesis.removeEventListener('voiceschanged', updateVoice)
  })
})

function speakChinese() {
  if (!import.meta.client || !selectedRow.value) return
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(selectedRow.value.chinese)
  utterance.lang = 'zh-CN'
  const preferredVoice = chineseVoice.value ?? pickBestChineseVoice()
  if (preferredVoice) utterance.voice = preferredVoice

  utterance.rate = 0.5
  utterance.pitch = 1
  utterance.volume = 1
  window.speechSynthesis.speak(utterance)
}
</script>

<template>
  <div class="overflow-x-auto rounded border border-default">
    <table class="min-w-200 w-full border-collapse text-center text-sm stocktype-table">
      <thead class="bg-primary text-primary-foreground">
        <tr>
          <th class="border border-default px-3 py-2">ID</th>
          <th class="border border-default px-3 py-2">Shape</th>
          <th class="border border-default px-3 py-2 w-32! chinese-char">中文</th>
          <th class="border border-default px-3 py-2">Pinyin</th>
          <th class="border border-default px-3 py-2">English</th>
          <th class="border border-default px-3 py-2 ">Khmer</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="odd:bg-elevated/40"
        >
          <td class="border border-default px-3 py-2">{{ row.id }}</td>
          <td class="border border-default px-3 py-2 text-xl font-semibold chinese-char">
            <button
              type="button"
              class="cursor-pointer hover:text-primary transition-colors chinese-char"
              :aria-label="`Open stroke detail for ${row.chinese}`"
              @click="openRowDialog(row)"
            >
              {{ row.shape }}
            </button>
          </td>
          <td class="border border-default px-3 py-2 text-lg chinese-char w-32!">
            <button
              type="button"
              class="cursor-pointer hover:text-primary transition-colors chinese-char"
              :aria-label="`Open stroke detail for ${row.chinese}`"
              @click="openRowDialog(row)"
            >
              {{ row.chinese }}
            </button>
          </td>
          <td class="border border-default px-3 py-2">{{ row.pinyin }}</td>
          <td class="border border-default px-3 py-2">{{ row.english }}</td>
          <td class="border border-default px-3 py-2 khmer-text">{{ row.khmer }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <UModal
    v-model:open="isDialogOpen"
    :title="undefined"
    :close="false"
    :ui="{ body: 'p-0' }"
  >
    <template #body>
      <div
        v-if="selectedRow"
        class="bg-muted/40"
      >
        <div class="flex items-center justify-between border-b border-default px-4 py-3">
          <div class="flex items-center gap-4">
            <span class="text-4xl font-semibold chinese-char">{{ selectedRow.shape }}</span>

            <div class="flex flex-col">
              <span class="text-2xl font-semibold chinese-char">{{ selectedRow.chinese }}</span>
              <span class="text-sm text-muted">{{ selectedRow.pinyin }}</span>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-volume-2"
              color="info"
              variant="soft"
              size="sm"
              aria-label="Read Chinese"
              @click="speakChinese"
            />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Close dialog"
              @click="closeRowDialog"
            />
          </div>
        </div>

        <div class="grid gap-3 px-4 py-4 text-sm">
          <div>
            <span class="text-muted">English:</span>
            <span class="ml-2 font-medium">{{ selectedRow.english }}</span>
          </div>
          <div>
            <span class="text-muted">Khmer:</span>
            <span class="ml-2 khmer-text">{{ selectedRow.khmer }}</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
</style>
