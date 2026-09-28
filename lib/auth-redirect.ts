/** Default landing page after a successful sign-in. */
export const DEFAULT_AUTHENTICATED_PATH = "/workspace";

/** Safe in-app path for post-auth redirect (blocks open redirects and /auth loops). */
export function sanitizeAuthRedirect(next: string | null | undefined): string {
  if (!next) return DEFAULT_AUTHENTICATED_PATH;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return DEFAULT_AUTHENTICATED_PATH;
  if (trimmed === "/auth" || trimmed.startsWith("/auth/")) return DEFAULT_AUTHENTICATED_PATH;
  return trimmed;
}

/** Sign-in URL, optionally remembering where the user was headed. */
export function authLoginUrl(intendedPath?: string): string {
  if (!intendedPath || intendedPath.startsWith("/auth")) return "/auth";
  return `/auth?next=${encodeURIComponent(intendedPath)}`;
}
