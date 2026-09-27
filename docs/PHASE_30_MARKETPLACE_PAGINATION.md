# Phase 30 — Marketplace pagination (load more)

**Goal:** Scale `/books` for larger catalogs — first page server-rendered, additional pages via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books` | Initial **24** listings (SSR) |
| **Load more** | Appends next page from `GET /api/books?page=&limit=` |
| Filters / search | Apply to all loaded books (load more to widen pool) |

Page size: `24` (`lib/marketplace-query.ts`).

---

## Verification

- [ ] Marketplace shows ≤24 cards initially when catalog is larger
- [ ] **Load more** appends without duplicate IDs
- [ ] FR/EN button label
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_31_MARKETPLACE_SEO.md](./PHASE_31_MARKETPLACE_SEO.md)
