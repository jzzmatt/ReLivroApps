# Phase 37 — Messages inbox pagination

**Goal:** Scale `/messages` for active users — first page SSR, load more via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/messages` | Initial **24** conversations (SSR) |
| **Load more** | `GET /api/messages/conversations?page=&limit=` |
| Shared | `CONVERSATIONS_INBOX_SELECT`, `inboxViewsForConversationRows()` |
| UI | Previews, unread badges, seller hints preserved on loaded rows |

---

## Verification

- [ ] User with >24 conversations: load more without duplicate threads
- [ ] Unread styling and preview text on appended rows
- [ ] FR/EN load-more labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_38_NOTIFICATIONS_PAGINATION.md](./PHASE_38_NOTIFICATIONS_PAGINATION.md)
