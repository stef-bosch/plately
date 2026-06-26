import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

export interface MacroItem {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface MacroSummaryProps {
  items: MacroItem[];
}

/** Horizontal grid of macro chips (eiwitten, koolhydraten, vetten, vezels). */
export function MacroSummary({ items }: MacroSummaryProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.cell}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.value}>
            {item.value}
            {item.unit}
          </Text>
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '22%',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  value: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: -0.2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
