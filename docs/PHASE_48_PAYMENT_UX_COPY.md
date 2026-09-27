# Phase 48 — Payment UX copy (peer-to-peer)

**Goal:** Set expectations that ReLivroApps is a marketplace connector, not an in-app checkout — no Stripe or payment API in this phase.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books/[id]` | **Payment note** under the safety callout (PT / FR / EN) |
| Scope | Messages + in-person / transfer arrangements between users |

---

## Verification

- [ ] Book detail shows payment note in all locales
- [ ] No new payment provider env vars required
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_49_PUSH_READINESS.md](./PHASE_49_PUSH_READINESS.md)
