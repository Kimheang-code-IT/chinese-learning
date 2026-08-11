<script setup lang="ts">
import heroImage from '~/assets/images/hero.png'

type BookItem = {
  label: string
  chinese: string
  bookNumber: number
  strokeClass: string
}

const books: BookItem[] = [
  {
    label: 'ភាគ ០១',
    chinese: '基础',
    bookNumber: 1,
    strokeClass: 'bg-sky-200'
  },
  {
    label: 'ភាគ ០២',
    chinese: '进阶',
    bookNumber: 2,
    strokeClass: 'bg-emerald-200'
  },
  {
    label: 'ភាគ ០៣',
    chinese: '提高',
    bookNumber: 3,
    strokeClass: 'bg-amber-200'
  }
]

const { query, searchResults, onSearchInput, clearSearch } = useSearch()

const heroQuery = computed({
  get: () => query.value,
  set: (val: string) => onSearchInput(val)
})

const showResults = computed(() => heroQuery.value.trim().length > 0)

useSeoMeta({
  title: 'ទំព័រដើម',
  ogTitle: 'រៀនកុំព្យូទ័រ - រៀនភាសាចិន',
  description: 'រៀនវាក្យសព្ទភាសាចិនជាមួយន័យខ្មែរ។',
  ogImage: '/logo.png',
  twitterImage: '/logo.png'
})
</script>

<template>
  <div class="pb-12">
    <section class="bg-teal-600 dark:bg-teal-700">
      <UContainer
        class="flex flex-col items-center gap-4 py-6 sm:gap-5 sm:py-8 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-8 lg:gap-y-4"
      >
        <h1
          class="order-2 text-center text-2xl font-extrabold text-white sm:text-3xl lg:order-none lg:col-start-1 lg:row-start-1 lg:justify-self-start lg:text-left lg:text-4xl"
        >
          រៀនវាក្យសព្ទភាសាចិន
          <span class="chinese-char ml-1 text-teal-100">学中文</span>
        </h1>

        <img
          :src="heroImage"
          alt=""
          class="order-1 mx-auto max-h-28 w-auto object-contain drop-shadow-lg sm:max-h-36 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-52 lg:justify-self-center"
          width="600"
          height="400"
          decoding="async"
          fetchpriority="high"
        >

        <div
          class="relative order-3 w-full max-w-md lg:order-none lg:col-start-1 lg:row-start-2 lg:justify-self-start"
        >
          <UInput
            v-model="heroQuery"
            size="xl"
            icon="i-lucide-search"
            placeholder="ស្វែងរកពាក្យ…"
            class="w-full"
            autocomplete="off"
            :ui="{
              base: 'bg-white text-highlighted ring-0 focus-visible:ring-2 focus-visible:ring-white/60'
            }"
          >
            <template #trailing>
              <UButton
                v-if="heroQuery"
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                class="rounded-full"
                aria-label="សម្អាត"
                @click="clearSearch()"
              />
            </template>
          </UInput>

          <UCard
            v-if="showResults"
            class="absolute inset-x-0 top-full z-30 mt-2 max-h-72 overflow-y-auto shadow-xl"
            :ui="{ body: 'p-2' }"
          >
            <p v-if="!searchResults.length" class="px-3 py-4 text-sm text-muted">
              រកមិនឃើញពាក្យទេ
            </p>
            <ul v-else class="space-y-1">
              <li
                v-for="item in searchResults"
                :key="`${item.bookNo}-${item.wordIndex}`"
              >
                <UButton
                  :to="`/words/${item.bookNo}/${item.wordIndex}`"
                  color="neutral"
                  variant="ghost"
                  block
                  class="h-auto! justify-start px-3 py-2.5"
                  @click="clearSearch()"
                >
                  <div class="flex w-full items-center gap-3 text-left">
                    <span class="chinese-char shrink-0 text-2xl text-teal-600">
                      {{ item.word.hanzi }}
                    </span>
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm font-medium">
                        {{ item.word.pinyin }}
                        <span class="font-normal text-muted"> · {{ item.word.khmer }}</span>
                      </div>
                      <div class="truncate text-xs text-muted">
                        សៀវភៅភាគ {{ item.bookNo }}
                      </div>
                    </div>
                    <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-muted" />
                  </div>
                </UButton>
              </li>
            </ul>
          </UCard>
        </div>
      </UContainer>
    </section>

    <UPageSection
      :ui="{
        container: 'py-8 sm:py-10',
        title: 'mb-1',
        description: 'mt-1'
      }"
    >
      <UPageGrid>
        <NuxtLink
          v-for="book in books"
          :key="book.bookNumber"
          :to="`/words/${book.bookNumber}`"
          class="block transition-transform duration-200 hover:-translate-y-1"
        >
          <UPageCard
            variant="solid"
            class="min-h-44 h-full"
            :ui="{
              root: 'relative overflow-hidden rounded-xl bg-neutral-950 ring-0 shadow-lg bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[14px_14px]',
              container: 'items-center justify-center text-center py-9 sm:py-10',
              title: 'sr-only',
              description: 'sr-only'
            }"
          >
            <div
              class="absolute left-3 top-3 flex h-11 w-9 flex-col items-center justify-center rounded-sm bg-red-600 text-white shadow-md ring-1 ring-red-400/40"
              aria-hidden="true"
            >
              <span class="text-[9px] font-black leading-none tracking-wide">PDF</span>
              <UIcon name="i-lucide-arrow-down" class="mt-0.5 size-4 stroke-[3]" />
            </div>

            <span class="chinese-char absolute right-3 top-3 text-sm text-red-400/90">
              {{ book.chinese }}
            </span>

            <div class="relative mx-auto mt-2 inline-flex min-w-40 items-center justify-center px-6 py-3">
              <span
                class="absolute inset-x-1 top-1/2 h-9 -translate-y-1/2 -rotate-2 rounded-[100%] opacity-95 blur-[0.3px]"
                :class="book.strokeClass"
              />
              <span class="relative -rotate-1 text-2xl font-black tracking-tight text-black sm:text-[1.65rem]">
                {{ book.label }}
              </span>
            </div>
          </UPageCard>
        </NuxtLink>
      </UPageGrid>
    </UPageSection>
  </div>
</template>
