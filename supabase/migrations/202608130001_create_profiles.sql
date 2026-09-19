-- Phase 1 student profiles. Public registration can never select or update role.
create type public.app_role as enum ('student', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  email text not null,
  role public.app_role not null default 'student',
  phone text,
  avatar_url text,
  course_interest text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, phone, avatar_url, course_interest) on table public.profiles to authenticated;

create policy "Students can read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Students can update their own allowed profile fields"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Student'),
    coalesce(new.email, ''),
    nullif(trim(new.raw_user_meta_data ->> 'phone'), ''),
    'student'::public.app_role
  );
  update public.profiles
  set avatar_url = coalesce(nullif(new.raw_user_meta_data ->> 'avatar_url', ''), nullif(new.raw_user_meta_data ->> 'picture', ''))
  where id = new.id;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

comment on column public.profiles.role is 'Assigned by trusted database/admin operations only; never from public signup metadata.';
