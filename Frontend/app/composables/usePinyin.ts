import { applyToneMark, type Final, type Initial, type ToneNumber } from '../utils/pinyinTone'
import { allInitials, allFinals, getPinyinForCell, getKhmerForCell } from '../utils/pinyinData'
import { normalizeText } from '~/utils/string'

type SelectedCell = {
  initial: Initial
  final: Final
  baseSyllable: string
  khmer: string
}

export function usePinyin() {
  const initials = allInitials as Initial[]
  const finals = allFinals as Final[]

  const query = ref('')
  const open = ref(false)
  const selected = ref<SelectedCell | null>(null)
  const selectedTone = ref<ToneNumber>(1)

  const toneButtons: Array<{ label: string, value: ToneNumber }> = [
    { label: 'Tone 1', value: 1 },
    { label: 'Tone 2', value: 2 },
    { label: 'Tone 3', value: 3 },
    { label: 'Tone 4', value: 4 },
    { label: 'Neutral', value: 0 }
  ]

  const selectedWithTone = computed(() => {
    if (!selected.value) return ''
    return applyToneMark(selected.value.baseSyllable, selectedTone.value)
  })

  function openDetails(initial: Initial, final: Final) {
    const base = getPinyinForCell(initial, final)
    if (!base) return

    selected.value = {
      initial,
      final,
      baseSyllable: base,
      khmer: getKhmerForCell(initial, final)
    }
    selectedTone.value = 1
    open.value = true
  }

  function onPinyinInput(val: string) {
    query.value = normalizeText(val)
  }

  return {
    initials,
    finals,
    query,
    open,
    selected,
    selectedTone,
    toneButtons,
    selectedWithTone,
    openDetails,
    onPinyinInput
  }
}
