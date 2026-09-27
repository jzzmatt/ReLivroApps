# Phase 24 — Landing phone mockups i18n

**Goal:** Localize the hero carousel phone mockups on the landing page (PT / FR / EN), matching the rest of Phase 10+ landing i18n.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/` hero phones | All mock UI strings follow `relivro-locale` / language switcher |
| Copy source | `lib/i18n-landing-phones.ts` consumed by `PhoneMockup` |

Demo book titles in mocks remain representative (school subjects); labels and CTAs are translated.

---

## Verification

- [ ] Switch FR/EN on landing → phone mock text updates
- [ ] Hero aria label localized (`phonesAria` already in `landingT`)
- [ ] `npm run build` passes

**Sign-off:** ___________________ **Date:** ___________

**Next:** _(TBD — push notifications, payments, school verification)_
