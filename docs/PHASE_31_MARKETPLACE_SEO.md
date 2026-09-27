# Phase 31 — Marketplace SEO & listing context

**Goal:** Localized metadata, breadcrumbs, and structured data on `/books`, plus clear “loaded of total” copy when the catalog is paginated (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books` | `generateMetadata` (title, description, canonical, OG/Twitter) |
| `/books` | Visible breadcrumb + `BreadcrumbList` JSON-LD |
| `/books` | `ItemList` JSON-LD for SSR first page of listings |
| Marketplace UI | “X de Y anúncios” when more listings exist beyond loaded set |

---

## Verification

- [ ] View source on `/books`: canonical, locale-aware title/description
- [ ] Breadcrumb shows current marketplace label (PT/FR/EN)
- [ ] JSON-LD: `BreadcrumbList` + `ItemList` on catalog with listings
- [ ] With >24 published books: catalog size hint + load more still works
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_32_SELLER_LISTINGS_PAGINATION.md](./PHASE_32_SELLER_LISTINGS_PAGINATION.md)
