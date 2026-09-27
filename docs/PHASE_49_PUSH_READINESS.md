# Phase 49 — Push notifications readiness

**Goal:** Document in-product expectations before native push (Web Push / mobile) — no DB migration or FCM/APNs integration in this phase.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/notifications` | Informational note: in-app alerts today; native push planned |
| Docs | This phase file + README pointer |

**Out of scope (future):** device tokens table, service worker, VAPID keys, app store push certificates.

---

## Verification

- [ ] Signed-in user sees push-readiness note on `/notifications` (PT / FR / EN)
- [ ] Existing notification list + pagination unchanged
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_50_ROADMAP_COMPLETE.md](./PHASE_50_ROADMAP_COMPLETE.md)
