# Phase 39 — Auth & sell route metadata

**Goal:** Locale-aware titles/descriptions for client-only `/auth` and `/sell` via route layouts, with `noindex` for private flows (PT / FR / EN).

---

## Behavior

| Surface | Change |
|---------|--------|
| `/auth` | `app/auth/layout.tsx` → `generateMetadata` |
| `/sell` | `app/sell/layout.tsx` → `generateMetadata` |
| SEO | `robots: noindex, nofollow` on both |
| i18n | `lib/i18n-auth-route.ts`, `lib/i18n-sell-route.ts` |

---

## Verification

- [ ] View source on `/auth` and `/sell`: localized title + description
- [ ] Meta robots `noindex, nofollow`
- [ ] FR/EN after locale cookie + reload
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_40_PRIVATE_APP_METADATA.md](./PHASE_40_PRIVATE_APP_METADATA.md)
