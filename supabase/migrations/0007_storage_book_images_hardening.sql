-- Phase 9.6: restrict book-images uploads to the authenticated user's folder prefix
drop policy if exists "Authenticated users upload book images" on storage.objects;
drop policy if exists "Users delete their own book images" on storage.objects;

create policy "Authenticated users upload own book images"
on storage.objects for insert
with check (
  bucket_id = 'book-images'
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users update own book images"
on storage.objects for update
using (
  bucket_id = 'book-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'book-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users delete their own book images"
on storage.objects for delete
using (
  bucket_id = 'book-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
