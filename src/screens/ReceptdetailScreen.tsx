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
import { MacroSummary } from '../components/MacroSummary';
import { Stepper } from '../components/Stepper';
import { Tag } from '../components/Tag';
import { Icon, MealIcon, SeasonIcon, type BrandIconName } from '../components/BrandIcons';
import {
  mealTypeLabel,
  seasonLabel,
} from '../constants/labels';
import { getRecipeById } from '../data/recipes';
import { useSettings } from '../context/SettingsContext';
import { useAppNavigation } from '../navigation/hooks';
import type { RootStackParamList } from '../navigation/types';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import { micronutrientMeta } from '../utils/nutrition';
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
  const micros = micronutrientMeta.filter(
    (m) => recipe.nutrition.micronutrients[m.key] !== undefined,
  );

  const handlePrint = async () => {
    if (printing) return;
    try {
      setPrinting(true);
      await printRecipe(recipe, {
        servings,
        showMicronutrients: settings.showMicronutrients,
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

        <View style={styles.metaRow}>
          <MetaItem icon="Clock" label={`${totalTime} min totaal`} />
          <MetaItem
            icon="Graph"
            label={`${recipe.nutrition.calories} kcal p.p.`}
          />
        </View>
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

      {/* Macros per serving */}
      <Section title="Voedingswaarden per portie">
        <View style={styles.card}>
          <View style={styles.calorieHeader}>
            <Text style={styles.calorieBig}>{recipe.nutrition.calories}</Text>
            <Text style={styles.calorieBigUnit}>kcal</Text>
          </View>
          <MacroSummary
            items={[
              { label: 'Eiwitten', value: recipe.nutrition.protein, unit: 'g', color: colors.protein },
              { label: 'Koolhydraten', value: recipe.nutrition.carbs, unit: 'g', color: colors.carbs },
              { label: 'Vetten', value: recipe.nutrition.fat, unit: 'g', color: colors.fat },
              { label: 'Vezels', value: recipe.nutrition.fiber, unit: 'g', color: colors.fiber },
            ]}
          />
          {recipe.nutrition.isIndicative ? (
            <Text style={styles.indicative}>
              Voedingswaarden zijn indicatief
            </Text>
          ) : null}
        </View>
      </Section>

      {/* Micronutrients */}
      {settings.showMicronutrients && micros.length > 0 ? (
        <Section title="Micronutriënten per portie">
          <View style={styles.card}>
            {micros.map((m, index) => (
              <View
                key={m.key}
                style={[
                  styles.microRow,
                  index < micros.length - 1 && styles.microRowBorder,
                ]}
              >
                <Text style={styles.microLabel}>{m.label}</Text>
                <Text style={styles.microValue}>
                  {recipe.nutrition.micronutrients[m.key]} {m.unit}
                </Text>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

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

      {/* Tags */}
      <Section title="Tags">
        <View style={styles.tagRow}>
          {recipe.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </View>
      </Section>
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

function MetaItem({
  icon,
  label,
}: {
  icon: BrandIconName;
  label: string;
}) {
  return (
    <View style={styles.metaItem}>
      <Icon name={icon} size={iconSize.badge} color={colors.textSecondary} />
      <Text style={styles.metaText}>{label}</Text>
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
    height: 220,
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
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xl,
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
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  calorieBig: {
    ...typography.display,
    color: colors.textPrimary,
  },
  calorieBigUnit: {
    ...typography.subheading,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  indicative: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  microRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  microRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  microLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  microValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
