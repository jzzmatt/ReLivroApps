# Phase 32 — Seller profile listings pagination

**Goal:** Scale public seller pages when a vendor has many active listings — first page SSR, load more via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/seller/[id]` | Initial **24** published listings (SSR) |
| **Load more** | `GET /api/sellers/[id]/books?page=&limit=` |
| Stats | Book count uses **total** published, not loaded slice |
| UI | Catalog size hint when total > page size |

Page size matches marketplace (`24`, `lib/marketplace-query.ts`).

---

## Verification

- [ ] Seller with >24 listings: first page only, then load more without duplicates
- [ ] Profile stats book count matches total published
- [ ] FR/EN load-more labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
