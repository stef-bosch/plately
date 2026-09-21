import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

interface TagProps {
  label: string;
}

/**
 * Small rounded pill for recipe tags. One calm, on-brand style (soft cream-green
 * fill + olive text) keeps a row of tags quiet against the food photography.
 */
export function Tag({ label }: TagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  text: {
    ...typography.caption,
    color: colors.primary,
  },
});
