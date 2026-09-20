import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { Icon } from '../components/BrandIcons';
import { Screen } from '../components/Screen';
import { useShoppingList } from '../context/ShoppingListContext';
import { getRecipeById } from '../data/recipes';
import { useAppNavigation } from '../navigation/hooks';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';
import { buildShoppingList } from '../utils/shoppingList';

export function BoodschappenlijstScreen() {
  const navigation = useAppNavigation();
  const { entries, checked, removeEntry, clear, toggleChecked } = useShoppingList();

  const groups = useMemo(() => buildShoppingList(entries), [entries]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const isEmpty = entries.length === 0;

  const subtitle = isEmpty
    ? 'Nog niets toegevoegd'
    : `${total} ${total === 1 ? 'product' : 'producten'}`;

  return (
    <Screen
      title="Boodschappen"
      subtitle={subtitle}
      headerRight={
        isEmpty ? undefined : (
          <Pressable
            onPress={clear}
            accessibilityRole="button"
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
          >
            <Text style={styles.clearText}>Leegmaken</Text>
          </Pressable>
        )
      }
    >
      {isEmpty ? (
        <View style={styles.emptyCard}>
          <Icon name="Cart" size={iconSize.hero} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Je boodschappenlijst is leeg</Text>
          <Text style={styles.emptyText}>
            Open een recept, kies het aantal personen en tik op “Toevoegen aan
            boodschappenlijst”. De ingrediënten worden hier automatisch
            gesorteerd en bij elkaar opgeteld.
          </Text>
          <Button
            label="Naar recepten"
            variant="primary"
            onPress={() => navigation.navigate('Recepten')}
          />
        </View>
      ) : (
        <>
          {groups.map((group) => (
            <View key={group.category} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.category}</Text>
              <View style={styles.card}>
                {group.items.map((item, i) => {
                  const isChecked = checked.has(item.key);
                  return (
                    <Pressable
                      key={item.key}
                      onPress={() => toggleChecked(item.key)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isChecked }}
                      style={({ pressed }) => [
                        styles.itemRow,
                        i > 0 && styles.divider,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View
                        style={[styles.checkbox, isChecked && styles.checkboxOn]}
                      >
                        {isChecked ? (
                          <Ionicons name="checkmark" size={15} color={colors.white} />
                        ) : null}
                      </View>
                      <Text
                        style={[styles.itemText, isChecked && styles.itemChecked]}
                      >
                        {item.amount ? (
                          <Text style={styles.amount}>{item.amount} </Text>
                        ) : null}
                        {item.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gerechten in de lijst</Text>
            <View style={styles.card}>
              {entries.map((entry, i) => {
                const recipe = getRecipeById(entry.recipeId);
                return (
                  <View
                    key={entry.id}
                    style={[styles.dishRow, i > 0 && styles.divider]}
                  >
                    <View style={styles.dishText}>
                      <Text style={styles.dishTitle} numberOfLines={1}>
                        {recipe?.title ?? 'Onbekend gerecht'}
                      </Text>
                      <Text style={styles.dishMeta}>
                        Voor {entry.servings}{' '}
                        {entry.servings === 1 ? 'persoon' : 'personen'}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => removeEntry(entry.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`${recipe?.title ?? 'Gerecht'} uit lijst verwijderen`}
                      hitSlop={8}
                      style={({ pressed }) => [styles.removeBtn, pressed && styles.pressed]}
                    >
                      <Ionicons name="close" size={iconSize.action} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  clearBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  clearText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    ...shadow.soft,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  itemText: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  itemChecked: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  amount: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  dishText: {
    flex: 1,
    gap: 2,
  },
  dishTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dishMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
    ...shadow.card,
  },
  emptyTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
