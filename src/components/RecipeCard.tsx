import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getRecipeImage } from '../constants/images';
import { dishCategory } from '../constants/labels';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { Recipe } from '../types';
import { MealIcon } from './BrandIcons';
import { PressableScale } from './PressableScale';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

/** Compact, landscape card used in the recipe overview (matches MealCard). */
export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <PressableScale onPress={onPress} accessibilityRole="button" style={styles.card}>
      <View style={styles.thumbWrap}>
        <Image
          source={getRecipeImage(recipe)}
          style={styles.thumb}
          resizeMode="cover"
        />
        <View style={styles.thumbBadge}>
          <MealIcon mealType={recipe.mealType} size={iconSize.badge} color={colors.white} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{dishCategory(recipe)}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.meta}>{totalTime} min</Text>
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
    width: 64,
    height: 64,
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
  category: {
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
