-- Create public.past_papers if it doesn't exist, matching fields used by the app
-- Safe to run multiple times

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

-- Helpful indexes
create index if not exists idx_papers_status on public.past_papers(status);
create index if not exists idx_papers_course on public.past_papers(course_code);
create index if not exists idx_papers_semester on public.past_papers(semester);
create index if not exists idx_papers_year on public.past_papers(year);
create index if not exists idx_papers_created_at on public.past_papers(created_at desc);
