/**
 * useBookAccess - Returns the list of book numbers a user is allowed to read.
 *
 * The User.book field is set by admins in the format "1", "1,2", or "1,2,3".
 * - Admins and employees have access to ALL books by default.
 * - Regular users can only access books listed in their `book` field.
 */
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export const TOTAL_BOOKS = 3

export function useBookAccess() {
  const authStore = useAuthStore()

  /**
   * Returns an array of allowed book numbers, e.g. [1], [1, 2], [1, 2, 3]
   * Admins and employees can always access all books.
   */
  const allowedBooks = computed<number[]>(() => {
    const user = authStore.user
    const role = user?.role

    // Admins and employees always have full access
    if (role === 'admin' || role === 'employee') {
      return Array.from({ length: TOTAL_BOOKS }, (_, i) => i + 1)
    }

    // For regular users, parse book field (e.g., "1", "1,2", "1,2,3")
    const bookStr = user?.book ?? ''
    if (!bookStr.trim()) return []

    const parsed = bookStr
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 1 && n <= TOTAL_BOOKS)

    return parsed
  })

  /**
   * Check if a specific book number is accessible by the current user.
   */
  function canAccessBook(bookNumber: number): boolean {
    return allowedBooks.value.includes(bookNumber)
  }

  return {
    allowedBooks,
    canAccessBook,
  }
}
