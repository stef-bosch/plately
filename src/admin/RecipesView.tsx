import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { DISH_CATEGORIES, dishCategory, mealTypeLabel } from '../constants/labels';
import type { DishRow } from '../data/adminApi';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { Recipe } from '../types';
import { formatDateLong } from '../utils/isoWeek';

const ALL = 'alle';

interface Props {
  rows: DishRow[];
  loading: boolean;
  /** Unique recipe ids planned in the current week (for the overview cards). */
  plannedIds: Set<string>;
  onNew: () => void;
  onNewMenu: () => void;
  onGoToWeekmenu: () => void;
  onEdit: (row: DishRow) => void;
  onDuplicate: (row: DishRow) => void;
  onDelete: (row: DishRow) => void;
}

const recipeOf = (row: DishRow) => row.data as Recipe;
const kcalOf = (row: DishRow) => recipeOf(row)?.nutrition?.calories ?? 0;

export function RecipesView({
  rows,
  loading,
  plannedIds,
  onNew,
  onNewMenu,
  onGoToWeekmenu,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>(ALL);

  // Categories actually in use, in the app's display order (unknown ones last).
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const c = dishCategory(recipeOf(r));
      counts.set(c, (counts.get(c) ?? 0) + 1);
    });
    const known = DISH_CATEGORIES.filter((c) => counts.has(c));
    const extra = [...counts.keys()].filter((c) => !DISH_CATEGORIES.includes(c)).sort();
    return [...known, ...extra].map((c) => ({ category: c, count: counts.get(c) ?? 0 }));
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (category !== ALL && dishCategory(recipeOf(r)) !== category) return false;
      return !q || r.title.toLowerCase().includes(q);
    });
  }, [rows, query, category]);

  const recent = useMemo(
    () => [...rows].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '')).slice(0, 5),
    [rows],
  );

  const withoutNutrition = rows.filter((r) => !kcalOf(r)).length;

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />;
  }

  return (
    <View style={styles.wrap}>
      {/* ---------- main column ---------- */}
      <View style={styles.main}>
        {/* Quick overview */}
        <View style={styles.statRow}>
          <Stat icon="restaurant-outline" label="Totaal recepten" value={rows.length} />
          <Stat icon="grid-outline" label="Categorieën in gebruik" value={categoryCounts.length} />
          <Stat icon="calendar-outline" label="Ingepland deze week" value={plannedIds.size} />
          <Stat
            icon="alert-circle-outline"
            label="Zonder voedingswaarden"
            value={withoutNutrition}
            tone={withoutNutrition > 0 ? 'warn' : undefined}
          />
        </View>

        {/* Filters */}
        <View style={styles.panel}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek recept…"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
            {query ? (
              <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />
            ) : null}
          </View>
          <View style={styles.chipRow}>
            <FilterChip label="Alle categorieën" active={category === ALL} onPress={() => setCategory(ALL)} />
            {categoryCounts.map((c) => (
              <FilterChip
                key={c.category}
                label={`${c.category} (${c.count})`}
                active={category === c.category}
                onPress={() => setCategory(category === c.category ? ALL : c.category)}
              />
            ))}
          </View>
        </View>

        {/* Table */}
        <View style={styles.panel}>
          <View style={styles.tableHead}>
            <Text style={styles.h2}>Alle recepten ({visible.length})</Text>
            <Pressable onPress={onNew} style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={18} color={colors.textOnPrimary} />
              <Text style={styles.newButtonText}>Recept toevoegen</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={[styles.row, styles.headRow]}>
                <Text style={[styles.headCell, styles.colName]}>Recept</Text>
                <Text style={[styles.headCell, styles.colCat]}>Categorie</Text>
                <Text style={[styles.headCell, styles.colMeal]}>Maaltijd</Text>
                <Text style={[styles.headCell, styles.colDiet]}>Dieet</Text>
                <Text style={[styles.headCell, styles.colKcal]}>kcal</Text>
                <Text style={[styles.headCell, styles.colDate]}>Laatst gewijzigd</Text>
                <Text style={[styles.headCell, styles.colActions]}>Acties</Text>
              </View>

              {visible.length === 0 ? (
                <Text style={styles.empty}>
                  {rows.length === 0 ? 'Nog geen recepten. Voeg er een toe.' : 'Geen recepten gevonden.'}
                </Text>
              ) : (
                visible.map((row) => {
                  const r = recipeOf(row);
                  const kcal = kcalOf(row);
                  return (
                    <View key={row.id} style={styles.row}>
                      <View style={styles.colName}>
                        <Text style={styles.cellTitle} numberOfLines={1}>{row.title}</Text>
                        {plannedIds.has(row.id) ? (
                          <Text style={styles.plannedTag}>ingepland deze week</Text>
                        ) : null}
                      </View>
                      <Text style={[styles.cell, styles.colCat]} numberOfLines={1}>{dishCategory(r)}</Text>
                      <Text style={[styles.cell, styles.colMeal]} numberOfLines={1}>
                        {mealTypeLabel[r.mealType] ?? '—'}
                      </Text>
                      <View style={[styles.colDiet, styles.dietWrap]}>
                        {(r.suitableFor ?? []).length === 0 ? (
                          <Text style={styles.cellMuted}>—</Text>
                        ) : (
                          (r.suitableFor ?? []).map((d) => (
                            <Text key={d} style={styles.dietTag}>{d}</Text>
                          ))
                        )}
                      </View>
                      <Text style={[styles.cell, styles.colKcal, !kcal && styles.cellWarn]}>
                        {kcal || '0'}
                      </Text>
                      <Text style={[styles.cellMuted, styles.colDate]} numberOfLines={1}>
                        {formatDateLong(row.updated_at)}
                      </Text>
                      <View style={[styles.colActions, styles.actions]}>
                        <IconAction icon="create-outline" label={`${row.title} bewerken`} color={colors.primary} onPress={() => onEdit(row)} />
                        <IconAction icon="copy-outline" label={`${row.title} kopiëren`} color={colors.textSecondary} onPress={() => onDuplicate(row)} />
                        <IconAction icon="trash-outline" label={`${row.title} verwijderen`} color={colors.fat} onPress={() => onDelete(row)} />
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ---------- side column ---------- */}
      <View style={styles.side}>
        <View style={styles.panel}>
          <Text style={styles.h2}>Categorieën</Text>
          {categoryCounts.length === 0 ? (
            <Text style={styles.empty}>Nog geen categorieën.</Text>
          ) : (
            categoryCounts.map((c) => (
              <Pressable
                key={c.category}
                onPress={() => setCategory(category === c.category ? ALL : c.category)}
                style={({ pressed }) => [styles.sideRow, pressed && styles.pressed]}
              >
                <Text style={[styles.sideRowText, category === c.category && styles.sideRowActive]} numberOfLines={1}>
                  {c.category}
                </Text>
                <Text style={styles.sideCount}>{c.count}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={styles.panel}>
          <Text style={styles.h2}>Snelle acties</Text>
          <QuickAction icon="restaurant-outline" label="Recept toevoegen" onPress={onNew} />
          <QuickAction icon="albums-outline" label="Menu toevoegen" onPress={onNewMenu} />
          <QuickAction icon="calendar-outline" label="Naar weekmenu" onPress={onGoToWeekmenu} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.h2}>Recent aangepast</Text>
          {recent.length === 0 ? (
            <Text style={styles.empty}>Nog niets aangepast.</Text>
          ) : (
            recent.map((row) => (
              <Pressable
                key={row.id}
                onPress={() => onEdit(row)}
                style={({ pressed }) => [styles.sideRow, pressed && styles.pressed]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.sideRowText} numberOfLines={1}>{row.title}</Text>
                  <Text style={styles.sideMeta}>{formatDateLong(row.updated_at)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
            ))
          )}
        </View>
      </View>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  tone?: 'warn';
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, tone === 'warn' && styles.statIconWarn]}>
        <Ionicons name={icon} size={22} color={tone === 'warn' ? colors.fat : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

function IconAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
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
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-start' },
  main: { flexGrow: 1, flexBasis: 640, gap: spacing.lg },
  side: { width: 300, gap: spacing.lg },

  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    flexGrow: 1, flexBasis: 200, ...shadow.soft,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  statIconWarn: { backgroundColor: colors.surfaceMuted },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statValue: { ...typography.title, color: colors.textPrimary },

  panel: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.md, ...shadow.soft,
  },
  h2: { ...typography.heading, color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  searchInput: { ...typography.body, color: colors.textPrimary, flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  tableHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  table: { minWidth: 900 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headRow: { borderBottomWidth: 2 },
  headCell: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 },
  cell: { ...typography.body, color: colors.textPrimary },
  cellTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  cellMuted: { ...typography.caption, color: colors.textMuted },
  cellWarn: { color: colors.fat },
  plannedTag: { ...typography.caption, color: colors.accent, fontSize: 10 },

  colName: { width: 260 },
  colCat: { width: 150 },
  colMeal: { width: 110 },
  colDiet: { width: 160 },
  colKcal: { width: 60 },
  colDate: { width: 130 },
  colActions: { width: 110 },

  dietWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dietTag: {
    ...typography.caption, fontSize: 10, color: colors.accent,
    backgroundColor: colors.accentSoft, borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 1,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  iconButton: { padding: spacing.xs },

  sideRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sideRowText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  sideRowActive: { color: colors.primary },
  sideCount: { ...typography.label, color: colors.textSecondary },
  sideMeta: { ...typography.caption, color: colors.textMuted },

  quickAction: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md,
  },
  quickIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  quickText: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },

  newButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary,
    borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  newButtonText: { ...typography.label, color: colors.textOnPrimary },
  empty: { ...typography.body, color: colors.textMuted, paddingVertical: spacing.sm },
  pressed: { opacity: 0.85 },
});
