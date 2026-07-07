/**
 * Calculates the estimated reading time of a text.
 * Assumes an average reading speed of 200 words per minute.
 */
export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words / wordsPerMinute) || 1;
}
