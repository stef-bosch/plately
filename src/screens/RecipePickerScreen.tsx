import { useRoute, type RouteProp } from '@react-navigation/native';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon } from '../components/BrandIcons';
import { FadeInView } from '../components/FadeInView';
import { FilterChip } from '../components/FilterChip';
import { RecipeCard } from '../components/RecipeCard';
import { mealTypeLabel } from '../constants/labels';
import { useDayMenu } from '../context/DayMenuContext';
import { getAllRecipes } from '../data/recipes';
import { useAppNavigation } from '../navigation/hooks';
import type { RootStackParamList } from '../navigation/types';
import { colors, iconSize, radius, spacing, typography } from '../theme';

/**
 * Picks a dish to plan for a specific meal moment (opened from a dashboard
 * slot). Defaults to dishes whose mealType matches the moment, with a toggle to
 * browse everything. Tapping a dish plans it and returns to the dashboard.
 */
export function RecipePickerScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'KiesRecept'>>();
  const { slot } = route.params;
  const { addToDayMenu } = useDayMenu();

  const [query, setQuery] = useState('');
  const [onlyThisMoment, setOnlyThisMoment] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ title: `Kies voor ${mealTypeLabel[slot]}` });
  }, [navigation, slot]);

  const allRecipes = useMemo(() => getAllRecipes(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRecipes.filter((r) => {
      if (onlyThisMoment && r.mealType !== slot) return false;
      return q === '' || r.title.toLowerCase().includes(q);
    });
  }, [allRecipes, query, onlyThisMoment, slot]);

  const pick = (recipeId: string) => {
    addToDayMenu(recipeId, slot);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.content}
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <FadeInView delay={Math.min(index, 6) * 45}>
            <RecipeCard recipe={item} onPress={() => pick(item.id)} />
          </FadeInView>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.searchBox}>
              <Icon name="Search" size={iconSize.action} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Zoek een recept..."
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
              />
            </View>
            <View style={styles.toggleRow}>
              <FilterChip
                label={`Voor ${mealTypeLabel[slot].toLowerCase()}`}
                active={onlyThisMoment}
                onPress={() => setOnlyThisMoment(true)}
              />
              <FilterChip
                label="Alle recepten"
                active={!onlyThisMoment}
                onPress={() => setOnlyThisMoment(false)}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Geen recepten gevonden</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
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
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    padding: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
