const PRODUCTION_HOST_PATTERNS = [
  /^https:\/\/relivroapps\.vercel\.app/i,
  /\.vercel\.app$/i,
];

const BLOCKED_PROJECT_REFS = (process.env.SEED_BLOCKED_SUPABASE_REFS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export function assertSeedEnvironment(): void {
  if (process.env.SEED_DATABASE !== "true") {
    console.error("Set SEED_DATABASE=true to run demo seeding.");
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production" && process.env.SEED_ALLOW_STAGING !== "true") {
    console.error("Demo data seeding is disabled for production.");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (siteUrl && PRODUCTION_HOST_PATTERNS.some(re => re.test(siteUrl)) && process.env.SEED_ALLOW_STAGING !== "true") {
    console.error("Demo data seeding is disabled for production.");
    process.exit(1);
  }

  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    if (BLOCKED_PROJECT_REFS.includes(ref)) {
      console.error("Demo data seeding is disabled for production.");
      process.exit(1);
    }
    if (process.env.SEED_ALLOWED_SUPABASE_REF) {
      const allowed = process.env.SEED_ALLOWED_SUPABASE_REF.trim();
      if (ref !== allowed) {
        console.error(`Seed allowed only for Supabase project ref "${allowed}" (got "${ref}").`);
        process.exit(1);
      }
    }
  } catch {
    console.error("Invalid Supabase URL.");
    process.exit(1);
  }
}

export function demoEmailDomain(): string {
  return "demo.example.com";
}

export function isDemoEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${demoEmailDomain()}`);
}
