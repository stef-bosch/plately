import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getRecipeImage } from '../constants/images';
import { dishCategory } from '../constants/labels';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { Recipe } from '../types';
import { Icon } from './BrandIcons';
import { PressableScale } from './PressableScale';
import { Tag } from './Tag';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

/** Recipe card used in the overview list. */
export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        <Image
          source={getRecipeImage(recipe)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.timePill}>
          <Icon name="Clock" size={iconSize.badge} color={colors.white} />
          <Text style={styles.timePillText}>{totalTime} min</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.mealBadge}>
          <Text style={styles.mealBadgeText}>{dishCategory(recipe)}</Text>
        </View>

        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.statsRow}>
          <Stat value={`${recipe.nutrition.calories}`} label="kcal" />
          <View style={styles.statDivider} />
          <Stat value={`${recipe.nutrition.protein}g`} label="eiwitten" />
          <View style={styles.statDivider} />
          <Stat value={`${recipe.nutrition.fiber}g`} label="vezels" />
        </View>

        <View style={styles.tagRow}>
          {recipe.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </View>
    </PressableScale>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: colors.surfaceMuted,
  },
  timePill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 34, 34, 0.62)',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  timePillText: {
    ...typography.caption,
    color: colors.white,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  mealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  mealBadgeText: {
    ...typography.caption,
    color: colors.primary,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
