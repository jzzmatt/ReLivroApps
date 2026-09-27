# Phase 36 — My listings pagination

**Goal:** Scale `/profile/listings` for active sellers — first page SSR, load more via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/profile/listings` | Initial **24** of the user’s books (SSR) |
| **Load more** | `GET /api/profile/listings?page=&limit=` (auth required) |
| Shared | `MY_LISTINGS_SELECT` in `lib/marketplace-query.ts` |
| UI | `MyListingsClient` with listing rows, status/actions, catalog hint |

---

## Verification

- [ ] Seller with >24 listings: load more without duplicate rows
- [ ] Pause/publish/status actions still work on loaded rows
- [ ] FR/EN load-more labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
