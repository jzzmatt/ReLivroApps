-- Browser push subscriptions. Endpoints stay private to the owner.
-- Reassignment of the same browser goes through save_push_subscription.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_idx on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "Users read their push subscriptions"
on public.push_subscriptions for select
using (auth.uid() = user_id);

create policy "Users delete their push subscriptions"
on public.push_subscriptions for delete
using (auth.uid() = user_id);

create or replace function public.save_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  if p_endpoint is null
    or p_endpoint !~ '^https://'
    or length(p_endpoint) > 2000
    or p_p256dh is null
    or length(p_p256dh) < 10
    or length(p_p256dh) > 300
    or p_auth is null
    or length(p_auth) < 4
    or length(p_auth) > 300
  then
    raise exception 'Invalid subscription';
  end if;

  delete from public.push_subscriptions where endpoint = p_endpoint;

  insert into public.push_subscriptions (user_id, endpoint, p256dh, auth)
  values (auth.uid(), p_endpoint, p_p256dh, p_auth);
end;
$$;

revoke all on function public.save_push_subscription(text, text, text) from public;
grant execute on function public.save_push_subscription(text, text, text) to authenticated;
