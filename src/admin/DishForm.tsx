import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import {
  CATEGORY_TO_MEALTYPE,
  MEAL_CATEGORIES,
  OTHER_CATEGORIES,
  dishCategory,
} from '../constants/labels';
import { deleteDish, getDishRow, saveDish } from '../data/adminApi';
import { reloadContent } from '../data/content';
import { colors, spacing, typography } from '../theme';
import type {
  DietSwap,
  DietaryPreference,
  DishUsage,
  Ingredient,
  IngredientCategory,
  IngredientGroup,
  MealType,
  Nutrition,
  ReactiveRecipe,
  Recipe,
  RecipeTag,
  Season,
} from '../types';
import { Field, FormHeader, MoveButtons, SaveButton, Section, formKit, moveInList } from './formKit';
import {
  GroupDraft,
  IngredientDraft,
  IngredientGroupsEditor,
  emptyGroup,
  groupsFromIngredients,
  ingredientsMissingNutrition,
  nutritionFromGroups,
  scalingFromDraft,
} from './IngredientGroupsEditor';
import { NutritionEditor } from './NutritionEditor';
import { PhotoField } from './PhotoField';
import { slugify } from './slugify';

const SEASONS: Season[] = ['lente-zomer', 'herfst-winter'];
const DIET_OPTIONS: DietaryPreference[] = [
  'glutenvrij', 'halal', 'lactosevrij', 'vegan', 'vegetarisch',
];
// The diet filter doubles as the dish's display tags in the app.
const DIET_TO_TAG: Record<DietaryPreference, RecipeTag> = {
  vegetarisch: 'Vegetarisch',
  vegan: 'Vegan',
  lactosevrij: 'Lactosevrij',
  glutenvrij: 'Glutenvrij',
  halal: 'Halal',
};

function nutritionToStrings(n: Nutrition): Record<string, string> {
  return {
    calories: String(n.calories),
    protein: String(n.protein),
    carbs: String(n.carbs),
    fat: String(n.fat),
    fiber: String(n.fiber),
  };
}

interface DishFormProps {
  dishId?: string;
  /** Which collection this dish belongs to — set by the admin tab it's opened from. */
  usage: DishUsage;
  onSaved: () => void;
  onCancel: () => void;
}

export function DishForm({ dishId, usage, onSaved, onCancel }: DishFormProps) {
  const isEdit = Boolean(dishId);
  // Weekmenu dishes get their nutrition computed from the ingredients and
  // scaled to the user's targets, so they never take hand-typed macros.
  const isWeekmenu = usage === 'weekmenu';

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [idValue, setIdValue] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  // The id the dish was loaded under, so a rename can clean up the old row.
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState('');
  // The dish category (one of the app's categories). Meal categories map back
  // to a mealType on save; the rest are stored as overigCategory.
  const [category, setCategory] = useState<string>('Lunch');
  const [seasons, setSeasons] = useState<Season[]>(['lente-zomer']);
  const [totalTime, setTotalTime] = useState('10');
  const [suitableFor, setSuitableFor] = useState<DietaryPreference[]>([]);
  const [groups, setGroups] = useState<GroupDraft[]>([emptyGroup()]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [macros, setMacros] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  // Preserved across edits so diet swaps aren't silently dropped.
  const [dietSwaps, setDietSwaps] = useState<DietSwap[] | undefined>(undefined);

  useEffect(() => {
    if (!dishId) return;
    (async () => {
      try {
        const row = await getDishRow(dishId);
        if (!row) {
          setError('Gerecht niet gevonden.');
        } else if (row.kind === 'reactive') {
          // Older reactive dishes: load the "gemiddeld" variant as the base.
          // Saving turns it into a plain (static) dish.
          const rr = row.data as ReactiveRecipe;
          const base = rr.energy.gemiddeld;
          setTitle(rr.title);
          setIdValue(rr.id);
          setIdTouched(true);
          setOriginalId(rr.id);
          setSubtitle(rr.subtitle ?? '');
          setCategory(dishCategory(rr));
          setSeasons(rr.seasons);
          setTotalTime(String(rr.prepTime + rr.cookTime));
          setSuitableFor(rr.suitableFor ?? []);
          setDietSwaps(rr.dietSwaps);
          const img = rr.image as { uri?: string } | number | undefined;
          setImageUrl(typeof img === 'object' && img?.uri ? img.uri : '');
          setGroups(groupsFromIngredients(base.ingredients));
          setSteps(rr.instructions.length ? rr.instructions : ['']);
          setMacros(nutritionToStrings(base.nutrition));
        } else {
          const r = row.data as Recipe;
          setTitle(r.title);
          setIdValue(r.id);
          setIdTouched(true);
          setOriginalId(r.id);
          setSubtitle(r.subtitle ?? '');
          setCategory(dishCategory(r));
          setSeasons(r.seasons);
          setTotalTime(String(r.prepTime + r.cookTime));
          setSuitableFor(r.suitableFor ?? []);
          setDietSwaps(r.dietSwaps);
          setGroups(groupsFromIngredients(r.ingredients));
          setSteps(r.instructions.length ? r.instructions : ['']);
          const img = r.image as { uri?: string } | number | undefined;
          setImageUrl(typeof img === 'object' && img?.uri ? img.uri : '');
          setMacros(nutritionToStrings(r.nutrition));
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [dishId]);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const effectiveId = idTouched ? idValue : slugify(title);

  const baseMacro = (key: string) => {
    const v = Number((macros[key] ?? '').replace(',', '.'));
    return Number.isNaN(v) ? 0 : v;
  };

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Geef het gerecht een naam.');
    if (!effectiveId) return setError('De id mag niet leeg zijn.');

    // When editing, whether the id was changed to a new value.
    const renaming = isEdit && originalId != null && effectiveId !== originalId;

    setSaving(true);
    try {
      // Guard against silently overwriting a different dish that already uses
      // the target id (on create, or when renaming to a new id).
      if (!isEdit || renaming) {
        const existing = await getDishRow(effectiveId);
        if (existing) {
          setSaving(false);
          return setError(
            'Er bestaat al een gerecht met deze id. Kies een andere naam of pas de id aan.',
          );
        }
      }

      const mapItems = (drafts: IngredientDraft[]): Ingredient[] =>
        drafts
          .filter((i) => i.name.trim())
          .map((i) => {
            const n = Number(i.quantity.replace(',', '.'));
            const scalable = i.quantity.trim() !== '' && !Number.isNaN(n);
            const scaling = scalingFromDraft(i);
            return {
              name: i.name.trim(),
              quantity: scalable ? n : i.quantity.trim() || 'naar smaak',
              unit: i.unit.trim(),
              scalable,
              ...(scaling ? { scaling } : {}),
            };
          });

      // Each group keeps its own heading; empty groups are dropped and a blank
      // heading falls back to "Basis".
      const baseGroups: IngredientGroup[] = groups
        .map((g) => ({
          category: (g.category.trim() || 'Basis') as IngredientCategory,
          items: mapItems(g.items),
        }))
        .filter((g) => g.items.length > 0);

      // Weekmenu dishes: computed from the ingredients. Recipes: as typed.
      const baseNutrition: Nutrition = isWeekmenu
        ? nutritionFromGroups(groups)
        : {
            calories: baseMacro('calories'),
            protein: baseMacro('protein'),
            carbs: baseMacro('carbs'),
            fat: baseMacro('fat'),
            fiber: baseMacro('fiber'),
            micronutrients: {},
            isIndicative: true,
          };

      const instructions = steps.map((s) => s.trim()).filter(Boolean);
      const tags = suitableFor.map((d) => DIET_TO_TAG[d]);
      // A meal category maps back to a mealType; the other categories are
      // stored as overigCategory (mealType then gets a neutral default).
      const mappedMealType = CATEGORY_TO_MEALTYPE[category];
      const mealType: MealType = mappedMealType ?? 'diner';
      const overigCat = mappedMealType ? undefined : category;

      const recipe: Recipe = {
        id: effectiveId,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        image: imageUrl.trim() ? { uri: imageUrl.trim() } : undefined,
        mealType,
        seasons: seasons.length ? seasons : ['lente-zomer'],
        baseServings: 1,
        prepTime: Number(totalTime) || 0,
        cookTime: 0,
        tags,
        ingredients: baseGroups,
        instructions,
        nutrition: baseNutrition,
        suitableFor: suitableFor.length ? suitableFor : undefined,
        dietSwaps,
        overigCategory: overigCat,
        usage,
      };
      await saveDish(recipe, 'static');
      // A renamed dish is written under the new id; remove the stale old row.
      if (renaming && originalId) await deleteDish(originalId);
      await reloadContent();
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  if (loading) {
    return <Text style={formKit.hint}>Laden…</Text>;
  }

  return (
    <View style={styles.wrap}>
      <FormHeader
        title={
          isWeekmenu
            ? isEdit
              ? 'Weekmenu-gerecht bewerken'
              : 'Nieuw weekmenu-gerecht'
            : isEdit
              ? 'Gerecht bewerken'
              : 'Nieuw gerecht'
        }
        onCancel={onCancel}
      />

      {error ? <Text style={formKit.error}>{error}</Text> : null}

      <Section title="Basis">
        <Field label="Naam">
          <TextInput value={title} onChangeText={setTitle} style={formKit.input} placeholder="Bijv. Griekse salade" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Id (uniek)">
          <TextInput value={effectiveId} onChangeText={(t) => { setIdTouched(true); setIdValue(t); }} style={formKit.input} autoCapitalize="none" autoCorrect={false} />
          {isEdit ? (
            <Text style={formKit.hint}>Pas je de id aan, dan wordt de oude id vervangen.</Text>
          ) : null}
        </Field>
        <Field label="Ondertitel">
          <TextInput value={subtitle} onChangeText={setSubtitle} style={formKit.input} placeholder="Korte tagline" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Categorie">
          <View style={styles.categoryGroups}>
            <View style={formKit.chipRow}>
              {MEAL_CATEGORIES.map((c) => (
                <FilterChip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
            {isWeekmenu ? (
              <Text style={formKit.hint}>
                Het weekmenu vult per dag een ontbijt, lunch, tussendoortje en diner.
              </Text>
            ) : (
              <>
                <Text style={formKit.hint}>Overig</Text>
                <View style={formKit.chipRow}>
                  {OTHER_CATEGORIES.map((c) => (
                    <FilterChip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
                  ))}
                </View>
              </>
            )}
          </View>
        </Field>
        <Field label="Seizoen">
          <View style={formKit.chipRow}>
            {SEASONS.map((s) => (
              <FilterChip key={s} label={s} active={seasons.includes(s)} onPress={() => setSeasons(toggle(seasons, s))} />
            ))}
          </View>
        </Field>
        <Field label="Bereidingstijd (min)">
          <TextInput value={totalTime} onChangeText={setTotalTime} keyboardType="numeric" style={formKit.input} />
        </Field>
      </Section>

      <Section title="Foto">
        <PhotoField
          imageUrl={imageUrl}
          onChange={setImageUrl}
          fileBaseName={effectiveId || slugify(title) || 'dish'}
          onError={(m) => setError(m || null)}
        />
      </Section>

      <Section title="Tags">
        <View style={formKit.chipRow}>
          {DIET_OPTIONS.map((d) => (
            <FilterChip key={d} label={d} active={suitableFor.includes(d)} onPress={() => setSuitableFor(toggle(suitableFor, d))} />
          ))}
        </View>
      </Section>

      <Section title="Ingrediënten">
        <IngredientGroupsEditor groups={groups} setGroups={setGroups} nutritionRequired={isWeekmenu} />
      </Section>

      <Section title="Bereidingswijze">
        {steps.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <Text style={styles.stepNum}>{idx + 1}</Text>
            <TextInput value={step} onChangeText={(t) => setSteps((p) => p.map((x, i) => (i === idx ? t : x)))} placeholder="Stap…" placeholderTextColor={colors.textMuted} multiline style={[formKit.input, { flex: 1 }]} />
            {steps.length > 1 ? (
              <MoveButtons
                onUp={() => setSteps((p) => moveInList(p, idx, -1))}
                onDown={() => setSteps((p) => moveInList(p, idx, 1))}
                disableUp={idx === 0}
                disableDown={idx === steps.length - 1}
                label="stap"
              />
            ) : null}
            <Pressable onPress={() => setSteps((p) => p.filter((_, i) => i !== idx))} style={formKit.iconButton}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        ))}
        <Pressable onPress={() => setSteps((p) => [...p, ''])} style={formKit.addRow}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={formKit.addRowText}>Stap toevoegen</Text>
        </Pressable>
      </Section>

      <Section title="Voedingswaarden (per portie)">
        {isWeekmenu ? (
          <ComputedNutrition groups={groups} />
        ) : (
          <NutritionEditor macros={macros} setMacros={setMacros} />
        )}
      </Section>

      <SaveButton saving={saving} onPress={save} />
    </View>
  );
}

/**
 * Read-only per-portion nutrition for a weekmenu dish: summed from the
 * ingredients' per-100 g values. In the app this base portion is then scaled to
 * the user's own daily target, so there's nothing to type here.
 */
function ComputedNutrition({ groups }: { groups: GroupDraft[] }) {
  const n = nutritionFromGroups(groups);
  const missing = ingredientsMissingNutrition(groups);

  return (
    <View style={styles.computed}>
      <Text style={formKit.hint}>
        Automatisch berekend uit de ingrediënten. In de app wordt deze
        basisportie verder afgestemd op de instellingen van de gebruiker.
      </Text>
      <View style={styles.computedRow}>
        <ComputedValue label="kcal" value={n.calories} />
        <ComputedValue label="eiwitten (g)" value={n.protein} />
        <ComputedValue label="koolhydraten (g)" value={n.carbs} />
        <ComputedValue label="vetten (g)" value={n.fat} />
      </View>
      {missing.length ? (
        <Text style={formKit.error}>
          Nog geen voedingswaarde voor: {missing.join(', ')}. Vul per ingrediënt
          de hoeveelheid in gram en de voedingswaarde per 100 g in.
        </Text>
      ) : null}
    </View>
  );
}

function ComputedValue({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.computedValue}>
      <Text style={styles.computedNumber}>{value}</Text>
      <Text style={styles.computedLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  computed: { gap: spacing.sm },
  computedRow: { flexDirection: 'row', gap: spacing.sm },
  computedValue: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: spacing.sm,
  },
  computedNumber: { ...typography.subheading, color: colors.textPrimary },
  computedLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  categoryGroups: { gap: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: { ...typography.bodyStrong, color: colors.primary, width: 18 },
});
