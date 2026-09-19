-- Private student profile photos. Apply after the existing profiles migration.
-- Also aligns manually-created profiles tables with the current profile form.
alter table public.profiles
  add column if not exists course_interest text;

grant update (full_name, phone, avatar_url, course_interest)
on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Students read own profile photos" on storage.objects;
drop policy if exists "Students upload own profile photos" on storage.objects;
drop policy if exists "Students update own profile photos" on storage.objects;
drop policy if exists "Students delete own profile photos" on storage.objects;

create policy "Students read own profile photos"
on storage.objects for select to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'student'::public.app_role)
);

create policy "Students upload own profile photos"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'student'::public.app_role)
);

create policy "Students update own profile photos"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'student'::public.app_role)
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'student'::public.app_role)
);

create policy "Students delete own profile photos"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'student'::public.app_role)
);
