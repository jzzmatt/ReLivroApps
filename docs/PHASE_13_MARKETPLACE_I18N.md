# Phase 13 — Marketplace & seller listings i18n

**Goal:** Extend PT / FR / EN to marketplace browsing, book cards, reports, and seller listing management.

---

## Scope

| Surface | Strings |
|---------|---------|
| `/books` | Search, filters, mode tabs, results count |
| `BookCard` | Mode, condition, “View book”, country fallback |
| Book detail | Report listing flow |
| `/profile/listings` | Page copy + edit/pause/delete actions |

Shared mode/condition labels align with Phase 12 `i18n-detail.ts` semantics.

---

## Verification

- [ ] `/books` — switch FR/EN, reload: placeholders, filters, counts
- [ ] Book cards show translated mode badges
- [ ] Report listing prompts/messages in selected language
- [ ] My listings actions and confirmations localized
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
