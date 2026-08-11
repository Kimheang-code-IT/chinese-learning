import pinyinJson from '../data/pinyin.json'

type PinyinRow = { pinyin: string; khmer: string }

// Build lookup maps
const khmerMap = new Map<string, string>()
const pinyinMap = new Map<string, string>()
const initialKhmerMap = new Map<string, string>()
const finalKhmerMap = new Map<string, string>()

for (const entry of pinyinJson.data) {
  const initial = entry.initial
  if (entry.initial_khmer) {
    initialKhmerMap.set(initial, entry.initial_khmer)
  }
  for (const [finalKey, row] of Object.entries(entry.rows as Record<string, PinyinRow>)) {
    const key = `${initial}:${finalKey}`
    khmerMap.set(key, row.khmer)
    pinyinMap.set(key, row.pinyin)
    // Use the empty-initial row as the canonical source for final khmer labels
    if (initial === '') {
      finalKhmerMap.set(finalKey, row.khmer)
    }
  }
}

// All initials in JSON order
export const allInitials: string[] = pinyinJson.data.map(e => e.initial)

// All finals in JSON order — sourced from the empty-initial entry (most complete set)
const _emptyEntry = pinyinJson.data.find(e => e.initial === '')
export const allFinals: string[] = _emptyEntry
  ? Object.keys(_emptyEntry.rows as Record<string, PinyinRow>)
  : Array.from(new Set(pinyinJson.data.flatMap(e => Object.keys(e.rows as Record<string, PinyinRow>))))

export function hasCombination(initial: string, final: string): boolean {
  return pinyinMap.has(`${initial}:${final}`)
}

export function getPinyinForCell(initial: string, final: string): string {
  return pinyinMap.get(`${initial}:${final}`) ?? ''
}

export function getKhmerForCell(initial: string, final: string): string {
  return khmerMap.get(`${initial}:${final}`) ?? ''
}

export function getKhmerForInitial(initial: string): string {
  return initialKhmerMap.get(initial) ?? ''
}

export function getKhmerForFinal(final: string): string {
  return finalKhmerMap.get(final) ?? ''
}
