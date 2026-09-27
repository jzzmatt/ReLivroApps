# Phase 43 — Admin listings pagination

**Goal:** Scale `/admin/listings` for moderators — first page SSR, load more via staff-only API (PT / FR / EN load-more labels).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/admin/listings` | Initial **24** books (SSR), replaces hard `limit(100)` |
| **Load more** | `GET /api/admin/listings?page=&limit=` (admin/moderator only) |
| Shared | `requireStaff()`, `ADMIN_LISTINGS_SELECT` |

---

## Verification

- [ ] Moderator with >24 books in DB: load more without duplicate rows
- [ ] Non-staff API → 403
- [ ] Moderation actions still work on loaded rows
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_44_ADMIN_REPORTS_PAGINATION.md](./PHASE_44_ADMIN_REPORTS_PAGINATION.md)
