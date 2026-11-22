-- Rise Academy CRM database. Paste into Supabase → SQL Editor → Run, once, on a new project.

create table public.students (
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
create table public.enrollments (
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

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  amount integer not null check (amount > 0),
  paid_on date not null default current_date,
  for_month date,
  method text,
  note text,
  created_at timestamptz not null default now()
);

create index on public.enrollments (student_id);
create index on public.payments (enrollment_id);

-- Only logins listed here can see or change any data, even if someone else manages to create an account.
create table public.admins (
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

create policy "admins manage students" on public.students
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage enrollments" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage payments" on public.payments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- After creating your login in Authentication → Users, make it an admin (use your login email):
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
