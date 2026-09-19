-- Minimum additional access required for the admin student directory.
drop policy if exists "Admins can read student profiles" on public.profiles;
create policy "Admins can read student profiles"
on public.profiles for select to authenticated
using ((select public.is_admin()));

