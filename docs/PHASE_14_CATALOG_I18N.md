# Phase 14 — Catalog labels & publish flow i18n

**Goal:** Show subjects and grades in the user’s language while keeping **Portuguese canonical values** in the database.

---

## Behavior

| Area | Change |
|------|--------|
| `/books` filters | Subject chips show translated labels; filter still matches stored PT subject |
| Book detail | Disciplina / Classe labels use catalog translations |
| `/sell`, `/books/[id]/edit` | Select options translated; saved values unchanged (PT) |
| Publish forms | Use existing `messages[locale].sell` copy (PT / FR / EN) |

---

## Verification

- [ ] FR/EN on `/sell` — labels and errors match language
- [ ] Publish book — DB still stores e.g. `Matemática`, `10ª Classe`
- [ ] Marketplace filter by translated subject chip works
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
