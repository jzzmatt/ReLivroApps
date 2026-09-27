const DEFAULT_SITE_URL = "https://relivroapps.vercel.app";

/** Canonical site origin for metadata and absolute links — never throws on bad env. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return DEFAULT_SITE_URL;
    return parsed.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
