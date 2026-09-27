# Phase 52 — Listing video and AI condition suggestion

**Goal:** Let a seller attach an optional short video and ask for a condition suggestion from the five inspection photos. The condition the seller publishes stays the one on the listing.

---

## Behavior

| Surface | Change |
|---------|--------|
| `/sell` | Optional MP4, WebM, or MOV up to 20 MB |
| `/sell` | **Suggest condition with AI** sends the five photos to `POST /api/listings/analyze-condition` |
| Suggestion | Shown with **Use this suggestion**. It does not replace the condition select until the seller clicks that button |
| Stored AI fields | `ai_suggested_condition` and `ai_analyzed_at` are written only when analysis succeeded in this session |
| Missing key | The API returns 503 and the form says analysis is not configured. The seller still picks a condition |
| Video storage | Public `book-images` bucket at `{userId}/{bookId}/video-…`. It is not a `book_images` row |
| Failed video upload | The new book row is deleted, same as a failed photo upload |
| Book detail | `<video controls>` only when the listing is published and `video_path` is set |
| `/workspace` | Recent listings show **AI analysed** or **Analysis pending**. **Watch video** only for a published listing that has a video |

The model defaults to `gpt-4o-mini`. Override with server-only `OPENAI_CONDITION_MODEL`. `OPENAI_API_KEY` must never be `NEXT_PUBLIC_`.

---

## Database

`0011_listing_video_and_ai.sql` adds nullable `books.video_path`, `books.ai_suggested_condition`, and `books.ai_analyzed_at`. The suggestion column only allows the four existing condition labels.

Apply the same migration on production if that database is not the staging project.

---

## Verification

- [ ] Without `OPENAI_API_KEY`, the suggest button reports that analysis is not configured and publish still works
- [ ] Applying a suggestion updates the condition select; skipping it leaves the seller’s choice
- [ ] A published listing with a video shows the player; an unpublished listing does not
- [ ] `npm run typecheck` and `npm run build` pass

**Next:** [Phase 53 — Nearby listings by city](PHASE_53_NEARBY_CITY.md)
