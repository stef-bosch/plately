import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius, shadow, spacing, typography } from '../theme';

/**
 * Shared building blocks for the admin forms (DishForm / MenuForm) so they stay
 * visually consistent and don't duplicate the same header/section/field/save
 * markup and styles.
 */

/** Swap the elements at `idx` and `idx + dir`, returning a new array. */
export function moveInList<T>(list: T[], idx: number, dir: -1 | 1): T[] {
  const to = idx + dir;
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[idx], next[to]] = [next[to], next[idx]];
  return next;
}

export function FormHeader({
  title,
  onCancel,
}: {
  title: string;
  onCancel: () => void;
}) {
  return (
    <View style={formKit.header}>
      <Text style={formKit.headerTitle}>{title}</Text>
      <Pressable
        onPress={onCancel}
        style={({ pressed }) => [formKit.ghost, pressed && formKit.pressed]}
      >
        <Text style={formKit.ghostText}>Annuleren</Text>
      </Pressable>
    </View>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={formKit.section}>
      <Text style={formKit.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function Field({
  label,
  style,
  children,
}: {
  label: string;
  style?: object;
  children: React.ReactNode;
}) {
  return (
    <View style={[formKit.field, style]}>
      <Text style={formKit.label}>{label}</Text>
      {children}
    </View>
  );
}

export function SaveButton({
  saving,
  onPress,
  label = 'Opslaan',
}: {
  saving: boolean;
  onPress: () => void;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={saving}
      style={({ pressed }) => [
        formKit.saveButton,
        pressed && formKit.pressed,
        saving && formKit.disabled,
      ]}
    >
      {saving ? (
        <ActivityIndicator size="small" color={colors.textOnPrimary} />
      ) : (
        <Text style={formKit.saveButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}

/** A compact up/down pair for reordering a list item. */
export function MoveButtons({
  onUp,
  onDown,
  disableUp,
  disableDown,
  label,
}: {
  onUp: () => void;
  onDown: () => void;
  disableUp: boolean;
  disableDown: boolean;
  label: string;
}) {
  return (
    <View style={formKit.moveGroup}>
      <Pressable
        onPress={onUp}
        disabled={disableUp}
        style={formKit.moveButton}
        accessibilityLabel={`Verplaats ${label} omhoog`}
      >
        <Ionicons name="chevron-up" size={16} color={disableUp ? colors.border : colors.textSecondary} />
      </Pressable>
      <Pressable
        onPress={onDown}
        disabled={disableDown}
        style={formKit.moveButton}
        accessibilityLabel={`Verplaats ${label} omlaag`}
      >
        <Ionicons name="chevron-down" size={16} color={disableDown ? colors.border : colors.textSecondary} />
      </Pressable>
    </View>
  );
}

/** A labelled checkbox row. */
export function Checkbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => [formKit.checkRow, pressed && formKit.pressed]}
    >
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={22}
        color={checked ? colors.primary : colors.textMuted}
      />
      <Text style={formKit.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export const formKit = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...typography.heading, color: colors.textPrimary },
  section: { gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, ...shadow.soft },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.xs },
  field: { gap: 4 },
  label: { ...typography.label, color: colors.textSecondary },
  hint: { ...typography.caption, color: colors.textMuted },
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
  disabledInput: { opacity: 0.6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconButton: { padding: spacing.xs },
  moveGroup: { flexDirection: 'row', alignItems: 'center' },
  moveButton: { paddingHorizontal: 2, paddingVertical: spacing.xs },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  checkLabel: { ...typography.body, color: colors.textPrimary },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs },
  addRowText: { ...typography.label, color: colors.primary },
  error: { ...typography.bodyStrong, color: colors.fat },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonText: { ...typography.bodyStrong, color: colors.textOnPrimary },
  ghost: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  ghostText: { ...typography.label, color: colors.textSecondary },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
