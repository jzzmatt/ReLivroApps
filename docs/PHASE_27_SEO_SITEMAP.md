# Phase 27 — Dynamic SEO sitemap (books & sellers)

**Goal:** Help crawlers discover published listings and public seller profiles (GA / non-beta).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/sitemap.xml` | Static routes plus `/books/[id]` and `/seller/[id]` from Supabase |
| Fallback | If Supabase is not configured, static routes only (build/CI safe) |
| Limits | Up to 2 000 published books; sellers deduped from published listings |

`robots.txt` unchanged (still points at sitemap; beta still `disallow`).

---

## Verification

- [ ] `/sitemap.xml` lists known book and seller URLs on staging/production
- [ ] CI build with placeholder Supabase still succeeds
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_28_STRUCTURED_DATA.md](./PHASE_28_STRUCTURED_DATA.md)
