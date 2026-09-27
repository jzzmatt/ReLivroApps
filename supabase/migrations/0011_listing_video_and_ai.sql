-- Optional listing video and a seller-confirmed record of an AI suggestion.
-- The published condition column stays authoritative.

alter table public.books
  add column if not exists video_path text,
  add column if not exists ai_suggested_condition text,
  add column if not exists ai_analyzed_at timestamptz;

alter table public.books
  drop constraint if exists books_ai_suggested_condition_check;

alter table public.books
  add constraint books_ai_suggested_condition_check
  check (
    ai_suggested_condition is null
    or ai_suggested_condition in ('Como novo', 'Muito bom', 'Bom estado', 'Usado')
  );
