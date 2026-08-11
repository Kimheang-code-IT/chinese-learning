export type Initial = '' | 'b' | 'p' | 'm' | 'f' | 'd' | 't' | 'n' | 'l' | 'g' | 'k' | 'h' | 'j' | 'q' | 'x' | 'zh' | 'ch' | 'sh' | 'r' | 'z' | 'c' | 's' | 'y' | 'w'

export type Final =
  | 'a' | 'o' | 'e' | 'ai' | 'ei' | 'ao' | 'ou' | 'an' | 'en' | 'ang' | 'eng' | 'ong'
  | 'i' | 'ia' | 'ie' | 'iao' | 'iu' | 'ian' | 'in' | 'iang' | 'ing' | 'iong'
  | 'u' | 'ua' | 'uo' | 'uai' | 'ui' | 'uan' | 'un' | 'uang' | 'ueng'
  | 'ü' | 'üe' | 'üan' | 'ün'

export type ToneNumber = 0 | 1 | 2 | 3 | 4

const TONE_MARKS: Record<string, [string, string, string, string]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ']
}

/**
 * Add a tone mark to a pinyin syllable using standard vowel priority:
 * 1) a/e always take mark
 * 2) in "ou", mark "o"
 * 3) in "iu", mark "u"; in "ui", mark "i"
 * 4) otherwise mark the last vowel
 *
 * Unit-test-like examples:
 * applyToneMark('ma', 1) -> 'mā'
 * applyToneMark('mei', 2) -> 'méi'
 * applyToneMark('you', 3) -> 'yǒu'
 * applyToneMark('liu', 4) -> 'liù'
 * applyToneMark('gui', 1) -> 'guī'
 * applyToneMark('xue', 2) -> 'xué'
 */
export function applyToneMark(rawSyllable: string, tone: ToneNumber): string {
  if (tone === 0) {
    return rawSyllable
  }

  const syllable = rawSyllable.toLowerCase().replaceAll('v', 'ü')
  const markIndex = resolveToneIndex(syllable)

  if (markIndex < 0) {
    return syllable
  }

  const vowel = syllable.charAt(markIndex)
  if (!(vowel in TONE_MARKS)) {
    return syllable
  }

  const toneSet = TONE_MARKS[vowel as keyof typeof TONE_MARKS]
  if (!toneSet) {
    return syllable
  }

  const markedVowel = toneSet[tone - 1]

  if (!markedVowel) {
    return syllable
  }

  return `${syllable.slice(0, markIndex)}${markedVowel}${syllable.slice(markIndex + 1)}`
}

function resolveToneIndex(syllable: string): number {
  const indexA = syllable.indexOf('a')
  if (indexA >= 0) return indexA

  const indexE = syllable.indexOf('e')
  if (indexE >= 0) return indexE

  const indexOu = syllable.indexOf('ou')
  if (indexOu >= 0) return indexOu

  const indexIu = syllable.indexOf('iu')
  if (indexIu >= 0) return indexIu + 1

  const indexUi = syllable.indexOf('ui')
  if (indexUi >= 0) return indexUi + 1

  const vowels = ['a', 'e', 'i', 'o', 'u', 'ü']
  for (let i = syllable.length - 1; i >= 0; i--) {
    const ch = syllable.charAt(i)
    if (vowels.includes(ch)) {
      return i
    }
  }

  return -1
}
