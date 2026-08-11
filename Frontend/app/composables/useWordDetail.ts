export function useWordDetail() {
  const route = useRoute()
  const { getBook, getWord } = useWords()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMounted = ref(false)
  const hasInitialized = ref(false)

  const bookNo = computed(() => Number(route.params.book) > 0 ? Number(route.params.book) : 1)
  const wordNo = computed(() => Number(route.params.word) > 0 ? Number(route.params.word) : 1)
  const book = computed(() => getBook(bookNo.value))
  const word = computed(() => getWord(bookNo.value, wordNo.value))
  const chars = computed(() => Array.from(word.value.hanzi || ""))

  // HanziWriter logic
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

  // Speech logic
  const {
    isPlayingSound,
    isPlayingChineseSentence,
    isPlayingKhmerSentence,
    playPronunciation,
    playCharPronunciation,
    playExampleSentenceChinese,
    playExampleSentenceKhmer,
    showSoundBlockedDialog,
    openInBrowser
  } = useSpeech(word, chars)

  // Pinyin/Khmer helpers
  const displayPinyin = computed(() => word.value.pinyin?.trim() || "")
  const sentencePinyin = computed(() => word.value.sentencePinyin?.trim() || "")
  function getPinyinForChar(charIndex: number): string {
    const parts = displayPinyin.value.trim().split(/\s+/)
    return parts[charIndex] || parts[0] || ""
  }
  function getKhmerForChar(charIndex: number): string {
    const khmerPinyin = word.value.khmer_pinyin || ""
    const parts = (khmerPinyin || word.value.khmer || "").trim().split(/\s+/)
    return parts[charIndex] || parts[0] || ""
  }

  // Sync logic
  async function syncClientState(showLoading = false) {
    if (!import.meta.client) return
    const { addRecent } = useChineseLearning()
    error.value = null
    if (showLoading) loading.value = true
    try {
      addRecent({
        key: `${bookNo.value}-${wordNo.value}-${word.value.hanzi}`,
        hanzi: word.value.hanzi,
        pinyin: displayPinyin.value,
        english: word.value.english,
        bookNo: bookNo.value,
        wordNo: wordNo.value,
        visitedAt: Date.now(),
      })
      destroyWriters()
      await initWriters()
      await loadStrokeOrderGroups()
    } catch {
      if (!hasMounted.value) error.value = "Failed to load word details."
    } finally {
      loading.value = false
      hasInitialized.value = true
    }
  }

  onMounted(() => { hasMounted.value = true; syncClientState(false) })
  onUnmounted(() => { destroyWriters(); isAnimating.value = false; isQuizActive.value = false })
  watch([bookNo, wordNo], () => { if (hasMounted.value && hasInitialized.value) syncClientState(true) })

  return {
    loading, error, bookNo, wordNo, book, word, chars, charWriterIds,
    isAnimating, isQuizActive, activeQuizIndex, showSuccessAnimation,
    isPlayingSound, isPlayingChineseSentence, isPlayingKhmerSentence,
    strokeOrderGroups, sentencePinyin, getPinyinForChar, getKhmerForChar,
    getToneColorClass, // from utils
    toggleAnimation, toggleQuiz, playPronunciation, playCharPronunciation,
    playExampleSentenceChinese, playExampleSentenceKhmer, hasInitialized,
    showSoundBlockedDialog, openInBrowser
  }
}

  // If you need to track detail input, add a ref:
  // const detail = ref('')
  // function onDetailInput(val: string) {
  //   detail.value = normalizeText(val)
  // }
  // ...existing code...

