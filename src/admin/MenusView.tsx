import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import type { MenuRow } from '../data/adminApi';
import { colors, spacing, typography } from '../theme';
import type { Menu } from '../types';
import { formatDateLong } from '../utils/isoWeek';
import { IconAction, QuickAction, StatCard, ov } from './overviewKit';

const ALL = 'alle';

interface Props {
  rows: MenuRow[];
  loading: boolean;
  /** Recipe ids that exist, so menus pointing at removed dishes can be flagged. */
  knownRecipeIds: Set<string>;
  onNew: () => void;
  onNewRecipe: () => void;
  onGoToRecipes: () => void;
  onEdit: (row: MenuRow) => void;
  onDuplicate: (row: MenuRow) => void;
  onDelete: (row: MenuRow) => void;
}

const menuOf = (row: MenuRow) => row.data as Menu;
const coursesOf = (row: MenuRow) => menuOf(row)?.courses ?? [];
const recipeIdsOf = (row: MenuRow) => coursesOf(row).flatMap((c) => c.recipeIds ?? []);

export function MenusView({
  rows,
  loading,
  knownRecipeIds,
  onNew,
  onNewRecipe,
  onGoToRecipes,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string>(ALL);

  /** Recipe ids a menu references that no longer exist. */
  const missingOf = (row: MenuRow) =>
    [...new Set(recipeIdsOf(row))].filter((id) => !knownRecipeIds.has(id));

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => (menuOf(r)?.tags ?? []).forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([t, count]) => ({ tag: t, count }));
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (tag !== ALL && !(menuOf(r)?.tags ?? []).includes(tag as never)) return false;
      return !q || r.title.toLowerCase().includes(q);
    });
  }, [rows, query, tag]);

  const recent = useMemo(
    () => [...rows].sort((a, b) => (b.updated_at ?? '').localeCompare(a.updated_at ?? '')).slice(0, 5),
    [rows],
  );

  const totalCourses = rows.reduce((n, r) => n + coursesOf(r).length, 0);
  const uniqueRecipes = new Set(rows.flatMap(recipeIdsOf)).size;
  const withMissing = rows.filter((r) => missingOf(r).length > 0).length;

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />;
  }

  return (
    <View style={ov.wrap}>
      {/* ---------- main column ---------- */}
      <View style={ov.main}>
        <View style={ov.statRow}>
          <StatCard icon="albums-outline" label="Totaal menu's" value={rows.length} />
          <StatCard icon="layers-outline" label="Gangen totaal" value={totalCourses} />
          <StatCard icon="restaurant-outline" label="Recepten in menu's" value={uniqueRecipes} />
          <StatCard
            icon="alert-circle-outline"
            label="Met ontbrekende recepten"
            value={withMissing}
            tone={withMissing > 0 ? 'warn' : undefined}
          />
        </View>

        <View style={ov.panel}>
          <View style={ov.searchBox}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={ov.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek menu…"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
            {query ? (
              <Ionicons name="close-circle" size={18} color={colors.textMuted} onPress={() => setQuery('')} />
            ) : null}
          </View>
          {tagCounts.length > 0 ? (
            <View style={ov.chipRow}>
              <FilterChip label="Alle tags" active={tag === ALL} onPress={() => setTag(ALL)} />
              {tagCounts.map((t) => (
                <FilterChip
                  key={t.tag}
                  label={`${t.tag} (${t.count})`}
                  active={tag === t.tag}
                  onPress={() => setTag(tag === t.tag ? ALL : t.tag)}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={ov.panel}>
          <View style={ov.tableHead}>
            <Text style={ov.h2}>Alle menu's ({visible.length})</Text>
            <Pressable onPress={onNew} style={({ pressed }) => [ov.newButton, pressed && ov.pressed]}>
              <Ionicons name="add" size={18} color={colors.textOnPrimary} />
              <Text style={ov.newButtonText}>Menu toevoegen</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              <View style={[ov.row, ov.headRow]}>
                <Text style={[ov.headCell, styles.colName]}>Menu</Text>
                <Text style={[ov.headCell, styles.colCourses]}>Gangen</Text>
                <Text style={[ov.headCell, styles.colDishes]}>Recepten</Text>
                <Text style={[ov.headCell, styles.colServings]}>Personen</Text>
                <Text style={[ov.headCell, styles.colTags]}>Tags</Text>
                <Text style={[ov.headCell, styles.colDate]}>Laatst gewijzigd</Text>
                <Text style={[ov.headCell, styles.colActions]}>Acties</Text>
              </View>

              {visible.length === 0 ? (
                <Text style={ov.empty}>
                  {rows.length === 0 ? "Nog geen menu's. Voeg er een toe." : "Geen menu's gevonden."}
                </Text>
              ) : (
                visible.map((row) => {
                  const m = menuOf(row);
                  const missing = missingOf(row);
                  return (
                    <View key={row.id} style={ov.row}>
                      <View style={styles.colName}>
                        <Text style={ov.cellTitle} numberOfLines={1}>{row.title}</Text>
                        {missing.length > 0 ? (
                          <Text style={styles.warnTag}>
                            {missing.length} ontbrekend recept{missing.length === 1 ? '' : 'en'}
                          </Text>
                        ) : m?.subtitle ? (
                          <Text style={ov.cellMuted} numberOfLines={1}>{m.subtitle}</Text>
                        ) : null}
                      </View>
                      <Text style={[ov.cell, styles.colCourses]}>{coursesOf(row).length}</Text>
                      <Text style={[ov.cell, styles.colDishes]}>{recipeIdsOf(row).length}</Text>
                      <Text style={[ov.cell, styles.colServings]}>{m?.baseServings ?? '—'}</Text>
                      <View style={[styles.colTags, ov.tagWrap]}>
                        {(m?.tags ?? []).length === 0 ? (
                          <Text style={ov.cellMuted}>—</Text>
                        ) : (
                          (m?.tags ?? []).map((t) => <Text key={t} style={ov.tag}>{t}</Text>)
                        )}
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
          <Text style={ov.h2}>Tags</Text>
          {tagCounts.length === 0 ? (
            <Text style={ov.empty}>Nog geen tags in gebruik.</Text>
          ) : (
            tagCounts.map((t) => (
              <Pressable
                key={t.tag}
                onPress={() => setTag(tag === t.tag ? ALL : t.tag)}
                style={({ pressed }) => [ov.sideRow, pressed && ov.pressed]}
              >
                <Text style={[ov.sideRowText, tag === t.tag && ov.sideRowActive]} numberOfLines={1}>
                  {t.tag}
                </Text>
                <Text style={ov.sideCount}>{t.count}</Text>
              </Pressable>
            ))
          )}
        </View>

        <View style={ov.panel}>
          <Text style={ov.h2}>Snelle acties</Text>
          <QuickAction icon="albums-outline" label="Menu toevoegen" onPress={onNew} />
          <QuickAction icon="restaurant-outline" label="Recept toevoegen" onPress={onNewRecipe} />
          <QuickAction icon="list-outline" label="Naar recepten" onPress={onGoToRecipes} />
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
  table: { minWidth: 900 },
  colName: { width: 280 },
  colCourses: { width: 80 },
  colDishes: { width: 90 },
  colServings: { width: 90 },
  colTags: { width: 180 },
  colDate: { width: 130 },
  colActions: { width: 110 },
  warnTag: { ...typography.caption, color: colors.fat, fontSize: 10 },
});
