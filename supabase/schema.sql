-- Rise Academy CRM database. Paste into Supabase → SQL Editor → Run.
-- Safe to run more than once: it only creates what is missing and never deletes data.

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  phone text not null,
  guardian_name text,
  class_level text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- One row per course a student takes; a student can take several.
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  category text not null,
  course text not null,
  fee_type text not null check (fee_type in ('monthly', 'course')),
  fee_amount integer not null check (fee_amount >= 0),
  due_day integer check (due_day between 1 and 28),
  next_due_on date,
  started_on date not null default current_date,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (fee_type <> 'monthly' or due_day is not null)
);

-- When a course stops. Monthly fees are not owed after this date.
alter table public.enrollments add column if not exists ended_on date;
-- Courses stopped before ended_on existed, and current courses of students already marked as left,
-- get today as their end date so their fees stop growing.
update public.enrollments set ended_on = current_date where active = false and ended_on is null;
update public.enrollments e set active = false, ended_on = current_date
  from public.students s
  where s.id = e.student_id and s.active = false and e.active;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  amount integer not null check (amount > 0),
  paid_on date not null default current_date,
  for_month date,
  method text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists enrollments_student_id_idx on public.enrollments (student_id);
create index if not exists payments_enrollment_id_idx on public.payments (enrollment_id);

-- Only logins listed here can see or change any data, even if someone else manages to create an account.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.students enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.admins enable row level security; -- no policies: nobody reads it directly, only is_admin()

-- Newer Supabase projects give no table access by default. Logged-in users get table access here;
-- the policies below still limit every row to admins. Logged-out visitors (anon) get nothing.
grant select, insert, update, delete on public.students, public.enrollments, public.payments to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins manage students" on public.students;
create policy "admins manage students" on public.students
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage enrollments" on public.enrollments;
create policy "admins manage enrollments" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage payments" on public.payments;
create policy "admins manage payments" on public.payments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- After creating your login in Authentication → Users, make it an admin (use your login email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
