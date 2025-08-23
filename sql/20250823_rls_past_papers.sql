-- Enable RLS for public.past_papers and add minimal safe policies
-- Safe to run multiple times

-- Ensure table exists
create table if not exists public.past_papers (
  id uuid not null default gen_random_uuid() primary key,
  title text,
  course_code text,
  exam_type text,
  semester text,
  year integer,
  tags text[] default '{}',
  download_url text,
  file_url text,
  department text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.past_papers enable row level security;

-- Public can read only approved past papers
drop policy if exists "public read approved papers" on public.past_papers;
create policy "public read approved papers"
  on public.past_papers
  for select
  to anon, authenticated
  using (status = 'approved');

-- Inserts are done by service role (our server upload route)
drop policy if exists "insert via service role only (past_papers)" on public.past_papers;
create policy "insert via service role only (past_papers)"
  on public.past_papers
  for insert
  to service_role
  with check (true);

-- Admins can moderate (update status)
drop policy if exists "admin moderate past papers" on public.past_papers;
create policy "admin moderate past papers"
  on public.past_papers
  for update
  to authenticated
  using (auth.jwt() ->> 'role' in ('admin','super_admin'))
  with check (auth.jwt() ->> 'role' in ('admin','super_admin'));

-- Helpful indexes
create index if not exists idx_papers_status on public.past_papers(status);
create index if not exists idx_papers_course on public.past_papers(course_code);
create index if not exists idx_papers_created_at on public.past_papers(created_at desc);
