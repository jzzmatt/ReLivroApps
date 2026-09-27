# Phase 47 — School trust UI (self-declared)

**Goal:** Surface school affiliation as a visible trust cue on public seller surfaces without a verification migration.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/seller/[id]` | **School community** badge when `profiles.school` is set |
| `/books/[id]` | Same badge on detail when seller profile includes school |
| Copy | PT / FR / EN — badge + tooltip clarifies self-declared, not verified |

---

## Verification

- [ ] Seller with school in profile shows badge on profile and listings
- [ ] Empty school → no badge
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_48_PAYMENT_UX_COPY.md](./PHASE_48_PAYMENT_UX_COPY.md)
