# Phase 9.6-DATA — Demo / test data seeding

**Objective:** Realistic school-book marketplace demo data for **development/staging only** — not production.

**Catalogue reference (metadata only):** [Xilonga — Manuais escolares](https://xilonga.med.gov.ao/manuais-escolares) — no PDFs, official covers, or textbook body text.

---

## Safety

| Rule | Detail |
|------|--------|
| Opt-in | `SEED_DATABASE=true` required |
| Environment | Refuses when `NODE_ENV=production` unless `SEED_ALLOW_STAGING=true` for a named staging project |
| Production URL | Blocks when `NEXT_PUBLIC_SITE_URL` looks like production Vercel (unless staging override) |
| Secrets | `SUPABASE_SERVICE_ROLE_KEY` and `DEMO_USER_PASSWORD` only in `.env.local` — never commit |
| Marker | All demo auth emails end with `@demo.example.com` |

On violation the script exits with: **Demo data seeding is disabled for production.**

---

## Prerequisites

1. Supabase project with migrations `0001`–`0008` applied.
2. `.env.local` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEMO_USER_PASSWORD` (min 8 characters)
3. Optional: `SEED_ALLOWED_SUPABASE_REF=<your-project-ref>` to pin seeding to one project.

---

## Commands

```bash
SEED_DATABASE=true npm run seed:demo
SEED_DATABASE=true npm run seed:demo:clear
```

Re-running `seed:demo` is **idempotent** (deterministic UUIDs, upserts).

---

## Dataset (summary)

| Entity | Count |
|--------|------:|
| Demo users | 15 (1 admin, 2 frequent sellers, 2 occasional, 10 others) |
| Books | 37 |
| Original SVG covers | 9 (uploaded to `book-images`) |
| Favourites | 15 |
| Conversations | 10 |
| Messages | 30 |
| Seller reviews | 12 |
| Listing reports | 2 |
| Analytics events | ~30 rows (`session_id` prefix `demo-seed-`) |

Publication mix: ~70% published on marketplace; remainder unpublished / sold / exchanged for seller UI tests.

---

## Demo login

Use any `*@demo.example.com` address from `scripts/demo-data/users.ts` with `DEMO_USER_PASSWORD`.

- **Admin:** `admin.demo@demo.example.com` → `/admin` after seed.

---

## Validation checklist

- [ ] `npm run lint` / `typecheck` / `build`
- [ ] `SEED_DATABASE=true npm run seed:demo` twice — no duplicate users
- [ ] Marketplace: images, filters (Matemática, Venda, Luanda), search **5ª Classe**
- [ ] Book detail, reviews form, favourites, messages, notifications
- [ ] Admin: listings, reports, users, analytics KPIs
- [ ] `seed:demo:clear` removes demo users only

**Sign-off:** ___________________ **Date:** ___________
