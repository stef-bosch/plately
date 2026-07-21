import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { dayLabel, dayOrder, dishCategory, getIsoWeekNumber } from '../constants/labels';
import { getWeekMenu, saveWeekMenu, type DishRow } from '../data/adminApi';
import { reloadContent } from '../data/content';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { DayMeals, MealSlot, Recipe, StoredWeekMenu, WeekDayName } from '../types';
import {
  addWeeks,
  dayDateInWeek,
  formatDayShort,
  formatWeekRange,
  getIsoWeekYear,
  startOfIsoWeek,
  weekIdFor,
} from '../utils/isoWeek';
import { formKit } from './formKit';

/** The four slots a day can hold, in the order they're shown. */
const SLOTS: { key: MealSlot; label: string; icon: keyof typeof Ionicons.glyphMap; category: string }[] = [
  { key: 'ontbijt', label: 'Ontbijt', icon: 'sunny-outline', category: 'Ontbijt' },
  { key: 'lunch', label: 'Lunch', icon: 'partly-sunny-outline', category: 'Lunch' },
  { key: 'diner', label: 'Diner', icon: 'moon-outline', category: 'Diner' },
  { key: 'tussendoortje', label: 'Snack', icon: 'nutrition-outline', category: 'Tussendoortjes' },
];

const TOTAL_SLOTS = dayOrder.length * SLOTS.length;

const emptyDay = (): DayMeals => ({ ontbijt: '', lunch: '', tussendoortje: [], diner: '' });

function emptyWeek(): Record<WeekDayName, DayMeals> {
  return dayOrder.reduce<Record<WeekDayName, DayMeals>>((acc, day) => {
    acc[day] = emptyDay();
    return acc;
  }, {} as Record<WeekDayName, DayMeals>);
}

/** The dish id in a slot ('' when empty). Snacks are stored as an array. */
function slotValue(meals: DayMeals, slot: MealSlot): string {
  return slot === 'tussendoortje' ? meals.tussendoortje[0] ?? '' : meals[slot];
}

function withSlot(meals: DayMeals, slot: MealSlot, id: string): DayMeals {
  if (slot === 'tussendoortje') return { ...meals, tussendoortje: id ? [id] : [] };
  return { ...meals, [slot]: id };
}

interface Props {
  /** The recipe library to plan from. */
  dishRows: DishRow[];
  onNewDish: () => void;
  onEditDish: (row: DishRow) => void;
}

export function WeekmenuBuilder({ dishRows, onNewDish, onEditDish }: Props) {
  const [anchor, setAnchor] = useState(() => startOfIsoWeek(new Date()));
  const [days, setDays] = useState<Record<WeekDayName, DayMeals>>(emptyWeek);
  const [stored, setStored] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ day: WeekDayName; slot: MealSlot } | null>(null);
  const [query, setQuery] = useState('');

  const weekId = weekIdFor(anchor);
  const weekNumber = getIsoWeekNumber(anchor);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wm = await getWeekMenu(weekIdFor(anchor));
      setDays(wm?.days ? { ...emptyWeek(), ...wm.days } : emptyWeek());
      setStored(Boolean(wm));
    } catch (e) {
      setDays(emptyWeek());
      setStored(false);
      setError(
        `Weekmenu laden mislukt: ${(e as Error).message}. Draai supabase/weekmenu.sql als de tabel nog niet bestaat.`,
      );
    } finally {
      setDirty(false);
      setSelected(null);
      setLoading(false);
    }
  }, [anchor]);

  useEffect(() => {
    load();
  }, [load]);

  // Dish lookup by id, plus the pool shown in the side panel.
  const dishById = useMemo(() => {
    const map = new Map<string, DishRow>();
    dishRows.forEach((r) => map.set(r.id, r));
    return map;
  }, [dishRows]);

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishRows.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false;
      // While a slot is selected, only offer dishes for that meal.
      if (selected) {
        const wanted = SLOTS.find((s) => s.key === selected.slot)?.category;
        if (wanted && dishCategory(r.data as Recipe) !== wanted) return false;
      }
      return true;
    });
  }, [dishRows, query, selected]);

  const setSlot = (day: WeekDayName, slot: MealSlot, id: string) => {
    setDays((prev) => ({ ...prev, [day]: withSlot(prev[day], slot, id) }));
    setDirty(true);
  };

  const addToSelected = (row: DishRow) => {
    if (!selected) return;
    setSlot(selected.day, selected.slot, row.id);
    setSelected(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const weekMenu: StoredWeekMenu = {
        id: weekId,
        year: getIsoWeekYear(anchor),
        week: weekNumber,
        days,
      };
      await saveWeekMenu(weekMenu);
      await reloadContent();
      setStored(true);
      setDirty(false);
      setFlash('Weekmenu opgeslagen');
      setTimeout(() => setFlash(null), 2500);
    } catch (e) {
      setError(
        `Opslaan mislukt: ${(e as Error).message}. Draai supabase/weekmenu.sql als de tabel nog niet bestaat.`,
      );
    } finally {
      setSaving(false);
    }
  };

  // Week overview numbers.
  const filledIds = dayOrder.flatMap((day) =>
    SLOTS.map((s) => slotValue(days[day], s.key)).filter(Boolean),
  );
  const uniqueCount = new Set(filledIds).size;
  const emptyCount = TOTAL_SLOTS - filledIds.length;
  const completeness = Math.round((filledIds.length / TOTAL_SLOTS) * 100);

  return (
    <View style={styles.wrap}>
      {/* ---------- main column ---------- */}
      <View style={styles.main}>
        <View style={styles.toolbar}>
          <View style={styles.weekNav}>
            <Pressable onPress={() => setAnchor((d) => addWeeks(d, -1))} style={({ pressed }) => [styles.navArrow, pressed && styles.pressed]}>
              <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
            </Pressable>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <View>
              <Text style={styles.weekRange}>{formatWeekRange(anchor)}</Text>
              <Text style={styles.weekMeta}>Week {weekNumber}</Text>
            </View>
            <Pressable onPress={() => setAnchor((d) => addWeeks(d, 1))} style={({ pressed }) => [styles.navArrow, pressed && styles.pressed]}>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={[styles.statusChip, stored ? styles.statusSaved : styles.statusDraft]}>
            <Text style={[styles.statusText, stored ? styles.statusTextSaved : styles.statusTextDraft]}>
              {dirty ? 'Niet opgeslagen' : stored ? 'Opgeslagen' : 'Nog niet samengesteld'}
            </Text>
          </View>

          <Pressable
            onPress={save}
            disabled={saving || loading}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, (saving || loading) && styles.disabled]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary} />
            ) : (
              <Ionicons name="save-outline" size={18} color={colors.textOnPrimary} />
            )}
            <Text style={styles.saveButtonText}>Weekmenu opslaan</Text>
          </Pressable>
        </View>

        {error ? <Text style={formKit.error}>{error}</Text> : null}
        {flash ? <Text style={styles.flash}>{flash}</Text> : null}
        {!loading && !stored ? (
          <Text style={styles.hint}>
            Deze week is nog niet samengesteld — de app vult 'm automatisch aan
            met je recepten. Zodra je hier opslaat, wint deze week.
          </Text>
        ) : null}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* day headers */}
              <View style={styles.gridRow}>
                <View style={styles.slotLabelCell} />
                {dayOrder.map((day, i) => (
                  <View key={day} style={styles.dayHeadCell}>
                    <Text style={styles.dayHeadName}>{dayLabel[day]}</Text>
                    <Text style={styles.dayHeadDate}>{formatDayShort(dayDateInWeek(anchor, i))}</Text>
                  </View>
                ))}
              </View>

              {SLOTS.map((slot) => (
                <View key={slot.key} style={styles.gridRow}>
                  <View style={styles.slotLabelCell}>
                    <Ionicons name={slot.icon} size={18} color={colors.primary} />
                    <Text style={styles.slotLabelText}>{slot.label}</Text>
                  </View>
                  {dayOrder.map((day) => {
                    const id = slotValue(days[day], slot.key);
                    const row = id ? dishById.get(id) : undefined;
                    const isSelected = selected?.day === day && selected?.slot === slot.key;

                    if (id) {
                      return (
                        <View key={day} style={[styles.cell, styles.cellFilled]}>
                          <Text style={styles.cellTitle} numberOfLines={2}>
                            {row?.title ?? 'Onbekend recept'}
                          </Text>
                          <Text style={styles.cellMeta} numberOfLines={1}>
                            {row ? dishCategory(row.data as Recipe) : 'niet meer beschikbaar'}
                          </Text>
                          <Pressable
                            onPress={() => setSlot(day, slot.key, '')}
                            accessibilityLabel="Gerecht verwijderen"
                            style={styles.cellRemove}
                          >
                            <Ionicons name="close" size={14} color={colors.textMuted} />
                          </Pressable>
                        </View>
                      );
                    }

                    return (
                      <Pressable
                        key={day}
                        onPress={() => setSelected(isSelected ? null : { day, slot: slot.key })}
                        style={({ pressed }) => [
                          styles.cell,
                          styles.cellEmpty,
                          isSelected && styles.cellSelected,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Ionicons name="add" size={16} color={isSelected ? colors.primary : colors.textMuted} />
                        <Text style={[styles.cellAddText, isSelected && styles.cellAddTextActive]}>
                          Recept toevoegen
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        <View style={styles.tipBar}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.tipText}>
            Klik op een lege plek om die te kiezen en voeg rechts een recept toe.
            Met × haal je een recept weer weg.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Weekoverzicht</Text>
          <View style={styles.overviewRow}>
            <Overview icon="restaurant-outline" value={filledIds.length} label="Recepten" />
            <Overview icon="sparkles-outline" value={uniqueCount} label="Unieke recepten" />
            <Overview icon="square-outline" value={emptyCount} label="Lege slots" />
            <Overview icon="checkmark-circle-outline" value={`${completeness}%`} label="Volledigheid" />
          </View>
        </View>
      </View>

      {/* ---------- side panel ---------- */}
      <View style={styles.side}>
        <View style={styles.panel}>
          <View style={styles.sideHeader}>
            <Text style={styles.panelTitle}>Beschikbare recepten</Text>
            <Pressable onPress={onNewDish} style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}>
              <Ionicons name="add" size={16} color={colors.textOnPrimary} />
              <Text style={styles.newButtonText}>Nieuw</Text>
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek recepten…"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
            />
          </View>

          {available.length === 0 ? (
            <Text style={styles.hint}>
              {dishRows.length === 0
                ? 'Nog geen recepten. Voeg er een toe met "Nieuw".'
                : 'Geen recepten die hierbij passen.'}
            </Text>
          ) : (
            available.map((row) => (
              <View key={row.id} style={styles.dishRow}>
                <Pressable
                  onPress={() => addToSelected(row)}
                  disabled={!selected}
                  style={({ pressed }) => [{ flex: 1 }, pressed && selected && styles.pressed, !selected && styles.dishRowIdle]}
                >
                  <Text style={styles.dishTitle} numberOfLines={1}>{row.title}</Text>
                  <Text style={styles.dishMeta}>{dishCategory(row.data as Recipe)}</Text>
                </Pressable>
                <Pressable onPress={() => onEditDish(row)} style={styles.rowIcon} accessibilityLabel={`${row.title} bewerken`}>
                  <Ionicons name="create-outline" size={18} color={colors.textMuted} />
                </Pressable>
                <Pressable
                  onPress={() => addToSelected(row)}
                  disabled={!selected}
                  style={styles.rowIcon}
                  accessibilityLabel={`${row.title} toevoegen`}
                >
                  <Ionicons name="add-circle" size={22} color={selected ? colors.primary : colors.border} />
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View style={styles.panel}>
          {selected ? (
            <>
              <View style={styles.sideHeader}>
                <Text style={styles.selectedTitle}>
                  {dayLabel[selected.day]} · {SLOTS.find((s) => s.key === selected.slot)?.label} geselecteerd
                </Text>
                <Pressable onPress={() => setSelected(null)} style={styles.clearLink}>
                  <Ionicons name="close" size={14} color={colors.textSecondary} />
                  <Text style={styles.clearText}>Wissen</Text>
                </Pressable>
              </View>
              <Text style={styles.hint}>Kies hierboven een recept om het toe te voegen.</Text>
            </>
          ) : (
            <Text style={styles.hint}>
              Nog geen plek gekozen. Klik in het weekraster op "Recept toevoegen".
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function Overview({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.overviewItem}>
      <View style={styles.overviewIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.overviewValue}>{value}</Text>
        <Text style={styles.overviewLabel}>{label}</Text>
      </View>
    </View>
  );
}

const CELL_WIDTH = 150;

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-start' },
  main: { flexGrow: 1, flexBasis: 640, gap: spacing.md },
  side: { width: 320, gap: spacing.lg },

  toolbar: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...shadow.soft,
  },
  weekNav: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  navArrow: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  weekRange: { ...typography.bodyStrong, color: colors.textPrimary },
  weekMeta: { ...typography.caption, color: colors.textMuted },
  statusChip: { borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  statusDraft: { backgroundColor: colors.surfaceMuted },
  statusSaved: { backgroundColor: colors.accentSoft },
  statusText: { ...typography.caption },
  statusTextDraft: { color: colors.textSecondary },
  statusTextSaved: { color: colors.accent },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  saveButtonText: { ...typography.label, color: colors.textOnPrimary },

  flash: { ...typography.label, color: colors.accent },
  hint: { ...typography.caption, color: colors.textSecondary },

  gridRow: { flexDirection: 'row', alignItems: 'stretch' },
  slotLabelCell: { width: 104, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  slotLabelText: { ...typography.label, color: colors.textPrimary },
  dayHeadCell: { width: CELL_WIDTH, paddingHorizontal: spacing.xs, paddingBottom: spacing.sm },
  dayHeadName: { ...typography.label, color: colors.textPrimary },
  dayHeadDate: { ...typography.caption, color: colors.textMuted },

  cell: {
    width: CELL_WIDTH - spacing.sm, minHeight: 76, marginRight: spacing.sm, marginBottom: spacing.sm,
    borderRadius: radius.md, padding: spacing.sm, justifyContent: 'center',
  },
  cellFilled: { backgroundColor: colors.surfaceMuted },
  cellEmpty: {
    alignItems: 'center', gap: 2,
    borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surface,
  },
  cellSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  cellTitle: { ...typography.caption, color: colors.textPrimary },
  cellMeta: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  cellAddText: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  cellAddTextActive: { color: colors.primary },
  cellRemove: { position: 'absolute', top: 4, right: 4, padding: 2 },

  tipBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, ...shadow.soft,
  },
  tipText: { ...typography.caption, color: colors.textSecondary, flex: 1 },

  panel: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.sm, ...shadow.soft,
  },
  panelTitle: { ...typography.heading, color: colors.textPrimary },
  overviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  overviewItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexGrow: 1, flexBasis: 150 },
  overviewIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  overviewValue: { ...typography.subheading, color: colors.textPrimary },
  overviewLabel: { ...typography.caption, color: colors.textSecondary },

  sideHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  newButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary,
    borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  newButtonText: { ...typography.caption, color: colors.textOnPrimary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  searchInput: { ...typography.body, color: colors.textPrimary, flex: 1 },
  dishRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  dishRowIdle: { opacity: 0.6 },
  rowIcon: { padding: spacing.xs },
  dishTitle: { ...typography.body, color: colors.textPrimary },
  dishMeta: { ...typography.caption, color: colors.textMuted },
  selectedTitle: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },
  clearLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  clearText: { ...typography.caption, color: colors.textSecondary },

  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
