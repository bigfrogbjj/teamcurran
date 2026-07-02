-- Run this in your Supabase SQL editor

create table public.members (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  belt text not null default 'white' check (belt in ('white','blue','purple','brown','black')),
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Allow members to read their own profile
alter table public.members enable row level security;

create policy "Members can read own profile"
  on public.members for select
  using (auth.uid() = id);

-- Allow service role full access (for admin operations)
create policy "Service role full access"
  on public.members for all
  using (true)
  with check (true);
