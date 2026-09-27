# Phase 41 — Admin, thread & book-edit metadata

**Goal:** Complete `noindex` metadata for remaining private routes: admin, message threads, book edit; DRY auth/sell layouts (PT / FR / EN).

---

## Behavior

| Route | Metadata |
|-------|----------|
| `/admin`, `/admin/listings`, `/admin/reports`, `/admin/users` | Static locale titles |
| `/messages/[id]` | Title includes book name when available |
| `/books/[id]/edit` | Title includes listing name when available |
| `/auth`, `/sell` | Refactored to `privateRouteMetadata()` |

---

## Verification

- [ ] Admin + thread + edit: localized title, `noindex`
- [ ] Thread/edit dynamic title when book exists
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_42_MESSAGE_THREAD_PAGINATION.md](./PHASE_42_MESSAGE_THREAD_PAGINATION.md)
