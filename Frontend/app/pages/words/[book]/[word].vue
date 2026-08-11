<script setup lang="ts">
const {
  loading,
  error,
  bookNo,
  word,
  chars,
  charWriterIds,
  isAnimating,
  isQuizActive,
  activeQuizIndex,
  showSuccessAnimation,
  hasInitialized,
  isPlayingSound,
  isPlayingChineseSentence,
  strokeOrderGroups,
  sentencePinyin,
  getPinyinForChar,
  getKhmerForChar,
  getToneColorClass,
  toggleAnimation,
  toggleQuiz,
  playPronunciation,
  playExampleSentenceChinese,
  showSoundBlockedDialog,
  openInBrowser
} = useWordDetail()

function getToneColorClassFromSyllable(syllable: string) {
  if (/[āēīōūǖ]/.test(syllable)) return 'text-red-600'
  if (/[áéíóúǘ]/.test(syllable)) return 'text-amber-600'
  if (/[ǎěǐǒǔǚ]/.test(syllable)) return 'text-emerald-600'
  if (/[àèìòùǜ]/.test(syllable)) return 'text-blue-600'
  return 'text-slate-500'
}

const sentenceCharPairs = computed(() => {
  const hanzi = word.value.sentenceHanzi || '我有一个弟弟。'
  const pinyinText = sentencePinyin.value || 'wǒ yǒu yí gè dì dì'
  const sentenceChars = Array.from(hanzi)
  const syllables = pinyinText.trim().split(/\s+/).filter(Boolean)

  let syllableIndex = 0
  return sentenceChars.map((char) => {
    const isChineseChar = /[\u3400-\u9fff]/.test(char)
    const syllable = isChineseChar ? (syllables[syllableIndex++] || '') : ''
    return {
      char,
      syllable,
      toneClass: getToneColorClassFromSyllable(syllable)
    }
  })
})

useSeoMeta({
  title: () => `${word.value.hanzi} (${word.value.pinyin}) - ${word.value.khmer}`,
  ogTitle: () => `${word.value.hanzi} - រៀនកុំព្យូទ័រ`,
  description: () => `រៀនពាក្យ "${word.value.hanzi}" មានន័យថា "${word.value.khmer}"។`,
  ogDescription: () => `រៀនពាក្យ "${word.value.hanzi}" មានន័យថា "${word.value.khmer}"។`,
  ogImage: '/logo.png'
})
</script>

<template>
  <div>
    <ConfirmDialog
      v-model="showSoundBlockedDialog"
      title="មិនអាចចាក់សម្លេងបានទេ"
      description="កម្មវិធីនេះត្រូវការបើកនៅក្នុងកម្មវិធីរុករក ដូចជា Chrome, Safari ឬ Edge ដើម្បីអាចចាក់សម្លេងបាន។"
      confirm-label="បើកក្នុងកម្មវិធីរុករក"
      cancel-label="បិទ"
      confirm-color="primary"
      @confirm="openInBrowser"
    />

    <UContainer class="pb-8">
      <UCard
        :ui="{
          root: 'overflow-hidden',
          header: 'bg-elevated/50'
        }"
      >
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <UButton :to="`/words/${bookNo}`" icon="i-lucide-arrow-left" variant="soft" color="neutral">
                ត្រលប់ក្រោយ
              </UButton>

              <UButton
:icon="isAnimating ? 'i-lucide-square' : 'i-lucide-play-circle'" color="primary"
                @click="toggleAnimation">
                <span class="hidden sm:inline">{{ isAnimating ? 'ឈប់ចលនា' : 'ចាក់ចលនា' }}</span>
              </UButton>

              <UButton :icon="isQuizActive ? 'i-lucide-x' : 'i-lucide-pencil'" color="secondary" @click="toggleQuiz">
                <span class="hidden sm:inline">{{ isQuizActive ? 'ឈប់សរសេរ' : 'សរសេរ' }}</span>
              </UButton>

              <UButton icon="i-lucide-volume-2" color="success" :loading="isPlayingSound" @click="playPronunciation">
                <span class="hidden sm:inline">អានសម្លេងចិន</span>
              </UButton>
            </div>
          </div>
        </template>

        <div v-if="loading && hasInitialized" class="space-y-3">
          <USkeleton class="h-8 w-1/3" />
          <USkeleton class="h-56 w-full" />
        </div>

        <UAlert v-else-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :title="error" />

        <div v-else class="space-y-6">
          <div class="flex flex-wrap items-start justify-center gap-4 sm:gap-6 lg:gap-8">
            <div v-for="(char, index) in chars" :key="`${char}-${index}`" class="flex flex-col items-center gap-2">
              <div class="w-full text-center text-sm font-medium sm:text-base" :class="getToneColorClass(getPinyinForChar(index))">
                {{ getPinyinForChar(index) }}
              </div>

              <div class="flex flex-col items-center gap-2">
                <ClientOnly>
                  <div
                    class="relative h-37.5 w-37.5 overflow-hidden rounded-lg border border-default bg-size-[18px_18px] bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] sm:h-45 sm:w-45"
                    :class="{
                      'ring-2 ring-primary/70 border-primary': activeQuizIndex === index,
                      'ring-2 ring-amber-400/60 border-amber-400': isAnimating
                    }">
                    <div :id="charWriterIds[index]" class="absolute inset-0 z-10 h-full w-full" />

                    <Transition
                      enter-active-class="transition-opacity duration-300"
                      enter-from-class="opacity-0"
                      leave-active-class="transition-opacity duration-300"
                      leave-to-class="opacity-0"
                    >
                      <div
v-if="showSuccessAnimation === index"
                        class="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" :class="[
                          'bg-linear-to-br from-emerald-400/90 via-green-400/90 to-teal-400/90',
                          'dark:from-emerald-500/90 dark:via-green-500/90 dark:to-teal-500/90'
                        ]">
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg
class="size-20 scale-100 text-white transition-transform duration-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div class="absolute bottom-3 left-0 right-0 text-center">
                          <span class="text-white font-bold text-sm sm:text-base drop-shadow-lg">ត្រឹមត្រូវ!</span>
                        </div>
                      </div>
                    </Transition>
                  </div>

                  <template #fallback>
                    <div
                      class="relative flex h-37.5 w-37.5 items-center justify-center overflow-hidden rounded-lg border border-default bg-size-[18px_18px] bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] sm:h-45 sm:w-45"
                    >
                      <span class="chinese-char text-5xl leading-none text-red-600 sm:text-6xl">{{ char }}</span>
                    </div>
                  </template>
                </ClientOnly>

              </div>

              <div class="text-xs khmer-text text-slate-500 sm:text-sm">
                {{ getKhmerForChar(index) }}
              </div>
            </div>

            <div class="min-w-45 space-y-5 pt-2">
              <div>
                <p class="text-sm font-semibold text-highlighted">អត្ថន័យជាភាសាខ្មែរ៖</p>
                <p class="khmer-text pt-2 text-lg italic text-blue-600">{{ word.khmer }}</p>
              </div>
            </div>
          </div>

          <USeparator />

          <div>
            <p class="mb-2 text-sm font-semibold text-highlighted">គំនូរលំដាប់លំដោយ ៖ <span class="chinese-char pl-2 text-red-600 text-md">{{ word.hanzi }}</span></p>


            <ClientOnly>
              <div v-if="strokeOrderGroups.length" class="mt-4 space-y-4">
                <div v-for="group in strokeOrderGroups" :key="group.char" class="space-y-2">
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="(step, stepIndex) in group.steps"
                      :key="`${group.char}-${stepIndex}`"
                      class="relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-lg border border-default bg-default bg-size-[12px_12px] bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)]"
                    >
                      <span
                        class="absolute left-0 top-0 z-10 rounded bg-default/90 px-1.5 py-0.5 text-[10px] font-semibold text-highlighted ring-1 ring-default"
                      >
                        {{ stepIndex + 1 }}
                      </span>
                      <SafeInlineSvg :svg="step" class="h-full w-full" />
                    </div>
                  </div>
                </div>
              </div>

            </ClientOnly>
          </div>

          <USeparator />

          <div>
            <div class="flex items-center gap-2">
              <p class="mb-3 text-sm font-semibold text-highlighted">ឧទាហរណ៍ប្រយោគ:</p>

              <UButton
icon="i-lucide-volume-2" color="neutral" variant="ghost" size="md" class="-mt-2!"
                :loading="isPlayingChineseSentence" @click="playExampleSentenceChinese" />

            </div>

          <div class="space-y-3 text-center">
            <div class="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
              <div
v-for="(item, idx) in sentenceCharPairs" :key="`sentence-char-${idx}`"
                class="flex min-w-5 flex-col items-center">
                <span
class="text-[11px] leading-none sm:text-xs"
                  :class="item.syllable ? item.toneClass : 'text-transparent'">
                  {{ item.syllable || ' ' }}
                </span>
                <span class="chinese-char text-3xl sm:text-4xl" :class="item.syllable ? item.toneClass : 'text-primary'">{{ item.char }}</span>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2">
              <p class="khmer-text text-lg italic text-muted sm:text-xl">{{ word.sentenceKhmer ||
                'ខ្ញុំមានប្អូនប្រុសម្នាក់។' }}
              </p>
            </div>
          </div>
          </div>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
