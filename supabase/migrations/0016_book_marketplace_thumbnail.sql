-- Phase 9.7.3: canonical marketplace thumbnail derived from inspection photos

alter table public.books
  add column if not exists thumbnail_path text,
  add column if not exists thumbnail_source text;

alter table public.books
  drop constraint if exists books_thumbnail_source_check;

alter table public.books
  add constraint books_thumbnail_source_check
  check (
    thumbnail_source is null
    or thumbnail_source in (
      'front_cover',
      'back_cover',
      'first_page',
      'middle_page',
      'last_page'
    )
  );
