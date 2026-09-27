# Phase 22 — Inbox previews & live nav badges

**Goal:** Keep shell unread badges accurate after in-app actions, and show last-message previews on `/messages` (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| ✉ / ♢ nav links | Re-fetch unread counts on route change and window focus |
| `/messages` | Each row shows truncated last message + time |
| Preview copy | “You:” prefix when the last message was sent by the viewer |

---

## Verification

- [ ] Open thread with unread → back to list → ✉ badge count drops without hard refresh
- [ ] Mark all notifications read → ♢ badge clears after navigation
- [ ] Conversation rows show sensible last-message snippets
- [ ] FR/EN preview prefix after locale switch + reload
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
