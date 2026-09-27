-- Staff-only school verification. Members cannot set the stamp themselves.
-- Changing the school name clears it.

alter table public.profiles
  add column if not exists school_verified_at timestamptz;

create or replace function public.protect_school_verification()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  staff boolean;
begin
  staff := public.is_admin_or_moderator();
  if staff then
    if new.school is null or btrim(new.school) = '' then
      new.school_verified_at := null;
    end if;
    return new;
  end if;

  new.school_verified_at := old.school_verified_at;
  if btrim(coalesce(new.school, '')) is distinct from btrim(coalesce(old.school, '')) then
    new.school_verified_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_school_verification on public.profiles;

create trigger profiles_protect_school_verification
before update on public.profiles
for each row
execute procedure public.protect_school_verification();

create or replace function public.set_school_verification(target_id uuid, verified boolean)
returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  stamp timestamptz;
  school_name text;
begin
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Admin access required';
  end if;

  select btrim(school) into school_name
  from public.profiles
  where id = target_id;

  if school_name is null or school_name = '' then
    raise exception 'School name required';
  end if;

  stamp := case when verified then now() else null end;

  update public.profiles
  set school_verified_at = stamp
  where id = target_id;

  insert into public.admin_audit_logs (admin_id, action, entity_type, entity_id, details)
  values (
    auth.uid(),
    case when verified then 'verify_school' else 'clear_school_verification' end,
    'profile',
    target_id,
    jsonb_build_object('school', school_name)
  );

  return stamp;
end;
$$;

revoke all on function public.protect_school_verification() from public, anon, authenticated;
revoke all on function public.set_school_verification(uuid, boolean) from public;
grant execute on function public.set_school_verification(uuid, boolean) to authenticated;
