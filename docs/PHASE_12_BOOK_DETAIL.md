# Phase 12 — Book detail i18n & rich share previews

**Goal:** Localize the book detail experience (PT / FR / EN) and improve link previews with listing photos.

---

## Deliverables

| Item | Description |
|------|-------------|
| Book detail copy | Labels, seller, safety note, modes, conditions via `lib/i18n-detail.ts` |
| Contact CTA | Localized **Contactar vendedor** button |
| Open Graph image | First listing photo in `generateMetadata` when available |
| Twitter card | `summary_large_image` with same image |

---

## Verification

- [ ] Switch language → reload book detail → labels and buttons update
- [ ] Share a listing **with photo** → preview shows image + title (WhatsApp / Slack / iMessage)
- [ ] Listing without photo → OG tags still work (title/description only)
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
