import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadow, spacing, typography } from '../theme';

/**
 * Shared building blocks for the admin's overview screens (Recepten, Menu's)
 * so both get the same stat cards, panels, table rows and side lists without
 * duplicating the styling.
 */

export function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  tone?: 'warn';
}) {
  return (
    <View style={ov.statCard}>
      <View style={[ov.statIcon, tone === 'warn' && ov.statIconWarn]}>
        <Ionicons name={icon} size={22} color={tone === 'warn' ? colors.fat : colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ov.statLabel}>{label}</Text>
        <Text style={ov.statValue}>{value}</Text>
      </View>
    </View>
  );
}

export function IconAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={({ pressed }) => [ov.iconButton, pressed && ov.pressed]}>
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
  );
}

export function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [ov.quickAction, pressed && ov.pressed]}>
      <View style={ov.quickIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={ov.quickText}>{label}</Text>
    </Pressable>
  );
}

export const ov = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-start' },
  main: { flexGrow: 1, flexBasis: 640, gap: spacing.lg },
  side: { width: 300, gap: spacing.lg },

  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    flexGrow: 1, flexBasis: 200, ...shadow.soft,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  statIconWarn: { backgroundColor: colors.surfaceMuted },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statValue: { ...typography.title, color: colors.textPrimary },

  panel: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.md, ...shadow.soft,
  },
  h2: { ...typography.heading, color: colors.textPrimary },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.background, borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  searchInput: { ...typography.body, color: colors.textPrimary, flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  tableHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headRow: { borderBottomWidth: 2 },
  headCell: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 },
  cell: { ...typography.body, color: colors.textPrimary },
  cellTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  cellMuted: { ...typography.caption, color: colors.textMuted },
  cellWarn: { color: colors.fat },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: {
    ...typography.caption, fontSize: 10, color: colors.accent,
    backgroundColor: colors.accentSoft, borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 1,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  iconButton: { padding: spacing.xs },

  sideRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sideRowText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  sideRowActive: { color: colors.primary },
  sideCount: { ...typography.label, color: colors.textSecondary },
  sideMeta: { ...typography.caption, color: colors.textMuted },

  quickAction: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md,
  },
  quickIcon: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  quickText: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },

  newButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary,
    borderRadius: radius.pill, paddingVertical: spacing.xs, paddingHorizontal: spacing.md,
  },
  newButtonText: { ...typography.label, color: colors.textOnPrimary },
  empty: { ...typography.body, color: colors.textMuted, paddingVertical: spacing.sm },
  pressed: { opacity: 0.85 },
});
