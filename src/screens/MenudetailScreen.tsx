import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components/BrandIcons';
import { PressableScale } from '../components/PressableScale';
import { Tag } from '../components/Tag';
import { getRecipeImage } from '../constants/images';
import { getRecipeById } from '../data/recipes';
import { getMenuById } from '../data/menus';
import { useAppNavigation, useOpenRecipe } from '../navigation/hooks';
import type { RootStackParamList } from '../navigation/types';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { Recipe } from '../types';

export function MenudetailScreen() {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const openRecipe = useOpenRecipe();
  const route = useRoute<RouteProp<RootStackParamList, 'Menudetail'>>();

  const menu = getMenuById(route.params.menuId);

  useLayoutEffect(() => {
    navigation.setOptions({ title: menu ? 'Menu' : 'Niet gevonden' });
  }, [navigation, menu]);

  if (!menu) {
    return (
      <View style={styles.notFound}>
        <Ionicons
          name="alert-circle-outline"
          size={iconSize.hero}
          color={colors.textMuted}
        />
        <Text style={styles.notFoundText}>Dit menu bestaat niet meer.</Text>
      </View>
    );
  }

  const dishes = menu.courses.flatMap((course) =>
    course.recipeIds
      .map((id) => getRecipeById(id))
      .filter((r): r is Recipe => Boolean(r)),
  );
  const dishCount = dishes.length;
  const totalCalories = dishes.reduce(
    (sum, recipe) => sum + recipe.nutrition.calories,
    0,
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxxl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero image */}
      <Image source={getRecipeImage(menu)} style={styles.hero} resizeMode="cover" />

      {/* Title block */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{menu.title}</Text>
        {menu.subtitle ? (
          <Text style={styles.subtitle}>{menu.subtitle}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="ChefHat" size={iconSize.badge} color={colors.textSecondary} />
            <Text style={styles.metaText}>{dishCount} gerechten</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="Graph" size={iconSize.badge} color={colors.textSecondary} />
            <Text style={styles.metaText}>±{totalCalories} kcal p.p.</Text>
          </View>
        </View>

        {menu.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {menu.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        ) : null}
      </View>

      {menu.description ? (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{menu.description}</Text>
        </View>
      ) : null}

      {/* Courses */}
      {menu.courses.map((course) => (
        <View key={course.type + course.title} style={styles.course}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <View style={styles.dishList}>
            {course.recipeIds.map((id) => {
              const recipe = getRecipeById(id);
              if (!recipe) return null;
              return (
                <DishRow
                  key={id}
                  recipe={recipe}
                  onPress={() => openRecipe(id)}
                />
              );
            })}
          </View>
        </View>
      ))}

      <Text style={styles.footnote}>
        Tik op een gerecht voor het volledige recept, ingrediënten en
        bereidingswijze.
      </Text>
    </ScrollView>
  );
}

function DishRow({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: () => void;
}) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={styles.dishRow}
    >
      <Image
        source={getRecipeImage(recipe)}
        style={styles.dishThumb}
        resizeMode="cover"
      />
      <View style={styles.dishInfo}>
        <Text style={styles.dishTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.dishMetaRow}>
          <View style={styles.dishMetaItem}>
            <Icon name="Clock" size={14} color={colors.textMuted} />
            <Text style={styles.dishMetaText}>{totalTime} min</Text>
          </View>
          <View style={styles.dishMetaItem}>
            <Icon name="Graph" size={14} color={colors.textMuted} />
            <Text style={styles.dishMetaText}>
              {recipe.nutrition.calories} kcal
            </Text>
          </View>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={iconSize.action}
        color={colors.textMuted}
      />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  hero: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  notFoundText: {
    ...typography.body,
    color: colors.textMuted,
  },
  titleBlock: {
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.soft,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 23,
  },
  course: {
    gap: spacing.md,
  },
  courseTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  dishList: {
    gap: spacing.md,
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    paddingRight: spacing.md,
    ...shadow.soft,
  },
  dishThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  dishInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  dishTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dishMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dishMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dishMetaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  footnote: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
