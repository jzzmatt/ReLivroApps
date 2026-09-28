# Desktop E2E smoke (auth + core routes)

Playwright **Desktop Chrome** (1280×800) checks signup UI and a signed-in path through marketplace and profile.

## Prerequisites

1. Supabase env in **`.env.local`** (required for client auth in dev):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. Fresh dev server (stale `.next` chunks break hydration):

   ```bash
   rm -rf .next && npm run dev
   ```

3. Optional confirmed test user (defaults to the Cursor smoke account on staging):

   ```bash
   export SMOKE_TEST_EMAIL=you@example.com
   export SMOKE_TEST_PASSWORD='your-password'
   ```

   Email signup on Supabase requires confirmation unless auto-confirm is enabled; confirm the user in Supabase Auth before using sign-in test.

## Run

```bash
npm run test:e2e:desktop
```

Or against another base URL:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e:desktop
```

## What is covered

| Test | Flow |
|------|------|
| Sign up | Switch to signup → submit → success message |
| Sign in | Login → `/books` → `/profile` heading |
