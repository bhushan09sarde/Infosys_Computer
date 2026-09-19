-- Restore private read access for published student materials on projects where
-- the study-materials table/bucket were created manually.
drop policy if exists "Students read published material files" on storage.objects;
drop policy if exists "Admins read all material files" on storage.objects;

create policy "Students read published material files"
on storage.objects for select to authenticated
using (
  bucket_id = 'study-materials'
  and exists (
    select 1
    from public.study_materials
    where study_materials.file_path = storage.objects.name
      and study_materials.is_published = true
  )
);

create policy "Admins read all material files"
on storage.objects for select to authenticated
using (
  bucket_id = 'study-materials'
  and (select public.is_admin())
);
