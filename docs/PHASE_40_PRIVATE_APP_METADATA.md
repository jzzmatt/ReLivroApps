# Phase 40 — Private app route metadata

**Goal:** Locale-aware titles/descriptions and `noindex` for signed-in areas: profile, favorites, listings, messages, notifications (PT / FR / EN).

---

## Behavior

| Route | Layout metadata |
|-------|-----------------|
| `/profile` | Hub |
| `/profile/edit` | Edit profile |
| `/profile/favorites` | Favorites |
| `/profile/listings` | My listings |
| `/messages` | Inbox (thread pages inherit segment) |
| `/notifications` | Notifications |

Shared helper: `privateRouteMetadata()` + `lib/i18n-app-routes.ts`.

---

## Verification

- [ ] Each route: localized `<title>` + description in view source
- [ ] `robots: noindex, nofollow` on all listed routes
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_41_ADMIN_THREAD_EDIT_METADATA.md](./PHASE_41_ADMIN_THREAD_EDIT_METADATA.md)
