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

function expandPinyinQuery(query: string): string[] {
  const chars = query.split('')
  const expanded: string[][] = chars.map(c => TONE_MARKS[c] || [c])
  function combine(arr: string[][], prefix = ''): string[] {
    if (!arr.length) return [prefix]
    const [first, ...rest] = arr
    if (!first) return [prefix]
    let result: string[] = []
    for (const f of first) {
      result = result.concat(combine(rest, prefix + f))
    }
    return result
  }
  return combine(expanded)
}

export interface SearchResult {
  word: WordItem
  bookNo: number
  wordIndex: number
}

function normalizePinyin(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'u')
    .toLowerCase()
}

export function useSearch() {
  const query = useState<string>('search:query', () => '')
  const { getBook } = useWords()
  const results = ref<SearchResult[]>([])

  const debouncedSearch = debounce((rawInput: string) => {
    const rawQuery = rawInput.trim()
    const q = normalizePinyin(rawQuery)
    if (!q) {
      results.value = []
      return
    }

    const expandedPinyinQueries = /[aeiouü]/i.test(rawQuery)
      ? expandPinyinQuery(rawQuery)
      : [rawQuery]

    const found: SearchResult[] = []
    for (const b of [1, 2, 3]) {
      const book = getBook(b)
      if (!book) continue
      book.words.forEach((word, idx) => {
        const searchStr = rawQuery.toLowerCase()
        const wordPinyinNorm = normalizePinyin(word.pinyin || '')
        const sentencePinyinNorm = normalizePinyin(word.sentencePinyin || '')

        const pinyinMatch = expandedPinyinQueries.some((expandedQ) => {
          const expandedNorm = normalizePinyin(expandedQ)
          return (
            wordPinyinNorm.includes(expandedNorm) ||
            sentencePinyinNorm.includes(expandedNorm)
          )
        })

        const matches =
          pinyinMatch ||
          (word.hanzi || '').includes(rawQuery) ||
          (word.khmer_pinyin || '').includes(rawQuery) ||
          (word.english || '').toLowerCase().includes(searchStr) ||
          (word.khmer || '').includes(rawQuery) ||
          (word.sentenceHanzi || '').includes(rawQuery) ||
          (word.sentenceKhmer || '').includes(rawQuery)

        if (matches) {
          found.push({ word, bookNo: b, wordIndex: idx + 1 })
        }
      })
    }
    results.value = found.slice(0, 30)
  }, 200)

  function onSearchInput(val: string) {
    query.value = normalizeText(val)
    debouncedSearch(query.value)
  }

  function clearSearch() {
    query.value = ''
    results.value = []
  }

  watch(query, (val) => {
    debouncedSearch(val)
  })

  return {
    query,
    searchResults: computed(() => results.value),
    onSearchInput,
    clearSearch
  }
}
