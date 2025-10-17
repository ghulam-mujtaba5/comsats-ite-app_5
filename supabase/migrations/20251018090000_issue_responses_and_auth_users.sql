-- Create issue_responses table
-- Use DO block to handle if table already exists
do $$ 
begin
  if not exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'issue_responses') then
    create table public.issue_responses (
      id uuid primary key default gen_random_uuid(),
      issue_id uuid not null,
      user_id uuid not null,
      message text not null,
      is_admin boolean not null default false,
      created_at timestamp with time zone not null default now()
    );
    
    -- Add foreign key constraint
    alter table public.issue_responses 
      add constraint fk_issue_responses_issue_id 
      foreign key (issue_id) 
      references public.issue_reports(id) 
      on delete cascade;
  end if;
end $$;

-- Enable RLS (safe to run multiple times)
do $$
begin
  alter table public.issue_responses enable row level security;
exception when others then null;
end $$;

-- RLS policies: owners (by issue) and admins can read/insert
-- Drop existing policies first to avoid conflicts
drop policy if exists issue_responses_select on public.issue_responses;
drop policy if exists issue_responses_insert on public.issue_responses;

-- Allow select for authenticated users who either own the related issue or are admins
create policy issue_responses_select on public.issue_responses
for select using (
  -- Owner: user_id matches auth.uid()
  auth.uid() = user_id
  OR exists (
    select 1 from public.issue_reports ir
    where ir.id = issue_id and ir.email = auth.email()
  )
  OR (
    -- Admin check: check admin_users table
    exists (
      select 1 from public.admin_users au
      where au.user_id = auth.uid() and au.role in ('admin','super_admin')
    )
  )
);

-- Allow insert for authenticated users who either own the related issue or are admins
create policy issue_responses_insert on public.issue_responses
for insert with check (
  (
    exists (
      select 1 from public.issue_reports ir
      where ir.id = issue_id and ir.email = auth.email()
    )
  )
  OR (
    exists (
      select 1 from public.admin_users au
      where au.user_id = auth.uid() and au.role in ('admin','super_admin')
    )
  )
);

-- Helpful indexes (create if not exists)
create index if not exists idx_issue_responses_issue_id on public.issue_responses(issue_id);
create index if not exists idx_issue_responses_user_id on public.issue_responses(user_id);
create index if not exists idx_issue_responses_created_at on public.issue_responses(created_at);

-- Minimal auth_users view for joins used by API (id, email)
create or replace view public.auth_users as
select u.id, u.email
from auth.users u;

grant usage on schema public to anon, authenticated;
grant select on public.auth_users to anon, authenticated;
