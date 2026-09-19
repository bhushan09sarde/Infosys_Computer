-- Private study-materials catalogue and object access policies.
create table public.study_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text check (description is null or char_length(description) <= 2000),
  course text not null check (char_length(trim(course)) between 1 and 120),
  category text check (category is null or char_length(trim(category)) between 1 and 120),
  file_name text not null check (char_length(trim(file_name)) between 1 and 255),
  file_path text not null unique check (file_path !~ '(^|/)\.\.(/|$)' and file_path !~ '^/'),
  file_type text not null check (file_type in (
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )),
  file_size bigint check (file_size is null or file_size between 1 and 26214400),
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  uploaded_by uuid references auth.users(id) on delete set null
);

alter table public.study_materials enable row level security;
alter table public.study_materials force row level security;

grant select on public.study_materials to authenticated;
grant insert, update, delete on public.study_materials to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'::public.app_role
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "Students read published study materials"
on public.study_materials for select to authenticated
using (is_published or (select public.is_admin()));

create policy "Admins insert study materials"
on public.study_materials for insert to authenticated
with check ((select public.is_admin()) and uploaded_by = (select auth.uid()));

create policy "Admins update study materials"
on public.study_materials for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins delete study materials"
on public.study_materials for delete to authenticated
using ((select public.is_admin()));

create trigger study_materials_set_updated_at
before update on public.study_materials
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-materials',
  'study-materials',
  false,
  26214400,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Students read published material files"
on storage.objects for select to authenticated
using (
  bucket_id = 'study-materials'
  and exists (
    select 1 from public.study_materials
    where study_materials.file_path = storage.objects.name
      and study_materials.is_published = true
  )
);

create policy "Admins read all material files"
on storage.objects for select to authenticated
using (bucket_id = 'study-materials' and (select public.is_admin()));

create policy "Admins upload material files"
on storage.objects for insert to authenticated
with check (bucket_id = 'study-materials' and (select public.is_admin()));

create policy "Admins update material files"
on storage.objects for update to authenticated
using (bucket_id = 'study-materials' and (select public.is_admin()))
with check (bucket_id = 'study-materials' and (select public.is_admin()));

create policy "Admins delete material files"
on storage.objects for delete to authenticated
using (bucket_id = 'study-materials' and (select public.is_admin()));
