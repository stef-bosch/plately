import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  deleteDish,
  deleteMenu,
  listDishes,
  listMenus,
  type DishRow,
  type MenuRow,
} from '../data/adminApi';
import { PlatelyLogo } from '../components/BrandIcons';
import { mealTypeLabel } from '../constants/labels';
import { reloadContent } from '../data/content';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { MealType } from '../types';
import { DishForm } from './DishForm';
import { MenuForm } from './MenuForm';

async function confirmAsync(message: string): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.confirm(message);
  return true;
}

type Tab = 'dishes' | 'overig' | 'menus';
type FormState =
  | { kind: 'dish'; id?: string; overig?: boolean }
  | { kind: 'menu'; id?: string }
  | null;

// A dish belongs to the "Overig" tab when it has a free-text overig category.
const overigCategoryOf = (row: DishRow): string =>
  ((row.data as { overigCategory?: string })?.overigCategory ?? '').trim();
const isOverigRow = (row: DishRow): boolean => overigCategoryOf(row) !== '';
const overigLabel = (row: DishRow): string => overigCategoryOf(row) || 'Overig';

// Order used to group the Gerechten list by meal type.
const MEAL_ORDER: MealType[] = ['ontbijt', 'lunch', 'diner', 'tussendoortje'];

export function AdminApp() {
  const { session, ready } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.container}>
          {!ready ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
          ) : session ? (
            <Dashboard email={session.user.email ?? ''} />
          ) : (
            <LoginForm />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    if (!supabase) return setError('Supabase is niet geconfigureerd.');
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (err) setError(err.message);
  };

  return (
    <View style={styles.loginWrap}>
      <PlatelyLogo width={150} color={colors.primary} />
      <Text style={styles.title}>Beheer</Text>
      <Text style={styles.subtitle}>Log in om de inhoud te beheren.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="jij@voorbeeld.nl" placeholderTextColor={colors.textMuted} style={styles.input} />
        <Text style={styles.label}>Wachtwoord</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" placeholderTextColor={colors.textMuted} style={styles.input} onSubmitEditing={signIn} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={signIn} disabled={busy} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, busy && styles.disabled]}>
          {busy ? <ActivityIndicator size="small" color={colors.textOnPrimary} /> : <Text style={styles.primaryButtonText}>Inloggen</Text>}
        </Pressable>
      </View>
    </View>
  );
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>('dishes');
  const [form, setForm] = useState<FormState>(null);
  const [dishes, setDishes] = useState<DishRow[]>([]);
  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyMsg, setBusyMsg] = useState<string | null>(null);
  // Which meal-type groups in the Gerechten list are collapsed.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [d, m] = await Promise.all([listDishes(), listMenus()]);
      setDishes(d);
      setMenus(m);
    } catch (e) {
      setBusyMsg(`Laden mislukt: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeDish = async (row: DishRow) => {
    if (!(await confirmAsync(`"${row.title}" verwijderen?`))) return;
    await deleteDish(row.id);
    await reloadContent();
    refresh();
  };

  const removeMenu = async (row: MenuRow) => {
    if (!(await confirmAsync(`"${row.title}" verwijderen?`))) return;
    await deleteMenu(row.id);
    await reloadContent();
    refresh();
  };

  const onFormDone = () => {
    setForm(null);
    refresh();
  };

  if (form?.kind === 'dish') {
    return (
      <DishForm
        dishId={form.id}
        overig={form.overig}
        onSaved={onFormDone}
        onCancel={() => setForm(null)}
      />
    );
  }
  if (form?.kind === 'menu') {
    return <MenuForm menuId={form.id} onSaved={onFormDone} onCancel={() => setForm(null)} />;
  }

  const normalDishes = dishes.filter((r) => !isOverigRow(r));
  const overigDishes = dishes.filter(isOverigRow);

  const renderDishCard = (row: DishRow, isOverigList: boolean) => (
    <View key={row.id} style={styles.itemCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle} numberOfLines={1}>{row.title}</Text>
        <Text style={styles.itemMeta}>
          {isOverigList
            ? overigLabel(row)
            : row.kind === 'reactive' ? 'energie-varianten' : 'enkel'}
        </Text>
      </View>
      <Pressable onPress={() => setForm({ kind: 'dish', id: row.id, overig: isOverigList })} style={styles.iconButton}>
        <Ionicons name="create-outline" size={20} color={colors.primary} />
      </Pressable>
      <Pressable onPress={() => removeDish(row)} style={styles.iconButton}>
        <Ionicons name="trash-outline" size={20} color={colors.fat} />
      </Pressable>
    </View>
  );

  const renderMealGroups = (rows: DishRow[]) => {
    const known = new Set<string>(MEAL_ORDER);
    const groups = MEAL_ORDER.map((mt) => ({
      key: mt,
      label: mealTypeLabel[mt],
      rows: rows.filter((r) => r.meal_type === mt),
    }));
    const leftover = rows.filter((r) => !known.has(r.meal_type ?? ''));
    if (leftover.length) groups.push({ key: 'overig' as MealType, label: 'Overig', rows: leftover });
    return groups
      .filter((g) => g.rows.length > 0)
      .map((g) => {
        const isCollapsed = collapsed[g.key];
        return (
          <View key={g.key} style={styles.mealGroup}>
            <Pressable
              onPress={() => setCollapsed((p) => ({ ...p, [g.key]: !p[g.key] }))}
              style={({ pressed }) => [styles.mealGroupHeader, pressed && styles.pressed]}
            >
              <Ionicons
                name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.mealGroupTitle}>{g.label} ({g.rows.length})</Text>
            </Pressable>
            {isCollapsed ? null : (
              <View style={styles.grid}>{g.rows.map((r) => renderDishCard(r, false))}</View>
            )}
          </View>
        );
      });
  };

  const renderDishList = (rows: DishRow[], title: string, isOverigList: boolean) => (
    <>
      <View style={styles.listHeader}>
        <Text style={styles.h2}>{title} ({rows.length})</Text>
        <Pressable onPress={() => setForm({ kind: 'dish', overig: isOverigList })} style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
          <Ionicons name="add" size={18} color={colors.textOnPrimary} />
          <Text style={styles.newButtonText}>Nieuw</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : rows.length === 0 ? (
        <Text style={styles.empty}>
          {isOverigList
            ? 'Nog geen overige items (cocktails/sauzen). Voeg er een toe.'
            : 'Nog geen gerechten. Voeg er een toe.'}
        </Text>
      ) : isOverigList ? (
        <View style={styles.grid}>{rows.map((r) => renderDishCard(r, true))}</View>
      ) : (
        <View style={styles.mealGroups}>{renderMealGroups(rows)}</View>
      )}
    </>
  );

  return (
    <View style={styles.dashboard}>
      <View style={styles.topbar}>
        <View style={styles.brandBlock}>
          <PlatelyLogo width={120} color={colors.primary} />
          <Text style={styles.subtitle}>Beheer · {email}</Text>
        </View>
        <Pressable onPress={() => supabase?.auth.signOut()} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Text style={styles.ghostText}>Uitloggen</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <TabButton label="Gerechten" active={tab === 'dishes'} onPress={() => setTab('dishes')} />
        <TabButton label="Overig" active={tab === 'overig'} onPress={() => setTab('overig')} />
        <TabButton label="Menu's" active={tab === 'menus'} onPress={() => setTab('menus')} />
      </View>

      {busyMsg ? <Text style={styles.message}>{busyMsg}</Text> : null}

      {tab === 'dishes' ? (
        renderDishList(normalDishes, 'Gerechten', false)
      ) : tab === 'overig' ? (
        renderDishList(overigDishes, 'Overig', true)
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.h2}>Menu's ({menus.length})</Text>
            <Pressable onPress={() => setForm({ kind: 'menu' })} style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={18} color={colors.textOnPrimary} />
              <Text style={styles.newButtonText}>Nieuw</Text>
            </Pressable>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
          ) : menus.length === 0 ? (
            <Text style={styles.empty}>Nog geen menu's. Importeer de ingebouwde set of voeg er een toe.</Text>
          ) : (
            <View style={styles.grid}>
              {menus.map((row) => (
                <View key={row.id} style={styles.itemCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{row.title}</Text>
                    <Text style={styles.itemMeta}>{row.data?.courses?.length ?? 0} gangen</Text>
                  </View>
                  <Pressable onPress={() => setForm({ kind: 'menu', id: row.id })} style={styles.iconButton}>
                    <Ionicons name="create-outline" size={20} color={colors.primary} />
                  </Pressable>
                  <Pressable onPress={() => removeMenu(row)} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={20} color={colors.fat} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing.xxxl, alignItems: 'center' },
  container: { width: '100%', maxWidth: 880, gap: spacing.lg },
  loginWrap: { gap: spacing.sm, maxWidth: 420, width: '100%', alignSelf: 'center', marginTop: spacing.xxl },
  dashboard: { gap: spacing.lg },
  topbar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  brandBlock: { gap: spacing.xs, alignItems: 'flex-start' },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary },
  tabs: { flexDirection: 'row', gap: spacing.sm },
  tab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.label, color: colors.textSecondary },
  tabTextActive: { color: colors.textOnPrimary },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm },
  h2: { ...typography.heading, color: colors.textPrimary },
  mealGroups: { gap: spacing.lg },
  mealGroup: { gap: spacing.sm },
  mealGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs },
  mealGroupTitle: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    flexGrow: 1, flexBasis: 320, ...shadow.soft,
  },
  itemTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  itemMeta: { ...typography.caption, color: colors.textSecondary },
  empty: { ...typography.body, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm, ...shadow.soft },
  label: { ...typography.label, color: colors.textSecondary, marginTop: spacing.xs },
  input: {
    ...typography.body, color: colors.textPrimary, backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  error: { ...typography.caption, color: colors.fat },
  message: { ...typography.bodyStrong, color: colors.accent },
  primaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  primaryButtonText: { ...typography.bodyStrong, color: colors.textOnPrimary },
  newButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  newButtonText: { ...typography.label, color: colors.textOnPrimary },
  ghost: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  ghostText: { ...typography.label, color: colors.textSecondary },
  iconButton: { padding: spacing.xs },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
