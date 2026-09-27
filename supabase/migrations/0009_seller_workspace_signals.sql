-- Seller workspace aggregates. Returns counts and recent favourite events
-- without exposing who favourited a listing.

create or replace function public.seller_workspace_signals()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return jsonb_build_object(
      'favorite_total', 0,
      'visitor_total', 0,
      'by_book', '[]'::jsonb,
      'recent_favorites', '[]'::jsonb
    );
  end if;

  return jsonb_build_object(
    'favorite_total',
    (
      select count(*)::int
      from public.favorites f
      join public.books b on b.id = f.book_id
      where b.seller_id = uid
    ),
    'visitor_total',
    (
      select count(*)::int
      from public.book_views v
      join public.books b on b.id = v.book_id
      where b.seller_id = uid
    ),
    'by_book',
    coalesce((
      select jsonb_agg(jsonb_build_object(
        'book_id', s.book_id,
        'favorite_count', s.favorite_count
      ))
      from (
        select f.book_id, count(*)::int as favorite_count
        from public.favorites f
        join public.books b on b.id = f.book_id
        where b.seller_id = uid
        group by f.book_id
      ) s
    ), '[]'::jsonb),
    'recent_favorites',
    coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'book_id', r.book_id,
          'title', r.title,
          'created_at', r.created_at
        )
        order by r.created_at desc
      )
      from (
        select f.book_id, b.title, f.created_at
        from public.favorites f
        join public.books b on b.id = f.book_id
        where b.seller_id = uid
        order by f.created_at desc
        limit 8
      ) r
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.seller_workspace_signals() from public;
grant execute on function public.seller_workspace_signals() to authenticated;
