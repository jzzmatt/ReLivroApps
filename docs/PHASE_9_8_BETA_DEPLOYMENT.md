# Phase 9.8 — Beta deployment

**Goal:** Deploy ReLivroApps to production/staging for a **closed beta** (not a public marketing launch unless you explicitly approve one).

This runbook complements [PRODUCTION_SMOKE_TEST.md](./PRODUCTION_SMOKE_TEST.md) and [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md).

---

## 1. Pre-flight (Supabase)

1. **Backup** the production database (Supabase Dashboard → Database → Backups, or manual dump before schema changes).
2. Confirm migrations **`0001` through `0008`** are applied **in order**:

```text
0001_relivroapps_foundation.sql
0002_community_transactions.sql
0003_trust_profiles_intelligence.sql
0004_admin_moderation_analytics.sql
0005_security_rate_limits.sql
0006_analytics_observability.sql
0007_storage_book_images_hardening.sql
0008_google_oauth_profile_names.sql
```

3. Quick verification (SQL editor):

```sql
select version, name from supabase_migrations.schema_migrations order by version;
-- Expect rows for 0001–0008 (exact naming depends on how you applied files).

select id, name, public from storage.buckets where id in ('book-images', 'avatars');
```

4. **Auth**
   - Email provider enabled.
   - Google provider enabled (see GOOGLE_AUTH_SETUP.md).
   - **Site URL** = your live URL (e.g. `https://your-app.vercel.app`).
   - **Redirect URLs** include `https://YOUR_DOMAIN/auth/callback` and local dev if needed.

5. **First admin** (after at least one user exists):

```sql
update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
```

---

## 2. Vercel environment

Set for **Production** (and Preview if you test PRs against real Supabase):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key only |
| `NEXT_PUBLIC_SITE_URL` | Must match the URL users open (no trailing slash mismatch in Auth) |
| `NEXT_PUBLIC_BETA` | Set to `true` during closed beta (shows onboarding banner; `noindex` in metadata) |

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` or `OPENAI_API_KEY` unless you run server-side scripts in CI (not required for normal app traffic).

After changing env vars: **Redeploy** production.

---

## 3. Deploy

1. Merge to `main` (CI: lint + build).
2. Confirm Vercel production deployment succeeds.
3. Confirm **HTTPS** (Vercel default).
4. Optional custom domain: add in Vercel, update `NEXT_PUBLIC_SITE_URL` and Supabase Auth URLs, redeploy.

---

## 4. Post-deploy verification

1. Open production URL — landing hero, navigation, language switcher (PT / FR / EN).
2. If `NEXT_PUBLIC_BETA=true`, confirm the beta banner appears and can be dismissed.
3. Work through [PRODUCTION_SMOKE_TEST.md](./PRODUCTION_SMOKE_TEST.md) on production.
4. Record results in the checklist section at the bottom of this file (copy into your deployment log).

---

## 5. Beta onboarding (product)

- Invite a small set of testers (schools, families, moderators).
- Share: sign-up URL, Google/email auth, how to publish a book, how to report listings.
- Monitor Supabase logs and admin `/admin` for reports during beta.
- Do **not** post public launch announcements unless explicitly requested.

---

## 6. Rollback

- **App:** Redeploy a previous Vercel deployment from the Deployments tab.
- **Database:** Restore from Supabase backup (only if a migration caused issues).
- **Beta flag:** Set `NEXT_PUBLIC_BETA=false` and redeploy when exiting beta.

---

## 7. Phase 9.8 completion checklist

| Step | Done |
|------|------|
| DB backup taken | ☐ |
| Migrations 0001–0008 verified | ☐ |
| Vercel env vars set + redeploy | ☐ |
| Auth redirect URLs match live domain | ☐ |
| Google OAuth tested on production | ☐ |
| PRODUCTION_SMOKE_TEST.md completed | ☐ |
| Admin user promoted | ☐ |
| Beta testers onboarded | ☐ |

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_9_9_PUBLIC_LAUNCH.md](./PHASE_9_9_PUBLIC_LAUNCH.md)
