# Phase 35 — Favorites grid pagination

**Goal:** Scale `/profile/favorites` for users with many saved listings — first page SSR, load more via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/profile/favorites` | Initial **24** favorites (SSR) |
| **Load more** | `GET /api/favorites/books?page=&limit=` (auth required) |
| Shared | `FAVORITES_LIST_SELECT`, `booksFromFavoriteRows()` helper |
| UI | Catalog size hint + marketplace load-more labels |

---

## Verification

- [ ] User with >24 favorites: load more without duplicate cards
- [ ] Unpublished favorited books still skipped in grid
- [ ] FR/EN load-more labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_36_MY_LISTINGS_PAGINATION.md](./PHASE_36_MY_LISTINGS_PAGINATION.md)
