-- Phase 9.8: quick schema checks after migrations 0001–0016 (run in Supabase SQL editor)

select exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'books' and column_name = 'thumbnail_path'
) as has_thumbnail_path;

select exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'book_images' and column_name = 'slot'
) as has_book_image_slots;

select exists (
  select 1 from information_schema.columns
  where table_schema = 'public' and table_name = 'books' and column_name = 'payment_arrangement'
) as has_payment_arrangement;

select id, public from storage.buckets where id in ('book-images', 'avatars');
