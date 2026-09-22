import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { Icon } from './BrandIcons';

export interface MacroItem {
  label: string;
  value: number;
  unit: string;
  color: string;
}

interface MacroSummaryProps {
  items: MacroItem[];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
}

/** Same hue as `hex`, but translucent — a calm tint for the block interior. */
function tint(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** The little glyph shown for each macro, in its own colour. */
function MacroGlyph({ label, color }: { label: string; color: string }) {
  switch (label) {
    case 'Koolhydraten':
      return <Icon name="Grain" size={16} color={color} />;
    case 'Eiwitten':
      return <Ionicons name="barbell-outline" size={16} color={color} />;
    case 'Vetten':
      return <Ionicons name="water-outline" size={16} color={color} />;
    case 'Vezels':
      return <Ionicons name="leaf-outline" size={16} color={color} />;
    default:
      return <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />;
  }
}

/**
 * Row of macro blocks (koolhydraten, eiwitten, vetten, vezels). Each is a soft
 * tinted tile with the macro's icon in a white circle, its name, and a bold
 * value. Used on the dashboard's nutrition card and the recipe detail.
 */
export function MacroSummary({ items }: MacroSummaryProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View
          key={item.label}
          style={[styles.cell, { backgroundColor: tint(item.color, 0.16) }]}
        >
          <View style={styles.iconCircle}>
            <MacroGlyph label={item.label} color={item.color} />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
          <Text style={styles.value}>
            {item.value} {item.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cell: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 13,
    height: 26, // reserve two lines so long names wrap and values stay aligned
    color: colors.textSecondary,
  },
  value: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
});
