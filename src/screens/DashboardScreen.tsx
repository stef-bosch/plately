import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Icon } from '../components/BrandIcons';
import { MacroSummary } from '../components/MacroSummary';
import { MealCard } from '../components/MealCard';
import { Screen } from '../components/Screen';
import { formatDutchDate, mealTypeLabel } from '../constants/labels';
import { useDayMenu } from '../context/DayMenuContext';
import { getRecipeById } from '../data/recipes';
import { useAppNavigation, useOpenRecipe } from '../navigation/hooks';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { MealType, Recipe } from '../types';
import { sumNutrition } from '../utils/nutrition';

/** Meal groups in the order they read on a day's timeline. */
const MEAL_ORDER: MealType[] = ['ontbijt', 'lunch', 'tussendoortje', 'diner'];

interface DayMenuItem {
  entryId: string;
  recipe: Recipe;
  label: string;
}

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const openRecipe = useOpenRecipe();
  const { entries, removeFromDayMenu } = useDayMenu();

  const today = useMemo(() => new Date(), []);

  // Resolve each entry to its dish, dropping any that no longer exist.
  const resolved = useMemo(
    () =>
      entries
        .map((e) => ({ entryId: e.id, recipe: getRecipeById(e.recipeId) }))
        .filter(
          (x): x is { entryId: string; recipe: Recipe } => Boolean(x.recipe),
        ),
    [entries],
  );

  // Group by meal type, keeping insertion order, and number duplicates.
  const items = useMemo<DayMenuItem[]>(
    () =>
      MEAL_ORDER.flatMap((mealType) => {
        const inGroup = resolved.filter((r) => r.recipe.mealType === mealType);
        return inGroup.map((item, index) => ({
          entryId: item.entryId,
          recipe: item.recipe,
          label:
            inGroup.length > 1
              ? `${mealTypeLabel[mealType]} ${index + 1}`
              : mealTypeLabel[mealType],
        }));
      }),
    [resolved],
  );

  const totals = useMemo(
    () => sumNutrition(resolved.map((r) => r.recipe)),
    [resolved],
  );

  const isEmpty = items.length === 0;

  return (
    <Screen title="Vandaag" subtitle={formatDutchDate(today)}>
      {/* Daily nutrition summary */}
      <View style={styles.summaryCard}>
        <View style={styles.calorieRow}>
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
        <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
      </View>

      {/* Today's day menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mijn dagmenu</Text>
        {isEmpty ? (
          <View style={styles.emptyCard}>
            <Icon name="ChefHat" size={iconSize.hero} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Je dagmenu is nog leeg</Text>
            <Text style={styles.emptyText}>
              Open een recept en tik op “Toevoegen aan dagmenu”. De
              voedingswaarden worden hier automatisch bij elkaar opgeteld.
            </Text>
            <Button
              label="Naar recepten"
              variant="primary"
              onPress={() => navigation.navigate('Recepten')}
            />
          </View>
        ) : (
          <View style={styles.mealList}>
            {items.map((item) => (
              <MealCard
                key={item.entryId}
                mealType={item.recipe.mealType}
                recipe={item.recipe}
                labelOverride={item.label}
                onPress={() => openRecipe(item.recipe.id)}
                onRemove={() => removeFromDayMenu(item.entryId)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Navigation buttons */}
      {!isEmpty ? (
        <View style={styles.buttonRow}>
          <Button
            label="Recepten"
            brandIcon="ChefHat"
            variant="primary"
            onPress={() => navigation.navigate('Recepten')}
          />
          <Button
            label="Menu's"
            brandIcon="Menu"
            variant="secondary"
            onPress={() => navigation.navigate('Menus')}
          />
        </View>
      ) : null}
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
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  mealList: {
    gap: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
    ...shadow.card,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
