# Phase 19 — Marketplace seller cues & notifications polish

**Goal:** Extend Phase 18 discovery to the marketplace grid and make in-app notifications easier to clear (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| Book cards | Seller label + name links to `/seller/[id]` (valid HTML; separate from book link) |
| `/notifications` | Safe deep links (conversation → message, else book, else stay) |
| `/notifications` | Mark one read on open; **Mark all as read** action |
| `/profile/favorites` | Use existing favorites i18n (no hardcoded PT) |

---

## Verification

- [ ] `/books` grid → seller name → public seller profile
- [ ] Tap notification → marks read + navigates correctly
- [ ] **Mark all as read** clears unread styling
- [ ] Favorites page eyebrow/title follow locale cookie
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_20_FAVORITES_NOTIFICATIONS.md](./PHASE_20_FAVORITES_NOTIFICATIONS.md)
