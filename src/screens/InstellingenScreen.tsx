import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { PlatelyLogo } from '../components/BrandIcons';
import { FilterChip } from '../components/FilterChip';
import { Screen } from '../components/Screen';
import { Stepper } from '../components/Stepper';
import { dietaryLabel, seasonLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { DietaryPreference, Season } from '../types';

const SEASONS: Season[] = ['lente-zomer', 'herfst-winter'];
const DIETS: DietaryPreference[] = [
  'vegetarisch',
  'glutenvrij',
  'lactosevrij',
  'notenvrij',
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

      {/* Preferred season */}
      <SettingCard title="Voorkeur seizoen">
        <View style={styles.grid}>
          {SEASONS.map((s) => (
            <FilterChip
              key={s}
              label={seasonLabel[s]}
              active={settings.preferredSeason === s}
              onPress={() => updateSettings({ preferredSeason: s })}
              style={styles.gridItemHalf}
            />
          ))}
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

      {/* Micronutrients */}
      <SettingCard title="Weergave">
        <View style={styles.rowBetween}>
          <View style={styles.switchText}>
            <Text style={styles.switchLabel}>Micronutriënten tonen</Text>
            <Text style={styles.helperText}>
              Toon vitaminen en mineralen bij recepten
            </Text>
          </View>
          <Switch
            value={settings.showMicronutrients}
            onValueChange={(v) => updateSettings({ showMicronutrients: v })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
            // `activeThumbColor` is a react-native-web prop: without it the web
            // Switch falls back to a teal thumb when on. Keep the knob white so
            // the control reads as fully orange on every platform.
            {...({ activeThumbColor: colors.surface } as object)}
          />
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchLabel: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  gridItemHalf: {
    width: '48.5%',
  },
  gridItemThird: {
    width: '31.5%',
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
