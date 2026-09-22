import { Ionicons } from '@expo/vector-icons';
import {
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { printRecipe } from '../utils/recipePdf';
import { DishThumb } from '../components/DishThumb';
import { MacroSummary } from '../components/MacroSummary';
import { Stepper } from '../components/Stepper';
import { Tag } from '../components/Tag';
import { MealIcon, SeasonIcon } from '../components/BrandIcons';
import {
  mealTypeLabel,
  seasonLabel,
} from '../constants/labels';
import { getRecipeById } from '../data/recipes';
import { useDayMenu } from '../context/DayMenuContext';
import { useShoppingList } from '../context/ShoppingListContext';
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
  const { addToDayMenu } = useDayMenu();
  const { addToShoppingList } = useShoppingList();

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
  // Brief "Toegevoegd" confirmations after adding to a list.
  const [justAdded, setJustAdded] = useState(false);
  const [justAddedShopping, setJustAddedShopping] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
      if (shopTimer.current) clearTimeout(shopTimer.current);
    };
  }, []);

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

  const handleAddToDayMenu = () => {
    addToDayMenu(recipe.id, recipe.mealType);
    setJustAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 2000);
  };

  const handleAddToShopping = () => {
    addToShoppingList(recipe.id, servings);
    setJustAddedShopping(true);
    if (shopTimer.current) clearTimeout(shopTimer.current);
    shopTimer.current = setTimeout(() => setJustAddedShopping(false), 2000);
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
      {/* Hero image — fixed 4:5 box, photo cover-cropped to fill it */}
      <View style={styles.heroWrap}>
        <DishThumb recipe={recipe} style={styles.hero} iconSize={72} />
      </View>

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
          <StatBlock icon="flame-outline" label="Calorieën" value={`${recipe.nutrition.calories}`} unit="kcal" tint={colors.surfaceMuted} fg={colors.primary} />
          <StatBlock icon="time-outline" label="Bereidingstijd" value={`${totalTime}`} unit="min" tint={colors.accentSoft} fg={colors.accent} />
        </View>

        {/* Nutrition per portion */}
        <MacroSummary
          items={[
            { label: 'Koolhydraten', value: recipe.nutrition.carbs, unit: 'g', color: colors.carbs },
            { label: 'Eiwitten', value: recipe.nutrition.protein, unit: 'g', color: colors.protein },
            { label: 'Vetten', value: recipe.nutrition.fat, unit: 'g', color: colors.fat },
            { label: 'Vezels', value: recipe.nutrition.fiber, unit: 'g', color: colors.fiber },
          ]}
        />
        {recipe.nutrition.isIndicative ? (
          <Text style={styles.indicative}>Voedingswaarden zijn indicatief</Text>
        ) : null}
      </View>

      {/* Add to the day menu / shopping list */}
      <View style={styles.addActions}>
        <Pressable
          onPress={handleAddToDayMenu}
          accessibilityRole="button"
          accessibilityLabel="Toevoegen aan dagmenu"
          style={({ pressed }) => [
            styles.addButton,
            justAdded && styles.addButtonAdded,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Ionicons
            name={justAdded ? 'checkmark' : 'add'}
            size={iconSize.action}
            color={colors.textOnPrimary}
          />
          <Text style={styles.addButtonText}>
            {justAdded ? 'Toegevoegd aan dagmenu' : 'Toevoegen aan dagmenu'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleAddToShopping}
          accessibilityRole="button"
          accessibilityLabel="Toevoegen aan boodschappenlijst"
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Ionicons
            name={justAddedShopping ? 'checkmark' : 'cart-outline'}
            size={iconSize.action}
            color={colors.primary}
          />
          <Text style={styles.cartButtonText}>
            {justAddedShopping
              ? `Toegevoegd (${servings} ${servings === 1 ? 'persoon' : 'personen'})`
              : 'Toevoegen aan boodschappenlijst'}
          </Text>
        </Pressable>
      </View>

      {/* Ingredients — with the servings stepper built into the header */}
      <Section title="Ingrediënten">
        <View style={styles.card}>
          <View style={styles.servingsPill}>
            <Stepper
              variant="pill"
              value={servings}
              onChange={setServings}
              label={`Voor ${servings} ${servings === 1 ? 'persoon' : 'personen'}`}
            />
          </View>
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
  heroWrap: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  hero: {
    width: '100%',
    height: '100%',
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
  addActions: {
    gap: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryStrong,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
  },
  addButtonAdded: {
    backgroundColor: colors.primary,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    ...typography.bodyStrong,
    color: colors.textOnPrimary,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cartButtonText: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
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
  servingsPill: {
    marginBottom: spacing.lg,
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
