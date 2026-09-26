/**
 * Removes ONLY @demo.example.com auth users (cascade deletes profiles, books, etc.).
 */
import {readFileSync} from "fs";
import {join} from "path";
import {createClient} from "@supabase/supabase-js";
import {assertSeedEnvironment, isDemoEmail} from "./demo-data/seed-guard";

const ROOT = process.cwd();

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    // optional
  }
}

async function main() {
  loadEnvLocal();
  assertSeedEnvironment();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, serviceKey, {auth: {autoRefreshToken: false, persistSession: false}});

  let page = 1;
  let removed = 0;
  while (page <= 20) {
    const {data, error} = await admin.auth.admin.listUsers({page, perPage: 200});
    if (error) throw error;
    for (const user of data.users) {
      if (user.email && isDemoEmail(user.email)) {
        const {error: delError} = await admin.auth.admin.deleteUser(user.id);
        if (delError) throw delError;
        removed++;
        console.log("Removed demo user:", user.email);
      }
    }
    if (data.users.length < 200) break;
    page++;
  }

  await admin.from("analytics_events").delete().like("session_id", "demo-seed-%");

  console.log(`\nClear complete. Removed ${removed} demo auth user(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
