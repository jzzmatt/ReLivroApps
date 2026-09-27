# Phase 26 — Share seller profile & social preview

**Goal:** Let users share a seller’s public profile and improve link previews (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/seller/[id]` | **Share profile** button (Web Share API or copy link) |
| Metadata | Open Graph / Twitter tags for seller public pages (name, description, avatar when available) |

---

## Verification

- [ ] Share on seller page copies/opens URL with `/seller/[id]`
- [ ] PT / FR / EN share button label
- [ ] Link unfurl shows seller name (Slack/WhatsApp/iMessage spot-check)
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_27_SEO_SITEMAP.md](./PHASE_27_SEO_SITEMAP.md)
