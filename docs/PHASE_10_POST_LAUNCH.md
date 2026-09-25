# Phase 10 — Post-launch discovery & support

**Goal:** Improve findability and self-service after GA (Phase 9.9).

---

## Deliverables (code)

| Item | Route / asset |
|------|----------------|
| Help centre (FAQ, PT / FR / EN) | `/ajuda` |
| Web app manifest (installable PWA baseline) | `/manifest.webmanifest` |
| JSON-LD (`WebSite` + `Organization`) | Landing page |
| Landing sections i18n | Home `#como-funciona`, `#comunidade`, CTA |
| Sitemap entry | `/ajuda` |

---

## Verification

- [ ] `/ajuda` in all three languages (language cookie + reload)
- [ ] Nav **Ajuda** opens `/ajuda`
- [ ] Footer includes help link
- [ ] `/manifest.webmanifest` valid JSON
- [ ] View source on `/` — JSON-LD script present
- [ ] Lighthouse / mobile — “Installable” optional (manifest + HTTPS)
- [ ] `npm run build` passes

---

## Optional follow-ups (not Phase 10)

- Dedicated support email in env (`NEXT_PUBLIC_SUPPORT_EMAIL`)
- Push notifications
- Payments / escrow
- School verification

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_11_SUPPORT_SHARE.md](./PHASE_11_SUPPORT_SHARE.md)
