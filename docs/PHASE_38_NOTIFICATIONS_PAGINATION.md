# Phase 38 — Notifications pagination

**Goal:** Scale `/notifications` for active users — first page SSR, load more via API; unread count uses full DB total (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/notifications` | Initial **24** notifications (SSR) |
| **Load more** | `GET /api/notifications?page=&limit=` |
| **Mark all read** | Still uses total unread count (not loaded slice only) |
| Shared | `NOTIFICATIONS_LIST_SELECT` |

---

## Verification

- [ ] User with >24 notifications: load more without duplicates
- [ ] Mark all read when unread exist beyond first page
- [ ] FR/EN load-more labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
