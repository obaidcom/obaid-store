-- Obaid Store account profile enhancements
alter table public.profiles
  add column if not exists first_name text not null default '',
  add column if not exists last_name text not null default '',
  add column if not exists birth_date date,
  add column if not exists customer_code text;

update public.profiles
set customer_code = 'OB-' || upper(substr(replace(id::text, '-', ''), 1, 10))
where customer_code is null;

alter table public.profiles
  alter column customer_code set default ('OB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)));

create unique index if not exists profiles_customer_code_uidx
  on public.profiles(customer_code);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  category text not null default 'استفسار',
  subject text not null,
  message text not null,
  status text not null default 'open'
    check (status in ('open','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

drop policy if exists support_tickets_select_own on public.support_tickets;
create policy support_tickets_select_own
  on public.support_tickets for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists support_tickets_insert_own on public.support_tickets;
create policy support_tickets_insert_own
  on public.support_tickets for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists support_tickets_update_own on public.support_tickets;
create policy support_tickets_update_own
  on public.support_tickets for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.support_tickets to authenticated;
