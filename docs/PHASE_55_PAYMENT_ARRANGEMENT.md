# Phase 55 — Payment arrangement

**Goal:** Let the seller say how they prefer to settle with the buyer. ReLivroApps still does not take payment.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/sell` and `/books/[id]/edit` | Choice: to be agreed, bank transfer, or cash |
| Stored value | `books.payment_arrangement`: `A combinar`, `Transferência`, or `Dinheiro` |
| Older listings | A null value is shown as **To be agreed** |
| Book detail | The choice appears with the existing note that payment stays between the two people |

Native push stays out of this phase.

---

## Database

`0013_payment_arrangement.sql` adds the nullable column and a check constraint. Apply it on production if that database is not staging.

---

## Verification

- [ ] New and edited listings save one of the three values
- [ ] Book detail shows the localized label
- [ ] A listing with a null value shows **To be agreed**
- [ ] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 56 — Browser push alerts](PHASE_56_WEB_PUSH.md)
