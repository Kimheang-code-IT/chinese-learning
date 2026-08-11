// utils/audio.ts
// Pure audio helpers

export function playAudioSafe(audio: HTMLAudioElement): Promise<void> {
  try {
    return audio.play();
  } catch (err) {
    return Promise.reject(err);
  }
}

export function getOrCreateAudio(src: string, existing?: HTMLAudioElement): HTMLAudioElement {
  if (existing && existing.src === src) return existing;
  const audio = new Audio(src);
  audio.preload = 'auto';
  return audio;
}
