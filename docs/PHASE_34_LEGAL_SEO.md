# Phase 34 — Legal pages SEO (privacy & terms)

**Goal:** Locale-aware metadata, breadcrumbs, and `WebPage` JSON-LD on `/privacidade` and `/termos` (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/privacidade` | `generateMetadata`, breadcrumb, `WebPage` JSON-LD |
| `/termos` | Same pattern |
| i18n | `metaDescription` on privacy/terms + breadcrumb labels |

---

## Verification

- [ ] Canonical + meta description on both legal routes
- [ ] Breadcrumbs link home; FR/EN labels after locale switch
- [ ] View source → `WebPage` + `BreadcrumbList` JSON-LD
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_35_FAVORITES_PAGINATION.md](./PHASE_35_FAVORITES_PAGINATION.md)
