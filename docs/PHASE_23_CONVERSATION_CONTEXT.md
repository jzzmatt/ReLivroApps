# Phase 23 — Conversation participant context

**Goal:** Make messaging clearer by showing who you are talking to and linking sellers to public profiles (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/messages` | Each row shows the other participant’s display name |
| `/messages/[id]` | Header shows “Chat with {name}”; seller → link to `/seller/[id]` |
| `/profile` | Locale via `getRequestLocale` (consistent with rest of app) |

---

## Verification

- [ ] Inbox lists counterpart name beside book title
- [ ] Buyer thread → seller name links to public profile
- [ ] Seller thread → buyer name shown (no public profile link)
- [ ] FR/EN strings on thread header
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
