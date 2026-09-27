# Phase 45 — Admin users pagination

**Goal:** Scale `/admin/users` for admins — first page SSR, load more via admin-only API (PT / FR / EN load-more labels).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/admin/users` | Initial **24** profiles (SSR), replaces hard `limit(100)` |
| **Load more** | `GET /api/admin/users?page=&limit=` (**admin only**) |
| Shared | `requireStaff(..., { adminOnly: true })`, `ADMIN_USERS_SELECT` |

---

## Verification

- [ ] Admin with >24 users: load more without duplicate rows
- [ ] Moderator → page redirect; API → 403
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_46_SITEMAP_SCALING.md](./PHASE_46_SITEMAP_SCALING.md)
