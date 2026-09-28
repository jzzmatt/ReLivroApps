# Phase 9.7.3 — AI marketplace thumbnail + WhatsApp sharing

## Summary

- `/sell` auto-runs vision analysis when all five inspection photos are selected (no manual AI button).
- One OpenAI vision request returns **condition suggestion** and **thumbnail slot** (`front_cover` … `last_page`).
- On publish, listings start unpublished; `POST /api/listings/prepare-thumbnail` builds `thumbnail.webp` with **sharp**, sets `thumbnail_path` / `thumbnail_source`, then publishes.
- Marketplace, workspace, and book detail hero use `resolveListingImagePath()`.
- WhatsApp share uses `lib/whatsapp-share.ts` (PT/FR/EN). Link previews use Open Graph / Twitter metadata on `/books/[id]`.

## Database

Apply `supabase/migrations/0016_book_marketplace_thumbnail.sql` on staging/production.

## Environment

- `OPENAI_API_KEY` (server only)
- Optional: `OPENAI_CONDITION_MODEL` (defaults to `gpt-4o-mini`)
