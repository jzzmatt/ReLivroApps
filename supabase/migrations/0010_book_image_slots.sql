-- Semantic inspection photos for new listings.
-- Existing rows keep slot null and remain valid.

alter table public.book_images
  add column if not exists slot text;

alter table public.book_images
  drop constraint if exists book_images_slot_check;

alter table public.book_images
  add constraint book_images_slot_check
  check (
    slot is null
    or slot in ('front_cover', 'back_cover', 'first_page', 'middle_page', 'last_page')
  );

create unique index if not exists book_images_book_slot_idx
  on public.book_images (book_id, slot)
  where slot is not null;
