import {createHash} from "crypto";

/** Deterministic UUID v4-style ids for idempotent demo seeding (namespace relivro-demo-v1). */
export function demoUuid(kind: string, key: string): string {
  const hash = createHash("sha256").update(`relivro-demo-v1:${kind}:${key}`).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, "0") + hash.slice(18, 20),
    hash.slice(20, 32),
  ].join("-");
}
