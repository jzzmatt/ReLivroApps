# ReLivroApps

Mobile-first school-book marketplace and exchange platform.

## Design source of truth

Design assets (16:9):

- Landing reference mockup: `public/asset/reLivroApps-landing-16x9.png`
- GPT-Image hero banner (text-free, HTML overlay): `public/asset/reLivroApps-hero-banner-16x9.png`

### Regenerate hero banner (optional)

Server-side only — never expose `OPENAI_API_KEY` to the client or Vercel runtime unless you run generation in CI.

```bash
# Set OPENAI_API_KEY in your shell or .env.local (do not commit)
npm run generate:hero
```

Uses `gpt-image-2` by default (`1536x864`) with reference-guided `images.edit` when `scripts/reference/reLivroApps-hero-reference.png` exists (cropped from the landing mockup illustration — not served from `public/`). Override reference path with `HERO_REFERENCE_IMAGE` or model with `OPENAI_IMAGE_MODEL`. Commit the updated PNG after review.

## Frontend progress

### Phase 1 — Foundation
- Next.js 15 / React 19 / TypeScript
- Motion for React
- Mobile-first responsive base
- Initial landing-page UI

### Phase 2 — Visual implementation
- Mockup-aligned landing composition
- Responsive hero
- App preview cards
- Motion interactions
- Reusable visual patterns

### Phase 3 — Marketplace Foundation
- Responsive application shell
- Mobile bottom navigation
- Book data model and demo catalogue
- Book discovery/search
- Subject and transaction filters
- Animated reusable BookCard
- Book detail page
- Publish-book form
- Marketplace responsive styles

## Languages

Portuguese is the default application language. French and English will be supported.

## Phase 5 — Real Marketplace CRUD
- Marketplace catalogue reads from Supabase
- Real search and subject / mode filtering
- Supabase-backed favourites
- Real book detail pages with image gallery
- Authenticated book publishing
- Supabase Storage upload for up to five book images
- Seller-owned listing management
- Edit listing
- Publish / pause listing
- Delete listing
- Personal listings page
- Profile navigation to listings
- Mobile-first management UI

### Current user flow
`/auth` → `/books` → `/books/[id]` → `/sell` → `/profile/listings` → `/books/[id]/edit`

## Phase 4 — Backend & Data Foundation
- Supabase browser/server clients
- Environment template
- Profiles and automatic profile creation on signup
- Books, book images and favourites tables
- PostgreSQL indexes and Row Level Security policies
- Public book-image storage bucket policies
- Email/password authentication UI
- Auth callback route
- Profile and favourites pages
- Supabase session middleware

### Supabase setup
1. Create a Supabase project.
2. Add the values from `.env.example` to your local environment.
3. Run `supabase/migrations/0001_relivroapps_foundation.sql` in the Supabase SQL editor or through the Supabase CLI.
4. Enable **Email** and **Google** in Supabase Auth (see [docs/GOOGLE_AUTH_SETUP.md](docs/GOOGLE_AUTH_SETUP.md)).
5. Configure the application callback URL as `/auth/callback` for the deployed domain.
6. Optional: run `0008_google_oauth_profile_names.sql` after `0007` for Google display names/avatars on signup.


## Phase 6 — Community & Transaction Layer
- Buyer/seller conversations
- Secure conversation creation through Supabase RPC
- Messaging with participant-only RLS
- Message read-state handling through secure RPC
- Automatic recipient notifications for new messages
- Notifications page
- Seller contact flow from book detail
- Listing reporting
- Listing transaction states: active, reserved, sold, exchanged
- Automatic unpublishing when sold/exchanged
- Mobile navigation for messages and notifications

### New community flow
`/books/[id]` → `Contactar vendedor` → `/messages/[conversation-id]` → messages + notifications

### Required Supabase migration
Run:
`supabase/migrations/0002_community_transactions.sql`
after the Phase 4 migration.


## Phase 7 — Trust, Profiles & Marketplace Intelligence
- Real editable user profiles
- Avatar uploads to Supabase Storage
- School, city, municipality, phone and bio fields
- Profile activity statistics
- Seller identity on book detail
- Seller ratings/reviews data model
- Book view tracking
- Seller/book analytics foundation
- Recent-view and recommendation data foundation
- Marketplace intelligence migration

### Required Supabase migration
Run:
`supabase/migrations/0003_trust_profiles_intelligence.sql`
after migrations 0001 and 0002.

## Phase 8 — Admin, Moderation & Analytics
- Dedicated `/admin` administration area
- Admin and moderator roles
- Marketplace KPI dashboard
- User management view
- Listing moderation
- Listing publish/suspend actions
- Report moderation
- Admin audit logs
- Secure admin RPCs
- Database-level admin authorization
- Moderation-ready analytics foundation

### Required Supabase migration
Run `supabase/migrations/0004_admin_moderation_analytics.sql` after migrations 0001, 0002 and 0003.

### First admin setup
After the migration, promote the initial administrator directly in Supabase:
`update public.profiles set role='admin' where id='<AUTH_USER_UUID>';`

## Phase 9 — Production Readiness & Beta Launch
- Production loading, error and 404 states
- Next.js production image configuration
- Strict ESLint configuration
- Production metadata, SEO defaults and viewport
- `NEXT_PUBLIC_SITE_URL` support
- Portuguese Angola document locale (`pt-AO`)
- Reduced-motion support for production route feedback

### Production environment
Set `NEXT_PUBLIC_SITE_URL` to the public Vercel domain before production deployment.

## Phase 9.1 — Security, Validation & Abuse Protection
- Zod schemas for listing, profile, message/report validation foundation
- Listing image type and 5 MB size validation
- Avatar image type and 3 MB size validation
- Secure HTTP response headers
- Database-backed rate limiting
- Conversation creation validates authentication, published listing and self-contact

### Required Supabase migration
Run `supabase/migrations/0005_security_rate_limits.sql` after migration 0004.

## Phase 9.2 — Internationalization
- PT-AO default locale
- French support
- English support
- Shared translation catalog
- Landing page localization
- Authentication localization
- Persistent language selector
- Language preference stored locally

### Supported locales
`pt` → Português (default)  
`fr` → Français  
`en` → English

## Phase 9.3 — Complete Application Localization
- Core marketplace localization
- Profile localization
- Favorites localization
- Messaging localization
- Notifications localization
- Sell/listing form translation catalog
- Server-rendered locale preference via cookie
- PT-AO, FR and EN shared translation keys

## Phase 9.4 — Accessibility & Mobile QA
- Visible keyboard focus states
- 44px minimum touch targets for primary controls
- Responsive mobile/tablet refinements
- Reduced-motion support
- Accessible application header navigation semantics
- Accessible landing preview semantics
- Mobile-friendly form sizing and error presentation

## Phase 9.5 — Analytics & Production Observability
- Privacy-conscious first-party analytics stored in Supabase
- Page-view tracking
- Session tracking with anonymous browser session ID
- Generic event tracking API
- Admin analytics summary
- Daily event aggregation view
- 24h / 7d / 30d event metrics

### Required Supabase migration
Run `supabase/migrations/0006_analytics_observability.sql` after migration 0005.

## Phase 9.6 — Production Deployment & Infrastructure

Production-ready deployment on **Vercel + Supabase + GitHub** (no public launch in this phase).

### Architecture

- **Frontend / SSR:** Next.js 15 App Router on Vercel
- **Auth & data:** Supabase (Postgres, Auth, Storage, RLS, RPC)
- **i18n:** PT-AO default, FR, EN (`lib/i18n.ts`, locale cookie `relivro-locale`)
- **Analytics:** first-party events via Supabase RPC (`record_analytics_event`)
- **Secrets:** only `NEXT_PUBLIC_*` in the browser; no service role in client code

### Environment variables

Copy `.env.example` to `.env.local` for local development. Never commit real secrets.

| Variable | Scope | Required |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public | Yes (production/staging URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | No (not used by current app) |

### Local development

```bash
npm ci
cp .env.example .env.local
# fill Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

### Supabase setup

1. Create a Supabase project.
2. Enable **Email** provider in Authentication.
3. Apply SQL migrations **in order** (SQL editor or Supabase CLI):

```text
supabase/migrations/0001_relivroapps_foundation.sql
supabase/migrations/0002_community_transactions.sql
supabase/migrations/0003_trust_profiles_intelligence.sql
supabase/migrations/0004_admin_moderation_analytics.sql
supabase/migrations/0005_security_rate_limits.sql
supabase/migrations/0006_analytics_observability.sql
supabase/migrations/0007_storage_book_images_hardening.sql
supabase/migrations/0008_google_oauth_profile_names.sql
```

4. Confirm Storage buckets: **`book-images`** (public), **`avatars`** (public).
5. Auth **Site URL** and **Redirect URLs** must include:
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://YOUR_PRODUCTION_DOMAIN/auth/callback`

### First admin

After migrations, promote an admin in SQL (replace UUID):

```sql
update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
```

### Vercel deployment

1. Import the GitHub repository in Vercel.
2. Framework: **Next.js** (auto-detected).
3. Node.js: **20.x** (see `package.json` `engines`).
4. Install: `npm ci` · Build: `npm run build`.
5. Set environment variables (Production + Preview as needed):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → `https://YOUR_PRODUCTION_DOMAIN` (use the Vercel URL until a custom domain is configured)
6. Deploy. Verify build logs and run the smoke-test checklist.

### Production checklist

- [ ] All migrations `0001`–`0008` on production database
- [ ] Env vars set in Vercel (no service role in client)
- [ ] Auth redirect URLs for production domain
- [ ] `NEXT_PUBLIC_SITE_URL` matches live URL
- [ ] `npm run lint` and `npm run build` pass in CI
- [ ] Complete [docs/PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md)

### Phase 9.8 — Beta deployment

Closed beta on Vercel + Supabase (not a public marketing launch unless you approve one).

1. Follow [docs/PHASE_9_8_BETA_DEPLOYMENT.md](docs/PHASE_9_8_BETA_DEPLOYMENT.md).
2. Set `NEXT_PUBLIC_BETA=true` in Vercel Production during beta (dismissible banner + `noindex`).
3. Complete [docs/PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md) on the live URL.
4. Onboard testers privately; do not announce publicly unless requested.

### Phase 9.9 — Public launch (GA)

Exit beta and enable public SEO when smoke tests are green:

1. Follow [docs/PHASE_9_9_PUBLIC_LAUNCH.md](docs/PHASE_9_9_PUBLIC_LAUNCH.md).
2. Set `NEXT_PUBLIC_BETA=false` (or remove) in Vercel Production → **Redeploy**.
3. Verify `/sitemap.xml`, `/robots.txt`, `/privacidade`, `/termos`.
4. Re-run [docs/PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md) on production.

### Phase 10 — Post-launch discovery & support

- Help centre FAQ: `/ajuda` (PT / FR / EN)
- PWA manifest, JSON-LD on landing, full landing section i18n
- See [docs/PHASE_10_POST_LAUNCH.md](docs/PHASE_10_POST_LAUNCH.md)

### Phase 11 — Support contact & listing share

- Optional `NEXT_PUBLIC_SUPPORT_EMAIL` (mailto on help + footer)
- Share listing on book detail (Web Share / copy link)
- Open Graph metadata per book
- See [docs/PHASE_11_SUPPORT_SHARE.md](docs/PHASE_11_SUPPORT_SHARE.md)

### Phase 12 — Book detail i18n & rich share previews

- Localized book detail page (PT / FR / EN)
- Open Graph / Twitter image from first listing photo
- See [docs/PHASE_12_BOOK_DETAIL.md](docs/PHASE_12_BOOK_DETAIL.md)

### Phase 13 — Marketplace & seller listings i18n

- `/books` search, filters, book cards (PT / FR / EN)
- Report listing + `/profile/listings` management copy
- See [docs/PHASE_13_MARKETPLACE_I18N.md](docs/PHASE_13_MARKETPLACE_I18N.md)

### Phase 14 — Catalog labels & publish flow i18n

- Translated subject/grade labels (DB values stay PT-AO)
- `/sell` and edit listing use full `messages[locale].sell`
- See [docs/PHASE_14_CATALOG_I18N.md](docs/PHASE_14_CATALOG_I18N.md)

### Validation commands

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```
