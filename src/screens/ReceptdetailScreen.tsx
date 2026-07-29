import { Ionicons } from '@expo/vector-icons';
import {
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getRecipeImage } from '../constants/images';
import { printRecipe } from '../utils/recipePdf';
import { Stepper } from '../components/Stepper';
import { Tag } from '../components/Tag';
import { MealIcon, SeasonIcon } from '../components/BrandIcons';
import {
  mealTypeLabel,
  seasonLabel,
} from '../constants/labels';
import { getRecipeById } from '../data/recipes';
import { useSettings } from '../context/SettingsContext';
import { useAppNavigation } from '../navigation/hooks';
import type { RootStackParamList } from '../navigation/types';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import { scaleIngredient } from '../utils/scaling';

export function ReceptdetailScreen() {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'Receptdetail'>>();
  const { settings } = useSettings();

  const recipe = getRecipeById(route.params.recipeId);

  // Dishes written for a fixed party size (e.g. a 4-person menu dish) open at
  // their base servings so the quantities read cleanly; single-serving recipes
  // follow the user's default.
  const [servings, setServings] = useState(
    recipe && recipe.baseServings > 1
      ? recipe.baseServings
      : Math.max(settings.defaultServings, 1),
  );
  const [printing, setPrinting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: recipe ? 'Recept' : 'Niet gevonden' });
  }, [navigation, recipe]);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={iconSize.hero} color={colors.textMuted} />
        <Text style={styles.notFoundText}>Dit recept bestaat niet meer.</Text>
      </View>
    );
  }

  const totalTime = recipe.prepTime + recipe.cookTime;

  const handlePrint = async () => {
    if (printing) return;
    try {
      setPrinting(true);
      await printRecipe(recipe, {
        servings,
      });
    } catch (error) {
      // Cancelling the dialog or a print failure shouldn't crash the screen.
      console.warn('Printen mislukt', error);
    } finally {
      setPrinting(false);
    }
  };

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
      <Image
        source={getRecipeImage(recipe)}
        style={styles.hero}
        resizeMode="cover"
      />

      {/* Title block */}
      <View style={styles.titleBlock}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <MealIcon mealType={recipe.mealType} size={iconSize.badge} color={colors.primary} />
            <Text style={styles.badgeText}>
              {mealTypeLabel[recipe.mealType]}
            </Text>
          </View>
          {recipe.seasons.map((s) => (
            <View key={s} style={[styles.badge, styles.badgeSand]}>
              <SeasonIcon season={s} size={iconSize.badge} color={colors.accent} />
              <Text style={[styles.badgeText, styles.badgeTextSand]}>
                {seasonLabel[s]}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.title}>{recipe.title}</Text>
        {recipe.subtitle ? (
          <Text style={styles.subtitle}>{recipe.subtitle}</Text>
        ) : null}

        {/* Tags */}
        {recipe.tags.length > 0 ? (
          <View style={styles.tagRow}>
            {recipe.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        ) : null}

        {/* kcal + total time */}
        <View style={styles.statRow}>
          <StatBlock icon="flame-outline" label="Calorieën" value={`${recipe.nutrition.calories}`} unit="kcal" tint="rgba(255, 122, 26, 0.12)" fg={colors.primary} />
          <StatBlock icon="time-outline" label="Bereidingstijd" value={`${totalTime}`} unit="min" tint="rgba(31, 157, 87, 0.12)" fg={colors.accent} />
        </View>

        {/* Nutrition per portion */}
        <View style={styles.macroGrid}>
          <MacroBlock label="Koolhydraten" value={recipe.nutrition.carbs} color={colors.carbs} tint="rgba(244, 183, 64, 0.16)" />
          <MacroBlock label="Eiwitten" value={recipe.nutrition.protein} color={colors.protein} tint="rgba(255, 122, 26, 0.13)" />
          <MacroBlock label="Vetten" value={recipe.nutrition.fat} color={colors.fat} tint="rgba(226, 89, 42, 0.13)" />
          <MacroBlock label="Vezels" value={recipe.nutrition.fiber} color={colors.fiber} tint="rgba(31, 157, 87, 0.13)" />
        </View>
        {recipe.nutrition.isIndicative ? (
          <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
        ) : null}
      </View>

      {/* Servings stepper */}
      <View style={styles.card}>
        <View style={styles.servingsRow}>
          <View style={styles.servingsText}>
            <Text style={styles.cardLabel}>Aantal personen</Text>
          </View>
          <Stepper
            value={servings}
            onChange={setServings}
            suffix={servings === 1 ? 'persoon' : 'personen'}
          />
        </View>
      </View>

      {/* Ingredients */}
      <Section title="Ingrediënten">
        <View style={styles.card}>
          {recipe.ingredients.map((group, groupIndex) => (
            <View
              key={group.category}
              style={[
                styles.ingredientGroup,
                groupIndex > 0 && styles.ingredientGroupSpacing,
              ]}
            >
              <Text style={styles.groupTitle}>{group.category}</Text>
              {group.items.map((item, index) => {
                const scaled = scaleIngredient(
                  item,
                  servings,
                  recipe.baseServings,
                );
                return (
                  <View key={`${item.name}-${index}`} style={styles.ingredientRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.ingredientText}>
                      {scaled.amountLabel ? (
                        <Text style={styles.ingredientAmount}>
                          {scaled.amountLabel}{' '}
                        </Text>
                      ) : null}
                      {scaled.name}
                      {scaled.note ? (
                        <Text style={styles.ingredientNote}> · {scaled.note}</Text>
                      ) : null}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </Section>

      {/* Instructions */}
      <Section title="Bereidingswijze">
        <View style={styles.card}>
          {recipe.instructions.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepRow,
                index > 0 && styles.stepRowSpacing,
              ]}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </Section>

      {/* Print / save as PDF */}
      <Pressable
        onPress={handlePrint}
        disabled={printing}
        accessibilityRole="button"
        accessibilityLabel="Recept afdrukken of opslaan als PDF"
        style={({ pressed }) => [
          styles.printButton,
          pressed && styles.printButtonPressed,
          printing && styles.printButtonDisabled,
        ]}
      >
        {printing ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons
            name="download-outline"
            size={iconSize.action}
            color={colors.primary}
          />
        )}
        <Text style={styles.printButtonText}>
          {printing ? 'Bezig…' : 'Afdrukken of opslaan als PDF'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** A tinted stat block (calories, prep time). */
function StatBlock({
  icon,
  label,
  value,
  unit,
  tint,
  fg,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  tint: string;
  fg: string;
}) {
  return (
    <View style={[styles.statBlock, { backgroundColor: tint }]}>
      <View style={styles.statHead}>
        <Ionicons name={icon} size={16} color={fg} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>
        {value} <Text style={styles.statUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

/** A tinted nutrition block (one macro). */
function MacroBlock({
  label,
  value,
  color,
  tint,
}: {
  label: string;
  value: number;
  color: string;
  tint: string;
}) {
  return (
    <View style={[styles.macroBlock, { backgroundColor: tint }]}>
      <View style={styles.macroHead}>
        <View style={[styles.macroDot, { backgroundColor: color }]} />
        <Text style={styles.macroLabel}>{label}</Text>
      </View>
      <Text style={[styles.macroValue, { color }]}>{value} g</Text>
    </View>
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
    aspectRatio: 1,
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
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  badgeSand: {
    backgroundColor: colors.accentSoft,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
  },
  badgeTextSand: {
    color: colors.accent,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statBlock: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  statUnit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  macroBlock: {
    flexGrow: 1,
    flexBasis: '47%',
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  macroHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  macroValue: {
    ...typography.subheading,
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  printButtonPressed: {
    opacity: 0.85,
  },
  printButtonDisabled: {
    opacity: 0.6,
  },
  printButtonText: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadow.soft,
  },
  cardLabel: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  servingsText: {
    flex: 1,
    gap: 2,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  ingredientGroup: {
    gap: spacing.sm,
  },
  ingredientGroupSpacing: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  groupTitle: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  ingredientText: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  ingredientAmount: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  ingredientNote: {
    ...typography.body,
    color: colors.textMuted,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepRowSpacing: {
    marginTop: spacing.lg,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...typography.label,
    color: colors.primary,
  },
  stepText: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 23,
    paddingTop: 3,
  },
  indicative: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
