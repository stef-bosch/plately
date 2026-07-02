-- Storage setup for dish photos.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL). It creates a
-- public bucket `dish-images` and lets signed-in admins upload/replace files
-- while everyone can read them (so the app can show the photos).

insert into storage.buckets (id, name, public)
values ('dish-images', 'dish-images', true)
on conflict (id) do update set public = true;

-- Public read of the images (needed for the app to load them).
drop policy if exists "dish-images public read" on storage.objects;
create policy "dish-images public read"
  on storage.objects for select
  using (bucket_id = 'dish-images');

-- Signed-in admins may upload new images.
drop policy if exists "dish-images auth insert" on storage.objects;
create policy "dish-images auth insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'dish-images');

-- Signed-in admins may overwrite/replace images.
drop policy if exists "dish-images auth update" on storage.objects;
create policy "dish-images auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'dish-images')
  with check (bucket_id = 'dish-images');

-- Signed-in admins may delete images.
drop policy if exists "dish-images auth delete" on storage.objects;
create policy "dish-images auth delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'dish-images');
