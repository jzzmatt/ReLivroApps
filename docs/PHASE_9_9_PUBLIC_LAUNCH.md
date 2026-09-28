# Phase 9.9 — Public launch (GA)

**Goal:** Exit closed beta and operate ReLivroApps as a **public, indexable** product (still not a marketing campaign unless you approve one separately).

Prerequisites: Phase **9.8** smoke tests passed on production.

---

## 1. Exit beta mode

In **Vercel → Production**:

| Variable | GA value |
|----------|----------|
| `NEXT_PUBLIC_BETA` | `false` or **remove** the variable |
| `NEXT_PUBLIC_SITE_URL` | Your canonical HTTPS URL |

**Redeploy** production after changes.

Verify launch readiness (expect HTTP 200):

```text
GET /api/health/deploy-readiness?mode=ga
```

When `NEXT_PUBLIC_BETA` is still `true`, this endpoint returns `503` with hints.

Expected results:

- Beta banner hidden
- `robots` allows crawling; `sitemap.xml` lists public routes
- Root layout `robots` metadata allows index/follow

---

## 2. SEO & legal

- [ ] Open `/robots.txt` — allows `/`, references sitemap, and disallows `/workspace`, `/profile`, `/admin`, `/messages`, `/notifications`
- [ ] Open `/sitemap.xml` — includes `/`, `/books`, `/auth`, `/privacidade`, `/termos`
- [ ] Review `/privacidade` and `/termos` (PT / FR / EN via language cookie)
- [ ] Optional: add custom domain in Vercel and update Supabase Auth URLs + `NEXT_PUBLIC_SITE_URL`

---

## 3. Final production pass

Re-run [PRODUCTION_SMOKE_TEST.md](./PRODUCTION_SMOKE_TEST.md) on production (skip beta-only rows if `NEXT_PUBLIC_BETA` is off).

Confirm:

- [ ] Google + email auth
- [ ] Publish / edit / pause listing + images
- [ ] Messaging and notifications
- [ ] Admin moderation (staff account)
- [ ] PT / FR / EN on marketplace and **admin** screens

---

## 4. Launch communications (optional)

Only if **you** explicitly approve:

- Social / school networks announcement
- Press or partner email
- Open beta list → public registration

Otherwise keep organic discovery (SEO, word of mouth).

---

## 5. Rollback

- Re-enable `NEXT_PUBLIC_BETA=true` and redeploy to return to closed beta behaviour.
- Revert Vercel deployment if a bad release shipped.

---

## 6. Phase 9.9 sign-off

| Step | Done |
|------|------|
| `NEXT_PUBLIC_BETA` disabled + redeploy | ☐ |
| `/api/health/deploy-readiness?mode=ga` returns 200 | ☐ |
| Sitemap & robots verified | ☐ |
| Legal pages reviewed | ☐ |
| Production smoke test (GA) | ☐ |
| Optional public announcement | ☐ |

**Sign-off:** ___________________ **Date:** ___________

**Next:** [PHASE_10_POST_LAUNCH.md](./PHASE_10_POST_LAUNCH.md)
