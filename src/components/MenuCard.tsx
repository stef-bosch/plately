import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { getRecipeImage } from '../constants/images';
import { getRecipeById } from '../data/recipes';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { Menu } from '../types';
import { Icon } from './BrandIcons';
import { PressableScale } from './PressableScale';
import { Tag } from './Tag';

interface MenuCardProps {
  menu: Menu;
  onPress: () => void;
}

const COURSE_WORDS = ['nul', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven'];

function courseCountLabel(count: number): string {
  const word = COURSE_WORDS[count] ?? `${count}`;
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}gangen menu`;
}

/** Rich card for a complete multi-course menu in the Menu's section. */
export function MenuCard({ menu, onPress }: MenuCardProps) {
  const dishes = menu.courses.flatMap((course) =>
    course.recipeIds.map((id) => getRecipeById(id)).filter(Boolean),
  );
  const dishCount = dishes.length;
  const totalCalories = dishes.reduce(
    (sum, recipe) => sum + (recipe?.nutrition.calories ?? 0),
    0,
  );

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={styles.card}
    >
      <View style={styles.imageWrap}>
        <Image
          source={getRecipeImage(menu)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.coursePill}>
          <Text style={styles.coursePillText}>
            {courseCountLabel(menu.courses.length)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{menu.title}</Text>
        {menu.subtitle ? (
          <Text style={styles.subtitle}>{menu.subtitle}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="ChefHat" size={iconSize.badge} color={colors.primary} />
            <Text style={styles.metaText}>{dishCount} gerechten</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="Graph" size={iconSize.badge} color={colors.primary} />
            <Text style={styles.metaText}>±{totalCalories} kcal p.p.</Text>
          </View>
        </View>

        <View style={styles.tagRow}>
          {menu.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </View>
    </PressableScale>
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
    height: 150,
    backgroundColor: colors.surfaceMuted,
  },
  coursePill: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  coursePillText: {
    ...typography.caption,
    color: colors.white,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
