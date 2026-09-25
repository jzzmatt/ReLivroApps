-- Phase 9.5: privacy-conscious product analytics
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  event_name text not null,
  path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_name_created_idx on public.analytics_events(event_name,created_at desc);
create index if not exists analytics_events_user_idx on public.analytics_events(user_id,created_at desc);
alter table public.analytics_events enable row level security;

create policy "Users can insert analytics events"
on public.analytics_events for insert
to anon, authenticated
with check (user_id is null or user_id=auth.uid());

create or replace function public.record_analytics_event(
  p_event_name text,
  p_path text default null,
  p_session_id text default null,
  p_metadata jsonb default '{}'::jsonb
) returns uuid
language plpgsql security definer set search_path=public
as $$
declare event_id uuid;
begin
  if length(trim(coalesce(p_event_name,''))) < 2 or length(p_event_name)>80 then
    raise exception 'Invalid event name';
  end if;
  if p_path is not null and length(p_path)>500 then raise exception 'Invalid path'; end if;
  if p_session_id is not null and length(p_session_id)>120 then raise exception 'Invalid session'; end if;
  insert into public.analytics_events(user_id,session_id,event_name,path,metadata)
  values(auth.uid(),p_session_id,trim(p_event_name),p_path,coalesce(p_metadata,'{}'::jsonb))
  returning id into event_id;
  return event_id;
end;$$;
grant execute on function public.record_analytics_event(text,text,text,jsonb) to anon,authenticated;

create or replace view public.admin_analytics_daily as
select date_trunc('day',created_at)::date as day,
       event_name,
       count(*)::bigint as events,
       count(distinct user_id)::bigint as users
from public.analytics_events
group by 1,2
order by 1 desc,event_name;

create or replace view public.admin_analytics_summary as
select
  count(*)::bigint as total_events,
  count(distinct user_id)::bigint as identified_users,
  count(distinct session_id)::bigint as sessions,
  count(*) filter (where created_at>=now()-interval '24 hours')::bigint as events_24h,
  count(*) filter (where created_at>=now()-interval '7 days')::bigint as events_7d,
  count(*) filter (where created_at>=now()-interval '30 days')::bigint as events_30d
from public.analytics_events;
