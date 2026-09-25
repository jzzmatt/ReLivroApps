-- Phase 8: admin, moderation and analytics

alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user','moderator','admin'));

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_logs_created_idx on public.admin_audit_logs(created_at desc);
create index admin_audit_logs_admin_idx on public.admin_audit_logs(admin_id,created_at desc);

alter table public.admin_audit_logs enable row level security;

create or replace function public.is_admin_or_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin','moderator')
  );
$$;

grant execute on function public.is_admin_or_moderator() to authenticated;

create policy "Admins can view all profiles"
on public.profiles for select
using (auth.uid() = id or public.is_admin_or_moderator());

create policy "Admins can view all books"
on public.books for select
using (is_published = true or auth.uid() = seller_id or public.is_admin_or_moderator());

create policy "Admins can moderate books"
on public.books for update
using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

create policy "Admins can view reports"
on public.listing_reports for select
using (auth.uid() = reporter_id or public.is_admin_or_moderator());

create policy "Admins can update reports"
on public.listing_reports for update
using (public.is_admin_or_moderator())
with check (public.is_admin_or_moderator());

create policy "Admins can create audit logs"
on public.admin_audit_logs for insert
with check (auth.uid() = admin_id and public.is_admin_or_moderator());

create policy "Admins can view audit logs"
on public.admin_audit_logs for select
using (public.is_admin_or_moderator());

create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_admin_or_moderator() then
    raise exception 'Admin access required';
  end if;

  select jsonb_build_object(
    'users',(select count(*) from public.profiles),
    'books',(select count(*) from public.books),
    'published_books',(select count(*) from public.books where is_published=true),
    'sold_books',(select count(*) from public.books where status='sold'),
    'exchanged_books',(select count(*) from public.books where status='exchanged'),
    'views',(select count(*) from public.book_views),
    'conversations',(select count(*) from public.conversations),
    'reports',(select count(*) from public.listing_reports)
  ) into result;

  return result;
end;
$$;

grant execute on function public.admin_dashboard_stats() to authenticated;

create or replace function public.admin_moderate_book(p_book_id uuid,p_published boolean,p_reason text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_or_moderator() then
    raise exception 'Admin access required';
  end if;

  update public.books
  set is_published = p_published
  where id = p_book_id;

  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,details)
  values(auth.uid(),case when p_published then 'publish_listing' else 'pause_listing' end,'book',p_book_id,jsonb_build_object('reason',p_reason));
end;
$$;

grant execute on function public.admin_moderate_book(uuid,boolean,text) to authenticated;

create or replace function public.admin_resolve_report(p_report_id uuid,p_status text,p_note text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_or_moderator() then
    raise exception 'Admin access required';
  end if;

  update public.listing_reports
  set details = coalesce(details,'') || case when p_note is null then '' else E'\nAdmin: '||p_note end
  where id=p_report_id;

  insert into public.admin_audit_logs(admin_id,action,entity_type,entity_id,details)
  values(auth.uid(),'resolve_report','listing_report',p_report_id,jsonb_build_object('status',p_status,'note',p_note));
end;
$$;

grant execute on function public.admin_resolve_report(uuid,text,text) to authenticated;
