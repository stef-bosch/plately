import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * Supabase client.
 *
 * Reads its config from public env vars (`EXPO_PUBLIC_*`, inlined by Expo at
 * build time). The anon key is safe to ship in the client — row-level security
 * in the database decides what can actually be read/written.
 *
 * When the env vars are absent the client is `null` and `isSupabaseConfigured`
 * is false; the content store then stays empty (no dishes/menus load), but the
 * app still runs without crashing.
 */

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        // The admin login lives on the web build; persist the session there.
        // On native there's no storage wired up yet (public app reads anon).
        persistSession: Platform.OS === 'web',
        autoRefreshToken: Platform.OS === 'web',
      },
    })
  : null;
