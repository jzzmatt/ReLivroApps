# Phase 20 — Favorites grid & notification badge

**Goal:** Turn favorites into a useful marketplace-style grid and surface unread notification count in the shell (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/profile/favorites` | Book grid with covers, seller links, favourites toggle (same as `/books`) |
| Header + mobile nav | Unread notification count badge when logged in |
| Empty favorites | Localized CTA to explore marketplace |

---

## Verification

- [ ] Save favorites → `/profile/favorites` shows thumbnails and titles
- [ ] Remove favorite from grid updates card state
- [ ] Unread demo notifications show badge on ♢ (header + mobile)
- [ ] Mark all read → badge clears after navigation/reload
- [ ] FR/EN empty state and explore CTA
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
