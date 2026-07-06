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
