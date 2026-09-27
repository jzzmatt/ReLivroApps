# Phase 59 — Installable app

**Goal:** Let a supported browser offer to install ReLivroApps on the device. This uses the web app manifest. Store listings for the Apple App Store and Google Play need those developer accounts.

---

## Behavior

| Surface | Change |
|---------|--------|
| Manifest | PNG icons at 192 and 512, plus the existing SVG |
| Banner | Shown only when the browser fires `beforeinstallprompt` |
| Dismiss | Hides the banner for this visit |

---

## Verification

- [x] `/icon-192.png` and `/icon-512.png` are served
- [x] The banner stays hidden until the browser offers install
- [x] `npm run typecheck` and `npm run build` pass

**Next:** In-app checkout needs a Stripe secret key and a webhook secret. Native store apps need Apple and Google developer accounts.
