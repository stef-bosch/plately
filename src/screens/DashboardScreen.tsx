import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { MacroSummary } from '../components/MacroSummary';
import { MealCard } from '../components/MealCard';
import { Screen } from '../components/Screen';
import {
  formatDutchDate,
  weekDayFromDate,
} from '../constants/labels';
import { getRecipeById } from '../data/recipes';
import { getWeeklyPlan } from '../data/weeklyPlans';
import { useSettings } from '../context/SettingsContext';
import { useAppNavigation, useOpenRecipe } from '../navigation/hooks';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { getDailyTotals } from '../utils/nutrition';

export function DashboardScreen() {
  const navigation = useAppNavigation();
  const openRecipe = useOpenRecipe();
  const { settings } = useSettings();

  const today = useMemo(() => new Date(), []);
  const todayName = weekDayFromDate(today);
  const season = settings.preferredSeason;

  const plan = getWeeklyPlan(season);
  const dayPlan = plan.days.find((d) => d.day === todayName) ?? plan.days[0];
  const meals = dayPlan.meals;

  const totals = useMemo(
    () => getDailyTotals(meals, settings),
    [meals, settings],
  );

  const ontbijt = getRecipeById(meals.ontbijt, settings);
  const lunch = getRecipeById(meals.lunch, settings);
  const diner = getRecipeById(meals.diner, settings);
  const snacks = meals.tussendoortje
    .map((id) => getRecipeById(id, settings))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <Screen
      title="Vandaag"
      subtitle={formatDutchDate(today)}
    >
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
          ]}
        />
        <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
      </View>

      {/* Today's meals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maaltijden van vandaag</Text>
        <View style={styles.mealList}>
          {ontbijt ? (
            <MealCard
              mealType="ontbijt"
              recipe={ontbijt}
              onPress={() => openRecipe(ontbijt.id)}
            />
          ) : null}
          {lunch ? (
            <MealCard
              mealType="lunch"
              recipe={lunch}
              onPress={() => openRecipe(lunch.id)}
            />
          ) : null}
          {snacks.map((snack, index) => (
            <MealCard
              key={snack.id}
              mealType="tussendoortje"
              recipe={snack}
              labelOverride={
                snacks.length > 1 ? `Tussendoortje ${index + 1}` : undefined
              }
              onPress={() => openRecipe(snack.id)}
            />
          ))}
          {diner ? (
            <MealCard
              mealType="diner"
              recipe={diner}
              onPress={() => openRecipe(diner.id)}
            />
          ) : null}
        </View>
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonRow}>
        <Button
          label="Weekmenu"
          brandIcon="Calendar"
          variant="primary"
          onPress={() => navigation.navigate('Weekmenu')}
        />
        <Button
          label="Recepten"
          brandIcon="ChefHat"
          variant="secondary"
          onPress={() => navigation.navigate('Recepten')}
        />
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
