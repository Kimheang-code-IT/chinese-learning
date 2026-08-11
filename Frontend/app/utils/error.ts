// utils/error.ts
// Error handling helpers

export function handleAudioError(err: unknown): string {
  if (err instanceof DOMException && err.name === 'NotAllowedError') {
    return 'Audio playback was blocked. Please interact with the page first.';
  }
  return 'Audio playback failed.';
}
