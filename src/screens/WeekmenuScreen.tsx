import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { getRecipeById } from '../data/recipes';
import { getWeeklyPlanForDate } from '../data/weeklyPlans';
import { useOpenRecipe } from '../navigation/hooks';
import { colors, iconSize, radius, spacing, typography } from '../theme';
import type { WeekDayName } from '../types';
import { getDailyTotals } from '../utils/nutrition';
import { printWeekShoppingList } from '../utils/shoppingListPdf';

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

  const [downloading, setDownloading] = useState(false);
  const handleDownloadList = async () => {
    if (downloading) return;
    try {
      setDownloading(true);
      await printWeekShoppingList(plan, weekNumber, settings);
    } catch (error) {
      console.warn('Boodschappenlijst maken mislukt', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Screen title="Weekmenu" subtitle={`Jouw plan voor week ${weekNumber}`}>
      {/* Shopping list download */}
      <Pressable
        onPress={handleDownloadList}
        disabled={downloading}
        accessibilityRole="button"
        accessibilityLabel="Boodschappenlijst downloaden"
        style={({ pressed }) => [
          styles.listButton,
          pressed && styles.listButtonPressed,
          downloading && styles.listButtonDisabled,
        ]}
      >
        {downloading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons
            name="download-outline"
            size={iconSize.action}
            color={colors.primary}
          />
        )}
        <Text style={styles.listButtonText}>
          {downloading ? 'Bezig…' : 'Boodschappenlijst downloaden'}
        </Text>
      </Pressable>

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
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listButtonPressed: {
    opacity: 0.85,
  },
  listButtonDisabled: {
    opacity: 0.6,
  },
  listButtonText: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
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
