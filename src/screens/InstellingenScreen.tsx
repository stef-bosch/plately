import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandLogoStacked, Icon } from '../components/BrandIcons';
import { FilterChip } from '../components/FilterChip';
import { Screen } from '../components/Screen';
import { Stepper } from '../components/Stepper';
import { dietaryLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { DietaryPreference, NutritionGoal } from '../types';

const DIETS: DietaryPreference[] = [
  'glutenvrij',
  'halal',
  'lactosevrij',
  'vegan',
  'vegetarisch',
];

const GOALS: { value: NutritionGoal; label: string }[] = [
  { value: 'eiwitrijk', label: 'Eiwitrijk' },
  { value: 'balans', label: 'In balans' },
  { value: 'lichter', label: 'Lichter eten' },
];

function dietIcon(diet: DietaryPreference): React.ReactNode {
  const c = colors.primary;
  switch (diet) {
    case 'glutenvrij':
      return <Icon name="Grain" size={16} color={c} />;
    case 'halal':
      return <Ionicons name="moon-outline" size={16} color={c} />;
    case 'lactosevrij':
      return <Ionicons name="water-outline" size={16} color={c} />;
    case 'vegan':
      return <Ionicons name="leaf-outline" size={16} color={c} />;
    case 'vegetarisch':
      return <Ionicons name="nutrition-outline" size={16} color={c} />;
  }
}

function goalIcon(goal: NutritionGoal): React.ReactNode {
  const c = colors.primary;
  switch (goal) {
    case 'eiwitrijk':
      return <Ionicons name="barbell-outline" size={16} color={c} />;
    case 'balans':
      return <Ionicons name="restaurant-outline" size={16} color={c} />;
    case 'lichter':
      return <Ionicons name="leaf-outline" size={16} color={c} />;
  }
}

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
    <Screen title="Instellingen" subtitle="Stem ChefStef af op jouw voorkeuren">
      {/* Default servings */}
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <IconCircle icon={<Ionicons name="people-outline" size={20} color={colors.primary} />} />
          <View style={styles.settingText}>
            <Text style={styles.rowTitle}>Standaard aantal personen</Text>
            <Text style={styles.rowDesc}>
              Voor hoeveel personen wil je standaard recepten zien?
            </Text>
          </View>
          <View style={styles.stepperPill}>
            <Stepper
              value={settings.defaultServings}
              onChange={(n) => updateSettings({ defaultServings: n })}
            />
          </View>
        </View>
      </View>

      {/* Dietary preferences */}
      <Section
        title="Dieetvoorkeuren"
        subtitle="Selecteer alle dieetvoorkeuren die voor jou van toepassing zijn."
      >
        <View style={styles.card}>
          <View style={[styles.chips, styles.chipsLeft]}>
            {DIETS.map((d) => (
              <FilterChip
                key={d}
                label={dietaryLabel[d]}
                icon={dietIcon(d)}
                active={settings.dietaryPreferences.includes(d)}
                onPress={() => toggleDiet(d)}
                style={styles.chip}
              />
            ))}
          </View>
        </View>
      </Section>

      {/* Nutrition goal */}
      <Section title="Voedingsdoel" subtitle="Wat past het beste bij jouw doel?">
        <View style={styles.card}>
          <View style={[styles.chips, styles.chipsLeft]}>
            {GOALS.map((g) => (
              <FilterChip
                key={g.value}
                label={g.label}
                icon={goalIcon(g.value)}
                active={settings.nutritionGoal === g.value}
                onPress={() => updateSettings({ nutritionGoal: g.value })}
                style={styles.chip}
              />
            ))}
          </View>
        </View>
        <Text style={styles.footnote}>
          Hiermee kunnen we je beter passende recepten aanraden.
        </Text>
      </Section>

      {/* App settings */}
      <Section title="App-instellingen">
        <View style={styles.card}>
          <ListRow
            icon={<Ionicons name="notifications-outline" size={20} color={colors.primary} />}
            title="Meldingen"
            subtitle="Ontvang tips, nieuwe recepten en meer"
          />
          <View style={styles.divider} />
          <ListRow
            icon={<Ionicons name="globe-outline" size={20} color={colors.primary} />}
            title="Taal"
            subtitle="Nederlands"
          />
        </View>
      </Section>

      <View style={styles.footer}>
        <BrandLogoStacked height={72} color={colors.primary} />
        <Text style={styles.footerText}>versie 1.1</Text>
      </View>
    </Screen>
  );
}

function IconCircle({ icon }: { icon: React.ReactNode }) {
  return <View style={styles.iconCircle}>{icon}</View>;
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function ListRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
    >
      <IconCircle icon={icon} />
      <View style={styles.settingText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={iconSize.action} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  rowDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
  sectionHead: {
    gap: 2,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chipsLeft: {
    justifyContent: 'flex-start',
  },
  chip: {
    paddingVertical: spacing.md,
  },
  footnote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: -spacing.xs,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  footerText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
