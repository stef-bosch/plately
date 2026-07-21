import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { Ingredient, IngredientGroup } from '../types';
import { MoveButtons, formKit, moveInList } from './formKit';

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
    items: g.items.length ? g.items.map(draftFromIngredient) : [emptyItem()],
  }));
}

function draftFromIngredient(it: Ingredient): IngredientDraft {
  return { name: it.name, quantity: String(it.quantity), unit: it.unit };
}

interface Props {
  groups: GroupDraft[];
  setGroups: React.Dispatch<React.SetStateAction<GroupDraft[]>>;
}

export function IngredientGroupsEditor({ groups, setGroups }: Props) {
  const patchItem = (gi: number, idx: number, patch: Partial<IngredientDraft>) =>
    setGroups((p) =>
      p.map((g, i) =>
        i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, ...patch } : x)) } : g,
      ),
    );

  const moveItem = (gi: number, idx: number, dir: -1 | 1) =>
    setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: moveInList(g.items, idx, dir) } : g)));

  const moveGroup = (gi: number, dir: -1 | 1) => setGroups((p) => moveInList(p, gi, dir));

  return (
    <>
      <Text style={formKit.hint}>
        Groepeer ingrediënten onder een kop (bijv. "Basis", "Topping").
      </Text>
      {groups.map((group, gi) => (
        <View key={gi} style={styles.groupBlock}>
          <View style={styles.groupHeaderRow}>
            <TextInput
              value={group.category}
              onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, category: t } : g)))}
              placeholder="Kop (bijv. Basis, Topping)"
              placeholderTextColor={colors.textMuted}
              style={[formKit.input, styles.groupTitleInput, { flex: 1 }]}
            />
            {groups.length > 1 ? (
              <>
                <MoveButtons
                  onUp={() => moveGroup(gi, -1)}
                  onDown={() => moveGroup(gi, 1)}
                  disableUp={gi === 0}
                  disableDown={gi === groups.length - 1}
                  label="kop"
                />
                <Pressable onPress={() => setGroups((p) => p.filter((_, i) => i !== gi))} style={formKit.iconButton}>
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </>
            ) : null}
          </View>

          {group.items.map((ing, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <TextInput value={ing.quantity} onChangeText={(t) => patchItem(gi, idx, { quantity: t })} placeholder="100" placeholderTextColor={colors.textMuted} style={[formKit.input, styles.qtyInput]} />
              <TextInput value={ing.unit} onChangeText={(t) => patchItem(gi, idx, { unit: t })} placeholder="g" placeholderTextColor={colors.textMuted} style={[formKit.input, styles.unitInput]} />
              <TextInput value={ing.name} onChangeText={(t) => patchItem(gi, idx, { name: t })} placeholder="ingrediënt" placeholderTextColor={colors.textMuted} style={[formKit.input, { flex: 1 }]} />
              {group.items.length > 1 ? (
                <MoveButtons
                  onUp={() => moveItem(gi, idx, -1)}
                  onDown={() => moveItem(gi, idx, 1)}
                  disableUp={idx === 0}
                  disableDown={idx === group.items.length - 1}
                  label="ingrediënt"
                />
              ) : null}
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
  qtyInput: { width: 56 },
  unitInput: { width: 48 },
});
