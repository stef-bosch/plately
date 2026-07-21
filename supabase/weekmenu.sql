-- Plately: hand-built week menus.
-- Run once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
--
-- A row is one ISO week (id = "2026-W30") holding the dish id per day and meal
-- slot in a JSONB `days` object. Weeks without a row fall back to the app's
-- automatically generated week menu.

create table if not exists public.week_menus (
  id          text primary key,
  year        int  not null,
  week        int  not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table public.week_menus enable row level security;

-- Everyone (the public app using the anon key) may READ.
drop policy if exists "week_menus readable by everyone" on public.week_menus;
create policy "week_menus readable by everyone"
  on public.week_menus for select using (true);

-- Only signed-in users (you, the admin) may INSERT/UPDATE/DELETE.
drop policy if exists "week_menus writable by authenticated" on public.week_menus;
create policy "week_menus writable by authenticated"
  on public.week_menus for all
  to authenticated
  using (true) with check (true);

drop trigger if exists week_menus_touch on public.week_menus;
create trigger week_menus_touch before update on public.week_menus
  for each row execute function public.touch_updated_at();
