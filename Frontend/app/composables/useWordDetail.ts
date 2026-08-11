import { parseRouteParam, isValidBookNo } from '~/composables/useWords'

export function useWordDetail() {
  const route = useRoute()
  const { getBook, getWord } = useWords()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMounted = ref(false)
  const hasInitialized = ref(false)

  const bookNo = computed(() => parseRouteParam(route.params.book))
  const wordNo = computed(() => parseRouteParam(route.params.word))

  const book = computed(() => getBook(bookNo.value))
  const word = computed(() => getWord(bookNo.value, wordNo.value))

  const chars = computed(() => Array.from(word.value?.hanzi || ''))

  // Redirect invalid book/word routes to a valid page
  watchEffect(() => {
    if (!bookNo.value || !isValidBookNo(bookNo.value)) {
      navigateTo('/', { replace: true })
      return
    }
    if (!wordNo.value || !word.value) {
      navigateTo(`/words/${bookNo.value}`, { replace: true })
    }
  })

  const {
    charWriterIds,
    isAnimating,
    isQuizActive,
    activeQuizIndex,
    showSuccessAnimation,
    strokeOrderGroups,
    initWriters,
    loadStrokeOrderGroups,
    toggleAnimation,
    toggleQuiz,
    destroyWriters
  } = useHanziWriter(chars, bookNo, wordNo)

  const emptyWord = {
    hanzi: '',
    pinyin: '',
    khmer_pinyin: '',
    english: '',
    khmer: '',
    sentencePinyin: '',
    sentenceHanzi: '',
    sentenceKhmer: ''
  }

  const safeWord = computed(() => word.value || emptyWord)

  const {
    isPlayingSound,
    isPlayingChineseSentence,
    playPronunciation,
    playExampleSentenceChinese,
    showSoundBlockedDialog,
    openInBrowser
  } = useSpeech(safeWord)

  const displayPinyin = computed(() => safeWord.value.pinyin?.trim() || '')
  const sentencePinyin = computed(() => safeWord.value.sentencePinyin?.trim() || '')

  function getPinyinForChar(charIndex: number): string {
    const parts = displayPinyin.value.trim().split(/\s+/)
    return parts[charIndex] || parts[0] || ''
  }

  function getKhmerForChar(charIndex: number): string {
    const khmerPinyin = safeWord.value.khmer_pinyin || ''
    const parts = (khmerPinyin || safeWord.value.khmer || '').trim().split(/\s+/)
    return parts[charIndex] || parts[0] || ''
  }

  function getToneColorClass(pinyin: string): string {
    if (/[āēīōūǖ]/.test(pinyin)) return 'text-red-600'
    if (/[áéíóúǘ]/.test(pinyin)) return 'text-emerald-600'
    if (/[ǎěǐǒǔǚ]/.test(pinyin)) return 'text-sky-600'
    if (/[àèìòùǜ]/.test(pinyin)) return 'text-violet-600'
    return 'text-orange-600'
  }

  async function syncClientState(showLoading = false) {
    if (!import.meta.client || !word.value) return
    error.value = null
    if (showLoading) loading.value = true
    try {
      destroyWriters()
      await initWriters()
      await loadStrokeOrderGroups()
    } catch {
      if (!hasMounted.value) error.value = 'មិនអាចផ្ទុកព័ត៌មានពាក្យបានទេ។'
    } finally {
      loading.value = false
      hasInitialized.value = true
    }
  }

  onMounted(() => {
    hasMounted.value = true
    syncClientState(false)
  })

  onUnmounted(() => {
    destroyWriters()
    isAnimating.value = false
    isQuizActive.value = false
  })

  watch([bookNo, wordNo], () => {
    if (hasMounted.value) syncClientState(true)
  })

  return {
    loading,
    error,
    bookNo,
    book,
    word: safeWord,
    chars,
    charWriterIds,
    isAnimating,
    isQuizActive,
    activeQuizIndex,
    showSuccessAnimation,
    isPlayingSound,
    isPlayingChineseSentence,
    strokeOrderGroups,
    sentencePinyin,
    getPinyinForChar,
    getKhmerForChar,
    getToneColorClass,
    toggleAnimation,
    toggleQuiz,
    playPronunciation,
    playExampleSentenceChinese,
    hasInitialized,
    showSoundBlockedDialog,
    openInBrowser
  }
}
