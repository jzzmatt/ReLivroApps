# Phase 17 — Seller reviews (trust UI)

**Goal:** Surface the Phase 7 `seller_reviews` data model in the product — ratings on book detail, submit/update reviews, and seller profile feedback.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books/[id]` | Seller average + review list; form for logged-in buyers (not own listing) |
| `/profile` | Localized stats labels; recent feedback cards |
| Data | One review per `(seller, reviewer, book)` via upsert |

---

## Verification

- [ ] Logged-in buyer rates seller on a listing → appears in list + updates average
- [ ] Seller cannot review own listing
- [ ] FR/EN copy on form and section headers
- [ ] Profile shows recent feedback when reviews exist
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
