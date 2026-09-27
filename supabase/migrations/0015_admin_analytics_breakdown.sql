-- Staff-only aggregates for the last 7 days. No user identities.

create or replace function public.admin_analytics_breakdown()
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
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('name', event_name, 'events', events) order by events desc)
      from (
        select event_name, count(*)::int as events
        from public.analytics_events
        where created_at >= now() - interval '7 days'
        group by event_name
        order by count(*) desc
        limit 8
      ) named
    ), '[]'::jsonb),
    'paths', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'events', events) order by events desc)
      from (
        select path, count(*)::int as events
        from public.analytics_events
        where created_at >= now() - interval '7 days'
          and path is not null
          and length(path) > 0
        group by path
        order by count(*) desc
        limit 8
      ) ranked
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_analytics_breakdown() from public;
grant execute on function public.admin_analytics_breakdown() to authenticated;
