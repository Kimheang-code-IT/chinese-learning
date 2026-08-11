<script setup lang="ts">

import { useAuth } from '~/composables/useAuth'
const route = useRoute()
const auth = useAuth()
const isAuthenticated = auth.isAuthenticated

// Pre-render navigation guard: allow only first 3 words for guest users
if (!isAuthenticated.value && Number(route.params.word) > 3) {
  navigateTo(`/words/${route.params.book}`)
}

const strokePreviewOpen = ref(false)
const selectedStrokePreview = ref<{ char: string, stepNumber: number, svg: string } | null>(null)

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

function openStrokePreview(char: string, stepNumber: number, svg: string) {
  selectedStrokePreview.value = { char, stepNumber, svg }
  strokePreviewOpen.value = true
}

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
  const chars = Array.from(hanzi)
  const syllables = pinyinText.trim().split(/\s+/).filter(Boolean)

  let syllableIndex = 0
  return chars.map(char => {
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
  title: () => `${word.value.hanzi} (${word.value.pinyin}) - ${word.value.english}`,
  ogTitle: () => `${word.value.hanzi} (${word.value.pinyin}) - រៀនភាសាចិន`,
  description: () => `រៀនពាក្យ "${word.value.hanzi}" មានន័យថា "${word.value.khmer}" ជាមួយដំណាក់សិក្សា។`,
  ogDescription: () => `រៀនពាក្យ "${word.value.hanzi}" មានន័យថា "${word.value.khmer}" ជាមួយដំណាក់សិក្សា។`,
  ogImage: '/logo.png'
})
</script>

<template>
  <UPageSection class="-mt-16! sm:-mt-32!">
    <ConfirmDialog
      v-model="showSoundBlockedDialog"
      title="មិនអាចចាក់សម្លេងបានទេ"
      description="កម្មវិធីនេះត្រូវការបើកនៅក្នុងកម្មវិធីរុករក (Browser) ដូចជា Chrome, Safari ឬ Edge ដើម្បីអាចចាក់សម្លេងបាន។ សូមបើកវេបសាយនេះក្នុងកម្មវិធីរុករក។"
      confirm-label="បើកក្នុងកម្មវិធីរុករក"
      cancel-label="បិទ"
      confirm-color="primary"
      @confirm="openInBrowser"
    />
    <div class="w-full sm:mx-auto sm:max-w-6xl">
      <UCard class="rounded-none border-x-0 sm:rounded-sm sm:border-x">
        <template #header>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <UButton :to="`/words/${bookNo}`" icon="i-lucide-arrow-left" variant="ghost" color="neutral">
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
                    class="hanzi-grid relative h-37.5 w-37.5 overflow-hidden rounded-lg border border-default sm:h-45 sm:w-45"
                    :class="{
                      'ring-2 ring-primary/70 border-primary': activeQuizIndex === index,
                      'ring-2 ring-amber-400/60 border-amber-400': isAnimating
                    }">
                    <div :id="charWriterIds[index]" class="absolute inset-0 z-10 h-full w-full" />

                    <transition name="success-fade">
                      <div
v-if="showSuccessAnimation === index"
                        class="absolute inset-0 z-20 pointer-events-none flex items-center justify-center" :class="[
                          'bg-linear-to-br from-emerald-400/90 via-green-400/90 to-teal-400/90',
                          'dark:from-emerald-500/90 dark:via-green-500/90 dark:to-teal-500/90'
                        ]">
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg
class="w-20 h-20 text-white animate-scale-in" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div class="absolute bottom-3 left-0 right-0 text-center">
                          <span class="text-white font-bold text-sm sm:text-base drop-shadow-lg">ត្រឹមត្រូវ!</span>
                        </div>
                      </div>
                    </transition>
                  </div>

                  <template #fallback>
                    <div
                      class="hanzi-grid relative flex h-37.5 w-37.5 items-center justify-center overflow-hidden rounded-lg border border-default sm:h-45 sm:w-45 cursor-pointer transition-transform hover:scale-110 active:scale-105"
                      title="ពង្រីកសម្រាប់សរសេរងាយ"
                      @click="openStrokePreview(char, 1, '')">
                      <span class="chinese-char writer-fallback-char">{{ char }}</span>
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

              <div>
                <p class="text-sm font-semibold text-highlighted">អត្ថន័យជាភាសាអង់គ្លេស៖</p>
                <p class="pt-2 text-lg italic text-blue-600">{{ word.english }}</p>
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
                    <button
v-for="(step, stepIndex) in group.steps" :key="`${group.char}-${stepIndex}`" type="button"
                      class="hanzi-grid relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-lg border border-default bg-default text-left transition-transform hover:scale-105 hover:border-primary"
                      @click="openStrokePreview(group.char, stepIndex + 1, step)">
                      <span
                        class="absolute left-0 top-0 z-10 rounded bg-default/90 px-1.5 py-0.5 text-[10px] font-semibold text-highlighted ring-1 ring-default">
                        {{ stepIndex + 1 }}
                      </span>
                      <SafeInlineSvg :svg="step" class="h-full w-full" />
                    </button>
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
    </div>

  </UPageSection>
</template>

<style scoped>
.hanzi-grid {
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
    linear-gradient(to right, rgba(100, 116, 139, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(100, 116, 139, 0.25) 1px, transparent 1px),
    linear-gradient(to bottom right, rgba(148, 163, 184, 0.22), rgba(148, 163, 184, 0));
  background-size: 18px 18px, 18px 18px, 50% 100%, 100% 50%, 100% 100%;
  background-position: 0 0, 0 0, center top, left center, center;
}

.chinese-char {
  transform: translateY(-2%) !important;
}

.writer-fallback-char {
  color: #dc2626;
  line-height: 1;
  font-size: clamp(2.75rem, 11vw, 4.75rem);
}



/* Success animation transitions */
.success-fade-enter-active,
.success-fade-leave-active {
  transition: opacity 0.3s ease;
}

.success-fade-enter-from,
.success-fade-leave-to {
  opacity: 0;
}

/* Scale animation for checkmark */
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
