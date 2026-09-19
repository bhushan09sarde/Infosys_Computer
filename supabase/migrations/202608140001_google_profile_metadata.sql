-- Google OAuth metadata support for projects that already ran Phase 1.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, avatar_url, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Student'),
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), nullif(new.raw_user_meta_data ->> 'picture', '')),
    'student'::public.app_role
  );
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Trusted migration backfill. This operation is never exposed through the browser.
insert into public.profiles (id, full_name, email, phone, avatar_url, role)
select
  users.id,
  coalesce(nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''), nullif(trim(users.raw_user_meta_data ->> 'name'), ''), 'Student'),
  coalesce(users.email, ''),
  nullif(trim(users.raw_user_meta_data ->> 'phone'), ''),
  coalesce(nullif(users.raw_user_meta_data ->> 'avatar_url', ''), nullif(users.raw_user_meta_data ->> 'picture', '')),
  'student'::public.app_role
from auth.users as users
where not exists (select 1 from public.profiles where profiles.id = users.id);
