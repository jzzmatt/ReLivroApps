/** Optional public support inbox (safe for NEXT_PUBLIC_). */
export function getSupportEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();
  if (!email || !email.includes("@")) return null;
  return email;
}
