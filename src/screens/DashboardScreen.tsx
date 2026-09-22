import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MacroSummary } from '../components/MacroSummary';
import { MealCard } from '../components/MealCard';
import { Screen } from '../components/Screen';
import { formatDutchDate } from '../constants/labels';
import { useDayMenu } from '../context/DayMenuContext';
import { getRecipeById } from '../data/recipes';
import { useAppNavigation, useOpenRecipe } from '../navigation/hooks';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { MealType, Recipe } from '../types';
import { sumNutrition } from '../utils/nutrition';

/** The meal moments, in the order they read on a day's timeline. */
const MOMENTS: { slot: MealType; label: string }[] = [
  { slot: 'ontbijt', label: 'Ontbijt' },
  { slot: 'lunch', label: 'Lunch' },
  { slot: 'diner', label: 'Diner' },
  { slot: 'tussendoortje', label: 'Tussendoor' },
];

interface PlannedDish {
  entryId: string;
  recipe: Recipe;
  slot: MealType;
}

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const openRecipe = useOpenRecipe();
  const { entries, removeFromDayMenu } = useDayMenu();

  const today = useMemo(() => new Date(), []);

  // Resolve each entry to its dish and effective slot (legacy entries fall back
  // to the dish's own mealType); drop dishes that no longer exist.
  const planned = useMemo<PlannedDish[]>(
    () =>
      entries
        .map((e) => {
          const recipe = getRecipeById(e.recipeId);
          return recipe
            ? { entryId: e.id, recipe, slot: e.slot ?? recipe.mealType }
            : null;
        })
        .filter((x): x is PlannedDish => x !== null),
    [entries],
  );

  const totals = useMemo(
    () => sumNutrition(planned.map((p) => p.recipe)),
    [planned],
  );
  const hasAny = planned.length > 0;

  return (
    <Screen title="Vandaag" subtitle={formatDutchDate(today)}>
      {/* Daily nutrition total — only once something is planned. */}
      {hasAny ? (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.calorieLabel}>Totaal vandaag</Text>
            <View style={styles.calorieValueRow}>
              <Text style={styles.calorieValue}>{totals.calories}</Text>
              <Text style={styles.calorieUnit}>kcal</Text>
            </View>
          </View>
          <MacroSummary
            items={[
              { label: 'Koolhydraten', value: totals.carbs, unit: 'g', color: colors.carbs },
              { label: 'Eiwitten', value: totals.protein, unit: 'g', color: colors.protein },
              { label: 'Vetten', value: totals.fat, unit: 'g', color: colors.fat },
              { label: 'Vezels', value: totals.fiber, unit: 'g', color: colors.fiber },
            ]}
          />
          <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
        </View>
      ) : null}

      {/* Day planner: one row per meal moment. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mijn dagmenu</Text>
        <View style={styles.planner}>
          {MOMENTS.map(({ slot, label }) => {
            const dishes = planned.filter((p) => p.slot === slot);
            return (
              <View key={slot} style={styles.moment}>
                <Text style={styles.momentLabel}>{label}</Text>
                {dishes.map((dish) => (
                  <MealCard
                    key={dish.entryId}
                    mealType={slot}
                    recipe={dish.recipe}
                    hideLabel
                    onPress={() => openRecipe(dish.recipe.id)}
                    onRemove={() => removeFromDayMenu(dish.entryId)}
                  />
                ))}
                {dishes.length === 0 ? (
                  <Pressable
                    onPress={() => navigation.navigate('KiesRecept', { slot })}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}: gerecht plannen`}
                    style={({ pressed }) => [
                      styles.placeholder,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.addIcon}>
                      <Ionicons name="add" size={iconSize.action} color={colors.primary} />
                    </View>
                    <Text style={styles.placeholderText}>Nog niets gepland</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => navigation.navigate('KiesRecept', { slot })}
                    accessibilityRole="button"
                    accessibilityLabel={`${label}: nog een gerecht toevoegen`}
                    style={({ pressed }) => [styles.addMore, pressed && styles.pressed]}
                  >
                    <Ionicons name="add" size={iconSize.badge} color={colors.primary} />
                    <Text style={styles.addMoreText}>Gerecht toevoegen</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadow.card,
  },
  calorieLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  calorieValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  calorieValue: {
    ...typography.display,
    fontSize: 38,
    color: colors.textPrimary,
  },
  calorieUnit: {
    ...typography.subheading,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  indicative: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  planner: {
    gap: spacing.lg,
  },
  moment: {
    gap: spacing.sm,
  },
  momentLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    alignSelf: 'flex-start',
  },
  addMoreText: {
    ...typography.label,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
