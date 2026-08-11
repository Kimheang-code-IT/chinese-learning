<script setup lang="ts">
const search = useSearch()
const router = useRouter()

const isOpenModel = computed<boolean>({
  get: () => search.isOpen.value,
  set: (val) => { search.isOpen.value = val },
})

const queryModel = computed<string>({
  get: () => search.query.value,
  set: (val) => { search.query.value = val },
})

const results = computed(() => search.searchResults.value)

const searchLabel = computed(() =>
  search.currentBook.value ? `Search Book ${search.currentBook.value}` : 'Search All Books'
)

const inputRef = ref<HTMLInputElement | null>(null)


// Lock body scroll when modal is open
watch(search.isOpen, async (val) => {
  if (val) {
    document.body.classList.add('overflow-hidden')
    await nextTick()
    inputRef.value?.focus()
  } else {
    document.body.classList.remove('overflow-hidden')
    search.query.value = ''
  }
})

function navigate(bookNo: number, wordIndex: number) {
  search.closeSearch()
  router.push(`/words/${bookNo}/${wordIndex}`)
}

function getToneColor(pinyin: string): string {
  if (/[āēīōūǖ]/.test(pinyin)) return 'text-red-600 dark:text-red-400'
  if (/[áéíóúǘ]/.test(pinyin)) return 'text-emerald-600 dark:text-emerald-400'
  if (/[ǎěǐǒǔǚ]/.test(pinyin)) return 'text-blue-600 dark:text-blue-400'
  if (/[àèìòùǜ]/.test(pinyin)) return 'text-violet-600 dark:text-violet-400'
  return 'text-primary'
}

function getCharPinyin(pinyin: string, charIndex: number): string {
  const parts = pinyin.trim().split(/\s+/)
  return parts[charIndex] || parts[0] || ''
}

function getCharKhmer(khmerPinyin: string, charIndex: number): string {
  const parts = khmerPinyin.trim().split(/\s+/)
  return parts[charIndex] || parts[0] || ''
}
</script>

<template>
  <UModal
v-model:open="isOpenModel" :title="undefined" :close="false"
    :ui="{ content: 'max-w-full sm:max-w-2xl', body: 'p-0' }" class="search-modal-responsive">
    <template #body>
      <div class="flex flex-col h-[80vh] max-h-160 min-h-80">
        <!-- Search input row -->
        <div class="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 border-b border-default shrink-0">
          <UIcon
name="i-lucide-search" class="shrink-0 size-5 text-muted cursor-pointer"
            @click="search.openSearch && search.openSearch()" />
          <input
ref="inputRef" v-model="queryModel" :placeholder="`${searchLabel}...`"
            class="flex-1 bg-transparent text-base outline-none placeholder:text-muted min-w-0" type="text"
            autocomplete="off" spellcheck="false" style="font-size: 1rem; min-height: 2.5rem;" >
          <div class="flex items-center gap-1 shrink-0">

            <UButton
icon="i-lucide-x" color="neutral" variant="ghost" size="sm" aria-label="Close"
              @click="search.closeSearch()" />
          </div>
        </div>

        <!-- Book context bar -->
        <div
          class="flex items-center gap-1.5 px-3 py-2 sm:px-4 border-b border-default bg-muted/30 text-xs text-muted shrink-0">
          <UIcon name="i-lucide-book-open" class="size-3.5 shrink-0" />
          <span>{{ searchLabel }}</span>
          <span v-if="queryModel && results.length" class="ml-auto">
            {{ results.length }} result{{ results.length === 1 ? '' : 's' }}
          </span>
        </div>

        <!-- Result area -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 min-h-0 overflow-y-auto">
            <!-- No query -->
            <div
v-if="!queryModel"
              class="flex flex-col items-center justify-center h-full gap-3 text-muted py-10 sm:py-16 text-center">
              <UIcon name="i-lucide-search" class="size-12 opacity-25" />
              <p class="text-sm">Type pinyin to search words</p>
            </div>

            <!-- No results -->
            <div
v-else-if="results.length === 0"
              class="flex flex-col items-center justify-center h-full gap-3 text-muted py-10 sm:py-16 text-center">
              <UIcon name="i-lucide-file-search" class="size-12 opacity-25" />
              <p class="text-sm">
                No words found for
                "<strong class="text-default font-semibold">{{ queryModel }}</strong>"
              </p>
            </div>

            <!-- Results list -->
            <div v-else class="divide-y divide-default">
              <button
v-for="result in results" :key="`${result.bookNo}-${result.wordIndex}`"
                class="w-full flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-3 text-left hover:bg-elevated/50 active:bg-elevated transition-colors cursor-pointer min-h-14"
                style="touch-action: manipulation;" @click="navigate(result.bookNo, result.wordIndex)">
                <!-- Char group: pinyin + hanzi + khmer_pinyin per character -->
                <div class="flex items-center gap-3 sm:gap-6 shrink-0">
                  <div
v-for="(char, charIndex) in result.word.hanzi" :key="charIndex"
                    class="flex flex-col items-center">
                    <span
class="text-[11px] sm:text-xs leading-none mb-0.5 font-medium"
                      :class="getToneColor(getCharPinyin(result.word.pinyin, charIndex))">
                      {{ getCharPinyin(result.word.pinyin, charIndex) }}
                    </span>
                    <span
class="chinese-char text-xl sm:text-2xl font-medium leading-none"
                      :class="getToneColor(getCharPinyin(result.word.pinyin, charIndex))">
                      {{ char }}
                    </span>
                    <span class="text-[10px] sm:text-xs leading-none mt-0.5 text-muted">
                      {{ getCharKhmer(result.word.khmer_pinyin, charIndex) }}
                    </span>
                  </div>
                </div>

                <!-- Meanings -->
                <div class="pl-12 sm:pl-20 flex-1 min-w-0">
                  <p class="text-xs sm:text-sm font-semibold text-highlighted truncate">
                    {{ result.word.english }}
                  </p>
                  <p class="text-[11px] sm:text-xs text-muted mt-0.5 truncate">
                    {{ result.word.khmer }}
                  </p>
                </div>

                <!-- Navigate arrow -->
                <UIcon name="i-lucide-chevron-right" class="size-4 text-muted shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
<style scoped>
.chinese-char {
  transform: translateY(-2%) !important;
}
</style>