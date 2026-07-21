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
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  deleteDish,
  deleteMenu,
  getDishRow,
  listDishes,
  listMenus,
  saveDish,
  type DishRow,
  type MenuRow,
} from '../data/adminApi';
import { PlatelyLogo } from '../components/BrandIcons';
import {
  MEAL_CATEGORIES,
  dayLabel,
  dishCategory,
  getIsoWeekNumber,
} from '../constants/labels';
import { getRecipeById, reloadContent } from '../data/content';
import { getWeeklyPlanForDate } from '../data/weeklyPlans';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { Recipe } from '../types';
import { DishForm } from './DishForm';
import { MenuForm } from './MenuForm';
import { RecipesView } from './RecipesView';
import { WeekmenuBuilder } from './WeekmenuBuilder';

async function confirmAsync(message: string): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') return window.confirm(message);
  return true;
}

type Tab = 'dashboard' | 'weekmenu' | 'dishes' | 'menus';
type FormState =
  | { kind: 'dish'; id?: string }
  | { kind: 'menu'; id?: string }
  | null;

/** Below this viewport width the admin shows a "use a desktop" notice. */
const DESKTOP_MIN_WIDTH = 900;

const NAV: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'home-outline' },
  { key: 'weekmenu', label: 'Weekmenu', icon: 'calendar-outline' },
  { key: 'dishes', label: 'Recepten', icon: 'restaurant-outline' },
  { key: 'menus', label: "Menu's", icon: 'albums-outline' },
];

const TAB_TITLE: Record<Tab, string> = {
  dashboard: 'Dashboard',
  weekmenu: 'Weekmenu',
  dishes: 'Recepten',
  menus: "Menu's",
};

/** The meal rows shown in the dashboard's week grid. */
const WEEK_ROWS: { key: 'ontbijt' | 'lunch' | 'diner'; label: string }[] = [
  { key: 'ontbijt', label: 'Ontbijt' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'diner', label: 'Diner' },
];

// The category a recipe is grouped under in the Recepten list.
const categoryOf = (row: DishRow): string =>
  dishCategory(row.data as Recipe);

export function AdminApp() {
  const { session, ready } = useAuth();

  if (!ready) {
    return (
      <View style={[styles.root, styles.centerFill]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.root}>
        <ScrollView contentContainerStyle={styles.loginScroll}>
          <LoginForm />
        </ScrollView>
      </View>
    );
  }

  return <AdminShell email={session.user.email ?? ''} />;
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

function AdminShell({ email }: { email: string }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDesktop = width >= DESKTOP_MIN_WIDTH;
  // Lets the user proceed on a small screen after the desktop notice.
  const [bypass, setBypass] = useState(false);

  const [tab, setTab] = useState<Tab>('dashboard');
  const [form, setForm] = useState<FormState>(null);
  const [dishes, setDishes] = useState<DishRow[]>([]);
  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyMsg, setBusyMsg] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [flash, setFlash] = useState<string | null>(null);

  const signOut = () => supabase?.auth.signOut();
  // Switching section always leaves any open form.
  const goTo = (t: Tab) => {
    setForm(null);
    setTab(t);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [d, m] = await Promise.all([listDishes(), listMenus()]);
      // Keep the content store in sync so the dashboard's week grid reflects
      // the current recipes and saved week menus.
      await reloadContent();
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

  /** Copies a recipe under a free "-kopie" id so it can be edited separately. */
  const duplicateDish = async (row: DishRow) => {
    try {
      let id = `${row.id}-kopie`;
      let n = 2;
      while (await getDishRow(id)) id = `${row.id}-kopie-${n++}`;
      const copy = { ...(row.data as object), id, title: `${row.title} (kopie)` };
      await saveDish(copy as Parameters<typeof saveDish>[0], row.kind);
      await reloadContent();
      setFlash(`"${row.title}" gekopieerd`);
      setTimeout(() => setFlash(null), 2500);
      refresh();
    } catch (e) {
      setBusyMsg(`Kopiëren mislukt: ${(e as Error).message}`);
    }
  };

  const removeMenu = async (row: MenuRow) => {
    if (!(await confirmAsync(`"${row.title}" verwijderen?`))) return;
    await deleteMenu(row.id);
    await reloadContent();
    refresh();
  };

  const onFormDone = () => {
    setForm(null);
    setFlash('Opgeslagen');
    setTimeout(() => setFlash(null), 2500);
    refresh();
  };

  const q = query.trim().toLowerCase();
  const matches = (title: string) => !q || title.toLowerCase().includes(q);
  const filteredMenus = menus.filter((r) => matches(r.title));

  const searchBox = (
    <View style={styles.searchBox}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
        placeholder="Zoeken op naam…"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
      />
      {query ? (
        <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />
      ) : null}
    </View>
  );

  const listView = (
    <View style={styles.listView}>
      {searchBox}
      {busyMsg ? <Text style={styles.message}>{busyMsg}</Text> : null}
      {flash ? <Text style={styles.flash}>{flash}</Text> : null}

      <>
          <View style={styles.listHeader}>
            <Text style={styles.h2}>Menu's ({filteredMenus.length})</Text>
            <Pressable onPress={() => setForm({ kind: 'menu' })} style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={18} color={colors.textOnPrimary} />
              <Text style={styles.newButtonText}>Nieuw</Text>
            </Pressable>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
          ) : filteredMenus.length === 0 ? (
            <Text style={styles.empty}>{query ? "Geen menu's gevonden." : "Nog geen menu's. Voeg er een toe."}</Text>
          ) : (
            <View style={styles.grid}>
              {filteredMenus.map((row) => (
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
    </View>
  );

  // Real signals worth flagging in the notification bell — no invented data.
  const weekmenuRows = dishes;
  const issues: string[] = [];
  if (busyMsg) issues.push(busyMsg);
  const withoutNutrition = weekmenuRows.filter(
    (r) => !(r.data as Recipe)?.nutrition?.calories,
  ).length;
  if (withoutNutrition > 0) {
    issues.push(
      `${withoutNutrition} weekmenu-gerecht${withoutNutrition === 1 ? '' : 'en'} zonder berekende voedingswaarden.`,
    );
  }
  for (const c of MEAL_CATEGORIES) {
    if (!weekmenuRows.some((r) => categoryOf(r) === c)) {
      issues.push(`Nog geen "${c}" in het weekmenu — die dagen blijven leeg.`);
    }
  }

  // Unique recipes planned in the current week (real, from the saved/generated plan).
  const plannedIds = new Set(
    getWeeklyPlanForDate(new Date()).days.flatMap((d) =>
      [d.meals.ontbijt, d.meals.lunch, d.meals.diner, ...d.meals.tussendoortje].filter(Boolean),
    ),
  );

  const recipesView = (
    <RecipesView
      rows={dishes}
      loading={loading}
      plannedIds={plannedIds}
      onNew={() => setForm({ kind: 'dish' })}
      onNewMenu={() => setForm({ kind: 'menu' })}
      onGoToWeekmenu={() => goTo('weekmenu')}
      onEdit={(row) => setForm({ kind: 'dish', id: row.id })}
      onDuplicate={duplicateDish}
      onDelete={removeDish}
    />
  );

  const dashboardView = (
    <DashboardView
      loading={loading}
      recipeRows={dishes}
      menus={menus}
      onGoTo={goTo}
      onNewDish={() => setForm({ kind: 'dish' })}
      onNewMenu={() => setForm({ kind: 'menu' })}
      onEditDish={(row) => setForm({ kind: 'dish', id: row.id })}
    />
  );

  const body =
    form?.kind === 'dish' ? (
      <DishForm dishId={form.id} onSaved={onFormDone} onCancel={() => setForm(null)} />
    ) : form?.kind === 'menu' ? (
      <MenuForm menuId={form.id} onSaved={onFormDone} onCancel={() => setForm(null)} />
    ) : tab === 'dashboard' ? (
      dashboardView
    ) : tab === 'dishes' ? (
      recipesView
    ) : tab === 'weekmenu' ? (
      <WeekmenuBuilder
        dishRows={weekmenuRows}
        onNewDish={() => setForm({ kind: 'dish' })}
        onEditDish={(row) => setForm({ kind: 'dish', id: row.id })}
      />
    ) : (
      listView
    );

  // Desktop-only: on a small screen show a notice (with an escape hatch).
  if (!isDesktop && !bypass) {
    return (
      <MobileNotice topInset={insets.top} onContinue={() => setBypass(true)} onSignOut={signOut} />
    );
  }

  if (isDesktop) {
    return (
      <View style={styles.shell}>
        <Sidebar tab={tab} onSelect={goTo} email={email} onSignOut={signOut} />
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentInner}>
          <TopBar title={TAB_TITLE[tab]} email={email} issues={issues} />
          {body}
        </ScrollView>
      </View>
    );
  }

  // Small screen, user chose to continue: stacked layout with top tabs.
  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.mobileScroll, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.mobileTopbar}>
        <PlatelyLogo width={110} color={colors.primary} />
        <Pressable onPress={signOut} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Text style={styles.ghostText}>Uitloggen</Text>
        </Pressable>
      </View>
      <View style={styles.mobileTabs}>
        {NAV.map((n) => (
          <Pressable key={n.key} onPress={() => goTo(n.key)} style={[styles.tab, tab === n.key && !form && styles.tabActive]}>
            <Text style={[styles.tabText, tab === n.key && !form && styles.tabTextActive]}>{n.label}</Text>
          </Pressable>
        ))}
      </View>
      <TopBar title={TAB_TITLE[tab]} email={email} issues={issues} />
      {body}
    </ScrollView>
  );
}

/** Section title, notification bell (real warnings) and the account chip. */
function TopBar({
  title,
  email,
  issues,
}: {
  title: string;
  email: string;
  issues: string[];
}) {
  const [open, setOpen] = useState(false);
  const initial = (email.trim()[0] ?? 'A').toUpperCase();

  return (
    <View style={styles.topBarWrap}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.topBarTitle}>{title}</Text>
          <Text style={styles.topBarSubtitle}>Beheer je weekmenu, recepten en menu's.</Text>
        </View>

        <Pressable
          onPress={() => setOpen((v) => !v)}
          accessibilityLabel={`Meldingen (${issues.length})`}
          style={({ pressed }) => [styles.bellButton, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          {issues.length > 0 ? (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{issues.length}</Text>
            </View>
          ) : null}
        </Pressable>

        <View style={styles.userChip}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View>
            <Text style={styles.userName} numberOfLines={1}>{email}</Text>
            <Text style={styles.userRole}>Admin</Text>
          </View>
        </View>
      </View>

      {open ? (
        <View style={styles.notifPanel}>
          {issues.length === 0 ? (
            <Text style={styles.notifEmpty}>Geen meldingen — alles ziet er goed uit.</Text>
          ) : (
            issues.map((msg) => (
              <View key={msg} style={styles.notifRow}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.fat} />
                <Text style={styles.notifText}>{msg}</Text>
              </View>
            ))
          )}
        </View>
      ) : null}
    </View>
  );
}

/** Admin home: counts, this week's menu, recent dishes/menus and quick actions. */
function DashboardView({
  loading,
  recipeRows,
  menus,
  onGoTo,
  onNewDish,
  onNewMenu,
  onEditDish,
}: {
  loading: boolean;
  recipeRows: DishRow[];
  menus: MenuRow[];
  onGoTo: (t: Tab) => void;
  onNewDish: () => void;
  onNewMenu: () => void;
  onEditDish: (row: DishRow) => void;
}) {
  const plan = getWeeklyPlanForDate(new Date());
  const titleFor = (id: string) => (id ? getRecipeById(id)?.title ?? null : null);

  // How many meal slots this week actually resolve to a dish.
  const plannedItems = plan.days.reduce((total, d) => {
    const ids = [d.meals.ontbijt, d.meals.lunch, d.meals.diner, ...d.meals.tussendoortje];
    return total + ids.filter((id) => titleFor(id)).length;
  }, 0);

  const recentDishes = [...recipeRows]
    .sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? ''))
    .slice(0, 5);

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />;
  }

  return (
    <View style={styles.dash}>
      {/* Counts */}
      <View style={styles.statRow}>
        <StatCard icon="restaurant-outline" label="Recepten" value={recipeRows.length} />
        <StatCard icon="albums-outline" label="Menu's" value={menus.length} />
        <StatCard icon="checkmark-done-outline" label="Geplande items deze week" value={plannedItems} />
      </View>

      {/* This week's menu */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Weekmenu week {getIsoWeekNumber(new Date())}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.weekRow}>
              <View style={styles.weekLabelCell} />
              {plan.days.map((d) => (
                <View key={d.day} style={styles.weekHeadCell}>
                  <Text style={styles.weekHeadText}>{dayLabel[d.day]}</Text>
                </View>
              ))}
            </View>
            {WEEK_ROWS.map((row) => (
              <View key={row.key} style={styles.weekRow}>
                <View style={styles.weekLabelCell}>
                  <Text style={styles.weekLabelText}>{row.label}</Text>
                </View>
                {plan.days.map((d) => {
                  const title = titleFor(d.meals[row.key]);
                  return (
                    <View key={d.day} style={styles.weekCell}>
                      <Text style={title ? styles.weekCellText : styles.weekCellEmpty} numberOfLines={3}>
                        {title ?? '—'}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
            <View style={styles.weekRow}>
              <View style={styles.weekLabelCell}>
                <Text style={styles.weekLabelText}>Snack</Text>
              </View>
              {plan.days.map((d) => {
                const title = titleFor(d.meals.tussendoortje[0] ?? '');
                return (
                  <View key={d.day} style={styles.weekCell}>
                    <Text style={title ? styles.weekCellText : styles.weekCellEmpty} numberOfLines={3}>
                      {title ?? '—'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Dishes + menus side by side */}
      <View style={styles.twoCol}>
        <View style={[styles.panel, styles.colPanel]}>
          <Text style={styles.panelTitle}>Recepten</Text>
          {recentDishes.length === 0 ? (
            <Text style={styles.empty}>Nog geen recepten.</Text>
          ) : (
            recentDishes.map((row) => (
              <Pressable
                key={row.id}
                onPress={() => onEditDish(row)}
                style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
              >
                <Text style={styles.listRowTitle} numberOfLines={1}>{row.title}</Text>
                <Text style={styles.listRowMeta}>{categoryOf(row)}</Text>
              </Pressable>
            ))
          )}
          <Pressable onPress={() => onGoTo('dishes')} style={styles.linkRow}>
            <Text style={styles.linkText}>Bekijk alle recepten</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        </View>

        <View style={[styles.panel, styles.colPanel]}>
          <Text style={styles.panelTitle}>Menu's</Text>
          {menus.length === 0 ? (
            <Text style={styles.empty}>Nog geen menu's.</Text>
          ) : (
            menus.slice(0, 5).map((row) => (
              <View key={row.id} style={styles.listRow}>
                <Text style={styles.listRowTitle} numberOfLines={1}>{row.title}</Text>
                <Text style={styles.listRowMeta}>{row.data?.courses?.length ?? 0} gangen</Text>
              </View>
            ))
          )}
          <Pressable onPress={() => onGoTo('menus')} style={styles.linkRow}>
            <Text style={styles.linkText}>Bekijk alle menu's</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Snelle acties</Text>
        <View style={styles.quickRow}>
          <QuickAction icon="restaurant-outline" label="Recept toevoegen" onPress={() => onNewDish()} />
          <QuickAction icon="albums-outline" label="Menu toevoegen" onPress={onNewMenu} />
        </View>
      </View>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}

function Sidebar({
  tab,
  onSelect,
  email,
  onSignOut,
}: {
  tab: Tab;
  onSelect: (t: Tab) => void;
  email: string;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.sidebar}>
      <View style={styles.sidebarBrand}>
        <PlatelyLogo width={124} color={colors.primary} />
      </View>
      <View style={styles.navList}>
        {NAV.map((n) => {
          const active = tab === n.key;
          return (
            <Pressable
              key={n.key}
              onPress={() => onSelect(n.key)}
              style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && styles.pressed]}
            >
              <Ionicons name={n.icon} size={20} color={active ? colors.primary : colors.textSecondary} />
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>{n.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sidebarFooter}>
        <Text style={styles.sidebarEmail} numberOfLines={1}>{email}</Text>
        <Pressable onPress={onSignOut} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Text style={styles.ghostText}>Uitloggen</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MobileNotice({
  topInset,
  onContinue,
  onSignOut,
}: {
  topInset: number;
  onContinue: () => void;
  onSignOut: () => void;
}) {
  return (
    <View style={styles.root}>
      <View style={[styles.noticeWrap, { paddingTop: topInset + spacing.xxl }]}>
        <PlatelyLogo width={132} color={colors.primary} />
        <View style={styles.noticeIcon}>
          <Ionicons name="desktop-outline" size={40} color={colors.primary} />
        </View>
        <Text style={styles.noticeTitle}>Open het beheer op desktop</Text>
        <Text style={styles.noticeBody}>
          Het beheerpaneel is gemaakt voor grotere schermen. Op een computer heb
          je meer overzicht en gaat het toevoegen en aanpassen van gerechten een
          stuk makkelijker.
        </Text>
        <Pressable onPress={onContinue} style={({ pressed }) => [styles.noticeContinue, pressed && styles.pressed]}>
          <Text style={styles.noticeContinueText}>Toch doorgaan op mobiel</Text>
        </Pressable>
        <Pressable onPress={onSignOut} style={styles.noticeSignOut}>
          <Text style={styles.ghostText}>Uitloggen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  centerFill: { alignItems: 'center', justifyContent: 'center' },
  loginScroll: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  loginWrap: { gap: spacing.sm, maxWidth: 420, width: '100%', alignSelf: 'center' },
  title: { ...typography.display, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary },

  // Desktop shell: fixed sidebar + scrollable content.
  shell: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  sidebar: {
    width: 240,
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sidebarBrand: { paddingHorizontal: spacing.sm, marginBottom: spacing.xl },
  navList: { gap: spacing.xs },
  navItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radius.md,
  },
  navItemActive: { backgroundColor: colors.primarySoft },
  navLabel: { ...typography.bodyStrong, color: colors.textSecondary },
  navLabelActive: { color: colors.primary },
  sidebarFooter: { marginTop: 'auto', gap: spacing.sm, paddingHorizontal: spacing.sm },
  sidebarEmail: { ...typography.caption, color: colors.textMuted },
  contentScroll: { flex: 1 },
  contentInner: { padding: spacing.xl, gap: spacing.lg, width: '100%' },
  listView: { gap: spacing.lg },

  // Top bar: title, notification bell, account chip.
  topBarWrap: { gap: spacing.sm },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  topBarTitle: { ...typography.title, color: colors.textPrimary },
  topBarSubtitle: { ...typography.caption, color: colors.textSecondary },
  bellButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', ...shadow.soft,
  },
  bellBadge: {
    position: 'absolute', top: 2, right: 2, minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.fat, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  bellBadgeText: { ...typography.caption, fontSize: 10, color: colors.white },
  userChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.pill,
    paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, maxWidth: 260, ...shadow.soft,
  },
  avatar: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...typography.label, color: colors.textOnPrimary },
  userName: { ...typography.label, color: colors.textPrimary, maxWidth: 170 },
  userRole: { ...typography.caption, color: colors.textMuted },
  notifPanel: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    gap: spacing.sm, ...shadow.soft,
  },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  notifText: { ...typography.body, color: colors.textSecondary, flex: 1 },
  notifEmpty: { ...typography.body, color: colors.textMuted },

  // Dashboard
  dash: { gap: spacing.lg },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    flexGrow: 1, flexBasis: 220, ...shadow.soft,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statValue: { ...typography.title, color: colors.textPrimary },
  panel: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.md, ...shadow.soft,
  },
  panelTitle: { ...typography.heading, color: colors.textPrimary },
  twoCol: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  colPanel: { flexGrow: 1, flexBasis: 380 },
  weekRow: { flexDirection: 'row' },
  weekLabelCell: { width: 90, paddingVertical: spacing.sm, justifyContent: 'center' },
  weekLabelText: { ...typography.label, color: colors.textSecondary },
  weekHeadCell: { width: 122, paddingVertical: spacing.sm, paddingHorizontal: spacing.xs },
  weekHeadText: { ...typography.label, color: colors.textPrimary },
  weekCell: {
    width: 122, padding: spacing.sm, marginRight: spacing.xs, marginBottom: spacing.xs,
    backgroundColor: colors.background, borderRadius: radius.sm, minHeight: 56, justifyContent: 'center',
  },
  weekCellText: { ...typography.caption, color: colors.textPrimary },
  weekCellEmpty: { ...typography.caption, color: colors.textMuted },
  listRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  listRowTitle: { ...typography.body, color: colors.textPrimary, flex: 1 },
  listRowMeta: { ...typography.caption, color: colors.textSecondary },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: spacing.xs },
  linkText: { ...typography.label, color: colors.primary },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickAction: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md,
    flexGrow: 1, flexBasis: 240,
  },
  quickActionText: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },

  // Small-screen fallback (after the desktop notice).
  mobileScroll: { padding: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  mobileTopbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mobileTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  // Desktop-only notice.
  noticeWrap: {
    flex: 1, alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.xl, maxWidth: 460, width: '100%', alignSelf: 'center',
  },
  noticeIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.md,
  },
  noticeTitle: { ...typography.title, color: colors.textPrimary, textAlign: 'center' },
  noticeBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  noticeContinue: {
    marginTop: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  noticeContinueText: { ...typography.label, color: colors.textPrimary },
  noticeSignOut: { marginTop: spacing.sm, padding: spacing.sm },

  tab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.surfaceMuted },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.label, color: colors.textSecondary },
  tabTextActive: { color: colors.textOnPrimary },
  flash: { ...typography.label, color: colors.primary, backgroundColor: colors.primarySoft, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...shadow.soft,
  },
  searchInput: { ...typography.body, color: colors.textPrimary, flex: 1 },
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
