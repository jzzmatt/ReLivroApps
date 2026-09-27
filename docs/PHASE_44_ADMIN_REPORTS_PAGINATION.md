# Phase 44 — Admin reports pagination

**Goal:** Scale `/admin/reports` for moderators — first page SSR, load more via staff-only API (PT / FR / EN load-more labels).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/admin/reports` | Initial **24** reports (SSR), replaces unbounded fetch |
| **Load more** | `GET /api/admin/reports?page=&limit=` (admin/moderator only) |
| Shared | `requireStaff()`, `ADMIN_REPORTS_SELECT` |

---

## Verification

- [ ] Moderator with >24 reports: load more without duplicate rows
- [ ] Non-staff API → 403
- [ ] Dismiss actions still work on loaded rows
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_45_ADMIN_USERS_PAGINATION.md](./PHASE_45_ADMIN_USERS_PAGINATION.md)
