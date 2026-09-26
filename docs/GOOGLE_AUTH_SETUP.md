# Google sign-in (Supabase + Vercel)

ReLivroApps uses Supabase Auth with **Google OAuth**. Email/password remains available on `/auth`.

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/) → select or create a project.
2. **APIs & Services → OAuth consent screen** — configure (External if public users), add app name and support email.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins** (add each URL you use):
     - `http://localhost:3000`
     - `https://YOUR-PRODUCTION-DOMAIN`
     - Preview URLs on Vercel if you test Google login there
   - **Authorized redirect URIs** — add **only** Supabase (not your Next.js callback):

```text
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```

Find `YOUR-PROJECT-REF` in Supabase → **Project Settings → General → Reference ID**,  
or from your `NEXT_PUBLIC_SUPABASE_URL` (`https://xxxx.supabase.co`).

4. Copy **Client ID** and **Client secret**.

## 2. Supabase Dashboard

1. **Authentication → Providers → Google** — enable.
2. Paste **Client ID** and **Client secret** → Save.
3. **Authentication → URL Configuration**
   - **Site URL:** production app URL (e.g. `https://your-app.vercel.app`)
   - **Redirect URLs** (app callback after Supabase finishes Google):

```text
http://localhost:3000/auth/callback
https://YOUR-PRODUCTION-DOMAIN/auth/callback
```

Add Vercel preview callback URLs or a wildcard if your Supabase project supports it.

## 3. Database (optional but recommended)

Run migration **`0008_google_oauth_profile_names.sql`** so new Google users get `display_name` and avatar from Google metadata.

## 4. Vercel

No extra env vars for Google (credentials live in Supabase). Ensure:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` matches the deployment URL you open in the browser.

Redeploy after env changes.

## 5. Test

1. Open `/auth` → **Continuar com Google**.
2. After consent, you should land on `/books` with a session.
3. Supabase → **Authentication → Users** — user appears with Google provider.
4. **Table Editor → profiles** — row exists with name (and avatar if provided).

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| `redirect_uri_mismatch` | Redirect URI in Google must be exactly `https://<ref>.supabase.co/auth/v1/callback` |
| Redirect URL not allowed | Add `https://your-domain/auth/callback` in Supabase URL Configuration |
| Login works but no profile | Confirm `handle_new_user` trigger exists (migration `0001`); run `0008` for Google names |
| Works on prod, not preview | Add preview origin + callback in Google and Supabase, or test Google only on production |
| Lands on `http://localhost:3000/?code=...` (stuck on home, not logged in) | Add **`http://localhost:3000/auth/callback`** under Supabase **Authentication → URL Configuration → Redirect URLs**. The app also forwards `/?code=` to `/auth/callback`, but whitelisting the callback URL is required for a reliable session. |
