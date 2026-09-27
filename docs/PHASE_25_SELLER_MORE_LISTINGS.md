# Phase 25 — More from this seller (book detail)

**Goal:** Help buyers discover other listings from the same seller without leaving trust context (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books/[id]` | Up to 4 other published listings from the seller (excludes current book) |
| CTA | Link to full seller profile `/seller/[id]` |

Hidden when the seller has no other published books.

---

## Verification

- [ ] Book detail with sibling listings shows grid + “View all listings”
- [ ] Current book not duplicated in grid
- [ ] Thumbnails and seller links work on cards
- [ ] FR/EN section title and CTA
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
