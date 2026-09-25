-- Phase 6: community and transaction layer

create type public.listing_status as enum ('active','reserved','sold','exchanged');

alter table public.books
  add column if not exists status public.listing_status not null default 'active';

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique(book_id,buyer_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  conversation_id uuid references public.conversations(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default now()
);

create index conversations_buyer_idx on public.conversations(buyer_id,last_message_at desc);
create index conversations_seller_idx on public.conversations(seller_id,last_message_at desc);
create index messages_conversation_idx on public.messages(conversation_id,created_at);
create index notifications_user_idx on public.notifications(user_id,is_read,created_at desc);
create index reports_book_idx on public.listing_reports(book_id);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.listing_reports enable row level security;

create policy "Participants can view conversations"
on public.conversations for select
using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Participants can view messages"
on public.messages for select
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

create policy "Participants can send messages"
on public.messages for insert
with check (
  auth.uid() = sender_id
  and exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

create policy "Recipients can mark messages read"
on public.messages for update
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
)
with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
    and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
  )
);

create policy "Users view their notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "Users update their notifications"
on public.notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users submit listing reports"
on public.listing_reports for insert
with check (auth.uid() = reporter_id);

create policy "Users view their reports"
on public.listing_reports for select
using (auth.uid() = reporter_id);

create or replace function public.start_conversation(p_book_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_seller uuid;
  v_conversation uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select seller_id into v_seller
  from public.books
  where id = p_book_id and is_published = true;

  if v_seller is null then
    raise exception 'Book is not available';
  end if;

  if v_seller = auth.uid() then
    raise exception 'Seller cannot contact themselves';
  end if;

  insert into public.conversations(book_id,buyer_id,seller_id)
  values(p_book_id,auth.uid(),v_seller)
  on conflict(book_id,buyer_id)
  do update set last_message_at=public.conversations.last_message_at
  returning id into v_conversation;

  return v_conversation;
end;
$$;

grant execute on function public.start_conversation(uuid) to authenticated;

create or replace function public.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;

  return new;
end;
$$;

create trigger on_message_created
after insert on public.messages
for each row execute procedure public.touch_conversation();

create or replace function public.notify_message_recipient()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recipient uuid;
  v_book uuid;
begin
  select
    case when buyer_id = new.sender_id then seller_id else buyer_id end,
    book_id
  into v_recipient,v_book
  from public.conversations
  where id = new.conversation_id;

  if v_recipient is not null then
    insert into public.notifications(user_id,type,title,body,conversation_id,book_id)
    values(v_recipient,'message','Nova mensagem','Recebeu uma nova mensagem.',new.conversation_id,v_book);
  end if;

  return new;
end;
$$;

create trigger on_message_notification
after insert on public.messages
for each row execute procedure public.notify_message_recipient();

alter table public.books add column if not exists sold_at timestamptz;
