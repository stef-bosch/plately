-- Plately content schema.
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run.
--
-- Dishes (recipes) and menus are stored with their full app object in a JSONB
-- `data` column, matching the app's Recipe / ReactiveRecipe / Menu types. A few
-- columns are mirrored out of the JSON for easy listing/filtering in the admin.

-- ---------- Tables ----------

create table if not exists public.dishes (
  id          text primary key,
  kind        text not null default 'static' check (kind in ('static', 'reactive')),
  meal_type   text,
  title       text not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.menus (
  id          text primary key,
  title       text not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ---------- Row level security ----------

alter table public.dishes enable row level security;
alter table public.menus  enable row level security;

-- Everyone (including the public app using the anon key) may READ.
drop policy if exists "dishes readable by everyone" on public.dishes;
create policy "dishes readable by everyone"
  on public.dishes for select using (true);

drop policy if exists "menus readable by everyone" on public.menus;
create policy "menus readable by everyone"
  on public.menus for select using (true);

-- Only signed-in users (you, the admin) may INSERT/UPDATE/DELETE.
-- Combined with "disable public sign-ups" in Auth settings + a single admin
-- user, this means only you can edit content.
drop policy if exists "dishes writable by authenticated" on public.dishes;
create policy "dishes writable by authenticated"
  on public.dishes for all
  to authenticated
  using (true) with check (true);

drop policy if exists "menus writable by authenticated" on public.menus;
create policy "menus writable by authenticated"
  on public.menus for all
  to authenticated
  using (true) with check (true);

-- Keep updated_at fresh on every write.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dishes_touch on public.dishes;
create trigger dishes_touch before update on public.dishes
  for each row execute function public.touch_updated_at();

drop trigger if exists menus_touch on public.menus;
create trigger menus_touch before update on public.menus
  for each row execute function public.touch_updated_at();
