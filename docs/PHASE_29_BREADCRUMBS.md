# Phase 29 — Breadcrumbs (UI + JSON-LD)

**Goal:** Improve navigation and SEO with visible breadcrumbs on key marketplace pages (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/books/[id]` | Livros → listing title |
| `/seller/[id]` | Livros → seller name |
| SEO | `BreadcrumbList` JSON-LD on both pages |

---

## Verification

- [ ] Breadcrumb links work (Livros → marketplace)
- [ ] FR/EN labels after locale switch + reload
- [ ] View source → `BreadcrumbList` JSON-LD
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_30_MARKETPLACE_PAGINATION.md](./PHASE_30_MARKETPLACE_PAGINATION.md)
