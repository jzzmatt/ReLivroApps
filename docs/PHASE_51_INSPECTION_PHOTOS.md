# Phase 51 — Inspection photos and publish guide

**Goal:** New listings require five semantic inspection photos, with a short how-to on `/sell`.

Phases 10–50 were already shipped. This is the next product step after public launch.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/sell` | How-to steps, then five required photo slots |
| Slots | `front_cover`, `back_cover`, `first_page`, `middle_page`, `last_page` |
| Publish | Blocked until all five exist. A failed upload deletes the new book row |
| `/workspace` | Recent listings show `{count}/5` photos |
| Older listings | `book_images.slot` may be null; they stay valid |

AI condition analysis and listing video are not in this phase (external API / extra storage).

---

## Database

`0010_book_image_slots.sql` adds nullable `book_images.slot` and a unique slot per book.

---

## Verification

- [ ] Publish without five photos shows the localized error
- [ ] A complete publish stores five rows with distinct slots
- [ ] `npm run typecheck` and `npm run build` pass

**Next:** _(awaiting approval — AI analysis and video still need an external API or storage decision)_
