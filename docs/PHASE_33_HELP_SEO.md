# Phase 33 — Help page SEO (metadata + FAQ structured data)

**Goal:** Improve discoverability and rich results for `/ajuda` with locale-aware metadata, breadcrumbs, and `FAQPage` JSON-LD (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/ajuda` | `generateMetadata` (title, description, canonical, OG/Twitter) |
| `/ajuda` | Breadcrumb: Início → Ajuda (+ `BreadcrumbList` JSON-LD) |
| `/ajuda` | `FAQPage` JSON-LD from localized FAQ copy |
| i18n | `metaDescription` + breadcrumb labels (`home`, `help`) |

---

## Verification

- [ ] View source: canonical + locale meta on `/ajuda`
- [ ] Visible breadcrumb links to home
- [ ] JSON-LD: `FAQPage` with all FAQ entries
- [ ] FR/EN after locale cookie + reload
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_34_LEGAL_SEO.md](./PHASE_34_LEGAL_SEO.md)
