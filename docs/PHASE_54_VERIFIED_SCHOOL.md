# Phase 54 — Verified school

**Goal:** Let an admin confirm the school name on a profile. Until then, the public badge stays the self-declared school community label.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/admin/users` | **Verify school** / **Remove verification** when the profile has a school |
| Stamp | `profiles.school_verified_at`, set only by `set_school_verification` for role `admin` |
| Member edit | A profile update cannot set the stamp. Changing the school name clears it |
| `/profile`, `/seller/[id]`, `/books/[id]` | **Verified school** when the stamp is set; otherwise the existing self-declared badge |

Payments and native push stay out of this phase.

---

## Database

`0012_school_verification.sql` adds the column, a before-update guard, and the admin function. Apply it on production if that database is not staging.

---

## Verification

- [ ] A member update cannot set `school_verified_at`
- [ ] An admin can verify and clear a school that has a name
- [ ] A verified profile shows **Verified school**; others keep **School community**
- [ ] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 55 — Payment arrangement](PHASE_55_PAYMENT_ARRANGEMENT.md)
