-- Run this in the Team Curran Supabase SQL editor

-- Add flags to existing members table
alter table public.members add column if not exists is_admin boolean not null default false;
alter table public.members add column if not exists is_tc_member boolean not null default false;

-- TC Posts: newsletters and announcements
create table if not exists public.tc_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  body text not null,
  is_members_only boolean not null default true,
  published_at timestamptz,
  created_at timestamptz default now()
);

alter table public.tc_posts enable row level security;

create policy "Authenticated users can read published posts"
  on public.tc_posts for select
  using (
    published_at is not null
    and published_at <= now()
    and (is_members_only = false or auth.uid() is not null)
  );

create policy "Service role full access on posts"
  on public.tc_posts for all
  using (true) with check (true);

-- TC Events: team_curran | public | all_access visibility
create table if not exists public.tc_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date date not null,
  event_time text,
  location text,
  visibility text not null default 'team_curran'
    check (visibility in ('team_curran', 'public')),
  created_at timestamptz default now()
);

alter table public.tc_events enable row level security;

-- Public events visible to everyone (main site)
create policy "Public events are visible to all"
  on public.tc_events for select
  using (visibility = 'public');

-- Members see all events (team_curran + public)
create policy "Members see all events"
  on public.tc_events for select
  using (auth.uid() is not null);

create policy "Service role full access on events"
  on public.tc_events for all
  using (true) with check (true);

-- Grant your admin member is_admin = true:
-- update public.members set is_admin = true where email = 'chuck@teamcurran.com';
