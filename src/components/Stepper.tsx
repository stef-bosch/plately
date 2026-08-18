import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, iconSize, radius, spacing, typography } from '../theme';

interface StepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Dutch suffix, e.g. "personen". */
  suffix?: string;
  /**
   * `default` shows [−] value [+]. `pill` is a single rounded bar with a
   * centred label and filled +/− buttons (used above the ingredient list).
   */
  variant?: 'default' | 'pill';
  /** Full centre label for the `pill` variant, e.g. "Voor 4 personen". */
  label?: string;
}

/** Plus/minus control for choosing the number of servings. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 12,
  suffix,
  variant = 'default',
  label,
}: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));
  const pill = variant === 'pill';

  return (
    <View style={pill ? styles.pill : styles.container}>
      <StepButton
        icon="remove"
        pill={pill}
        onPress={decrement}
        disabled={value <= min}
        accessibilityLabel="Minder personen"
      />
      {pill ? (
        <Text style={styles.pillLabel}>
          {label ?? `${value}${suffix ? ` ${suffix}` : ''}`}
        </Text>
      ) : (
        <View style={styles.valueBox}>
          <Text style={styles.value}>{value}</Text>
          {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        </View>
      )}
      <StepButton
        icon="add"
        pill={pill}
        onPress={increment}
        disabled={value >= max}
        accessibilityLabel="Meer personen"
      />
    </View>
  );
}

function StepButton({
  icon,
  onPress,
  disabled,
  accessibilityLabel,
  pill,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
  pill?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        pill && styles.buttonPill,
        disabled && (pill ? styles.buttonPillDisabled : styles.buttonDisabled),
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={iconSize.action}
        color={
          pill
            ? disabled
              ? colors.textMuted
              : colors.textOnPrimary
            : disabled
              ? colors.textMuted
              : colors.primary
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  pillLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPill: {
    backgroundColor: colors.primary,
  },
  buttonPillDisabled: {
    backgroundColor: colors.surface,
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  valueBox: {
    minWidth: 56,
    alignItems: 'center',
  },
  value: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  suffix: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
