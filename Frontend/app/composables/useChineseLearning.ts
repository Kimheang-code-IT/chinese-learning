import { useStorage } from '@vueuse/core'

interface LearnedWord {
  key: string
  hanzi: string
  pinyin: string
  english: string
  bookNo: number
  wordNo: number
  visitedAt: number
}

export function useChineseLearning() {
  // Use VueUse's useStorage for persistence, similar to Pinia but without the overhead
  const recent = useStorage<LearnedWord[]>('chinese-learning-recent', [])

  function addRecent(word: LearnedWord) {
    // Keep only the last 20 unique words
    recent.value = [
      word,
      ...recent.value.filter((item) => item.key !== word.key)
    ].slice(0, 20)
  }

  return {
    recent,
    addRecent
  }
}

// Removed orphaned onUserInput. If input state is needed, use a ref as shown above.
