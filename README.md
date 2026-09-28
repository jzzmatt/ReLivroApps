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
`/auth` → `/workspace` (after sign-in) → `/books` → `/books/[id]` → `/sell` → `/profile/listings` → `/books/[id]/edit`

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

- [ ] All migrations `0001`–`0009` on production database
- [ ] Env vars set in Vercel (no service role in client)
- [ ] Auth redirect URLs for production domain
- [ ] `NEXT_PUBLIC_SITE_URL` matches live URL
- [ ] `npm run lint` and `npm run build` pass in CI
- [ ] Complete [docs/PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md)

### Phase 9.6-DATA — Demo / test data seeding (dev & staging only)

Populate a **non-production** Supabase project with fictional users, books, messaging, reviews, and original SVG demo covers. Catalogue titles are inspired by public metadata from [Xilonga manuais escolares](https://xilonga.med.gov.ao/manuais-escolares) — no PDFs or official artwork.

**Never run against production.** Requires `SEED_DATABASE=true`, service role key, and `DEMO_USER_PASSWORD` in `.env.local` only.

```bash
SEED_DATABASE=true npm run seed:demo
SEED_DATABASE=true npm run seed:demo:clear
# Fallback without service role (SQL editor / MCP):
DEMO_USER_PASSWORD='…' npm run seed:demo:sql > demo-seed.sql
```

See [docs/PHASE_9_6_DATA_SEEDING.md](docs/PHASE_9_6_DATA_SEEDING.md). Demo emails: `*@demo.example.com` (admin: `admin.demo@demo.example.com`).

### Phase 9.7.1 — Dedicated seller workspace

- `/workspace` dashboard: KPIs, publication summary, recent listings, activity, notification and message summaries
- Profile stays account-focused and links to the workspace
- See [docs/PHASE_9_7_1_SELLER_WORKSPACE.md](docs/PHASE_9_7_1_SELLER_WORKSPACE.md)

### Phase 9.8 — Beta deployment

Closed beta on Vercel + Supabase (not a public marketing launch unless you approve one).

1. Follow [docs/PHASE_9_8_BETA_DEPLOYMENT.md](docs/PHASE_9_8_BETA_DEPLOYMENT.md).
2. Set `NEXT_PUBLIC_BETA=true` in Vercel Production during beta (dismissible banner + `noindex`).
3. Complete [docs/PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md) on the live URL.
4. Onboard testers privately; do not announce publicly unless requested.

### Phase 9.9 — Public launch (GA)

Exit beta and enable public SEO when smoke tests are green:

1. Follow [docs/PHASE_9_9_PUBLIC_LAUNCH.md](docs/PHASE_9_9_PUBLIC_LAUNCH.md).
2. Set `NEXT_PUBLIC_BETA=false` (or remove) in Vercel Production → **Redeploy**. Default in code is already public when the variable is unset.
3. Verify `/sitemap.xml`, `/robots.txt` (public crawl, private areas disallowed), `/privacidade`, `/termos`.
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

### Phase 15 — Messaging thread & profile edit i18n

- `/messages/[id]` conversation UI (PT / FR / EN)
- `MessageComposer` and `/profile/edit` localized
- Locale-aware dates on messages and notifications
- See [docs/PHASE_15_MESSAGING_PROFILE_I18N.md](docs/PHASE_15_MESSAGING_PROFILE_I18N.md)

### Phase 16 — App shell & global SEO i18n

- `AppShell` / `MobileNav` labels and header aria
- Root `generateMetadata` + `<html lang>` from locale cookie
- Localized 404, error, loading, Supabase config banner
- See [docs/PHASE_16_SHELL_SEO_I18N.md](docs/PHASE_16_SHELL_SEO_I18N.md)

### Phase 17 — Seller reviews (trust UI)

- Rate sellers on book detail (1–5 stars + optional comment)
- Seller average and review list; profile stats + recent feedback i18n
- See [docs/PHASE_17_SELLER_REVIEWS.md](docs/PHASE_17_SELLER_REVIEWS.md)

### Phase 18 — Public seller profiles (trust & discovery)

- Public `/seller/[id]` page with active listings, ratings, and recent feedback
- Book detail seller block links to the public profile (PT / FR / EN)
- See [docs/PHASE_18_SELLER_PROFILE.md](docs/PHASE_18_SELLER_PROFILE.md)

### Phase 19 — Marketplace seller cues & notifications polish

- Book cards link seller name to `/seller/[id]`
- Notifications: mark read on open, mark all read, safer deep links
- Favorites page fully localized
- See [docs/PHASE_19_SELLER_CUES_NOTIFICATIONS.md](docs/PHASE_19_SELLER_CUES_NOTIFICATIONS.md)

### Phase 20 — Favorites grid & notification badge

- `/profile/favorites` uses marketplace-style book cards with thumbnails
- Unread count badge on notifications in header and mobile nav
- See [docs/PHASE_20_FAVORITES_NOTIFICATIONS.md](docs/PHASE_20_FAVORITES_NOTIFICATIONS.md)

### Phase 21 — Messaging unread indicators

- Unread message badge on ✉ in header and mobile nav
- `/messages` highlights threads with unread incoming messages
- See [docs/PHASE_21_MESSAGES_UNREAD.md](docs/PHASE_21_MESSAGES_UNREAD.md)

### Phase 22 — Inbox previews & live nav badges

- Nav ✉ / ♢ badges refresh on route change and tab focus
- `/messages` shows last-message preview and date per thread
- See [docs/PHASE_22_INBOX_BADGES.md](docs/PHASE_22_INBOX_BADGES.md)

### Phase 23 — Conversation participant context

- Inbox and thread show the other participant’s name
- Buyers can open the seller’s public profile from a thread
- See [docs/PHASE_23_CONVERSATION_CONTEXT.md](docs/PHASE_23_CONVERSATION_CONTEXT.md)

### Phase 24 — Landing phone mockups i18n

- Hero carousel phone UI strings follow PT / FR / EN language switcher
- See [docs/PHASE_24_LANDING_PHONES_I18N.md](docs/PHASE_24_LANDING_PHONES_I18N.md)

### Phase 25 — More from this seller (book detail)

- Book detail shows up to four other listings from the same seller
- Link to full `/seller/[id]` profile (PT / FR / EN)
- See [docs/PHASE_25_SELLER_MORE_LISTINGS.md](docs/PHASE_25_SELLER_MORE_LISTINGS.md)

### Phase 26 — Share seller profile & social preview

- Share button on `/seller/[id]` (Web Share or copy link, PT / FR / EN)
- Open Graph / Twitter metadata for seller public pages
- See [docs/PHASE_26_SELLER_SHARE.md](docs/PHASE_26_SELLER_SHARE.md)

### Phase 27 — Dynamic SEO sitemap (books & sellers)

- `/sitemap.xml` includes published `/books/[id]` and `/seller/[id]` URLs when Supabase is configured
- See [docs/PHASE_27_SEO_SITEMAP.md](docs/PHASE_27_SEO_SITEMAP.md)

### Phase 28 — Structured data & canonical URLs

- JSON-LD on book detail (`Book` + `Offer`) and seller profile (`ProfilePage`)
- Canonical URLs in metadata via `getSiteUrl()`
- See [docs/PHASE_28_STRUCTURED_DATA.md](docs/PHASE_28_STRUCTURED_DATA.md)

### Phase 29 — Breadcrumbs (UI + JSON-LD)

- Visible breadcrumbs on book detail and seller profile (PT / FR / EN)
- `BreadcrumbList` structured data for SEO
- See [docs/PHASE_29_BREADCRUMBS.md](docs/PHASE_29_BREADCRUMBS.md)

### Phase 30 — Marketplace pagination (load more)

- `/books` SSR first 24 listings; **Load more** via paginated `/api/books`
- See [docs/PHASE_30_MARKETPLACE_PAGINATION.md](docs/PHASE_30_MARKETPLACE_PAGINATION.md)

### Phase 31 — Marketplace SEO & listing context

- Locale-aware `/books` metadata, breadcrumbs, `ItemList` JSON-LD
- “Loaded of total” hint when catalog exceeds first page
- See [docs/PHASE_31_MARKETPLACE_SEO.md](docs/PHASE_31_MARKETPLACE_SEO.md)

### Phase 32 — Seller listings pagination

- `/seller/[id]` SSR first 24 listings; **Load more** via `/api/sellers/[id]/books`
- See [docs/PHASE_32_SELLER_LISTINGS_PAGINATION.md](docs/PHASE_32_SELLER_LISTINGS_PAGINATION.md)

### Phase 33 — Help page SEO

- `/ajuda` metadata, breadcrumbs, and `FAQPage` JSON-LD (PT / FR / EN)
- See [docs/PHASE_33_HELP_SEO.md](docs/PHASE_33_HELP_SEO.md)

### Phase 34 — Legal pages SEO

- `/privacidade` and `/termos` metadata, breadcrumbs, `WebPage` JSON-LD
- See [docs/PHASE_34_LEGAL_SEO.md](docs/PHASE_34_LEGAL_SEO.md)

### Phase 35 — Favorites pagination

- `/profile/favorites` SSR first 24; **Load more** via `/api/favorites/books`
- See [docs/PHASE_35_FAVORITES_PAGINATION.md](docs/PHASE_35_FAVORITES_PAGINATION.md)

### Phase 36 — My listings pagination

- `/profile/listings` SSR first 24; **Load more** via `/api/profile/listings`
- See [docs/PHASE_36_MY_LISTINGS_PAGINATION.md](docs/PHASE_36_MY_LISTINGS_PAGINATION.md)

### Phase 37 — Messages inbox pagination

- `/messages` SSR first 24 conversations; **Load more** via `/api/messages/conversations`
- See [docs/PHASE_37_MESSAGES_INBOX_PAGINATION.md](docs/PHASE_37_MESSAGES_INBOX_PAGINATION.md)

### Phase 38 — Notifications pagination

- `/notifications` SSR first 24; **Load more** via `/api/notifications`; accurate unread total for “mark all read”
- See [docs/PHASE_38_NOTIFICATIONS_PAGINATION.md](docs/PHASE_38_NOTIFICATIONS_PAGINATION.md)

### Phase 39 — Auth & sell metadata

- Locale-aware `/auth` and `/sell` metadata via route layouts (`noindex` for private flows)
- See [docs/PHASE_39_AUTH_SELL_METADATA.md](docs/PHASE_39_AUTH_SELL_METADATA.md)

### Phase 40 — Private app route metadata

- Profile, favorites, listings, messages, notifications: layouts + `noindex` (PT / FR / EN)
- See [docs/PHASE_40_PRIVATE_APP_METADATA.md](docs/PHASE_40_PRIVATE_APP_METADATA.md)

### Phase 41 — Admin, thread & book-edit metadata

- Admin routes, `/messages/[id]`, `/books/[id]/edit` layouts; auth/sell use shared helper
- See [docs/PHASE_41_ADMIN_THREAD_EDIT_METADATA.md](docs/PHASE_41_ADMIN_THREAD_EDIT_METADATA.md)

### Phase 42 — Message thread pagination

- `/messages/[id]` latest 40 messages SSR; **Load earlier** via paginated messages API
- See [docs/PHASE_42_MESSAGE_THREAD_PAGINATION.md](docs/PHASE_42_MESSAGE_THREAD_PAGINATION.md)

### Phase 43 — Admin listings pagination

- `/admin/listings` SSR first 24; **Load more** via staff-only `/api/admin/listings`
- See [docs/PHASE_43_ADMIN_LISTINGS_PAGINATION.md](docs/PHASE_43_ADMIN_LISTINGS_PAGINATION.md)

### Phase 44 — Admin reports pagination

- `/admin/reports` SSR first 24; **Load more** via staff-only `/api/admin/reports`
- See [docs/PHASE_44_ADMIN_REPORTS_PAGINATION.md](docs/PHASE_44_ADMIN_REPORTS_PAGINATION.md)

### Phase 45 — Admin users pagination

- `/admin/users` SSR first 24; **Load more** via admin-only `/api/admin/users`
- See [docs/PHASE_45_ADMIN_USERS_PAGINATION.md](docs/PHASE_45_ADMIN_USERS_PAGINATION.md)

### Phase 46 — Sitemap scaling

- Sitemap index + chunked `/books/[id]` URLs (5 000 per file); sellers on static chunk
- See [docs/PHASE_46_SITEMAP_SCALING.md](docs/PHASE_46_SITEMAP_SCALING.md)

### Phase 47 — School trust UI

- Self-declared **School community** badge on seller profile and book detail (PT / FR / EN)
- See [docs/PHASE_47_SCHOOL_TRUST_UI.md](docs/PHASE_47_SCHOOL_TRUST_UI.md)

### Phase 48 — Payment UX copy

- Peer-to-peer payment expectations on book detail (no in-app checkout)
- See [docs/PHASE_48_PAYMENT_UX_COPY.md](docs/PHASE_48_PAYMENT_UX_COPY.md)

### Phase 49 — Push readiness

- In-app notification expectations on `/notifications` before native push
- See [docs/PHASE_49_PUSH_READINESS.md](docs/PHASE_49_PUSH_READINESS.md)

### Phase 51 — Inspection photos

- `/sell` how-to guide and five required inspection photos
- See [docs/PHASE_51_INSPECTION_PHOTOS.md](docs/PHASE_51_INSPECTION_PHOTOS.md)

### Phase 52 — Listing video and AI condition

- Optional short video on published listings; AI condition is a suggestion only
- See [docs/PHASE_52_LISTING_VIDEO_AI.md](docs/PHASE_52_LISTING_VIDEO_AI.md)

### Phase 53 — Nearby listings by city

- Marketplace filter for the signed-in profile city. No browser location and no distance
- See [docs/PHASE_53_NEARBY_CITY.md](docs/PHASE_53_NEARBY_CITY.md)

### Phase 54 — Verified school

- Admins confirm a profile school. Members cannot set the stamp. Changing the school name clears it
- See [docs/PHASE_54_VERIFIED_SCHOOL.md](docs/PHASE_54_VERIFIED_SCHOOL.md)

### Phase 55 — Payment arrangement

- Seller chooses cash, bank transfer, or to be agreed. The app does not take payment
- See [docs/PHASE_55_PAYMENT_ARRANGEMENT.md](docs/PHASE_55_PAYMENT_ARRANGEMENT.md)

### Phase 56 — Browser push alerts

- Optional browser alerts for new messages. In-app notifications stay in place
- See [docs/PHASE_56_WEB_PUSH.md](docs/PHASE_56_WEB_PUSH.md)

### Phase 57 — Deeper analytics

- Staff see 7-day event counts and top pages. Favourites, seller contact, and publish are recorded
- See [docs/PHASE_57_DEEPER_ANALYTICS.md](docs/PHASE_57_DEEPER_ANALYTICS.md)

### Phase 58 — Offline mode

- A lost connection shows an offline page. Account pages are not cached
- See [docs/PHASE_58_OFFLINE.md](docs/PHASE_58_OFFLINE.md)

### Phase 59 — Installable app

- The browser can offer to install ReLivroApps. Store apps need Apple and Google accounts
- See [docs/PHASE_59_INSTALLABLE_APP.md](docs/PHASE_59_INSTALLABLE_APP.md)

### Phase 50 — Roadmap complete

- Phases 1–50 documented; post-MVP backlog called out in phase doc
- See [docs/PHASE_50_ROADMAP_COMPLETE.md](docs/PHASE_50_ROADMAP_COMPLETE.md)

### Validation commands

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```
