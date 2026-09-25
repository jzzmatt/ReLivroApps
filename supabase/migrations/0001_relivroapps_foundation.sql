create extension if not exists "pgcrypto";

create type public.listing_mode as enum ('Venda','Troca','Oferta');
create type public.book_condition as enum ('Como novo','Muito bom','Bom estado','Usado');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  city text,
  municipality text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  subject text not null,
  grade text not null,
  condition public.book_condition not null,
  mode public.listing_mode not null default 'Venda',
  price_kz numeric(12,2) not null default 0 check (price_kz >= 0),
  description text,
  city text,
  municipality text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.book_images (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

create index books_subject_idx on public.books(subject);
create index books_grade_idx on public.books(grade);
create index books_mode_idx on public.books(mode);
create index books_city_idx on public.books(city);
create index books_seller_idx on public.books(seller_id);
create index books_created_at_idx on public.books(created_at desc);

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_images enable row level security;
alter table public.favorites enable row level security;

create policy "Profiles are publicly readable"
on public.profiles for select using (true);

create policy "Users can insert their profile"
on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their profile"
on public.profiles for update using (auth.uid() = id);

create policy "Published books are publicly readable"
on public.books for select using (is_published = true or auth.uid() = seller_id);

create policy "Users can create their own books"
on public.books for insert with check (auth.uid() = seller_id);

create policy "Users can update their own books"
on public.books for update using (auth.uid() = seller_id);

create policy "Users can delete their own books"
on public.books for delete using (auth.uid() = seller_id);

create policy "Book images are readable"
on public.book_images for select using (
  exists (select 1 from public.books b where b.id = book_id and (b.is_published = true or b.seller_id = auth.uid()))
);

create policy "Owners can add book images"
on public.book_images for insert with check (
  exists (select 1 from public.books b where b.id = book_id and b.seller_id = auth.uid())
);

create policy "Users manage their favorites"
on public.favorites for select using (auth.uid() = user_id);
create policy "Users add their favorites"
on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users remove their favorites"
on public.favorites for delete using (auth.uid() = user_id);

insert into storage.buckets (id,name,public)
values ('book-images','book-images',true)
on conflict (id) do nothing;

create policy "Book images are public"
on storage.objects for select
using (bucket_id = 'book-images');

create policy "Authenticated users upload book images"
on storage.objects for insert
with check (bucket_id = 'book-images' and auth.role() = 'authenticated');

create policy "Users delete their own book images"
on storage.objects for delete
using (bucket_id = 'book-images' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles(id,display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
