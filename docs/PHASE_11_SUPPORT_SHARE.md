# Phase 11 — Support contact & listing share

**Goal:** Give users a public support channel and make listings easy to share after launch.

---

## Features

| Feature | Config / route |
|---------|----------------|
| Support email (optional) | `NEXT_PUBLIC_SUPPORT_EMAIL` → mailto on `/ajuda` + landing footer |
| Share listing | Book detail → Web Share API or copy link |
| Book Open Graph | `generateMetadata` on `/books/[id]` |

---

## Setup

```env
NEXT_PUBLIC_SUPPORT_EMAIL=support@your-domain.com
```

Redeploy Vercel after setting the variable.

---

## Verification

- [ ] Book detail → **Partilhar anúncio** copies or opens native share
- [ ] `/books/[id]` preview shows title in Slack / WhatsApp link unfurl (OG tags)
- [ ] With support email set, `/ajuda` shows mailto button
- [ ] PT / FR / EN share strings (locale cookie)

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_12_BOOK_DETAIL.md](./PHASE_12_BOOK_DETAIL.md)
