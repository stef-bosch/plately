import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PlatelyLogo } from '../components/BrandIcons';
import { FilterChip } from '../components/FilterChip';
import { Screen } from '../components/Screen';
import { Stepper } from '../components/Stepper';
import { dietaryLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { DietaryPreference } from '../types';

const DIETS: DietaryPreference[] = [
  'glutenvrij',
  'halal',
  'lactosevrij',
  'vegan',
  'vegetarisch',
];

export function InstellingenScreen() {
  const { settings, updateSettings } = useSettings();

  const toggleDiet = (diet: DietaryPreference) => {
    const has = settings.dietaryPreferences.includes(diet);
    updateSettings({
      dietaryPreferences: has
        ? settings.dietaryPreferences.filter((d) => d !== diet)
        : [...settings.dietaryPreferences, diet],
    });
  };

  return (
    <Screen title="Instellingen" subtitle="Stem Plately af op jouw voorkeuren">
      {/* Default servings */}
      <SettingCard title="Standaard aantal personen">
        <View style={styles.stepperWrap}>
          <Stepper
            value={settings.defaultServings}
            onChange={(n) => updateSettings({ defaultServings: n })}
          />
        </View>
      </SettingCard>

      {/* Dietary preferences */}
      <SettingCard title="Dieetvoorkeuren">
        <View style={styles.grid}>
          {DIETS.map((d) => (
            <FilterChip
              key={d}
              label={dietaryLabel[d]}
              active={settings.dietaryPreferences.includes(d)}
              onPress={() => toggleDiet(d)}
              style={styles.gridItemThird}
            />
          ))}
        </View>
      </SettingCard>

      <View style={styles.footer}>
        <PlatelyLogo width={130} color={colors.primary} />
        <Text style={styles.footerText}>versie 1.0</Text>
      </View>
    </Screen>
  );
}

function SettingCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  stepperWrap: {
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.sm,
    rowGap: spacing.sm,
  },
  gridItemThird: {
    width: '31%',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
