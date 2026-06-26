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
}

/** Plus/minus control for choosing the number of servings. */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 12,
  suffix,
}: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <View style={styles.container}>
      <StepButton
        icon="remove"
        onPress={decrement}
        disabled={value <= min}
        accessibilityLabel="Minder personen"
      />
      <View style={styles.valueBox}>
        <Text style={styles.value}>{value}</Text>
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      <StepButton
        icon="add"
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled: boolean;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={iconSize.action}
        color={disabled ? colors.textMuted : colors.primary}
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
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
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
