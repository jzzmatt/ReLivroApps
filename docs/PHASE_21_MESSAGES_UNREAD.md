# Phase 21 — Messaging unread indicators

**Goal:** Match Phase 20 notification badges for conversations — unread count in the shell and per-thread cues on `/messages` (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| Header + mobile nav | Unread **message** count badge on ✉ when logged in |
| `/messages` | Conversations with unread incoming messages show visual emphasis |
| Thread open | Existing `mark_conversation_messages_read` RPC unchanged |

Unread = message in a conversation you participate in, sent by the other party, `read_at` is null.

---

## Verification

- [ ] Demo inbox with unread → badge on ✉ (header + mobile)
- [ ] Open thread → return to list → row no longer marked unread; badge decreases
- [ ] Accessible labels include unread count
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_22_INBOX_BADGES.md](./PHASE_22_INBOX_BADGES.md)
