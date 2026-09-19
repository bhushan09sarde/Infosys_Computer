-- Align manually-created study_materials tables with the canonical MIME values
-- used by 202608150001_study_materials.sql and the upload API.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint as con
    join pg_class as rel on rel.oid = con.conrelid
    join pg_namespace as nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'study_materials'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%file_type%'
  loop
    execute format(
      'alter table public.study_materials drop constraint %I',
      constraint_name
    );
  end loop;
end;
$$;

alter table public.study_materials
add constraint study_materials_file_type_check
check (file_type in (
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
));
