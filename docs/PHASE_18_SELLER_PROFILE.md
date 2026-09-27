# Phase 18 — Public seller profiles (trust & discovery)

**Goal:** Let buyers discover a seller beyond a single listing — public profile with active listings, ratings, and recent feedback (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/seller/[id]` | Public seller page: avatar, location, school, bio, stats, active listings, recent reviews |
| `/books/[id]` | Seller block links to public profile |
| Privacy | No email or phone on public page; own profile → redirect to `/profile` |

---

## Verification

- [ ] Book detail → seller name/avatar → opens `/seller/[id]`
- [ ] Public page shows published listings with cover thumbnails
- [ ] Reviews and average match book detail for same seller
- [ ] Visiting own seller id while logged in → `/profile`
- [ ] FR/EN copy on page headers and empty states
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_19_SELLER_CUES_NOTIFICATIONS.md](./PHASE_19_SELLER_CUES_NOTIFICATIONS.md)
