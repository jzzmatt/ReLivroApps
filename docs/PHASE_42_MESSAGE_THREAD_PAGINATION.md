# Phase 42 — Message thread pagination (load earlier)

**Goal:** Scale long `/messages/[id]` threads — latest messages SSR, load older via API (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| Thread | Initial **40** most recent messages (chronological display) |
| **Load earlier** | `GET /api/messages/[conversationId]/messages?before=&limit=` |
| Shared | `fetchThreadMessageBatch()`, `userCanAccessConversation()` |
| UX | Sticky “load earlier” control at top of scroll area |

---

## Verification

- [ ] Thread with >40 messages: only latest initially, then load earlier without duplicates
- [ ] Unauthorized conversation → API 404
- [ ] FR/EN button labels
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_43_ADMIN_LISTINGS_PAGINATION.md](./PHASE_43_ADMIN_LISTINGS_PAGINATION.md)
