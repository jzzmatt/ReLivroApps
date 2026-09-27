# Phase 28 — Structured data & canonical URLs

**Goal:** Improve SEO for listings and seller profiles with JSON-LD and canonical links (complements Phase 27 sitemap).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books/[id]` | `Book` + `Offer` JSON-LD; canonical URL in metadata |
| `/seller/[id]` | `ProfilePage` / `Person` JSON-LD; canonical URL in metadata |

Uses `getSiteUrl()` for safe absolute URLs.

---

## Verification

- [ ] View source on book detail → `application/ld+json` script present
- [ ] View source on seller profile → profile JSON-LD present
- [ ] `<link rel="canonical">` matches public URL
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_29_BREADCRUMBS.md](./PHASE_29_BREADCRUMBS.md)
