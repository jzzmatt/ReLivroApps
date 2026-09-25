# ReLivroApps

Mobile-first school-book marketplace and exchange platform.

## Design source of truth

The approved 16:9 landing-page mockup is:
`public/asset/reLivroApps-landing-16x9.png`

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
4. Enable email authentication in Supabase Auth.
5. Configure the application callback URL as `/auth/callback` for the deployed domain.
