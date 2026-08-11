<script setup lang="ts">
import type { BookData } from '~/composables/useWords'
import { parseRouteParam, isValidBookNo } from '~/composables/useWords'

const route = useRoute()
const { getBook } = useWords()

const bookNo = computed(() => parseRouteParam(route.params.book))

watchEffect(() => {
  if (!bookNo.value || !isValidBookNo(bookNo.value)) {
    navigateTo('/', { replace: true })
  }
})

const book = computed<BookData | null>(() => getBook(bookNo.value))

const loadedCount = ref(30)
const displayWords = computed(() => book.value?.words.slice(0, loadedCount.value) || [])

watch(bookNo, () => {
  loadedCount.value = 30
})

function loadMore() {
  if (!book.value) return
  loadedCount.value = Math.min(loadedCount.value + 30, book.value.words.length)
}

const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (
      entry?.isIntersecting &&
      book.value &&
      loadedCount.value < book.value.words.length
    ) {
      loadMore()
    }
  })
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  if (observer && loadMoreTrigger.value) {
    observer.unobserve(loadMoreTrigger.value)
  }
  observer = null
})

const pageTitle = computed(() =>
  book.value
    ? `បញ្ជីពាក្យសៀវភៅភាគ ${String(bookNo.value).padStart(2, '0')}`
    : 'បញ្ជីពាក្យ'
)

useSeoMeta({
  title: computed(() => pageTitle.value),
  description: computed(() => book.value?.subtitle || 'រៀនពាក្យចិនជាមួយន័យខ្មែរ')
})
</script>

<template>
  <UContainer
    class="max-w-5xl px-6 py-6 pb-12 sm:px-10 sm:py-8 md:px-14 md:pb-10 lg:px-16"
  >
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-highlighted sm:text-3xl">
        {{ pageTitle }}
      </h1>
      <UButton
        to="/"
        icon="i-lucide-arrow-left"
        variant="soft"
        color="neutral"
      >
        ត្រឡប់ទំព័រដើម
      </UButton>
    </div>

    <UAlert
      v-if="!book || displayWords.length === 0"
      color="neutral"
      variant="subtle"
      title="មិនមានពាក្យទេ។"
    />

    <div v-else class="border-t border-default">
      <NuxtLink
        v-for="(word, index) in displayWords"
        :key="`${bookNo}-${index + 1}-${word.hanzi}`"
        :to="`/words/${bookNo}/${index + 1}`"
        class="flex items-start gap-6 border-b border-default px-2 py-4 transition-colors hover:bg-elevated/50 sm:gap-10 sm:px-4"
      >
        <div class="w-24 shrink-0 sm:w-28">
          <div class="chinese-char text-2xl font-semibold leading-tight text-blue-600 sm:text-3xl dark:text-blue-400">
            {{ word.hanzi }}
          </div>
          <div class="mt-1 text-sm text-blue-600 sm:text-base dark:text-blue-400">
            {{ word.pinyin }}
          </div>
        </div>

        <div class="min-w-0 flex-1 pt-1 text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
          {{ word.khmer }}
        </div>
      </NuxtLink>

      <div
        v-if="loadedCount < book.words.length"
        ref="loadMoreTrigger"
        class="h-8"
      />
    </div>
  </UContainer>
</template>
