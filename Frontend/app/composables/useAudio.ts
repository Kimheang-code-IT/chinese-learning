// composables/useAudio.ts
import { ref } from 'vue'
import { playAudioSafe, getOrCreateAudio } from '~/utils/audio'
import { handleAudioError } from '~/utils/error'

export function useAudio(src: string) {
  const audio = ref<HTMLAudioElement | null>(null)
  const error = ref<string | null>(null)

  function play() {
    if (!audio.value) audio.value = getOrCreateAudio(src)
    playAudioSafe(audio.value)
      .catch(err => {
        error.value = handleAudioError(err)
      })
  }

  return { play, error }
}
