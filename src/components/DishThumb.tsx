import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../theme';
import type { Recipe } from '../types';
import { MealIcon } from './BrandIcons';

interface DishThumbProps {
  recipe: Pick<Recipe, 'image' | 'mealType'>;
  /** Sizing + border radius come from the caller (same as an <Image>). */
  style?: StyleProp<ViewStyle>;
  /** Meal-icon size for the placeholder (scale to the thumb size). */
  iconSize?: number;
}

/**
 * A dish photo, or — when the dish has none — a warm, on-brand placeholder
 * showing its meal-type icon. This keeps photo-less dishes looking intentional
 * (and distinct per meal) instead of repeating a generic logo image.
 */
export function DishThumb({ recipe, style, iconSize = 24 }: DishThumbProps) {
  if (recipe.image) {
    return (
      <Image
        source={recipe.image}
        style={style as StyleProp<ImageStyle>}
        resizeMode="cover"
      />
    );
  }
  return (
    <View style={[style, styles.placeholder]}>
      <MealIcon mealType={recipe.mealType} size={iconSize} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
