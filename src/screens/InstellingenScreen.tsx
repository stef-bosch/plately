import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PlatelyLogo } from '../components/BrandIcons';
import { FilterChip } from '../components/FilterChip';
import { Screen } from '../components/Screen';
import { Stepper } from '../components/Stepper';
import { dietaryLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { computeDailyTarget } from '../nutrition/appTargets';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type {
  BodySex,
  CalcActivityLevel,
  CalcGoal,
  DietaryPreference,
  NutritionProfile,
  ProteinProfile,
} from '../types';

const DIETS: DietaryPreference[] = ['glutenvrij', 'halal', 'lactosevrij', 'vegan', 'vegetarisch'];

const SEX_LABEL: Record<BodySex, string> = { male: 'Man', female: 'Vrouw', other: 'Anders' };
const ACTIVITY_LABEL: Record<CalcActivityLevel, string> = {
  sedentary: 'Weinig',
  light: 'Licht',
  moderate: 'Gemiddeld',
  active: 'Actief',
  very_active: 'Zeer actief',
};
const GOAL_LABEL: Record<CalcGoal, string> = {
  maintain: 'Op gewicht',
  lose: 'Afvallen',
  gain: 'Aankomen',
  muscle_gain: 'Spieropbouw',
};
const PROTEIN_LABEL: Record<ProteinProfile, string> = {
  standard: 'Standaard',
  active: 'Actief',
  muscle: 'Spieropbouw',
};

const SEXES = Object.keys(SEX_LABEL) as BodySex[];
const ACTIVITIES = Object.keys(ACTIVITY_LABEL) as CalcActivityLevel[];
const GOALS = Object.keys(GOAL_LABEL) as CalcGoal[];
const PROTEINS = Object.keys(PROTEIN_LABEL) as ProteinProfile[];

export function InstellingenScreen() {
  const { settings, updateSettings } = useSettings();
  const profile = settings.nutritionProfile;

  const setProfile = (patch: Partial<NutritionProfile>) =>
    updateSettings({ nutritionProfile: { ...profile, ...patch } });

  const toggleDiet = (diet: DietaryPreference) => {
    const has = settings.dietaryPreferences.includes(diet);
    updateSettings({
      dietaryPreferences: has
        ? settings.dietaryPreferences.filter((d) => d !== diet)
        : [...settings.dietaryPreferences, diet],
    });
  };

  const target = computeDailyTarget(profile);

  return (
    <Screen title="Instellingen" subtitle="Stem Plately af op jouw voorkeuren">
      {/* Default servings */}
      <SettingCard title="Standaard aantal personen">
        <View style={styles.stepperWrap}>
          <Stepper value={settings.defaultServings} onChange={(n) => updateSettings({ defaultServings: n })} />
        </View>
      </SettingCard>

      {/* Body data */}
      <SettingCard title="Persoonlijke gegevens">
        <Field label="Geslacht">
          <View style={styles.grid}>
            {SEXES.map((s) => (
              <FilterChip key={s} label={SEX_LABEL[s]} active={profile.sex === s} onPress={() => setProfile({ sex: s })} style={styles.gridItemThird} />
            ))}
          </View>
        </Field>
        <View style={styles.numberRow}>
          <NumberField label="Leeftijd" placeholder="jaar" value={profile.ageYears} onChange={(v) => setProfile({ ageYears: v })} />
          <NumberField label="Lengte (cm)" placeholder="cm" value={profile.heightCm} onChange={(v) => setProfile({ heightCm: v })} />
          <NumberField label="Gewicht (kg)" placeholder="kg" value={profile.weightKg} onChange={(v) => setProfile({ weightKg: v })} />
        </View>
      </SettingCard>

      {/* Activity & goal */}
      <SettingCard title="Activiteit & doel">
        <Dropdown
          label="Activiteitsniveau"
          value={profile.activityLevel}
          options={ACTIVITIES}
          labels={ACTIVITY_LABEL}
          onSelect={(v) => setProfile({ activityLevel: v })}
        />
        <Dropdown
          label="Doel"
          value={profile.goal}
          options={GOALS}
          labels={GOAL_LABEL}
          onSelect={(v) => setProfile({ goal: v })}
        />
        <Dropdown
          label="Eiwitbehoefte"
          value={profile.proteinProfile}
          options={PROTEINS}
          labels={PROTEIN_LABEL}
          onSelect={(v) => setProfile({ proteinProfile: v })}
        />
        <Field label="Handmatig kcal-doel (optioneel)">
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={profile.manualKcalTarget != null ? String(profile.manualKcalTarget) : ''}
            onChangeText={(t) => {
              const n = Number(t.replace(',', '.'));
              setProfile({ manualKcalTarget: t.trim() === '' || Number.isNaN(n) || n <= 0 ? null : Math.round(n) });
            }}
            placeholder="Leeg = automatisch berekenen"
            placeholderTextColor={colors.textMuted}
          />
        </Field>
      </SettingCard>

      {/* Computed daily target */}
      <SettingCard title="Jouw dagdoel">
        {target.complete ? (
          <>
            <View style={styles.targetRow}>
              <Text style={styles.targetValue}>{target.targetKcal}</Text>
              <Text style={styles.targetUnit}>kcal / dag</Text>
            </View>
            <Text style={styles.targetMeta}>
              {target.source === 'manual' ? 'Handmatig ingesteld' : `Berekend · BMR ${target.bmr} · TDEE ${target.tdee}`}
            </Text>
            <View style={styles.macroRow}>
              <MacroChip label="Eiwitten" value={`${target.macro.proteinG} g`} color={colors.protein} />
              <MacroChip label="Koolhydraten" value={`${target.macro.carbsG} g`} color={colors.carbs} />
              <MacroChip label="Vetten" value={`${target.macro.fatG} g`} color={colors.fat} />
            </View>
          </>
        ) : (
          <Text style={styles.targetPrompt}>
            Vul je geslacht, leeftijd, lengte en gewicht in om je dagdoel te berekenen.
          </Text>
        )}
      </SettingCard>

      {/* Dietary preferences */}
      <SettingCard title="Dieetvoorkeuren">
        <View style={styles.grid}>
          {DIETS.map((d) => (
            <FilterChip key={d} label={dietaryLabel[d]} active={settings.dietaryPreferences.includes(d)} onPress={() => toggleDiet(d)} style={styles.gridItemThird} />
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

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

/** Lightweight, cross-platform dropdown (tap to expand a single-choice list). */
function Dropdown<T extends string>({
  label,
  value,
  options,
  labels,
  onSelect,
}: {
  label: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onSelect: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={styles.dropdownField}
      >
        <Text style={styles.dropdownValue}>{labels[value]}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
      </Pressable>
      {open ? (
        <View style={styles.dropdownMenu}>
          {options.map((o, i) => {
            const active = o === value;
            return (
              <Pressable
                key={o}
                onPress={() => {
                  onSelect(o);
                  setOpen(false);
                }}
                style={[styles.dropdownItem, i > 0 && styles.dropdownItemBorder, active && styles.dropdownItemActive]}
              >
                <Text style={[styles.dropdownItemText, active && styles.dropdownItemTextActive]}>
                  {labels[o]}
                </Text>
                {active ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.numberField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.numberInputWrap}>
        <TextInput
          style={styles.numberInput}
          keyboardType="numeric"
          value={value != null ? String(value) : ''}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onChangeText={(t) => {
            const trimmed = t.trim();
            if (trimmed === '') return onChange(null);
            const n = Number(trimmed.replace(',', '.'));
            onChange(Number.isNaN(n) ? null : n);
          }}
        />
      </View>
    </View>
  );
}

function MacroChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.macroChip, { borderColor: color }]}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  sectionTitle: { ...typography.heading, color: colors.textPrimary },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, ...shadow.soft },
  stepperWrap: { alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.sm, rowGap: spacing.sm },
  gridItemThird: { width: '31%' },
  field: { gap: spacing.xs },
  fieldLabel: { ...typography.label, color: colors.textSecondary },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownValue: { ...typography.body, color: colors.textPrimary },
  dropdownMenu: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.soft,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownItemBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  dropdownItemActive: { backgroundColor: colors.primarySoft },
  dropdownItemText: { ...typography.body, color: colors.textPrimary },
  dropdownItemTextActive: { color: colors.primary },
  numberRow: { flexDirection: 'row', gap: spacing.sm },
  numberField: { flex: 1, gap: spacing.xs },
  numberInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  numberInput: { ...typography.body, color: colors.textPrimary, flex: 1, paddingVertical: spacing.sm },
  targetRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
  targetValue: { ...typography.display, fontSize: 40, color: colors.textPrimary },
  targetUnit: { ...typography.subheading, color: colors.textSecondary, marginBottom: 6 },
  targetMeta: { ...typography.caption, color: colors.textMuted },
  targetPrompt: { ...typography.body, color: colors.textSecondary },
  macroRow: { flexDirection: 'row', gap: spacing.sm },
  macroChip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  macroValue: { ...typography.bodyStrong },
  macroLabel: { ...typography.caption, color: colors.textSecondary, fontSize: 10 },
  footer: { alignItems: 'center', gap: spacing.xs, paddingTop: spacing.sm },
  footerText: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
