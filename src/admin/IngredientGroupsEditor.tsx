import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { colors, spacing, typography } from '../theme';
import type {
  Ingredient,
  IngredientGroup,
  IngredientRole,
  IngredientScaling,
  Nutrition,
} from '../types';
import { MoveButtons, formKit, moveInList } from './formKit';

export interface IngredientDraft {
  name: string;
  quantity: string;
  unit: string;
  // Optional calc-engine metadata (per-ingredient scaling).
  advancedOpen?: boolean;
  role?: IngredientRole | '';
  minG?: string;
  maxG?: string;
  stepG?: string;
  kcal100?: string;
  protein100?: string;
  carbs100?: string;
  fat100?: string;
}

export interface GroupDraft {
  category: string;
  items: IngredientDraft[];
}

const ROLE_LABEL: Record<IngredientRole, string> = {
  carb_base: 'Koolhydraatbron',
  protein_base: 'Eiwitbron',
  fat_source: 'Vetbron',
  vegetable: 'Groente',
  fruit: 'Fruit',
  dairy_sauce: 'Zuivel/saus',
  sauce_base: 'Sausbasis',
  flavouring: 'Smaakmaker',
  garnish: 'Garnering',
  liquid: 'Vloeistof',
  optional_topping: 'Optionele topping',
};
const ROLES = Object.keys(ROLE_LABEL) as IngredientRole[];

export const emptyItem = (): IngredientDraft => ({ name: '', quantity: '', unit: '' });
export const emptyGroup = (): GroupDraft => ({ category: '', items: [emptyItem()] });

const numOrUndef = (s?: string): number | undefined => {
  const n = Number((s ?? '').replace(',', '.'));
  return s == null || s.trim() === '' || Number.isNaN(n) ? undefined : n;
};

/** Build the calc-engine scaling metadata from a draft (needs role + kcal/100g). */
export function scalingFromDraft(d: IngredientDraft): IngredientScaling | undefined {
  if (!d.role) return undefined;
  const kcal = numOrUndef(d.kcal100);
  if (kcal == null) return undefined; // without per-100g kcal the engine can't scale it
  return {
    role: d.role,
    minG: numOrUndef(d.minG),
    maxG: numOrUndef(d.maxG),
    stepG: numOrUndef(d.stepG),
    kcalPer100g: kcal,
    proteinPer100g: numOrUndef(d.protein100) ?? 0,
    carbsPer100g: numOrUndef(d.carbs100) ?? 0,
    fatPer100g: numOrUndef(d.fat100) ?? 0,
  };
}

/** The gram amount of a draft, or undefined when it isn't a plain number. */
function gramsOf(d: IngredientDraft): number | undefined {
  const n = numOrUndef(d.quantity);
  return n != null && n > 0 ? n : undefined;
}

/**
 * Per-portion nutrition summed from the ingredients' per-100 g values. Used for
 * weekmenu dishes, whose nutrition is computed instead of typed by hand. An
 * ingredient only counts once it has a gram amount and kcal/100 g.
 */
export function nutritionFromGroups(groups: GroupDraft[]): Nutrition {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const group of groups) {
    for (const item of group.items) {
      const grams = gramsOf(item);
      const kcal100 = numOrUndef(item.kcal100);
      if (!item.name.trim() || grams == null || kcal100 == null) continue;
      const factor = grams / 100;
      calories += kcal100 * factor;
      protein += (numOrUndef(item.protein100) ?? 0) * factor;
      carbs += (numOrUndef(item.carbs100) ?? 0) * factor;
      fat += (numOrUndef(item.fat100) ?? 0) * factor;
    }
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: 0,
    micronutrients: {},
    isIndicative: true,
  };
}

/** Named ingredients that can't be counted yet (no gram amount or no kcal/100 g). */
export function ingredientsMissingNutrition(groups: GroupDraft[]): string[] {
  const missing: string[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      if (!item.name.trim()) continue;
      if (gramsOf(item) == null || numOrUndef(item.kcal100) == null) {
        missing.push(item.name.trim());
      }
    }
  }
  return missing;
}

/** Turn stored ingredient groups back into editable drafts. */
export function groupsFromIngredients(ingredients: IngredientGroup[]): GroupDraft[] {
  if (!ingredients.length) return [emptyGroup()];
  return ingredients.map((g) => ({
    category: g.category,
    items: g.items.length ? g.items.map(draftFromIngredient) : [emptyItem()],
  }));
}

function draftFromIngredient(it: Ingredient): IngredientDraft {
  const s = it.scaling;
  return {
    name: it.name,
    quantity: String(it.quantity),
    unit: it.unit,
    role: s?.role ?? '',
    minG: s?.minG != null ? String(s.minG) : '',
    maxG: s?.maxG != null ? String(s.maxG) : '',
    stepG: s?.stepG != null ? String(s.stepG) : '',
    kcal100: s?.kcalPer100g != null ? String(s.kcalPer100g) : '',
    protein100: s?.proteinPer100g != null ? String(s.proteinPer100g) : '',
    carbs100: s?.carbsPer100g != null ? String(s.carbsPer100g) : '',
    fat100: s?.fatPer100g != null ? String(s.fatPer100g) : '',
  };
}

interface Props {
  groups: GroupDraft[];
  setGroups: React.Dispatch<React.SetStateAction<GroupDraft[]>>;
  /**
   * When true (weekmenu dishes) the per-ingredient role + nutrition panel is
   * always visible, since that data is required to compute and scale the dish.
   * When false (recipes) it stays behind the ⚙ toggle and is optional.
   */
  nutritionRequired?: boolean;
}

export function IngredientGroupsEditor({ groups, setGroups, nutritionRequired = false }: Props) {
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
        {nutritionRequired
          ? 'Groepeer ingrediënten onder een kop (bijv. "Basis", "Topping"). Vul per ingrediënt de hoeveelheid (g) in, en klap met ⚙ de rol en voedingswaarde per 100 g uit — daaruit worden de voedingswaarden berekend en wordt het gerecht op maat geschaald.'
          : 'Groepeer ingrediënten onder een kop (bijv. "Basis", "Topping").'}
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

          {group.items.map((ing, idx) => {
            // The role + nutrition panel starts collapsed; the ⚙ toggles it.
            const panelOpen = ing.advancedOpen === true;
            return (
            <View key={idx} style={styles.itemBlock}>
              <View style={styles.ingredientRow}>
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
                {nutritionRequired ? (
                  <Pressable
                    onPress={() => patchItem(gi, idx, { advancedOpen: !panelOpen })}
                    style={formKit.iconButton}
                    accessibilityLabel="Schaal-instellingen"
                  >
                    <Ionicons
                      name="options-outline"
                      size={18}
                      color={ing.role ? colors.primary : colors.textMuted}
                    />
                  </Pressable>
                ) : null}
                <Pressable onPress={() => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.filter((_, j) => j !== idx) } : g)))} style={formKit.iconButton}>
                  <Ionicons name="close" size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              {nutritionRequired && panelOpen ? (
                <View style={styles.advanced}>
                  <Text style={styles.advancedLabel}>Voedingswaarde per 100 g</Text>
                  <View style={styles.miniRow}>
                    <MiniField label="kcal" value={ing.kcal100 ?? ''} onChange={(t) => patchItem(gi, idx, { kcal100: t })} />
                    <MiniField label="eiwit" value={ing.protein100 ?? ''} onChange={(t) => patchItem(gi, idx, { protein100: t })} />
                    <MiniField label="kh" value={ing.carbs100 ?? ''} onChange={(t) => patchItem(gi, idx, { carbs100: t })} />
                    <MiniField label="vet" value={ing.fat100 ?? ''} onChange={(t) => patchItem(gi, idx, { fat100: t })} />
                  </View>
                  <Text style={formKit.hint}>
                    Vul minstens de hoeveelheid (g) en kcal/100 g in, anders telt dit ingrediënt niet mee in de voedingswaarden.
                  </Text>

                  <Text style={styles.advancedLabel}>Rol in het gerecht</Text>
                  <View style={formKit.chipRow}>
                    <FilterChip label="geen" active={!ing.role} onPress={() => patchItem(gi, idx, { role: '' })} />
                    {ROLES.map((r) => (
                      <FilterChip key={r} label={ROLE_LABEL[r]} active={ing.role === r} onPress={() => patchItem(gi, idx, { role: r })} />
                    ))}
                  </View>

                  {ing.role ? (
                    <>
                      <Text style={styles.advancedLabel}>Grenzen (gram, optioneel)</Text>
                      <View style={styles.miniRow}>
                        <MiniField label="min" value={ing.minG ?? ''} onChange={(t) => patchItem(gi, idx, { minG: t })} />
                        <MiniField label="max" value={ing.maxG ?? ''} onChange={(t) => patchItem(gi, idx, { maxG: t })} />
                        <MiniField label="stap" value={ing.stepG ?? ''} onChange={(t) => patchItem(gi, idx, { stepG: t })} />
                      </View>
                    </>
                  ) : null}
                </View>
              ) : null}
            </View>
            );
          })}

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

function MiniField({ label, value, onChange }: { label: string; value: string; onChange: (t: string) => void }) {
  return (
    <View style={styles.miniField}>
      <Text style={styles.miniLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} keyboardType="numeric" placeholder="—" placeholderTextColor={colors.textMuted} style={[formKit.input, styles.miniInput]} />
    </View>
  );
}

const styles = StyleSheet.create({
  groupBlock: { gap: spacing.xs, paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.border, marginBottom: spacing.sm },
  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  groupTitleInput: { ...typography.bodyStrong },
  itemBlock: { gap: spacing.xs },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyInput: { width: 56 },
  unitInput: { width: 48 },
  advanced: { gap: spacing.xs, backgroundColor: colors.background, borderRadius: 8, padding: spacing.sm, marginBottom: spacing.xs },
  advancedLabel: { ...typography.caption, color: colors.textSecondary },
  miniRow: { flexDirection: 'row', gap: spacing.xs },
  miniField: { flex: 1, gap: 2 },
  miniLabel: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  miniInput: { paddingVertical: spacing.xs, textAlign: 'center' },
});
