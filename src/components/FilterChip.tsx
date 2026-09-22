import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  /** Extra container styling, e.g. to size the chip inside a grid. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Selectable pill for filters and dietary preferences. Interactive by design:
 * a bordered outline when off, a filled olive chip with a checkmark when on —
 * so a selected state (and multi-select) reads at a glance.
 */
export function FilterChip({ label, active, onPress, style }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {active ? (
          <Ionicons name="checkmark" size={15} color={colors.textOnPrimary} />
        ) : null}
        <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    ...typography.label,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.textOnPrimary,
  },
});
