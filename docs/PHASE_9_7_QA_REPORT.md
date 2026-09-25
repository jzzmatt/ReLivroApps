# Phase 9.7 — Final QA & Release Candidate Report

**Date:** 2026-09-25  
**Scope:** Release-candidate validation for ReLivroApps (Vercel + Supabase)  
**Environments:** CI build (placeholder Supabase env); live E2E requires your production/staging deployment with real credentials.

---

## Automated validation

| Check | Result |
|-------|--------|
| `npm ci` | Pass |
| `npm run lint` | Pass (0 errors; existing `<img>` warnings) |
| `npm run typecheck` | Pass |
| `npm run build` | Pass |

---

## Release-blocking fixes (Phase 9.7)

| Issue | Resolution |
|-------|------------|
| No **logout** flow (smoke test gap) | `ProfileLogoutButton` on `/profile` → `signOut()` + redirect home |
| Duplicate non-functional **♡ Guardar** on book detail | Removed; favourites use `FavoriteButton` only |
| Staff users hard to reach admin in QA | `/admin` link on profile when `role` is `admin` or `moderator` |

---

## Code review — security boundaries

| Area | Status | Notes |
|------|--------|--------|
| `/admin/*` | Pass | Server-side role check; non-staff → `/profile` |
| `/admin/users` | Pass | `admin` role only |
| API routes | Pass | Auth required; generic 500 messages (`lib/api-errors.ts`) |
| Service role in client | Pass | Not used |
| RLS | Pass | Assumed applied via migrations `0001`–`0008` on your Supabase project |
| Middleware | Pass | Session refresh only; route guards in pages |

---

## Manual / production E2E matrix

Run on **your** Vercel URL with migrations and Google/Email auth configured. Mark in deployment checklist when done.

### Authentication

| Test | RC status |
|------|-----------|
| Email register / login | Requires live Supabase |
| **Google** login | Requires Google provider + PR with OAuth UI |
| **Logout** | Implemented — verify on production after deploy |
| Session persistence | Requires live Supabase |

### Marketplace, community, admin, i18n, responsive

Use [PRODUCTION_SMOKE_TEST.md](./PRODUCTION_SMOKE_TEST.md) line-by-line on production. Phase 9.7 did not replace full live data testing (listings, uploads, messaging) without your Supabase project credentials in this agent environment.

---

## Known non-blockers (RC accepted)

- ESLint warnings for `<img>` on Supabase Storage URLs (intentional; Next Image config already set for remote patterns).
- Some admin/moderation strings remain PT-only (Phase 9.3 scope largely covered marketplace; admin UI not fully i18n).
- Client `alert(error.message)` on a few flows (auth messages; not raw SQL).
- `npm audit` reports dependency advisories — review separately before public launch.

---

## Release candidate verdict

**RC status: approved for Phase 9.8 beta deployment prep** after:

1. Merge/deploy branch with Phase 9.6 + 9.7 + Google OAuth changes.
2. Migrations `0001`–`0008` on production Supabase.
3. Complete live smoke test on production URL.

---

## Phase roadmap

| Phase | Status |
|-------|--------|
| 9.6 Production deployment | Complete |
| **9.7 Final QA & RC** | **Complete** |
| 9.6-HERO Reference hero | Complete |
| 9.8 Beta launch | Complete (runbook) — ops sign-off in [PHASE_9_8_BETA_DEPLOYMENT.md](./PHASE_9_8_BETA_DEPLOYMENT.md) |
| 9.9 Public launch (GA) | In progress — [PHASE_9_9_PUBLIC_LAUNCH.md](./PHASE_9_9_PUBLIC_LAUNCH.md) |
