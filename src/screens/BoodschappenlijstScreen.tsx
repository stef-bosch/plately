import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '../components/BrandIcons';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useShoppingList } from '../context/ShoppingListContext';
import { getRecipeById } from '../data/recipes';
import { useAppNavigation } from '../navigation/hooks';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { GroceryCategory } from '../utils/groceryCategories';
import { buildShoppingList } from '../utils/shoppingList';

/** Same hue as `hex`, but translucent — a soft tint for the category badge. */
function tint(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Accent colour per supermarket category (drives the badge circle). */
const CATEGORY_COLOR: Record<GroceryCategory, string> = {
  Groente: '#6A7147',
  Fruit: '#E08A3C',
  'Vlees & vis': '#BE6E45',
  'Zuivel & eieren': '#CE7B92',
  'Brood & granen': '#D3A64A',
  'Noten, zaden & droog': '#A9773E',
  'Sauzen, olie & azijn': '#A98A3E',
  'Kruiden & specerijen': '#6E7A46',
  Drank: '#4E8D9C',
  Overig: '#7C7E70',
};

/** The little glyph shown in each category badge, in the category's colour. */
function CategoryGlyph({ category, color }: { category: GroceryCategory; color: string }) {
  const size = 22;
  switch (category) {
    case 'Groente':
      return <Icon name="Vegetable" size={size} color={color} />;
    case 'Fruit':
      return <Icon name="Fruit" size={size} color={color} />;
    case 'Vlees & vis':
      return <Icon name="Fish" size={size} color={color} />;
    case 'Zuivel & eieren':
      return <MaterialCommunityIcons name="bottle-soda-outline" size={size} color={color} />;
    case 'Brood & granen':
      return <Icon name="Grain" size={size} color={color} />;
    case 'Noten, zaden & droog':
      return <Ionicons name="nutrition-outline" size={size} color={color} />;
    case 'Sauzen, olie & azijn':
      return <Ionicons name="water-outline" size={size} color={color} />;
    case 'Kruiden & specerijen':
      return <Ionicons name="leaf-outline" size={size} color={color} />;
    case 'Drank':
      return <Ionicons name="wine-outline" size={size} color={color} />;
    case 'Overig':
      return <Ionicons name="cart-outline" size={size} color={color} />;
  }
}

function checkedLabel(done: number, total: number): string {
  return `${done} van ${total} afgevinkt`;
}

export function BoodschappenlijstScreen() {
  const navigation = useAppNavigation();
  const { entries, checked, hidden, removeEntry, clear, toggleChecked, hideItem } =
    useShoppingList();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [menuKey, setMenuKey] = useState<string | null>(null);

  // Aggregated groups minus items the user removed by hand.
  const groups = useMemo(() => {
    return buildShoppingList(entries)
      .map((g) => ({ ...g, items: g.items.filter((it) => !hidden.has(it.key)) }))
      .filter((g) => g.items.length > 0);
  }, [entries, hidden]);

  const allItems = groups.flatMap((g) => g.items);
  const total = allItems.length;
  const doneCount = allItems.filter((it) => checked.has(it.key)).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  const isEmpty = entries.length === 0;

  const toggleCollapse = (category: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });

  return (
    <Screen
      title="Boodschappen"
      subtitle={isEmpty ? 'Nog niets toegevoegd' : checkedLabel(doneCount, total)}
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
          <Icon name="Cart" size={32} color={colors.textMuted} />
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
          {/* Overall progress */}
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.progressPct}>{percent}%</Text>
          </View>

          {groups.map((group) => {
            const color = CATEGORY_COLOR[group.category];
            const groupDone = group.items.filter((it) => checked.has(it.key)).length;
            const isCollapsed = collapsed.has(group.category);
            return (
              <View key={group.category} style={styles.card}>
                <Pressable
                  onPress={() => toggleCollapse(group.category)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: !isCollapsed }}
                  style={({ pressed }) => [
                    styles.groupHeader,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.badge, { backgroundColor: tint(color, 0.16) }]}>
                    <CategoryGlyph category={group.category} color={color} />
                  </View>
                  <View style={styles.groupHeadText}>
                    <Text style={styles.groupTitle}>{group.category}</Text>
                    <Text style={styles.groupMeta}>
                      {checkedLabel(groupDone, group.items.length)}
                    </Text>
                  </View>
                  <View style={styles.chevron}>
                    <Ionicons
                      name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                      size={18}
                      color={colors.textSecondary}
                    />
                  </View>
                </Pressable>

                {isCollapsed
                  ? null
                  : group.items.map((item) => {
                      const isChecked = checked.has(item.key);
                      const menuOpen = menuKey === item.key;
                      return (
                        <View key={item.key} style={styles.itemWrap}>
                          <View
                            style={[styles.itemRow, isChecked && styles.itemRowChecked]}
                          >
                            <Pressable
                              onPress={() => toggleChecked(item.key)}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: isChecked }}
                              style={({ pressed }) => [
                                styles.itemMain,
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
                              <View style={styles.itemText}>
                                <Text
                                  style={[styles.itemName, isChecked && styles.itemChecked]}
                                >
                                  {item.name}
                                </Text>
                                {item.amount ? (
                                  <Text style={styles.itemAmount}>{item.amount}</Text>
                                ) : null}
                              </View>
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                setMenuKey((prev) => (prev === item.key ? null : item.key))
                              }
                              accessibilityRole="button"
                              accessibilityLabel={`Opties voor ${item.name}`}
                              hitSlop={8}
                              style={({ pressed }) => [
                                styles.kebab,
                                pressed && styles.pressed,
                              ]}
                            >
                              <Ionicons
                                name="ellipsis-vertical"
                                size={18}
                                color={colors.textMuted}
                              />
                            </Pressable>
                          </View>

                          {menuOpen ? (
                            <View style={styles.menu}>
                              <Pressable
                                onPress={() => {
                                  hideItem(item.key);
                                  setMenuKey(null);
                                }}
                                accessibilityRole="button"
                                style={({ pressed }) => [
                                  styles.menuItem,
                                  pressed && styles.pressed,
                                ]}
                              >
                                <Ionicons
                                  name="trash-outline"
                                  size={16}
                                  color={colors.protein}
                                />
                                <Text style={styles.menuItemText}>Verwijderen</Text>
                              </Pressable>
                            </View>
                          ) : null}
                        </View>
                      );
                    })}
              </View>
            );
          })}

          {/* Dishes that feed the list */}
          <View style={styles.dishesSection}>
            <Text style={styles.dishesTitle}>Gerechten in de lijst</Text>
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
                      <Ionicons name="close" size={20} color={colors.textSecondary} />
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: -spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  progressPct: {
    ...typography.bodyStrong,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    ...shadow.soft,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  groupMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  chevron: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrap: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  itemRowChecked: {
    backgroundColor: colors.surfaceMuted,
  },
  itemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingLeft: spacing.xs,
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
    gap: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  itemChecked: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemAmount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  kebab: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    alignItems: 'flex-end',
    paddingBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  menuItemText: {
    ...typography.label,
    color: colors.protein,
  },
  dishesSection: {
    gap: spacing.md,
  },
  dishesTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
