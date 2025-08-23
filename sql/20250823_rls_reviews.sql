-- Enable RLS and policies for public.reviews
-- Safe to run multiple times

-- Ensure status column exists
alter table public.reviews
  add column if not exists status text;

alter table public.reviews
  alter column status set default 'approved';

update public.reviews
set status = coalesce(status, 'approved');

alter table public.reviews
  alter column status set not null;

-- Enable RLS
alter table public.reviews enable row level security;

-- Public can read only approved reviews
drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews"
  on public.reviews
  for select
  to anon, authenticated
  using (status = 'approved');

-- Insert via service role (API server)
drop policy if exists "insert via service role only (reviews)" on public.reviews;
create policy "insert via service role only (reviews)"
  on public.reviews
  for insert
  to service_role
  with check (true);

-- Admins can moderate (update status)
-- Adjust this to your JWT/role setup if needed
drop policy if exists "admin moderate reviews" on public.reviews;
create policy "admin moderate reviews"
  on public.reviews
  for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin' or auth.jwt() ->> 'role' = 'super_admin')
  with check (auth.jwt() ->> 'role' = 'admin' or auth.jwt() ->> 'role' = 'super_admin');

-- Helpful indexes
create index if not exists idx_reviews_status on public.reviews(status);
create index if not exists idx_reviews_faculty_status on public.reviews(faculty_id, status);
