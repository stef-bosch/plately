import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import {
  CATEGORY_TO_MEALTYPE,
  DISH_CATEGORIES,
  dishCategory,
  mealTypeLabel,
} from '../constants/labels';
import { deleteDish, getDishRow, saveDish } from '../data/adminApi';
import { reloadContent } from '../data/content';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type {
  DietSwap,
  DietaryPreference,
  DishStatus,
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
import { Field, FormHeader, MoveButtons, Select, formKit, moveInList } from './formKit';
import {
  GroupDraft,
  IngredientDraft,
  IngredientGroupsEditor,
  emptyGroup,
  groupsFromIngredients,
} from './IngredientGroupsEditor';
import { NutritionEditor } from './NutritionEditor';
import { PhotoField } from './PhotoField';
import { slugify } from './slugify';

const SEASONS: Season[] = ['lente-zomer', 'herfst-winter'];
const MEAL_TYPES: MealType[] = ['ontbijt', 'lunch', 'diner', 'tussendoortje'];
const STATUSES: DishStatus[] = ['gepubliceerd', 'concept'];
const STATUS_LABEL: Record<string, string> = {
  gepubliceerd: 'Gepubliceerd',
  concept: 'Concept',
};
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
  onSaved: () => void;
  onCancel: () => void;
}

export function DishForm({ dishId, onSaved, onCancel }: DishFormProps) {
  const isEdit = Boolean(dishId);
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
  const [servings, setServings] = useState('1');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [status, setStatus] = useState<DishStatus>('gepubliceerd');
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
          setError('Recept niet gevonden.');
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
          setServings(String(rr.baseServings || 1));
          setMealType(rr.mealType);
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
          setServings(String(r.baseServings || 1));
          setMealType(r.mealType);
          setStatus(r.status ?? 'gepubliceerd');
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

  // Meal categories imply the meal moment; "Overig" categories pick their own.
  const mappedMeal = CATEGORY_TO_MEALTYPE[category] as MealType | undefined;

  const baseMacro = (key: string) => {
    const v = Number((macros[key] ?? '').replace(',', '.'));
    return Number.isNaN(v) ? 0 : v;
  };

  const save = async (nextStatus: DishStatus) => {
    setError(null);
    if (!title.trim()) return setError('Geef het recept een naam.');
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
            'Er bestaat al een recept met deze id. Kies een andere naam of pas de id aan.',
          );
        }
      }

      const mapItems = (drafts: IngredientDraft[]): Ingredient[] =>
        drafts
          .filter((i) => i.name.trim())
          .map((i) => {
            const n = Number(i.quantity.replace(',', '.'));
            const scalable = i.quantity.trim() !== '' && !Number.isNaN(n);
            return {
              name: i.name.trim(),
              quantity: scalable ? n : i.quantity.trim() || 'naar smaak',
              unit: i.unit.trim(),
              scalable,
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

      const baseNutrition: Nutrition = {
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
      const overigCat = mappedMeal ? undefined : category;

      const recipe: Recipe = {
        id: effectiveId,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        image: imageUrl.trim() ? { uri: imageUrl.trim() } : undefined,
        mealType: mappedMeal ?? mealType,
        seasons: seasons.length ? seasons : ['lente-zomer'],
        baseServings: Math.max(1, Number(servings) || 1),
        prepTime: Number(totalTime) || 0,
        cookTime: 0,
        tags,
        ingredients: baseGroups,
        instructions,
        nutrition: baseNutrition,
        suitableFor: suitableFor.length ? suitableFor : undefined,
        dietSwaps,
        overigCategory: overigCat,
        status: nextStatus,
      };
      setStatus(nextStatus);
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
    <View style={styles.page}>
      <FormHeader
        title={isEdit ? 'Recept bewerken' : 'Recept toevoegen'}
        onCancel={onCancel}
      />
      <Text style={formKit.hint}>
        {isEdit
          ? 'Pas dit recept aan. Na opslaan is het direct bijgewerkt in de app.'
          : 'Voeg een nieuw recept toe aan de bibliotheek.'}
      </Text>

      {error ? <Text style={formKit.error}>{error}</Text> : null}

      <View style={styles.columns}>
        {/* ---------- left: the form ---------- */}
        <View style={styles.formCol}>
          <Card icon="document-text-outline" title="Basisinformatie">
            <View style={styles.grid}>
              <Field label="Naam recept *" style={styles.cellWide}>
                <TextInput value={title} onChangeText={setTitle} style={formKit.input} placeholder="Bijv. Romige kip pesto pasta" placeholderTextColor={colors.textMuted} />
              </Field>
              <Field label="Korte beschrijving" style={styles.cellWide}>
                <TextInput value={subtitle} onChangeText={setSubtitle} multiline style={[formKit.input, styles.textarea]} placeholder="Korte tagline die op de receptkaart staat" placeholderTextColor={colors.textMuted} />
              </Field>
              <Field label="Categorie *" style={styles.cell}>
                <Select value={category} options={DISH_CATEGORIES} onSelect={setCategory} />
              </Field>
              <Field label="Maaltijdmoment *" style={styles.cell}>
                {mappedMeal ? (
                  <Text style={styles.derived}>Volgt de categorie: {mealTypeLabel[mappedMeal]}</Text>
                ) : (
                  <Select value={mealType} options={MEAL_TYPES} labels={mealTypeLabel} onSelect={setMealType} />
                )}
              </Field>
              <Field label="Porties *" style={styles.cell}>
                <TextInput value={servings} onChangeText={setServings} keyboardType="numeric" style={formKit.input} placeholder="1" placeholderTextColor={colors.textMuted} />
              </Field>
              <Field label="Bereidingstijd (min) *" style={styles.cell}>
                <TextInput value={totalTime} onChangeText={setTotalTime} keyboardType="numeric" style={formKit.input} />
              </Field>
              <Field label="Id (uniek)" style={styles.cell}>
                <TextInput value={effectiveId} onChangeText={(t) => { setIdTouched(true); setIdValue(t); }} style={formKit.input} autoCapitalize="none" autoCorrect={false} />
              </Field>
              <Field label="Seizoen" style={styles.cell}>
                <View style={formKit.chipRow}>
                  {SEASONS.map((x) => (
                    <FilterChip key={x} label={x} active={seasons.includes(x)} onPress={() => setSeasons(toggle(seasons, x))} />
                  ))}
                </View>
              </Field>
            </View>
            {isEdit ? (
              <Text style={formKit.hint}>Pas je de id aan, dan wordt de oude id vervangen.</Text>
            ) : null}
          </Card>

          <View style={styles.row2}>
            <Card icon="nutrition-outline" title="Ingrediënten" style={styles.half}>
              <IngredientGroupsEditor groups={groups} setGroups={setGroups} />
            </Card>

            <Card icon="list-outline" title="Bereidingswijze" style={styles.half}>
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
            </Card>
          </View>

          <View style={styles.row2}>
            <Card icon="flame-outline" title="Voedingswaarden (per portie)" style={styles.half}>
              <NutritionEditor macros={macros} setMacros={setMacros} />
            </Card>

            <Card icon="pricetags-outline" title="Tags en dieetfilters" style={styles.half}>
              <View style={formKit.chipRow}>
                {DIET_OPTIONS.map((d) => (
                  <FilterChip key={d} label={d} active={suitableFor.includes(d)} onPress={() => setSuitableFor(toggle(suitableFor, d))} />
                ))}
              </View>
              <Text style={formKit.hint}>
                Deze filters bepalen ook de tags die in de app op de receptkaart staan.
              </Text>
            </Card>
          </View>
        </View>

        {/* ---------- right: photo, publication, live preview ---------- */}
        <View style={styles.sideCol}>
          <Card icon="cloud-upload-outline" title="Afbeelding">
            <PhotoField
              imageUrl={imageUrl}
              onChange={setImageUrl}
              fileBaseName={effectiveId || slugify(title) || 'dish'}
              onError={(m) => setError(m || null)}
            />
          </Card>

          <Card icon="settings-outline" title="Publicatie">
            <Field label="Status">
              <Select value={status} options={STATUSES} labels={STATUS_LABEL} onSelect={setStatus} />
            </Field>
            <Text style={formKit.hint}>
              Een concept blijft in het beheer staan en is nog niet zichtbaar in de app.
            </Text>
          </Card>

          <Card icon="eye-outline" title="Live preview">
            <Preview
              title={title}
              subtitle={subtitle}
              category={category}
              mealType={mappedMeal ?? mealType}
              servings={servings}
              totalTime={totalTime}
              imageUrl={imageUrl}
              diets={suitableFor}
              macros={macros}
            />
          </Card>
        </View>
      </View>

      {/* ---------- action bar ---------- */}
      <View style={styles.actionBar}>
        <Pressable
          onPress={() => save('concept')}
          disabled={saving}
          style={({ pressed }) => [styles.ghostButton, pressed && formKit.pressed, saving && formKit.disabled]}
        >
          <Ionicons name="document-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.ghostButtonText}>Opslaan als concept</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => save('gepubliceerd')}
          disabled={saving}
          style={({ pressed }) => [styles.publishButton, pressed && formKit.pressed, saving && formKit.disabled]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.textOnPrimary} />
          ) : (
            <Ionicons name="paper-plane-outline" size={18} color={colors.textOnPrimary} />
          )}
          <Text style={styles.publishButtonText}>
            {isEdit ? 'Opslaan en publiceren' : 'Recept publiceren'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/** A titled card with an icon, used for every block in the form. */
function Card({
  icon,
  title,
  style,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  style?: object;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHead}>
        <View style={styles.cardIcon}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/** Read-only rendering of how the recipe will read in the app. */
function Preview({
  title,
  subtitle,
  category,
  mealType,
  servings,
  totalTime,
  imageUrl,
  diets,
  macros,
}: {
  title: string;
  subtitle: string;
  category: string;
  mealType: MealType;
  servings: string;
  totalTime: string;
  imageUrl: string;
  diets: DietaryPreference[];
  macros: Record<string, string>;
}) {
  const num = (k: string) => macros[k]?.trim() || '0';
  return (
    <View style={styles.preview}>
      {imageUrl.trim() ? (
        <Image source={{ uri: imageUrl.trim() }} style={styles.previewImage} resizeMode="cover" />
      ) : (
        <View style={[styles.previewImage, styles.previewImageEmpty]}>
          <Ionicons name="image-outline" size={26} color={colors.textMuted} />
        </View>
      )}
      <Text style={styles.previewTitle}>{title.trim() || 'Naam van het recept'}</Text>
      {subtitle.trim() ? <Text style={styles.previewSubtitle}>{subtitle.trim()}</Text> : null}

      <View style={styles.badgeRow}>
        <Text style={styles.badge}>{category}</Text>
        <Text style={styles.badge}>{mealTypeLabel[mealType]}</Text>
        <Text style={styles.badge}>{Math.max(1, Number(servings) || 1)} porties</Text>
      </View>

      <View style={styles.previewStats}>
        <PreviewStat value={`${Number(totalTime) || 0} min`} label="Totale tijd" />
        <PreviewStat value={`${num('calories')} kcal`} label="Per portie" />
      </View>

      {diets.length > 0 ? (
        <View style={styles.badgeRow}>
          {diets.map((d) => (
            <Text key={d} style={[styles.badge, styles.badgeDiet]}>{d}</Text>
          ))}
        </View>
      ) : null}

      <Text style={styles.previewSection}>Voedingswaarden (per portie)</Text>
      <PreviewRow label="Calorieën" value={`${num('calories')} kcal`} />
      <PreviewRow label="Eiwitten" value={`${num('protein')} g`} />
      <PreviewRow label="Koolhydraten" value={`${num('carbs')} g`} />
      <PreviewRow label="Vetten" value={`${num('fat')} g`} />
      <PreviewRow label="Vezels" value={`${num('fiber')} g`} />
    </View>
  );
}

function PreviewStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.previewStat}>
      <Text style={styles.previewStatValue}>{value}</Text>
      <Text style={styles.previewStatLabel}>{label}</Text>
    </View>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.previewRow}>
      <Text style={styles.previewRowLabel}>{label}</Text>
      <Text style={styles.previewRowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.md },
  columns: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-start' },
  formCol: { flexGrow: 1, flexBasis: 620, gap: spacing.lg },
  sideCol: { width: 320, gap: spacing.lg },
  row2: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'flex-start' },
  half: { flexGrow: 1, flexBasis: 280 },

  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg,
    gap: spacing.md, ...shadow.soft,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { ...typography.subheading, color: colors.textPrimary },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  cell: { flexGrow: 1, flexBasis: 180 },
  cellWide: { flexGrow: 1, flexBasis: '100%' },
  textarea: { minHeight: 64, textAlignVertical: 'top' },
  derived: { ...typography.caption, color: colors.textSecondary, paddingVertical: spacing.sm },

  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: { ...typography.bodyStrong, color: colors.primary, width: 18 },

  actionBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap',
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, ...shadow.soft,
  },
  ghostButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
  },
  ghostButtonText: { ...typography.label, color: colors.textSecondary },
  publishButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.xl,
  },
  publishButtonText: { ...typography.bodyStrong, color: colors.textOnPrimary },

  preview: { gap: spacing.sm },
  previewImage: { width: '100%', height: 150, borderRadius: radius.md, backgroundColor: colors.background },
  previewImageEmpty: { alignItems: 'center', justifyContent: 'center' },
  previewTitle: { ...typography.heading, color: colors.textPrimary },
  previewSubtitle: { ...typography.caption, color: colors.textSecondary },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  badge: {
    ...typography.caption, fontSize: 11, color: colors.primary,
    backgroundColor: colors.primarySoft, borderRadius: radius.pill,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  badgeDiet: { color: colors.accent, backgroundColor: colors.accentSoft },
  previewStats: { flexDirection: 'row', gap: spacing.sm },
  previewStat: {
    flex: 1, alignItems: 'center', backgroundColor: colors.background,
    borderRadius: radius.md, paddingVertical: spacing.sm,
  },
  previewStatValue: { ...typography.bodyStrong, color: colors.textPrimary },
  previewStatLabel: { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  previewSection: { ...typography.label, color: colors.textSecondary, marginTop: spacing.xs },
  previewRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  previewRowLabel: { ...typography.caption, color: colors.textSecondary },
  previewRowValue: { ...typography.caption, color: colors.textPrimary },
});
