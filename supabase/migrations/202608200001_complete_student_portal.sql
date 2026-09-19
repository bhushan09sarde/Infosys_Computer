-- Final student portal data model. Run after the profile and study-material migrations.
create table if not exists public.student_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  course_code text not null check (char_length(trim(course_code)) between 1 and 80),
  course_name text not null check (char_length(trim(course_name)) between 1 and 160),
  course_category text check (course_category is null or char_length(trim(course_category)) between 1 and 120),
  status text not null default 'active' check (status in ('active', 'completed', 'paused', 'cancelled')),
  enrolled_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_id, course_code)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  content text not null check (char_length(trim(content)) between 1 and 5000),
  created_by uuid references auth.users(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (expires_at is null or published_at is null or expires_at > published_at)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 1 and 180),
  description text check (description is null or char_length(description) <= 5000),
  event_date date not null,
  start_time time,
  end_time time,
  location text check (location is null or char_length(trim(location)) between 1 and 240),
  created_by uuid references auth.users(id) on delete set null,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (end_time is null or start_time is null or end_time > start_time)
);

alter table public.student_enrollments enable row level security;
alter table public.student_enrollments force row level security;
alter table public.announcements enable row level security;
alter table public.announcements force row level security;
alter table public.events enable row level security;
alter table public.events force row level security;

grant select, insert, update, delete on public.student_enrollments to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
grant select, insert, update, delete on public.events to authenticated;

drop policy if exists "Students read own enrollments" on public.student_enrollments;
drop policy if exists "Admins manage enrollments" on public.student_enrollments;
create policy "Students read own enrollments" on public.student_enrollments
for select to authenticated using (student_id = (select auth.uid()));
create policy "Admins manage enrollments" on public.student_enrollments
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Students read current announcements" on public.announcements;
drop policy if exists "Admins manage announcements" on public.announcements;
create policy "Students read current announcements" on public.announcements
for select to authenticated using (
  is_published = true
  and published_at is not null
  and published_at <= timezone('utc', now())
  and (expires_at is null or expires_at > timezone('utc', now()))
);
create policy "Admins manage announcements" on public.announcements
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Students read published events" on public.events;
drop policy if exists "Admins manage events" on public.events;
create policy "Students read published events" on public.events
for select to authenticated using (is_published = true);
create policy "Admins manage events" on public.events
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop trigger if exists student_enrollments_set_updated_at on public.student_enrollments;
create trigger student_enrollments_set_updated_at before update on public.student_enrollments
for each row execute function public.set_updated_at();
drop trigger if exists announcements_set_updated_at on public.announcements;
create trigger announcements_set_updated_at before update on public.announcements
for each row execute function public.set_updated_at();
drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();

create index if not exists student_enrollments_student_id_idx on public.student_enrollments(student_id, enrolled_at desc);
create index if not exists announcements_current_idx on public.announcements(is_published, published_at desc);
create index if not exists events_published_date_idx on public.events(is_published, event_date);

