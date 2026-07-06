import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { IngredientGroup } from '../types';
import { formKit } from './formKit';

export interface IngredientDraft {
  name: string;
  quantity: string;
  unit: string;
}

export interface GroupDraft {
  category: string;
  items: IngredientDraft[];
}

export const emptyItem = (): IngredientDraft => ({ name: '', quantity: '', unit: '' });
export const emptyGroup = (): GroupDraft => ({ category: '', items: [emptyItem()] });

/** Turn stored ingredient groups back into editable drafts. */
export function groupsFromIngredients(ingredients: IngredientGroup[]): GroupDraft[] {
  if (!ingredients.length) return [emptyGroup()];
  return ingredients.map((g) => ({
    category: g.category,
    items: g.items.length
      ? g.items.map((it) => ({
          name: it.name,
          quantity: String(it.quantity),
          unit: it.unit,
        }))
      : [emptyItem()],
  }));
}

interface Props {
  groups: GroupDraft[];
  setGroups: React.Dispatch<React.SetStateAction<GroupDraft[]>>;
}

/** Grouped ingredient editor: each group has a heading + its own rows. */
export function IngredientGroupsEditor({ groups, setGroups }: Props) {
  return (
    <>
      <Text style={formKit.hint}>
        Groepeer ingrediënten onder een kop (bijv. "Basis", "Topping"). De kop
        verschijnt in de app boven de betreffende ingrediënten.
      </Text>
      {groups.map((group, gi) => (
        <View key={gi} style={styles.groupBlock}>
          <View style={styles.groupHeaderRow}>
            <TextInput
              value={group.category}
              onChangeText={(t) =>
                setGroups((p) => p.map((g, i) => (i === gi ? { ...g, category: t } : g)))
              }
              placeholder="Kop (bijv. Basis, Topping)"
              placeholderTextColor={colors.textMuted}
              style={[formKit.input, styles.groupTitleInput, { flex: 1 }]}
            />
            {groups.length > 1 ? (
              <Pressable
                onPress={() => setGroups((p) => p.filter((_, i) => i !== gi))}
                style={formKit.iconButton}
              >
                <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
          {group.items.map((ing, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <TextInput value={ing.quantity} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, quantity: t } : x)) } : g)))} placeholder="100" placeholderTextColor={colors.textMuted} style={[formKit.input, styles.qtyInput]} />
              <TextInput value={ing.unit} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, unit: t } : x)) } : g)))} placeholder="g" placeholderTextColor={colors.textMuted} style={[formKit.input, styles.unitInput]} />
              <TextInput value={ing.name} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, name: t } : x)) } : g)))} placeholder="ingrediënt" placeholderTextColor={colors.textMuted} style={[formKit.input, { flex: 1 }]} />
              <Pressable onPress={() => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.filter((_, j) => j !== idx) } : g)))} style={formKit.iconButton}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: [...g.items, emptyItem()] } : g)))} style={formKit.addRow}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={formKit.addRowText}>Ingrediënt toevoegen</Text>
          </Pressable>
        </View>
      ))}
      <Pressable onPress={() => setGroups((p) => [...p, emptyGroup()])} style={formKit.addRow}>
        <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
        <Text style={formKit.addRowText}>Kop toevoegen</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  groupBlock: { gap: spacing.xs, paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.border, marginBottom: spacing.sm },
  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  groupTitleInput: { ...typography.bodyStrong },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyInput: { width: 64 },
  unitInput: { width: 64 },
});
