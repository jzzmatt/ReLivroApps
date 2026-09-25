-- Phase 9.1: database abuse controls
create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_events_actor_action_idx on public.rate_limit_events(actor_id,action,created_at desc);
alter table public.rate_limit_events enable row level security;

create or replace function public.check_rate_limit(p_action text,p_limit integer,p_window_seconds integer)
returns boolean
language plpgsql security definer set search_path=public
as $$
declare c integer;
begin
  if auth.uid() is null then return false; end if;
  select count(*) into c from public.rate_limit_events
  where actor_id=auth.uid() and action=p_action and created_at>now()-make_interval(secs=>p_window_seconds);
  if c>=p_limit then return false; end if;
  insert into public.rate_limit_events(actor_id,action) values(auth.uid(),p_action);
  return true;
end;$$;
grant execute on function public.check_rate_limit(text,integer,integer) to authenticated;

create or replace function public.start_conversation(p_book_id uuid)
returns uuid
language plpgsql security definer set search_path=public
as $$
declare b public.books%rowtype; cid uuid; allowed boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into b from public.books where id=p_book_id and is_published=true;
  if not found then raise exception 'Book unavailable'; end if;
  if b.seller_id=auth.uid() then raise exception 'Cannot contact yourself'; end if;
  select public.check_rate_limit('start_conversation',10,3600) into allowed;
  if not allowed then raise exception 'Too many conversation attempts'; end if;
  select id into cid from public.conversations where book_id=p_book_id and buyer_id=auth.uid() and seller_id=b.seller_id limit 1;
  if cid is not null then return cid; end if;
  insert into public.conversations(book_id,buyer_id,seller_id) values(p_book_id,auth.uid(),b.seller_id) returning id into cid;
  return cid;
end;$$;
grant execute on function public.start_conversation(uuid) to authenticated;
