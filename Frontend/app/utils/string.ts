// utils/string.ts
// String/text normalization

export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
