# Plately admin & backend setup (Supabase)

This sets up the database that powers the in-app admin. You do steps 1–5 once;
then I wire the app to read from it and build the `/admin` screens.

## 1. Create a Supabase project
- Go to https://supabase.com → sign up (free) → **New project**.
- Pick a name (e.g. `plately`), a strong database password, and a region close
  to you. Wait ~2 minutes for it to provision.

## 2. Create the tables
- In the project: **SQL Editor → New query**.
- Open `supabase/schema.sql` from this repo, copy everything, paste it, **Run**.
- You should see the `dishes` and `menus` tables under **Table Editor**.

## 3. Lock it down to just you
- **Authentication → Providers → Email**: keep it enabled.
- **Authentication → Sign In / Providers** (or **Settings**): turn **off**
  "Allow new users to sign up". This means no one can create an account.
- **Authentication → Users → Add user**: create your own admin user
  (your email + a password). This is the login you'll use in `/admin`.

## 4. Get your keys
- **Project Settings → API**. Copy:
  - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
  - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Both are public/safe to ship; row-level security protects the data.
- Do **not** share or ship the `service_role` key.

## 5. Tell the app the keys
- **Local development:** copy `.env.example` to `.env` and paste your values.
- **Production (Vercel):** Project → **Settings → Environment Variables** → add
  the same two `EXPO_PUBLIC_SUPABASE_*` vars → redeploy.

## 5b. Enable photo uploads (optional but recommended)
The dish form can upload a photo straight from your computer. That needs a
public storage bucket, created once:
- **SQL Editor → New query** → open `supabase/storage.sql`, copy everything,
  paste, **Run**. This creates a public `dish-images` bucket and its policies.
- After that, the "Foto uploaden…" button in the dish form works. Without the
  bucket you can still paste an image URL in the "Afbeelding-URL" field.

## 6. Hand back to me
Send me the **Project URL** and the **anon public key** (they're safe to share).
Then I'll:
- migrate the current recipes/menus into your Supabase tables,
- switch the app to read from Supabase (with a safe fallback to bundled data),
- build the `/admin` login + forms to add/edit dishes, menus and "Overig".
