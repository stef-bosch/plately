import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, iconSize, radius, spacing, typography } from '../theme';
import { Icon, type BrandIconName } from './BrandIcons';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof Ionicons.glyphMap;
  /** Brand SVG icon, takes precedence over `icon` when set. */
  brandIcon?: BrandIconName;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  brandIcon,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const iconColor = isPrimary ? colors.textOnPrimary : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      {brandIcon ? (
        <Icon name={brandIcon} size={iconSize.action} color={iconColor} />
      ) : icon ? (
        <Ionicons name={icon} size={iconSize.action} color={iconColor} />
      ) : null}
      <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.bodyStrong,
  },
  labelPrimary: {
    color: colors.textOnPrimary,
  },
  labelSecondary: {
    color: colors.primary,
  },
});
