# Phase 16 — App shell & global SEO i18n

**Goal:** Localize in-app navigation (header + mobile tab bar), global route states, config banner, language switcher labels, and default site metadata from the locale cookie (PT / FR / EN).

---

## Scope

| Surface | Strings |
|---------|---------|
| `AppShell` | Header nav `aria-label`s |
| `MobileNav` | Tab labels + publish affordance |
| `LanguageSwitcher` | Select `aria-label` |
| `SupabaseConfigBanner` | Deployment warning |
| `not-found`, `error`, `loading` | User-facing copy |
| Root `layout` | `html lang`, `generateMetadata` title/description/keywords/OG locale |
| Landing header | Mobile menu button `aria-label` |

---

## Verification

- [ ] Cookie `relivro-locale` = `fr` or `en` → reload on `/books`: mobile nav + header aria match
- [ ] View source / devtools: `<html lang>` and meta description follow locale
- [ ] Trigger 404 → localized message and CTA
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________
