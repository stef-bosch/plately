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

/** Darkened variant of `hex` so the label stays legible on the light tint. */
function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r * factor)}, ${clamp(g * factor)}, ${clamp(b * factor)})`;
}

/**
 * 2-column grid of macro blocks (koolhydraten, eiwitten, vetten, vezels).
 * Mirrors the recipe-detail nutrition blocks so both screens read the same.
 */
export function MacroSummary({ items }: MacroSummaryProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const textColor = darken(item.color, 0.55);
        return (
          <View
            key={item.label}
            style={[styles.cell, { backgroundColor: tint(item.color, 0.14) }]}
          >
            <View style={styles.head}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
            <Text style={[styles.value, { color: textColor }]}>
              {item.value} {item.unit}
            </Text>
          </View>
        );
      })}
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
    flexBasis: '47%',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  value: {
    ...typography.subheading,
  },
});
