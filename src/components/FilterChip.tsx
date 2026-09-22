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
  /** Optional leading icon shown when the chip is off (a checkmark replaces it
   * when the chip is on). Ignored by the `plain` variant. */
  icon?: React.ReactNode;
  /**
   * `check` (default) shows a checkmark when active and the optional icon when
   * off — used for dietary preferences. `plain` just recolours the pill (filled
   * olive when active) with centred text and no glyph — used in the filter
   * sheet where several chips read as a clean grid.
   */
  variant?: 'check' | 'plain';
  /** Extra container styling, e.g. to size the chip inside a grid. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Selectable pill for filters and dietary preferences. Interactive by design:
 * a bordered outline when off, a filled olive chip when on — so a selected
 * state (and multi-select) reads at a glance.
 */
export function FilterChip({
  label,
  active,
  onPress,
  icon,
  variant = 'check',
  style,
}: FilterChipProps) {
  const plain = variant === 'plain';
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
        {plain ? null : active ? (
          <Ionicons name="checkmark" size={15} color={colors.textOnPrimary} />
        ) : (
          icon ?? null
        )}
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
