<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useBookAccess } from '~/composables/useBookAccess'
import type { BookData } from '~/composables/useWords'
const route = useRoute()
const { getBook } = useWords()

const auth = useAuth()
const isAuthenticated = auth.isAuthenticated
const { canAccessBook } = useBookAccess()

const bookNo = computed(() => {
  const raw = Number(route.params.book)
  return Number.isFinite(raw) && raw > 0 ? raw : 1
})

// Redirect if logged-in user doesn't have access to this book
onMounted(() => {
  if (isAuthenticated.value && !canAccessBook(bookNo.value)) {
    navigateTo('/')
  }
})

const book = computed<BookData>(() => getBook(bookNo.value))

const loadedCount = ref(20)
const displayWords = computed(() => {
  if (isAuthenticated.value) {
    return book.value.words.slice(0, loadedCount.value)
  }
  return book.value.words.slice(0, 3)
})

function loadMore() {
  loadedCount.value += 20
}

const loadMoreTrigger = ref<null | HTMLElement>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (isAuthenticated.value) {
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (
        entry &&
        entry.isIntersecting &&
        loadedCount.value < book.value.words.length
      ) {
        loadMore()
      }
    })
    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value)
    }
  }
})

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
  }
  observer = null
})

const cardTitle = computed(() => `សៀវភៅគំនូសអក្សរចិន ភាគ${String(bookNo.value).padStart(2, '0')}( 汉字笔画 )`)

function getPinyinForChar(pinyin: string, charIndex: number): string {
  const parts = pinyin.trim().split(/\s+/)
  return parts[charIndex] || parts[0] || ''
}

function getKhmerForChar(khmer: string, charIndex: number): string {
  const parts = khmer.trim().split(/\s+/)
  return parts[charIndex] || parts[0] || ''
}

function getToneColorClassForChar(pinyin: string, charIndex: number): string {
  const syllable = getPinyinForChar(pinyin, charIndex)
  if (/[āēīōūǖ]/.test(syllable)) return 'text-red-600'
  if (/[áéíóúǘ]/.test(syllable)) return 'text-emerald-600'
  if (/[ǎěǐǒǔǚ]/.test(syllable)) return 'text-blue-600'
  if (/[àèìòùǜ]/.test(syllable)) return 'text-violet-600'
  return 'text-red-600'
}

useSeoMeta({
  title: computed(() => book.value.title),
  description: computed(() => book.value.subtitle)
})
</script>

<template>
  <UPageSection class="-mt-17.5 sm:-mt-32">
    <div class="mx-auto max-w-5xl w-full px-4 py-6 sm:p-6">
      <div class="mb-4 sm:mb-5 lg:mb-6">
        <div class=" flex items-start gap-4 sm:hidden">
          <UButton
            to="/"
            icon="i-lucide-chevron-left"
            variant="ghost"
            color="primary"
            size="xl"
            class="-ml-2 bg-primary/10 hover:bg-primary/20"
            aria-label="Back to Cards"
          />

          <h1 class="text-[15px] pt-1 font-bold text-highlighted">
            {{ cardTitle }}
          </h1>
        </div>

        <div class="hidden sm:flex sm:items-start sm:justify-between sm:gap-4">
          <h1 class="text-lg font-bold text-highlighted sm:text-2xl">
            {{ cardTitle }}
          </h1>
          <UButton
            to="/"
            icon="i-lucide-chevron-left"
            variant="ghost"
            color="primary"
            size="xl"
            class="bg-primary/10 hover:bg-primary/20"
          >
            Back to Cards
          </UButton>
        </div>

      </div>

      <div v-if="displayWords.length === 0" class="py-12 text-center text-muted">
        No words found.
      </div>

      <div v-else class="space-y-0">
        <NuxtLink
          v-for="(word, index) in displayWords"
          :key="`${word.hanzi}-${index}`"
          :to="`/words/${bookNo}/${index + 1}`"
          class="block cursor-pointer border-b border-default px-2 py-4 transition-colors active:bg-elevated/70 hover:bg-elevated/40 sm:px-1"
        >
          <div class="flex items-start gap-4 sm:hidden">
            <div class="min-w-20 shrink-0">
              <div class="flex items-center gap-3">
                <div
                  v-for="(char, charIndex) in word.hanzi"
                  :key="charIndex"
                  class="flex flex-col items-center"
                >
                  <div class="mb-1 text-base text-blue-600">
                    {{ getPinyinForChar(word.pinyin, charIndex) }}
                  </div>
                  <div class="chinese-char text-3xl font-semibold" :class="getToneColorClassForChar(word.pinyin, charIndex)">
                    {{ char }}
                  </div>
                  <div class="mt-1 text-sm khmer-text text-muted">
                    {{ getKhmerForChar(word.khmer_pinyin, charIndex) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="space-y-1.5">
                <div class="text-base leading-relaxed text-highlighted">
                  {{ word.english }}
                </div>
                <div class="khmer-text text-sm text-muted">
                  {{ word.khmer }}
                </div>
              </div>
            </div>
          </div>

          <div class="hidden items-start gap-8 sm:flex md:gap-16 lg:gap-24">
            <div class="min-w-30 shrink-0 lg:min-w-35">
              <div class="flex items-center gap-3 lg:gap-4">
                <div
                  v-for="(char, charIndex) in word.hanzi"
                  :key="charIndex"
                  class="flex flex-col items-center"
                >
                  <div class="text-base text-blue-600 lg:text-base">
                    {{ getPinyinForChar(word.pinyin, charIndex) }}
                  </div>
                  <div class="chinese-char text-3xl font-semibold lg:text-4xl" :class="getToneColorClassForChar(word.pinyin, charIndex)">
                    {{ char }}
                  </div>
                  <div class="mt-1 text-base khmer-text text-slate-500 lg:text-base">
                    {{ getKhmerForChar(word.khmer_pinyin, charIndex) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="min-w-0 flex-1 pl-2">
              <div class="space-y-3 lg:space-y-4">
                <div class="text-lg leading-relaxed text-highlighted lg:text-xl">
                  {{ word.english }}
                </div>
                <div class="khmer-text text-base italic text-muted lg:text-base">
                  {{ word.khmer }}
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
          <div v-if="isAuthenticated && loadedCount < book.words.length" ref="loadMoreTrigger" class="h-8" />
      </div>
    </div>
  </UPageSection>
</template>
