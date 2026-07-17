import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MealCard } from '../components/MealCard';
import { Screen } from '../components/Screen';
import {
  dayLabel,
  dayShort,
  getIsoWeekNumber,
  weekDayFromDate,
} from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { getWeeklyPlanForDate } from '../data/weeklyPlans';
import { useOpenRecipe } from '../navigation/hooks';
import { colors, radius, spacing, typography } from '../theme';
import type { WeekDayName } from '../types';
import { getDailyTotals, resolveDayMeals } from '../utils/nutrition';

export function WeekmenuScreen() {
  const openRecipe = useOpenRecipe();
  const { settings } = useSettings();

  const today = useMemo(() => new Date(), []);
  const weekNumber = getIsoWeekNumber(today);

  const [selectedDay, setSelectedDay] = useState<WeekDayName>(
    weekDayFromDate(today),
  );

  const plan = getWeeklyPlanForDate(today);
  const dayPlan =
    plan.days.find((d) => d.day === selectedDay) ?? plan.days[0];
  const meals = dayPlan.meals;
  // Weekmenu dishes are computed for the user's targets; recipes stay general.
  const day = useMemo(
    () => resolveDayMeals(meals, settings.nutritionProfile),
    [meals, settings.nutritionProfile],
  );
  const totals = useMemo(() => getDailyTotals(day), [day]);
  const { ontbijt, lunch, diner, snacks } = day;

  return (
    <Screen title="Weekmenu" subtitle={`Jouw plan voor week ${weekNumber}`}>
      {/* Day selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayRow}
      >
        {plan.days.map((d) => {
          const active = d.day === selectedDay;
          return (
            <Pressable
              key={d.day}
              onPress={() => setSelectedDay(d.day)}
              style={[styles.dayChip, active && styles.dayChipActive]}
            >
              <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                {dayShort[d.day]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Selected day */}
      <View style={styles.dayHeaderRow}>
        <Text style={styles.dayTitle}>{dayLabel[selectedDay]}</Text>
        <Text style={styles.dayCalories}>{totals.calories} kcal</Text>
      </View>

      <View style={styles.mealList}>
        {ontbijt ? (
          <MealCard mealType="ontbijt" recipe={ontbijt} onPress={() => openRecipe(ontbijt.id)} />
        ) : null}
        {lunch ? (
          <MealCard mealType="lunch" recipe={lunch} onPress={() => openRecipe(lunch.id)} />
        ) : null}
        {snacks.map((snack, index) => (
          <MealCard
            key={snack.id}
            mealType="tussendoortje"
            recipe={snack}
            labelOverride={snacks.length > 1 ? `Tussendoortje ${index + 1}` : undefined}
            onPress={() => openRecipe(snack.id)}
          />
        ))}
        {diner ? (
          <MealCard mealType="diner" recipe={diner} onPress={() => openRecipe(diner.id)} />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dayRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dayChip: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayChipText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  dayChipTextActive: {
    color: colors.textOnPrimary,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  dayCalories: {
    ...typography.bodyStrong,
    color: colors.accent,
  },
  mealList: {
    gap: spacing.md,
  },
});
