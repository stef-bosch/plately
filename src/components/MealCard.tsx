import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getRecipeImage } from '../constants/images';
import { mealTypeLabel } from '../constants/labels';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { MealType, Recipe } from '../types';
import { MealIcon } from './BrandIcons';
import { PressableScale } from './PressableScale';

interface MealCardProps {
  mealType: MealType;
  recipe: Recipe;
  /** Overrides the meal-type label, e.g. for a second snack. */
  labelOverride?: string;
  onPress: () => void;
}

/** Compact row showing one planned meal. Used on dashboard and week screen. */
export function MealCard({
  mealType,
  recipe,
  labelOverride,
  onPress,
}: MealCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={getRecipeImage(recipe)}
          style={styles.thumb}
          resizeMode="cover"
        />
        <View style={styles.thumbBadge}>
          <MealIcon mealType={mealType} size={iconSize.badge} color={colors.white} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.mealLabel}>
          {labelOverride ?? mealTypeLabel[mealType]}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.meta}>
          {recipe.nutrition.calories} kcal · {recipe.nutrition.protein}g eiwitten
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={iconSize.action} color={colors.textMuted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  thumbWrap: {
    position: 'relative',
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  thumbBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  mealLabel: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
