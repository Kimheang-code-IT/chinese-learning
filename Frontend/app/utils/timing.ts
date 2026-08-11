// utils/timing.ts
// Debounce and throttle helpers

export function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay = 300) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<Args extends unknown[]>(fn: (...args: Args) => void, limit = 300) {
  let inThrottle = false;
  return (...args: Args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
