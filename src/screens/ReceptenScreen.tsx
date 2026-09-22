import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Icon, type BrandIconName } from '../components/BrandIcons';
import { FadeInView } from '../components/FadeInView';
import { FilterChip } from '../components/FilterChip';
import { RecipeCard } from '../components/RecipeCard';
import { dietaryLabel, dishCategory, seasonLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { getAllRecipes } from '../data/recipes';
import { useOpenRecipe } from '../navigation/hooks';
import { recipeMatchesDiets } from '../utils/resolveRecipe';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type { DietaryPreference, Season } from '../types';

/**
 * A selectable category. `value` is the underlying `dishCategory()` a recipe
 * carries; `label` is the shorter chip text from the mockup.
 */
interface CategoryOption {
  value: string;
  label: string;
  icon: BrandIconName;
}

/**
 * The single category axis: eating moments and dish types combined. A recipe's
 * `dishCategory()` resolves to exactly one of these values.
 */
const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'Ontbijt', label: 'Ontbijt', icon: 'Breakfast' },
  { value: 'Lunch', label: 'Lunch', icon: 'Lunch' },
  { value: 'Diner', label: 'Diner', icon: 'Dinner' },
  { value: 'Tussendoortjes', label: 'Tussendoor', icon: 'Snack' },
  { value: 'Sauzen', label: 'Saus', icon: 'ChefHat' },
  { value: 'Desserts & gebak', label: 'Dessert', icon: 'ChefHat' },
  { value: 'Borrelhapjes & snacks', label: 'Snack', icon: 'Snack' },
  { value: 'Dranken & cocktails', label: 'Drank', icon: 'Lunch' },
];

const SEASONS: Season[] = ['lente-zomer', 'herfst-winter'];

const DIETS: DietaryPreference[] = [
  'vegetarisch',
  'vegan',
  'lactosevrij',
  'glutenvrij',
  'halal',
];

/** Max total-time (prep + cook) options, in minutes. */
const TIME_OPTIONS = [15, 30, 45, 60] as const;

/** Look up a category's chip label + icon by its stored value. */
const CATEGORY_BY_VALUE: Record<string, CategoryOption> = Object.fromEntries(
  CATEGORY_OPTIONS.map((o) => [o.value, o]),
);

const DIET_ICON: Record<DietaryPreference, React.ComponentProps<typeof Ionicons>['name']> = {
  vegetarisch: 'leaf-outline',
  vegan: 'leaf-outline',
  lactosevrij: 'water-outline',
  glutenvrij: 'nutrition-outline',
  halal: 'moon-outline',
};

function recipeCountLabel(n: number): string {
  return `${n} ${n === 1 ? 'recept' : 'recepten'}`;
}

function totalTime(recipe: { prepTime: number; cookTime: number }): number {
  return recipe.prepTime + recipe.cookTime;
}

export function ReceptenScreen() {
  const openRecipe = useOpenRecipe();
  const { settings, updateSettings } = useSettings();

  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>([]);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The dietary preferences double as a recipe filter here; they live in the
  // global settings so the choice stays in sync with the Instellingen screen.
  const selectedDiets = settings.dietaryPreferences;
  // Available height for the filter sheet, measured from its full-screen wrap so
  // the sheet can be capped and its groups scroll on small screens.
  const [sheetAreaHeight, setSheetAreaHeight] = useState(0);

  const allRecipes = useMemo(() => getAllRecipes(), []);

  // Only offer category chips that at least one recipe actually uses, so the
  // sheet never shows a filter that can only ever return zero results.
  const presentCategories = useMemo(
    () => new Set(allRecipes.map((r) => dishCategory(r))),
    [allRecipes],
  );
  const categoryOptions = CATEGORY_OPTIONS.filter((o) =>
    presentCategories.has(o.value),
  );

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRecipes.filter((recipe) => {
      if (!recipeMatchesDiets(recipe, selectedDiets)) return false;
      const matchesQuery = q === '' || recipe.title.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(dishCategory(recipe));
      const matchesSeason =
        selectedSeasons.length === 0 ||
        recipe.seasons.some((s) => selectedSeasons.includes(s));
      const matchesTime = maxTime === null || totalTime(recipe) <= maxTime;
      return matchesQuery && matchesCategory && matchesSeason && matchesTime;
    });
  }, [allRecipes, query, selectedCategories, selectedSeasons, maxTime, selectedDiets]);

  const data = filteredRecipes;
  const countLabel = `${recipeCountLabel(filteredRecipes.length)} gevonden`;
  const activeFilterCount =
    selectedCategories.length +
    selectedSeasons.length +
    selectedDiets.length +
    (maxTime !== null ? 1 : 0);

  const toggleCategory = (value: string) =>
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  const toggleSeason = (season: Season) =>
    setSelectedSeasons((prev) =>
      prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season],
    );
  const toggleDiet = (diet: DietaryPreference) =>
    updateSettings({
      dietaryPreferences: selectedDiets.includes(diet)
        ? selectedDiets.filter((d) => d !== diet)
        : [...selectedDiets, diet],
    });
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSeasons([]);
    setMaxTime(null);
    updateSettings({ dietaryPreferences: [] });
  };

  // The chips shown under the search bar, one per active filter.
  const appliedFilters = [
    ...selectedCategories.map((value) => {
      const opt = CATEGORY_BY_VALUE[value];
      return {
        key: `cat:${value}`,
        label: opt?.label ?? value,
        icon: <Icon name={opt?.icon ?? 'ChefHat'} size={15} color={colors.primary} />,
        onRemove: () => toggleCategory(value),
      };
    }),
    ...selectedSeasons.map((season) => ({
      key: `season:${season}`,
      label: seasonLabel[season],
      icon: (
        <Icon
          name={season === 'lente-zomer' ? 'Sun' : 'Snow'}
          size={15}
          color={colors.primary}
        />
      ),
      onRemove: () => toggleSeason(season),
    })),
    ...selectedDiets.map((diet) => ({
      key: `diet:${diet}`,
      label: dietaryLabel[diet],
      icon: <Ionicons name={DIET_ICON[diet]} size={15} color={colors.primary} />,
      onRemove: () => toggleDiet(diet),
    })),
    ...(maxTime !== null
      ? [
          {
            key: 'time',
            label: `≤ ${maxTime} min`,
            icon: <Icon name="Clock" size={15} color={colors.primary} />,
            onRemove: () => setMaxTime(null),
          },
        ]
      : []),
  ];

  // Slide-in for the in-tree filter sheet (kept inside the app container rather
  // than a Modal, which on web would portal to full browser width).
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!filtersOpen) return;
    sheetAnim.setValue(0);
    dragY.setValue(0);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [filtersOpen, sheetAnim, dragY]);
  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [560, 0],
  });

  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => gesture.dy > 4,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) dragY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_evt, gesture) => {
        if (gesture.dy > 110 || gesture.vy > 0.8) {
          Animated.timing(dragY, {
            toValue: 560,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            dragY.setValue(0);
            setFiltersOpen(false);
          });
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView delay={Math.min(index, 6) * 55}>
            <RecipeCard recipe={item} onPress={() => openRecipe(item.id)} />
          </FadeInView>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Recepten</Text>
            <Text style={styles.subtitle}>{countLabel}</Text>

            {/* Search field + filters trigger, always visible */}
            <View style={styles.toolbar}>
              <View style={styles.searchBox}>
                <Icon name="Search" size={iconSize.action} color={colors.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Zoek recepten"
                  placeholderTextColor={colors.textMuted}
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                />
                {query.length > 0 ? (
                  <Ionicons
                    name="close-circle"
                    size={iconSize.action}
                    color={colors.textMuted}
                    onPress={() => setQuery('')}
                  />
                ) : null}
              </View>

              <Pressable
                onPress={() => setFiltersOpen(true)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.filtersButton,
                  activeFilterCount > 0 && styles.filtersButtonActive,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="options-outline"
                  size={iconSize.action}
                  color={colors.textSecondary}
                />
                <Text style={styles.filtersButtonText}>Filters</Text>
                {activeFilterCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeFilterCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            </View>

            {/* Applied filters, so it's clear what's narrowing the list */}
            {appliedFilters.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.appliedRow}
              >
                {appliedFilters.map((f) => (
                  <Pressable
                    key={f.key}
                    onPress={f.onRemove}
                    accessibilityRole="button"
                    accessibilityLabel={`${f.label} filter verwijderen`}
                    style={({ pressed }) => [
                      styles.appliedChip,
                      pressed && styles.pressed,
                    ]}
                  >
                    {f.icon}
                    <Text style={styles.appliedChipText}>{f.label}</Text>
                    <Ionicons name="close" size={15} color={colors.primary} />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="sad-outline" size={iconSize.hero} color={colors.textMuted} />
            <Text style={styles.emptyText}>Geen recepten gevonden</Text>
          </View>
        }
      />

      {filtersOpen ? (
        <View
          style={styles.sheetWrap}
          onLayout={(e) => setSheetAreaHeight(e.nativeEvent.layout.height)}
        >
          <Animated.View style={[styles.sheetBackdrop, { opacity: sheetAnim }]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setFiltersOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Filters sluiten"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.sheet,
              sheetAreaHeight > 0 ? { maxHeight: sheetAreaHeight } : null,
              { transform: [{ translateY: Animated.add(sheetTranslateY, dragY) }] },
            ]}
          >
            <View
              style={styles.sheetHandleArea}
              {...sheetPanResponder.panHandlers}
              accessibilityRole="button"
              accessibilityLabel="Sleep omlaag om filters te sluiten"
            >
              <View style={styles.sheetHandle} />
            </View>

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <Pressable
                onPress={resetFilters}
                accessibilityRole="button"
                disabled={activeFilterCount === 0}
              >
                <Text
                  style={[
                    styles.sheetReset,
                    activeFilterCount === 0 && styles.sheetResetDisabled,
                  ]}
                >
                  Wis alles
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <FilterGroup
                icon={<Icon name="ChefHat" size={22} color={colors.primary} />}
                title="Moment & type"
                subtitle="Wat wil je eten?"
              >
                {categoryOptions.map((o) => (
                  <FilterChip
                    key={o.value}
                    label={o.label}
                    variant="plain"
                    active={selectedCategories.includes(o.value)}
                    onPress={() => toggleCategory(o.value)}
                  />
                ))}
              </FilterGroup>

              <View style={styles.divider} />
              <FilterGroup
                icon={<Ionicons name="leaf-outline" size={22} color={colors.primary} />}
                title="Seizoen"
                subtitle="Welk seizoen past bij je stemming?"
              >
                {SEASONS.map((s) => (
                  <FilterChip
                    key={s}
                    label={seasonLabel[s]}
                    variant="plain"
                    active={selectedSeasons.includes(s)}
                    onPress={() => toggleSeason(s)}
                  />
                ))}
              </FilterGroup>

              <View style={styles.divider} />
              <FilterGroup
                icon={<Ionicons name="nutrition-outline" size={22} color={colors.primary} />}
                title="Dieet"
                subtitle="Houd rekening met je voorkeuren"
              >
                {DIETS.map((d) => (
                  <FilterChip
                    key={d}
                    label={dietaryLabel[d]}
                    variant="plain"
                    active={selectedDiets.includes(d)}
                    onPress={() => toggleDiet(d)}
                  />
                ))}
              </FilterGroup>

              <View style={styles.divider} />
              <FilterGroup
                icon={<Icon name="Clock" size={22} color={colors.primary} />}
                title="Bereidingstijd"
                subtitle="Hoeveel tijd heb je?"
              >
                {TIME_OPTIONS.map((minutes) => (
                  <FilterChip
                    key={minutes}
                    label={`≤ ${minutes} min`}
                    variant="plain"
                    active={maxTime === minutes}
                    onPress={() =>
                      setMaxTime((prev) => (prev === minutes ? null : minutes))
                    }
                  />
                ))}
              </FilterGroup>
            </ScrollView>

            <Pressable
              style={({ pressed }) => [styles.sheetApply, pressed && styles.pressed]}
              onPress={() => setFiltersOpen(false)}
              accessibilityRole="button"
            >
              <Text style={styles.sheetApplyText}>
                {`Toon ${recipeCountLabel(filteredRecipes.length)}`}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={colors.textOnPrimary} />
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

/** One labelled group of chips in the filter sheet. */
function FilterGroup({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHead}>
        <View style={styles.groupIcon}>{icon}</View>
        <View style={styles.groupHeadText}>
          <Text style={styles.groupTitle}>{title}</Text>
          <Text style={styles.groupSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: -spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filtersButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  filtersButtonText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.85,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
  },
  appliedRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  appliedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
  },
  appliedChipText: {
    ...typography.label,
    color: colors.primary,
  },
  sheetWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 44, 26, 0.4)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    flexShrink: 1,
    ...shadow.card,
  },
  sheetScroll: { flexShrink: 1 },
  sheetScrollContent: { gap: spacing.lg, paddingBottom: spacing.xs },
  sheetHandleArea: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: -spacing.xs,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    ...typography.display,
    color: colors.textPrimary,
  },
  sheetReset: {
    ...typography.bodyStrong,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  sheetResetDisabled: {
    color: colors.textMuted,
    textDecorationLine: 'none',
  },
  group: {
    gap: spacing.md,
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  groupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupHeadText: {
    flex: 1,
    gap: 2,
  },
  groupTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  groupSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sheetApply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginTop: spacing.xs,
  },
  sheetApplyText: {
    ...typography.bodyStrong,
    color: colors.textOnPrimary,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
