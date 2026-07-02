import { supabase } from '../lib/supabase';
import type { Menu, Recipe, ReactiveRecipe } from '../types';

/**
 * Admin write/read operations against Supabase. These require an authenticated
 * session (row-level security only allows signed-in users to write).
 */

export type DishKind = 'static' | 'reactive';

export interface DishRow {
  id: string;
  kind: DishKind;
  meal_type: string | null;
  title: string;
  data: Recipe | ReactiveRecipe;
  updated_at?: string;
}

function rowFor(dish: Recipe | ReactiveRecipe, kind: DishKind) {
  return {
    id: dish.id,
    kind,
    meal_type: dish.mealType ?? null,
    title: dish.title,
    data: dish,
  };
}

function client() {
  if (!supabase) {
    throw new Error('Supabase is niet geconfigureerd (env-variabelen ontbreken).');
  }
  return supabase;
}

export async function listDishes(): Promise<DishRow[]> {
  const { data, error } = await client()
    .from('dishes')
    .select('*')
    .order('meal_type', { ascending: true })
    .order('title', { ascending: true });
  if (error) throw error;
  return (data ?? []) as DishRow[];
}

export async function getDishRow(id: string): Promise<DishRow | null> {
  const { data, error } = await client()
    .from('dishes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as DishRow) ?? null;
}

export async function saveDish(
  dish: Recipe | ReactiveRecipe,
  kind: DishKind,
): Promise<void> {
  const { error } = await client().from('dishes').upsert(rowFor(dish, kind));
  if (error) throw error;
}

export async function deleteDish(id: string): Promise<void> {
  const { error } = await client().from('dishes').delete().eq('id', id);
  if (error) throw error;
}

/* ---------- Menus ---------- */

export interface MenuRow {
  id: string;
  title: string;
  data: Menu;
  updated_at?: string;
}

export async function listMenus(): Promise<MenuRow[]> {
  const { data, error } = await client()
    .from('menus')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error;
  return (data ?? []) as MenuRow[];
}

export async function getMenuRow(id: string): Promise<MenuRow | null> {
  const { data, error } = await client()
    .from('menus')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as MenuRow) ?? null;
}

export async function saveMenu(menu: Menu): Promise<void> {
  const { error } = await client()
    .from('menus')
    .upsert({ id: menu.id, title: menu.title, data: menu });
  if (error) throw error;
}

export async function deleteMenu(id: string): Promise<void> {
  const { error } = await client().from('menus').delete().eq('id', id);
  if (error) throw error;
}
