import type { ComputedRef } from 'vue'

type WordLike = {
  hanzi?: string
  sentenceHanzi?: string
}

type SpeechCallback = (() => void) | undefined

export function useSpeech(word: ComputedRef<WordLike>) {
  const isPlayingSound = ref(false)
  const isPlayingChineseSentence = ref(false)
  const showSoundBlockedDialog = ref(false)

  function canUseSpeechSynthesis(): boolean {
    return (
      import.meta.client &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      'SpeechSynthesisUtterance' in window
    )
  }

  function resolveVoiceForLang(lang: string): SpeechSynthesisVoice | null {
    if (!import.meta.client || !('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return null
    const wanted = lang.toLowerCase()
    const base = wanted.split('-')[0] || wanted
    const exact = voices.find(v => v.lang?.toLowerCase() === wanted)
    if (exact) return exact
    const sameLang = voices.filter(v => v.lang?.toLowerCase().startsWith(`${base}-`))
    if (base === 'zh' && sameLang.length) {
      const preferredZhName = ['xiaoxiao', 'xiaoyi', 'tingting', 'yunxi', 'mandarin', 'chinese', 'google']
      const naturalZh = sameLang.find(v => preferredZhName.some(k => (v.name || '').toLowerCase().includes(k)))
      if (naturalZh) return naturalZh
      const localZh = sameLang.find(v => v.localService)
      if (localZh) return localZh
      return sameLang[0] || null
    }
    if (sameLang.length) return sameLang.find(v => v.localService) || sameLang[0] || null
    return voices.find(v => (v.lang || '').toLowerCase().includes(base)) || voices[0] || null
  }

  function speak(
    text: string,
    lang: string,
    onStart?: SpeechCallback,
    onEnd?: SpeechCallback,
    rate = 0.9
  ): boolean {
    if (!canUseSpeechSynthesis() || !text?.trim()) {
      onEnd?.()
      return false
    }
    const synth = window.speechSynthesis
    const utterance = new window.SpeechSynthesisUtterance(text.trim())
    utterance.lang = lang
    utterance.rate = Math.min(Math.max(rate, 0.5), 1.2)
    utterance.pitch = 0.95
    utterance.volume = 1
    utterance.onstart = () => onStart?.()
    utterance.onend = () => onEnd?.()
    utterance.onerror = () => onEnd?.()
    const runSpeak = () => {
      utterance.voice = resolveVoiceForLang(lang)
      synth.cancel()
      setTimeout(() => {
        synth.resume?.()
        synth.speak(utterance)
      }, 50)
    }
    if (synth.getVoices().length) {
      runSpeak()
      return true
    }
    const voiceReadyHandler = () => {
      synth.removeEventListener('voiceschanged', voiceReadyHandler)
      runSpeak()
    }
    synth.addEventListener('voiceschanged', voiceReadyHandler)
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', voiceReadyHandler)
      runSpeak()
    }, 250)
    return true
  }

  function playPronunciation(): void {
    if (!word.value.hanzi) return
    speak(
      word.value.hanzi,
      'zh-CN',
      () => { isPlayingSound.value = true },
      () => { isPlayingSound.value = false },
      0.56
    )
  }

  function playExampleSentenceChinese(): void {
    const sentenceText = word.value.sentenceHanzi?.trim() || '我有一个弟弟。'
    const played = speak(
      sentenceText,
      'zh-CN',
      () => { isPlayingChineseSentence.value = true },
      () => { isPlayingChineseSentence.value = false },
      0.55
    )
    if (!played) showSoundBlockedDialog.value = true
  }

  function openInBrowser(): void {
    window.location.href = window.location.origin + window.location.pathname + window.location.search
  }

  return {
    isPlayingSound,
    isPlayingChineseSentence,
    playPronunciation,
    playExampleSentenceChinese,
    showSoundBlockedDialog,
    openInBrowser
  }
}
