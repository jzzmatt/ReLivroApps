-- Phase 7: trust, profiles and marketplace intelligence

alter table public.profiles
  add column if not exists school text,
  add column if not exists phone text;

create table public.seller_reviews (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(seller_id,reviewer_id,book_id)
);

create table public.book_views (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz not null default now()
);

create index seller_reviews_seller_idx on public.seller_reviews(seller_id,created_at desc);
create index book_views_book_idx on public.book_views(book_id,viewed_at desc);
create index book_views_viewer_idx on public.book_views(viewer_id,viewed_at desc);

alter table public.seller_reviews enable row level security;
alter table public.book_views enable row level security;

create policy "Reviews are publicly readable"
on public.seller_reviews for select using (true);

create policy "Users create their own reviews"
on public.seller_reviews for insert
with check (
  auth.uid() = reviewer_id
  and auth.uid() <> seller_id
);

create policy "Users update their own reviews"
on public.seller_reviews for update
using (auth.uid() = reviewer_id)
with check (auth.uid() = reviewer_id);

create policy "Users delete their own reviews"
on public.seller_reviews for delete
using (auth.uid() = reviewer_id);

create policy "Users create book views"
on public.book_views for insert
with check (viewer_id is null or auth.uid() = viewer_id);

create policy "Owners can view their book analytics"
on public.book_views for select
using (
  exists(select 1 from public.books b where b.id=book_id and b.seller_id=auth.uid())
  or auth.uid() = viewer_id
);

create or replace function public.record_book_view(p_book_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists(select 1 from public.books where id=p_book_id and is_published=true) then
    return;
  end if;
  insert into public.book_views(book_id,viewer_id)
  values(p_book_id,auth.uid());
end;
$$;

grant execute on function public.record_book_view(uuid) to anon,authenticated;

insert into storage.buckets(id,name,public)
values('avatars','avatars',true)
on conflict(id) do nothing;

create policy "Avatar images are public"
on storage.objects for select
using(bucket_id='avatars');

create policy "Authenticated users upload avatars"
on storage.objects for insert
with check(bucket_id='avatars' and auth.role()='authenticated');

create policy "Users update their own avatars"
on storage.objects for update
using(bucket_id='avatars' and auth.uid()::text=(storage.foldername(name))[1])
with check(bucket_id='avatars' and auth.uid()::text=(storage.foldername(name))[1]);

create policy "Users delete their own avatars"
on storage.objects for delete
using(bucket_id='avatars' and auth.uid()::text=(storage.foldername(name))[1]);
