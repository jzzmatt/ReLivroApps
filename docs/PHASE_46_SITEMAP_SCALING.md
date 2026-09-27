# Phase 46 — Sitemap scaling (chunked books)

**Goal:** Remove the single 2 000-book cap; serve book URLs in chunked sitemap files while keeping static routes and seller profiles discoverable.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/sitemap.xml` | Sitemap index via Next.js `generateSitemaps` |
| `id=0` | Static routes + `/seller/[id]` (scan all published listings for seller dedupe) |
| `id≥1` | `/books/[id]` in chunks of **5 000** URLs |
| Fallback | If Supabase is not configured, index with static-only chunk |

---

## Verification

- [ ] Staging sitemap index lists multiple child sitemaps when book count > 5 000
- [ ] CI build with placeholder Supabase still succeeds
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_47_SCHOOL_TRUST_UI.md](./PHASE_47_SCHOOL_TRUST_UI.md)
