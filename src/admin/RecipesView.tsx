import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { DISH_CATEGORIES, dishCategory, mealTypeLabel } from '../constants/labels';
import type { DishRow } from '../data/adminApi';
import { colors, spacing, typography } from '../theme';
import type { Recipe } from '../types';
import { formatDateLong } from '../utils/isoWeek';
import { IconAction, QuickAction, StatCard, ov } from './overviewKit';

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
const isConcept = (row: DishRow) => recipeOf(row)?.status === 'concept';

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
    <View style={ov.wrap}>
      {/* ---------- main column ---------- */}
      <View style={ov.main}>
        <View style={ov.statRow}>
          <StatCard icon="restaurant-outline" label="Totaal recepten" value={rows.length} />
          <StatCard icon="grid-outline" label="Categorieën" value={categoryCounts.length} />
          <StatCard icon="document-outline" label="Concepten" value={rows.filter(isConcept).length} />
          <StatCard icon="calendar-outline" label="Ingepland deze week" value={plannedIds.size} />
          <StatCard
            icon="alert-circle-outline"
            label="Zonder voedingswaarden"
            value={withoutNutrition}
            tone={withoutNutrition > 0 ? 'warn' : undefined}
          />
        </View>

        <View style={ov.panel}>
          <View style={ov.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={ov.searchInput}
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
          <View style={ov.chipRow}>
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

        <View style={ov.panel}>
          <View style={ov.tableHead}>
            <Text style={ov.h2}>Alle recepten ({visible.length})</Text>
            <Pressable onPress={onNew} style={({ pressed }) => [ov.newButton, pressed && ov.pressed]}>
              <Ionicons name="add" size={18} color={colors.textOnPrimary} />
              <Text style={ov.newButtonText}>Recept toevoegen</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={[ov.row, ov.headRow]}>
                <Text style={[ov.headCell, styles.colName]}>Recept</Text>
                <Text style={[ov.headCell, styles.colCat]}>Categorie</Text>
                <Text style={[ov.headCell, styles.colMeal]}>Maaltijd</Text>
                <Text style={[ov.headCell, styles.colDiet]}>Dieet</Text>
                <Text style={[ov.headCell, styles.colKcal]}>kcal</Text>
                <Text style={[ov.headCell, styles.colStatus]}>Status</Text>
                <Text style={[ov.headCell, styles.colDate]}>Laatst gewijzigd</Text>
                <Text style={[ov.headCell, styles.colActions]}>Acties</Text>
              </View>

              {visible.length === 0 ? (
                <Text style={ov.empty}>
                  {rows.length === 0 ? 'Nog geen recepten. Voeg er een toe.' : 'Geen recepten gevonden.'}
                </Text>
              ) : (
                visible.map((row) => {
                  const r = recipeOf(row);
                  const kcal = kcalOf(row);
                  return (
                    <View key={row.id} style={ov.row}>
                      <View style={styles.colName}>
                        <Text style={ov.cellTitle} numberOfLines={1}>{row.title}</Text>
                        {plannedIds.has(row.id) ? (
                          <Text style={styles.plannedTag}>ingepland deze week</Text>
                        ) : null}
                      </View>
                      <Text style={[ov.cell, styles.colCat]} numberOfLines={1}>{dishCategory(r)}</Text>
                      <Text style={[ov.cell, styles.colMeal]} numberOfLines={1}>
                        {mealTypeLabel[r.mealType] ?? '—'}
                      </Text>
                      <View style={[styles.colDiet, ov.tagWrap]}>
                        {(r.suitableFor ?? []).length === 0 ? (
                          <Text style={ov.cellMuted}>—</Text>
                        ) : (
                          (r.suitableFor ?? []).map((d) => <Text key={d} style={ov.tag}>{d}</Text>)
                        )}
                      </View>
                      <Text style={[ov.cell, styles.colKcal, !kcal && ov.cellWarn]}>{kcal || '0'}</Text>
                      <View style={styles.colStatus}>
                        <Text style={[styles.status, isConcept(row) ? styles.statusConcept : styles.statusLive]}>
                          {isConcept(row) ? 'Concept' : 'Actief'}
                        </Text>
                      </View>
                      <Text style={[ov.cellMuted, styles.colDate]} numberOfLines={1}>
                        {formatDateLong(row.updated_at)}
                      </Text>
                      <View style={[styles.colActions, ov.actions]}>
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
      <View style={ov.side}>
        <View style={ov.panel}>
          <Text style={ov.h2}>Categorieën</Text>
          {categoryCounts.length === 0 ? (
            <Text style={ov.empty}>Nog geen categorieën.</Text>
          ) : (
            categoryCounts.map((c) => (
              <Pressable
                key={c.category}
                onPress={() => setCategory(category === c.category ? ALL : c.category)}
                style={({ pressed }) => [ov.sideRow, pressed && ov.pressed]}
              >
                <Text style={[ov.sideRowText, category === c.category && ov.sideRowActive]} numberOfLines={1}>
                  {c.category}
                </Text>
                <Text style={ov.sideCount}>{c.count}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={ov.panel}>
          <Text style={ov.h2}>Snelle acties</Text>
          <QuickAction icon="restaurant-outline" label="Recept toevoegen" onPress={onNew} />
          <QuickAction icon="albums-outline" label="Menu toevoegen" onPress={onNewMenu} />
          <QuickAction icon="calendar-outline" label="Naar weekmenu" onPress={onGoToWeekmenu} />
        </View>

        <View style={ov.panel}>
          <Text style={ov.h2}>Recent aangepast</Text>
          {recent.length === 0 ? (
            <Text style={ov.empty}>Nog niets aangepast.</Text>
          ) : (
            recent.map((row) => (
              <Pressable
                key={row.id}
                onPress={() => onEdit(row)}
                style={({ pressed }) => [ov.sideRow, pressed && ov.pressed]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={ov.sideRowText} numberOfLines={1}>{row.title}</Text>
                  <Text style={ov.sideMeta}>{formatDateLong(row.updated_at)}</Text>
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

const styles = StyleSheet.create({
  table: { minWidth: 1000 },
  colName: { width: 260 },
  colCat: { width: 150 },
  colMeal: { width: 110 },
  colDiet: { width: 160 },
  colKcal: { width: 60 },
  colStatus: { width: 90 },
  colDate: { width: 130 },
  colActions: { width: 110 },
  plannedTag: { ...typography.caption, color: colors.accent, fontSize: 10 },
  status: {
    ...typography.caption, fontSize: 10, alignSelf: 'flex-start',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden',
  },
  statusLive: { color: colors.accent, backgroundColor: colors.accentSoft },
  statusConcept: { color: colors.fat, backgroundColor: colors.surfaceMuted },
});
