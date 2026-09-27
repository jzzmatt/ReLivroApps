/** Trim a city label for an exact, case-insensitive match. No geocoding. */
export function normalizeCity(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (!trimmed || trimmed.length > 80) return null;
  return trimmed;
}

/** Escape LIKE wildcards so the city filter stays an exact match. */
export function cityIlikePattern(city: string): string {
  return city.replace(/[%_\\]/g, "\\$&");
}
