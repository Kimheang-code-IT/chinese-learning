export function getToneColorClass(syllable: string): string {
  if (/[āēīōūǖ]/.test(syllable)) return "text-red-600"
  if (/[áéíóúǘ]/.test(syllable)) return "text-amber-600"
  if (/[ǎěǐǒǔǚ]/.test(syllable)) return "text-emerald-600"
  if (/[àèìòùǜ]/.test(syllable)) return "text-blue-600"
  return "text-slate-500"
}
