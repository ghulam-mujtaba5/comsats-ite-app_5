-- Add status column to public.reviews to support moderation flows used by the app
-- Safe to run multiple times due to IF NOT EXISTS and null backfill guards

alter table public.reviews
  add column if not exists status text;

-- Set NOT NULL with default, but only after adding the column
alter table public.reviews
  alter column status set default 'approved';

-- Backfill existing rows to approved so they are visible publicly
update public.reviews
set status = coalesce(status, 'approved');

-- Enforce NOT NULL after backfill
alter table public.reviews
  alter column status set not null;

-- Helpful indexes
create index if not exists idx_reviews_status on public.reviews(status);
create index if not exists idx_reviews_faculty_status on public.reviews(faculty_id, status);


