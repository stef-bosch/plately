import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '../theme';

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

/** Horizontal grid of macro chips (eiwitten, koolhydraten, vetten, vezels). */
export function MacroSummary({ items }: MacroSummaryProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const textColor = darken(item.color, 0.55);
        return (
          <View
            key={item.label}
            style={[
              styles.cell,
              { borderColor: item.color, backgroundColor: tint(item.color, 0.14) },
            ]}
          >
            <Text style={[styles.value, { color: textColor }]}>
              {item.value}
              {item.unit}
            </Text>
            <Text
              style={[styles.label, { color: textColor }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {item.label}
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
    flexBasis: '22%',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    ...typography.subheading,
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
});
