export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay = 300) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return (...args: Args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
