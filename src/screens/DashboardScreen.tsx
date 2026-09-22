import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MealIcon } from '../components/BrandIcons';
import { DishThumb } from '../components/DishThumb';
import { MacroSummary } from '../components/MacroSummary';
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

  // Resolve entries to dishes + their effective slot (legacy entries fall back
  // to the dish's mealType); drop dishes that no longer exist.
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

  const totals = useMemo(() => sumNutrition(planned.map((p) => p.recipe)), [planned]);
  const hasAny = planned.length > 0;

  return (
    <Screen title="Vandaag" subtitle={formatDutchDate(today)}>
      {/* Daily nutrition total — only once something is planned. */}
      {hasAny ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryHead}>
            <View style={styles.leafCircle}>
              <Ionicons name="leaf" size={iconSize.action} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.calorieLabel}>Totaal vandaag</Text>
              <View style={styles.calorieValueRow}>
                <Text style={styles.calorieValue}>{totals.calories}</Text>
                <Text style={styles.calorieUnit}>kcal</Text>
              </View>
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

          <View style={styles.indicativeRow}>
            <Ionicons name="information-circle-outline" size={iconSize.badge} color={colors.textMuted} />
            <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
          </View>
        </View>
      ) : null}

      {/* Day planner: one card per meal moment. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mijn dagmenu</Text>
        <View style={styles.planner}>
          {MOMENTS.map(({ slot, label }) => {
            const dishes = planned.filter((p) => p.slot === slot);
            if (dishes.length === 0) {
              return (
                <Pressable
                  key={slot}
                  onPress={() => navigation.navigate('KiesRecept', { slot })}
                  accessibilityRole="button"
                  accessibilityLabel={`${label}: gerecht plannen`}
                  style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                >
                  <View style={styles.emptyThumb}>
                    <MealIcon mealType={slot} size={22} color={colors.primary} />
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.momentLabel}>{label}</Text>
                    <Text style={styles.title}>Nog niets gepland</Text>
                    <Text style={styles.subtitle}>Voeg een recept toe</Text>
                  </View>
                  <View style={styles.action}>
                    <Ionicons name="add" size={iconSize.action} color={colors.primary} />
                  </View>
                </Pressable>
              );
            }
            return dishes.map((dish) => (
              <Pressable
                key={dish.entryId}
                onPress={() => openRecipe(dish.recipe.id)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              >
                <View style={styles.thumbWrap}>
                  <DishThumb recipe={dish.recipe} style={styles.thumb} iconSize={22} />
                  <Pressable
                    onPress={() => removeFromDayMenu(dish.entryId)}
                    accessibilityRole="button"
                    accessibilityLabel={`${dish.recipe.title} uit dagmenu verwijderen`}
                    hitSlop={10}
                    style={styles.removeBadge}
                  >
                    <Ionicons name="close" size={13} color={colors.textSecondary} />
                  </Pressable>
                </View>
                <View style={styles.body}>
                  <Text style={styles.momentLabel}>{label}</Text>
                  <Text style={styles.title} numberOfLines={2}>
                    {dish.recipe.title}
                  </Text>
                  <Text style={styles.subtitle}>
                    {dish.recipe.nutrition.calories} kcal ·{' '}
                    {dish.recipe.prepTime + dish.recipe.cookTime} min
                  </Text>
                </View>
                <View style={styles.action}>
                  <Ionicons name="chevron-forward" size={iconSize.action} color={colors.primary} />
                </View>
              </Pressable>
            ));
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
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.card,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  leafCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
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
  indicativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  indicative: {
    ...typography.caption,
    color: colors.textMuted,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  planner: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.soft,
  },
  thumbWrap: {
    position: 'relative',
  },
  thumb: {
    width: 56,
    height: 70,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyThumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  momentLabel: {
    ...typography.caption,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  action: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
