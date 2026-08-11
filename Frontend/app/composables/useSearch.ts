// Map of base vowels to all their tone-marked forms
import type { WordItem } from './useWords'
import { debounce } from '~/utils/timing'
import { normalizeText } from '~/utils/string'
const TONE_MARKS: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
}

export type ToneMarkKey = keyof typeof TONE_MARKS
export type ToneMarksMap = typeof TONE_MARKS
export const PINYIN_TONE_MARKS: ToneMarksMap = TONE_MARKS

// Expand a search query so that e.g. 'ai' matches all tone-marked forms for a and i
function expandPinyinQuery(query: string): string[] {
  // For each character, if it's a base vowel, expand to all tone forms, else keep as is
  const chars = query.split('')
  const expanded: string[][] = chars.map(c => TONE_MARKS[c] || [c])
  // Generate all combinations
  function combine(arr: string[][], prefix = ''): string[] {
    if (!arr.length) return [prefix];
    const [first, ...rest] = arr;
    if (!first) return [prefix];
    let result: string[] = [];
    for (const f of first) {
      result = result.concat(combine(rest, prefix + f));
    }
    return result;
  }
  return combine(expanded);
}

export interface SearchResult {
  word: WordItem
  bookNo: number
  wordIndex: number
}

export type SearchMode = 'pinyin' | 'all'

// Strips tone diacritics so plain letters match tone-marked pinyin.
// e.g. "a" matches ā á ǎ à, "u" matches ü ǖ ǘ ǚ ǜ

// Normalize pinyin to plain ASCII for easier search (e.g. 'eoui' matches 'ēǒūī')
function normalizePinyin(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove all combining diacritical marks
    .replace(/ü/g, 'u') // treat ü as u for search
    .toLowerCase()
}

export const useSearch = (): {
  isOpen: Ref<boolean>
  query: Ref<string>
  searchMode: Ref<SearchMode>
  currentBook: ComputedRef<number | null>
  searchResults: ComputedRef<SearchResult[]>
  pinyinToneMarks: ComputedRef<ToneMarksMap>
  pinyinToneList: ComputedRef<Array<{ key: ToneMarkKey, chars: string[] }>>
  openSearch: () => void
  closeSearch: () => void
  onSearchInput: (val: string) => void
} => {
  const isOpen = useState('search:open', () => false)
  const query = useState<string>('search:query', () => '')
  const searchMode = useState<SearchMode>('search:mode', () => 'pinyin')
  const route = useRoute()
  const { getBook } = useWords()

  const currentBook = computed<number | null>(() => {
    const bookParam = route.params.book
    if (bookParam) {
      const n = Number(Array.isArray(bookParam) ? bookParam[0] : bookParam)
      if (Number.isFinite(n) && n > 0) return n
    }
    return null
  })

  // Search by pinyin-only or all fields depending on mode.
  const results = ref<SearchResult[]>([])
  const debouncedSearch = debounce((query: string) => {

    const rawQuery = query.trim()
    const q = normalizePinyin(rawQuery)
    if (!q) {
      results.value = []
      return
    }
    // If the query contains any a, e, i, o, u, ü, expand to all tone-marked forms
    const expandedPinyinQueries = /[aeiouü]/i.test(rawQuery) ? expandPinyinQuery(rawQuery) : [rawQuery]

    const bookNo = currentBook.value
    const booksToSearch = bookNo ? [bookNo] : [1, 2, 3]

    const found: SearchResult[] = []
    for (const b of booksToSearch) {
      const book = getBook(b)
      const wordsToSearch = book.words
      wordsToSearch.forEach((word, idx) => {
        const raw = rawQuery
        const searchStr = raw.toLowerCase()

        const wordPinyinNorm = normalizePinyin(word.pinyin || '')
        const sentencePinyinNorm = normalizePinyin(word.sentencePinyin || '')
        const searchNorm = normalizePinyin(searchStr)

        // Allow plain pinyin input to match tone-marked pinyin (and vice-versa), for both word + sentence pinyin.
        const pinyinMatch = expandedPinyinQueries.some(expandedQ => {
          const expandedNorm = normalizePinyin(expandedQ)
          return (
            wordPinyinNorm.includes(expandedNorm) ||
            sentencePinyinNorm.includes(expandedNorm) ||
            searchNorm.includes(wordPinyinNorm) ||
            wordPinyinNorm.includes(searchNorm) ||
            searchNorm.includes(sentencePinyinNorm) ||
            sentencePinyinNorm.includes(searchNorm)
          )
        })

        const hanziMatch = (word.hanzi || '').includes(raw)
        const khmerPinyinMatch = (word.khmer_pinyin || '').includes(raw)
        const englishMatch = (word.english || '').toLowerCase().includes(searchStr)
        const khmerMatch = (word.khmer || '').includes(raw)
        const sentenceHanziMatch = (word.sentenceHanzi || '').includes(raw)
        const sentenceKhmerMatch = (word.sentenceKhmer || '').includes(raw)

        const matches = searchMode.value === 'pinyin'
          ? pinyinMatch
          : (
            pinyinMatch ||
            hanziMatch ||
            khmerPinyinMatch ||
            englishMatch ||
            khmerMatch ||
            sentenceHanziMatch ||
            sentenceKhmerMatch
          )

        if (matches) {
          found.push({ word, bookNo: b, wordIndex: idx + 1 })
        }
      })
    }
    results.value = found.slice(0, 50)
  }, 300)

  function openSearch() {
    isOpen.value = true
  }

  function closeSearch() {
    isOpen.value = false
    query.value = ''
  }

  function onSearchInput(val: string) {
    const normalized = normalizeText(val)
    debouncedSearch(normalized)
  }

  watch(query, (val) => {
    debouncedSearch(val)
  }, { immediate: true })

  return {
    isOpen,
    query,
    searchMode,
    currentBook,
    searchResults: computed(() => results.value),
    pinyinToneMarks: computed(() => PINYIN_TONE_MARKS),
    pinyinToneList: computed(() => (Object.entries(PINYIN_TONE_MARKS) as Array<[ToneMarkKey, string[]]>)
      .map(([key, chars]) => ({ key, chars }))),
    openSearch,
    closeSearch,
    onSearchInput
  }
}

