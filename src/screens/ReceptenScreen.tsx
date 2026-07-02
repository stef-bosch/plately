import { Ionicons } from '@expo/vector-icons';
import { useRoute, type RouteProp } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Icon } from '../components/BrandIcons';
import { FadeInView } from '../components/FadeInView';
import { FilterChip } from '../components/FilterChip';
import { MenuCard } from '../components/MenuCard';
import { RecipeCard } from '../components/RecipeCard';
import { mealTypeLabel, seasonLabel } from '../constants/labels';
import { useSettings } from '../context/SettingsContext';
import { getCourseForRecipe, getMenus } from '../data/menus';
import { getAllRecipes } from '../data/recipes';
import { useOpenMenu, useOpenRecipe } from '../navigation/hooks';
import { recipeMatchesDiets } from '../utils/resolveRecipe';
import type { TabParamList } from '../navigation/types';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import type {
  MealType,
  Menu,
  Recipe,
  RecipeTag,
  Season,
} from '../types';

/** Top-level browse mode. */
type Category = 'gerechten' | 'menus' | 'overig';
type MealFilter = MealType | 'alle';
type TagFilter = 'cocktails' | 'sauzen';
type TagFilterOption = TagFilter | 'alle';
type SeasonFilter = Season | 'alle';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'gerechten', label: 'Gerechten' },
  { key: 'menus', label: "Menu's" },
  { key: 'overig', label: 'Overig' },
];

const MEAL_FILTERS: MealFilter[] = [
  'alle',
  'ontbijt',
  'lunch',
  'diner',
  'tussendoortje',
];

/** "Overig" filters match on a recipe tag rather than its meal type. */
const TAG_FILTERS: Record<TagFilter, RecipeTag> = {
  cocktails: 'Cocktails',
  sauzen: 'Sauzen',
};
const TAG_FILTER_OPTIONS: TagFilterOption[] = ['alle', 'cocktails', 'sauzen'];

/**
 * Tags that define the "Overig" tab. Only recipes carrying one of these belong
 * here, so full dishes (e.g. BBQ mains) stay out of "Overig" entirely — even
 * when no specific category is selected.
 */
const OVERIG_TAGS: RecipeTag[] = Object.values(TAG_FILTERS);

const SEASON_FILTERS: SeasonFilter[] = ['alle', 'lente-zomer', 'herfst-winter'];

const MEAL_TYPES: MealType[] = ['ontbijt', 'lunch', 'diner', 'tussendoortje'];

function isTagFilter(value: string): value is TagFilter {
  return value in TAG_FILTERS;
}

export function ReceptenScreen() {
  const openRecipe = useOpenRecipe();
  const openMenu = useOpenMenu();
  const route = useRoute<RouteProp<TabParamList, 'Recepten'>>();
  const { settings } = useSettings();

  // A deep-link param can target a meal type or an "Overig" tag.
  const param = route.params?.mealType;
  const initialCategory: Category =
    param && isTagFilter(param) ? 'overig' : 'gerechten';
  const initialMeal: MealFilter =
    param && MEAL_TYPES.includes(param as MealType)
      ? (param as MealType)
      : 'alle';
  const initialTag: TagFilterOption =
    param && isTagFilter(param) ? param : 'alle';

  const [category, setCategory] = useState<Category>(initialCategory);
  const [query, setQuery] = useState('');
  const [mealFilter, setMealFilter] = useState<MealFilter>(initialMeal);
  const [tagFilter, setTagFilter] = useState<TagFilterOption>(initialTag);
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('alle');
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Recipes resolved for the current settings (reactive breakfasts adapt to
  // the user's energy need + dietary preferences).
  const allRecipes = useMemo(() => getAllRecipes(settings), [settings]);

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRecipes.filter((recipe) => {
      // Dishes that are part of a menu only show under the "Menu's" tab.
      if (getCourseForRecipe(recipe.id)) return false;
      // Only show dishes that meet every selected dietary preference.
      if (!recipeMatchesDiets(recipe, settings.dietaryPreferences)) return false;
      const matchesQuery = q === '' || recipe.title.toLowerCase().includes(q);
      const matchesSeason =
        seasonFilter === 'alle' || recipe.seasons.includes(seasonFilter);
      if (category === 'overig') {
        const matchesTag =
          tagFilter === 'alle'
            ? OVERIG_TAGS.some((tag) => recipe.tags.includes(tag))
            : recipe.tags.includes(TAG_FILTERS[tagFilter]);
        return matchesQuery && matchesSeason && matchesTag;
      }
      const matchesMeal =
        mealFilter === 'alle' ? true : recipe.mealType === mealFilter;
      return matchesQuery && matchesSeason && matchesMeal;
    });
  }, [allRecipes, query, category, mealFilter, tagFilter, seasonFilter]);

  const filteredMenus = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getMenus().filter(
      (menu) => q === '' || menu.title.toLowerCase().includes(q),
    );
  }, [query]);

  const showingMenus = category === 'menus';
  const data: (Recipe | Menu)[] = showingMenus
    ? filteredMenus
    : filteredRecipes;

  const countLabel = showingMenus
    ? `${filteredMenus.length} ${filteredMenus.length === 1 ? 'menu' : "menu's"} gevonden`
    : `${filteredRecipes.length} ${filteredRecipes.length === 1 ? 'recept' : 'recepten'} gevonden`;

  // How many filters are narrowing the current list (used for the badge).
  const primaryFilterActive =
    category === 'overig' ? tagFilter !== 'alle' : mealFilter !== 'alle';
  const activeFilterCount =
    (primaryFilterActive ? 1 : 0) + (seasonFilter !== 'alle' ? 1 : 0);

  const resetFilters = () => {
    setMealFilter('alle');
    setTagFilter('alle');
    setSeasonFilter('alle');
  };

  const searchVisible = searchOpen || query.length > 0;
  const searchPlaceholder = showingMenus ? 'Zoek een menu...' : 'Zoeken op naam...';

  // Slide-in for the in-tree filter sheet (kept inside the app container rather
  // than a Modal, which on web would portal to full browser width).
  const sheetAnim = useRef(new Animated.Value(0)).current;
  // Extra downward offset driven by dragging the grab handle.
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
    outputRange: [480, 0],
  });

  // Let the user swipe the sheet down by its handle to dismiss it.
  const sheetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_evt, gesture) => gesture.dy > 4,
      onPanResponderMove: (_evt, gesture) => {
        if (gesture.dy > 0) {
          dragY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_evt, gesture) => {
        // Far enough or a quick flick down → close; otherwise snap back.
        if (gesture.dy > 110 || gesture.vy > 0.8) {
          Animated.timing(dragY, {
            toValue: 480,
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
          {showingMenus ? (
            <MenuCard menu={item as Menu} onPress={() => openMenu(item.id)} />
          ) : (
            <RecipeCard
              recipe={item as Recipe}
              onPress={() => openRecipe(item.id)}
            />
          )}
        </FadeInView>
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Recepten</Text>
          <Text style={styles.subtitle}>{countLabel}</Text>

          {/* Category switcher */}
          <View style={styles.segment}>
            {CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <Pressable
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[styles.segmentItem, active && styles.segmentItemActive]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Compact toolbar: search toggle + filters sheet trigger */}
          <View style={styles.toolbar}>
            <Pressable
              onPress={() => setSearchOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityState={{ expanded: searchVisible }}
              style={({ pressed }) => [
                styles.toolbarButton,
                searchVisible && styles.toolbarButtonActive,
                pressed && styles.toolbarButtonPressed,
              ]}
            >
              <Icon name="Search" size={iconSize.action} color={colors.textSecondary} />
              <Text style={styles.toolbarButtonText}>Zoeken</Text>
            </Pressable>

            {!showingMenus ? (
              <Pressable
                onPress={() => setFiltersOpen(true)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.toolbarButton,
                  activeFilterCount > 0 && styles.toolbarButtonActive,
                  pressed && styles.toolbarButtonPressed,
                ]}
              >
                <Ionicons
                  name="options-outline"
                  size={iconSize.action}
                  color={colors.textSecondary}
                />
                <Text style={styles.toolbarButtonText}>Filters</Text>
                {activeFilterCount > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{activeFilterCount}</Text>
                  </View>
                ) : null}
              </Pressable>
            ) : null}
          </View>

          {searchVisible ? (
            <View style={styles.searchBox}>
              <Icon name="Search" size={iconSize.action} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                autoFocus
              />
              <Ionicons
                name="close-circle"
                size={iconSize.action}
                color={colors.textMuted}
                onPress={() => {
                  setQuery('');
                  setSearchOpen(false);
                }}
              />
            </View>
          ) : null}

        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="sad-outline" size={iconSize.hero} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            {showingMenus ? "Geen menu's gevonden" : 'Geen recepten gevonden'}
          </Text>
        </View>
      }
    />

    {filtersOpen ? (
      <View style={styles.sheetWrap}>
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
            {activeFilterCount > 0 ? (
              <Pressable onPress={resetFilters} accessibilityRole="button">
                <Text style={styles.sheetReset}>Wis filters</Text>
              </Pressable>
            ) : null}
          </View>

          {category === 'gerechten' ? (
            <View style={styles.sheetGroup}>
              <Text style={styles.filterLabel}>Soort gerecht</Text>
              <View style={styles.chipRow}>
                {MEAL_FILTERS.map((m) => (
                  <FilterChip
                    key={m}
                    label={m === 'alle' ? 'Alle' : mealTypeLabel[m]}
                    active={mealFilter === m}
                    onPress={() => setMealFilter(m)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {category === 'overig' ? (
            <View style={styles.sheetGroup}>
              <Text style={styles.filterLabel}>Categorie</Text>
              <View style={styles.chipRow}>
                {TAG_FILTER_OPTIONS.map((t) => (
                  <FilterChip
                    key={t}
                    label={t === 'alle' ? 'Alle' : TAG_FILTERS[t]}
                    active={tagFilter === t}
                    onPress={() => setTagFilter(t)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.sheetGroup}>
            <Text style={styles.filterLabel}>Seizoen</Text>
            <View style={styles.chipRow}>
              {SEASON_FILTERS.map((s) => (
                <FilterChip
                  key={s}
                  label={s === 'alle' ? 'Alle' : seasonLabel[s]}
                  active={seasonFilter === s}
                  onPress={() => setSeasonFilter(s)}
                />
              ))}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sheetApply,
              pressed && styles.toolbarButtonPressed,
            ]}
            onPress={() => setFiltersOpen(false)}
            accessibilityRole="button"
          >
            <Text style={styles.sheetApplyText}>
              {showingMenus
                ? 'Sluiten'
                : `Toon ${filteredRecipes.length} ${
                    filteredRecipes.length === 1 ? 'recept' : 'recepten'
                  }`}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    ) : null}
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
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  segmentItemActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textOnPrimary,
  },
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  toolbarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolbarButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  toolbarButtonPressed: {
    opacity: 0.85,
  },
  toolbarButtonText: {
    ...typography.label,
    color: colors.textSecondary,
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
  searchBox: {
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
  sheetWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 23, 8, 0.45)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
    ...shadow.card,
  },
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
    ...typography.heading,
    color: colors.textPrimary,
  },
  sheetReset: {
    ...typography.label,
    color: colors.primary,
  },
  sheetGroup: {
    gap: spacing.md,
  },
  sheetApply: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sheetApplyText: {
    ...typography.bodyStrong,
    color: colors.textOnPrimary,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  filterLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
