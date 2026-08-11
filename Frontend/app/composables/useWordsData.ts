import wordData from '~/data/word.json'
import { computed } from 'vue'
import { debounce } from '~/utils/timing'
import { normalizeText } from '~/utils/string'

type Word = typeof wordData[number]

// Build a fast lookup map by hanzi
const hanziMap: Record<string, Word> = {}
for (const word of wordData) {
  if (word.hanzi) hanziMap[word.hanzi] = word
}

export function useWordsData() {
  // Get all words
  const all = computed(() => wordData)

  // Get by hanzi
  function getByHanzi(hanzi: string): Word | null {
    return hanziMap[hanzi] || null
  }

  const debouncedDataUpdate = debounce((_query: string) => {
    // ...existing data update logic...
  }, 300)

  function onDataInput(val: string) {
    const normalized = normalizeText(val)
    debouncedDataUpdate(normalized)
  }

  return {
    all,
    getByHanzi,
    onDataInput
  }
}
