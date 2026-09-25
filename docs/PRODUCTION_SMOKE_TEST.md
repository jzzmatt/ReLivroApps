# ReLivroApps — Production smoke-test checklist

Run against the **production or staging** deployment after env vars and Supabase migrations are applied.  
Do not treat this as a public launch checklist unless explicitly approved (Phase 9.8).

## Authentication

- [ ] Register (email)
- [ ] Login (email)
- [ ] Login (Google)
- [ ] Logout (profile → **Terminar sessão**)
- [ ] Session persistence (refresh page while logged in)

## Marketplace

- [ ] Browse books
- [ ] Search
- [ ] Book details
- [ ] Publish book
- [ ] Edit listing
- [ ] Delete listing
- [ ] Upload images (up to 5, JPG/PNG/WebP, size limits)

## Community

- [ ] Profile
- [ ] Edit profile
- [ ] Favourite
- [ ] Contact seller
- [ ] Conversation
- [ ] Messages
- [ ] Notifications

## Trust & Safety

- [ ] Report listing
- [ ] Moderation (admin/moderator)
- [ ] Admin access
- [ ] Unauthorized access tests (non-admin cannot open `/admin`)

## Languages

- [ ] Portuguese (default)
- [ ] French
- [ ] English
- [ ] Language persistence (cookie + reload)

## Responsive

- [ ] 360px
- [ ] 390px
- [ ] 430px
- [ ] Tablet
- [ ] Desktop

## Beta (when `NEXT_PUBLIC_BETA=true`)

- [ ] Beta banner visible on first visit
- [ ] Banner dismisses and stays hidden after reload
- [ ] PT / FR / EN banner text (language switcher)
- [ ] Page metadata uses `noindex` (view source / SEO tools)

## Infrastructure (deployment)

- [ ] `NEXT_PUBLIC_SITE_URL` matches deployed URL
- [ ] Supabase Auth redirect URLs include `https://YOUR_DOMAIN/auth/callback`
- [ ] Migrations `0001`–`0008` applied in order on production database
- [ ] Google provider enabled in Supabase (see [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md))
- [ ] Storage buckets `book-images` and `avatars` exist with expected policies
- [ ] HTTPS enforced on production domain
