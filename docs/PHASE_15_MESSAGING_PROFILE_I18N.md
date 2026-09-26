# Phase 15 — Messaging thread & profile edit i18n

**Goal:** Localize the conversation detail flow and profile editor (PT / FR / EN), with locale-aware dates on message threads.

---

## Scope

| Surface | Strings |
|---------|---------|
| `/messages/[id]` | Back link, header, empty thread, “View book”, country fallback |
| `MessageComposer` | Placeholder, send / sending |
| `/messages` | Book title fallback |
| `/profile/edit` | Form labels, placeholders, validation, save |

Shared date/number formatting: `lib/locale-format.ts` (`localeTag`).

---

## Verification

- [ ] FR/EN on `/messages/[id]` — header, empty state, composer
- [ ] Send message — button states localized
- [ ] `/profile/edit` — all labels and errors in selected language
- [ ] Message timestamps use locale-appropriate format after language switch + reload
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
