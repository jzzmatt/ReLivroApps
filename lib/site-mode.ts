/** Closed beta when NEXT_PUBLIC_BETA=true. Unset or any other value is public GA. */
export function isClosedBeta(): boolean {
  return process.env.NEXT_PUBLIC_BETA === "true";
}

/** Signed-in areas stay out of the crawl even after public launch. */
export const PRIVATE_ROBOTS_PATHS = [
  "/workspace",
  "/profile",
  "/admin",
  "/messages",
  "/notifications",
] as const;
