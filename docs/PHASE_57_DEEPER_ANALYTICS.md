# Phase 57 — Deeper analytics

**Goal:** Show staff what people actually do over the last 7 days, from events the app already records. No third-party tracker.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/admin` | Event counts and the most viewed paths for 7 days |
| Favourites | `favorite_add` and `favorite_remove` |
| Contact seller | `seller_contact` after the conversation opens |
| Publish | `listing_published` after the listing is saved |
| Access | `admin_analytics_breakdown` is staff-only and returns no user ids |

---

## Database

`0015_admin_analytics_breakdown.sql`. Apply it on production if that database is not staging.

---

## Verification

- [x] A member cannot call `admin_analytics_breakdown`
- [x] Staff see event names and paths, not people
- [x] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 58 — Offline mode](PHASE_58_OFFLINE.md)
