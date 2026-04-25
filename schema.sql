-- Supabase MVP schema for Lost & Found Portal
-- Includes: users, items, claims

create extension if not exists pgcrypto;

-- RLS helpers (for Clerk JWT integration)
-- We expect Clerk JWT template to set `sub` to the Clerk userId.
create or replace function public.current_clerk_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '');
$$;

-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  name text not null,
  email text not null unique,
  role text not null default 'student' check (role in ('student', 'finder', 'admin')),
  created_at timestamptz not null default now()
);

-- ITEMS
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('lost', 'found')),
  title text not null,
  category text not null,
  color text,
  description text not null,
  location text,
  date_lost date,
  date_found date,
  image_url text,
  status text not null default 'open' check (status in ('open', 'claimed', 'returned')),
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- CLAIMS
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  claimer_id uuid not null references public.users(id) on delete cascade,
  message text,
  proof text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('claim_approved', 'claim_rejected', 'item_returned', 'item_match', 'claim_received')),
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Ensure existing databases also accept the new notification type.
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('claim_approved', 'claim_rejected', 'item_returned', 'item_match', 'claim_received'));

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.items enable row level security;
alter table public.claims enable row level security;
alter table public.notifications enable row level security;

-- USERS policies
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users for select
using (clerk_id = public.current_clerk_id());

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
on public.users for insert
with check (clerk_id = public.current_clerk_id());

drop policy if exists "users_update_own_profile" on public.users;
create policy "users_update_own_profile"
on public.users for update
using (clerk_id = public.current_clerk_id())
with check (clerk_id = public.current_clerk_id());

-- ITEMS policies
drop policy if exists "items_select_open_found_public" on public.items;
create policy "items_select_open_found_public"
on public.items for select
using (type = 'found' and status = 'open');

drop policy if exists "items_select_own" on public.items;
create policy "items_select_own"
on public.items for select
using (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "items_insert_own" on public.items;
create policy "items_insert_own"
on public.items for insert
with check (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "items_update_own" on public.items;
create policy "items_update_own"
on public.items for update
using (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
)
with check (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "items_delete_own" on public.items;
create policy "items_delete_own"
on public.items for delete
using (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

-- CLAIMS policies
drop policy if exists "claims_select_own" on public.claims;
create policy "claims_select_own"
on public.claims for select
using (
  claimer_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "claims_insert_own" on public.claims;
create policy "claims_insert_own"
on public.claims for insert
with check (
  claimer_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "claims_update_own" on public.claims;
create policy "claims_update_own"
on public.claims for update
using (
  claimer_id in (select id from public.users where clerk_id = public.current_clerk_id())
)
with check (
  claimer_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

-- NOTIFICATIONS policies
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
on public.notifications for select
using (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
on public.notifications for update
using (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
)
with check (
  user_id in (select id from public.users where clerk_id = public.current_clerk_id())
);

-- Helpful indexes for MVP query patterns
create index if not exists idx_items_user_id on public.items(user_id);
create index if not exists idx_items_type_status on public.items(type, status);
create index if not exists idx_claims_item_id on public.claims(item_id);
create index if not exists idx_claims_claimer_id on public.claims(claimer_id);
create index if not exists idx_notifications_user_created_at on public.notifications(user_id, created_at desc);
create index if not exists idx_notifications_user_read_at on public.notifications(user_id, read_at);
