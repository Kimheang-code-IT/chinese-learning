import wordData from '../data/word.json'

export interface WordItem {
  pinyin: string
  hanzi: string
  khmer_pinyin: string
  english: string
  khmer: string
  sentencePinyin?: string
  sentenceHanzi?: string
  sentenceKhmer?: string
}

export interface BookData {
  title: string
  subtitle: string
  words: WordItem[]
}

interface RawWord {
  hanzi: string
  pinyin: string
  khmer_pinyin?: string
  meaning_english?: string
  meaning_khmer?: string
  example_sentence_pinyin?: string
  example_sentence?: string
  example_sentence_meaning_khmer?: string
}

function mapWords(items: RawWord[]): WordItem[] {
  return items.map(w => ({
    hanzi: w.hanzi || '',
    pinyin: w.pinyin || '',
    khmer_pinyin: w.khmer_pinyin || '',
    english: w.meaning_english || '',
    khmer: w.meaning_khmer || '',
    sentencePinyin: w.example_sentence_pinyin || '',
    sentenceHanzi: w.example_sentence || '',
    sentenceKhmer: w.example_sentence_meaning_khmer || ''
  }))
}

const books: Record<number, BookData> = {
  1: {
    title: 'សៀវភៅភាគ០១',
    subtitle: 'ពាក្យមូលដ្ឋាន ១–១០០',
    words: mapWords((wordData as RawWord[]).slice(0, 100))
  },
  2: {
    title: 'សៀវភៅភាគ០២',
    subtitle: 'ពាក្យមូលដ្ឋាន ១០១–២០០',
    words: mapWords((wordData as RawWord[]).slice(100, 200))
  },
  3: {
    title: 'សៀវភៅភាគ០៣',
    subtitle: 'ពាក្យកម្រិតខ្ពស់ ២០១–៣០០',
    words: mapWords((wordData as RawWord[]).slice(200, 300))
  }
}

export const BOOK_NUMBERS = [1, 2, 3] as const

export function parseRouteParam(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

export function isValidBookNo(bookNo: number): boolean {
  return BOOK_NUMBERS.includes(bookNo as 1 | 2 | 3)
}

export function useWords() {
  const getBook = (bookNo: number): BookData | null => {
    if (!isValidBookNo(bookNo)) return null
    return books[bookNo] || null
  }

  const getWord = (bookNo: number, wordNo: number): WordItem | null => {
    const book = getBook(bookNo)
    if (!book) return null
    const index = wordNo - 1
    if (index < 0 || index >= book.words.length) return null
    return book.words[index] || null
  }

  const getWordCount = (bookNo: number): number => getBook(bookNo)?.words.length || 0

  return {
    getBook,
    getWord,
    getWordCount,
    isValidBookNo
  }
}
