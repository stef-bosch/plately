import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { getDishRow, saveDish } from '../data/adminApi';
import { reloadContent } from '../data/content';
import { supabase } from '../lib/supabase';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type {
  DietSwap,
  DietaryPreference,
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
import { slugify } from './slugify';

const MEAL_TYPES: MealType[] = ['ontbijt', 'lunch', 'diner', 'tussendoortje'];
const SEASONS: Season[] = ['lente-zomer', 'herfst-winter'];
const DIET_OPTIONS: DietaryPreference[] = [
  'vegetarisch', 'vegan', 'lactosevrij', 'glutenvrij', 'halal',
];
// The diet filter doubles as the dish's display tags in the app.
const DIET_TO_TAG: Record<DietaryPreference, RecipeTag> = {
  vegetarisch: 'Vegetarisch',
  vegan: 'Vegan',
  lactosevrij: 'Lactosevrij',
  glutenvrij: 'Glutenvrij',
  halal: 'Halal',
};
const MACROS = ['calories', 'protein', 'carbs', 'fat', 'fiber'] as const;
const MACRO_LABEL: Record<(typeof MACROS)[number], string> = {
  calories: 'Calorieën', protein: 'Eiwitten', carbs: 'Koolhydraten', fat: 'Vetten', fiber: 'Vezels',
};
const MACRO_UNIT: Record<(typeof MACROS)[number], string> = {
  calories: 'kcal', protein: 'g', carbs: 'g', fat: 'g', fiber: 'g',
};

const DEFAULT_LOW_PCT = '80';
const DEFAULT_HIGH_PCT = '125';

function nutritionToStrings(n: Nutrition): Record<string, string> {
  return {
    calories: String(n.calories),
    protein: String(n.protein),
    carbs: String(n.carbs),
    fat: String(n.fat),
    fiber: String(n.fiber),
  };
}

interface IngredientDraft {
  name: string;
  quantity: string;
  unit: string;
}

interface GroupDraft {
  category: string;
  items: IngredientDraft[];
}

const emptyItem = (): IngredientDraft => ({ name: '', quantity: '', unit: '' });
const emptyGroup = (): GroupDraft => ({ category: '', items: [emptyItem()] });

function groupsFromIngredients(ingredients: IngredientGroup[]): GroupDraft[] {
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
  const [subtitle, setSubtitle] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [seasons, setSeasons] = useState<Season[]>(['lente-zomer']);
  const [totalTime, setTotalTime] = useState('10');
  const [suitableFor, setSuitableFor] = useState<DietaryPreference[]>([]);
  const [groups, setGroups] = useState<GroupDraft[]>([emptyGroup()]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [macros, setMacros] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  // Reactive dishes scale ingredients + nutrition with the user's energy need.
  const [reactive, setReactive] = useState(true);
  const [lowPct, setLowPct] = useState(DEFAULT_LOW_PCT);
  const [highPct, setHighPct] = useState(DEFAULT_HIGH_PCT);
  const [lowOverrides, setLowOverrides] = useState<Record<string, string>>({});
  const [highOverrides, setHighOverrides] = useState<Record<string, string>>({});
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
          // Reactive: base the form on the "gemiddeld" variant and keep the
          // stored laag/hoog values as explicit overrides (lossless editing).
          const rr = row.data as ReactiveRecipe;
          const base = rr.energy.gemiddeld;
          setReactive(true);
          setTitle(rr.title);
          setIdValue(rr.id);
          setIdTouched(true);
          setSubtitle(rr.subtitle ?? '');
          setMealType(rr.mealType);
          setSeasons(rr.seasons);
          setTotalTime(String(rr.prepTime + rr.cookTime));
          setSuitableFor(rr.suitableFor ?? []);
          setDietSwaps(rr.dietSwaps);
          const img = rr.image as { uri?: string } | number | undefined;
          setImageUrl(typeof img === 'object' && img?.uri ? img.uri : '');
          setGroups(groupsFromIngredients(base.ingredients));
          setSteps(rr.instructions.length ? rr.instructions : ['']);
          setMacros(nutritionToStrings(base.nutrition));
          setLowOverrides(nutritionToStrings(rr.energy.laag.nutrition));
          setHighOverrides(nutritionToStrings(rr.energy.hoog.nutrition));
          const baseCal = base.nutrition.calories;
          if (baseCal > 0) {
            setLowPct(String(Math.round((rr.energy.laag.nutrition.calories / baseCal) * 100)));
            setHighPct(String(Math.round((rr.energy.hoog.nutrition.calories / baseCal) * 100)));
          }
        } else {
          const r = row.data as Recipe;
          setReactive(false);
          setTitle(r.title);
          setIdValue(r.id);
          setIdTouched(true);
          setSubtitle(r.subtitle ?? '');
          setMealType(r.mealType);
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

  const pctToFactor = (value: string, fallback: number) => {
    const v = Number((value ?? '').replace(',', '.'));
    return !v || Number.isNaN(v) ? fallback : v / 100;
  };
  const lowFactor = pctToFactor(lowPct, 0.8);
  const highFactor = pctToFactor(highPct, 1.25);
  const baseMacro = (key: string) => {
    const v = Number((macros[key] ?? '').replace(',', '.'));
    return Number.isNaN(v) ? 0 : v;
  };

  // Web-only: pick a file and upload it to the public `dish-images` bucket,
  // then store its public URL as the dish photo.
  const pickAndUpload = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!supabase) {
        setError('Supabase is niet geconfigureerd.');
        return;
      }
      setError(null);
      setUploading(true);
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${effectiveId || slugify(title) || 'dish'}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('dish-images')
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('dish-images').getPublicUrl(path);
        setImageUrl(data.publicUrl);
      } catch (e) {
        setError(
          `Uploaden mislukt: ${(e as Error).message}. Bestaat de publieke bucket "dish-images"?`,
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Geef het gerecht een naam.');
    if (!effectiveId) return setError('De id mag niet leeg zijn.');

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
    // The diet filter selections are also the dish's display tags in the app.
    const tags = suitableFor.map((d) => DIET_TO_TAG[d]);
    const seasonsOut: Season[] = seasons.length ? seasons : ['lente-zomer'];
    const image = imageUrl.trim() ? { uri: imageUrl.trim() } : undefined;

    setSaving(true);
    try {
      if (reactive) {
        // Scale each group's scalable numeric quantities by the level factor,
        // keeping the group headings intact.
        const scaleGroups = (f: number): IngredientGroup[] =>
          baseGroups.map((g) => ({
            category: g.category,
            items: g.items.map((it) =>
              it.scalable && typeof it.quantity === 'number'
                ? { ...it, quantity: Math.round(it.quantity * f * 100) / 100 }
                : it,
            ),
          }));
        // Nutrition for a level: an explicit override wins, else base × factor.
        const levelNutrition = (
          f: number,
          overrides: Record<string, string>,
        ): Nutrition => {
          const pick = (key: string) => {
            const raw = (overrides[key] ?? '').replace(',', '.').trim();
            if (raw !== '') {
              const n = Number(raw);
              if (!Number.isNaN(n)) return n;
            }
            return Math.round(baseMacro(key) * f);
          };
          return {
            calories: pick('calories'),
            protein: pick('protein'),
            carbs: pick('carbs'),
            fat: pick('fat'),
            fiber: pick('fiber'),
            micronutrients: {},
            isIndicative: true,
          };
        };

        const reactiveRecipe: ReactiveRecipe = {
          id: effectiveId,
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          image,
          mealType,
          seasons: seasonsOut,
          baseServings: 1,
          prepTime: Number(totalTime) || 0,
          cookTime: 0,
          tags,
          instructions,
          energy: {
            laag: {
              ingredients: scaleGroups(lowFactor),
              nutrition: levelNutrition(lowFactor, lowOverrides),
            },
            gemiddeld: {
              ingredients: baseGroups,
              nutrition: baseNutrition,
            },
            hoog: {
              ingredients: scaleGroups(highFactor),
              nutrition: levelNutrition(highFactor, highOverrides),
            },
          },
          suitableFor,
          dietSwaps,
        };
        await saveDish(reactiveRecipe, 'reactive');
      } else {
        const recipe: Recipe = {
          id: effectiveId,
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          image,
          mealType,
          seasons: seasonsOut,
          baseServings: 1,
          prepTime: Number(totalTime) || 0,
          cookTime: 0,
          tags,
          ingredients: baseGroups,
          instructions,
          nutrition: baseNutrition,
          suitableFor: suitableFor.length ? suitableFor : undefined,
          dietSwaps,
        };
        await saveDish(recipe, 'static');
      }
      await reloadContent();
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  };

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{isEdit ? 'Gerecht bewerken' : 'Nieuw gerecht'}</Text>
        <Pressable onPress={onCancel} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Text style={styles.ghostText}>Annuleren</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Section title="Basis">
        <Field label="Naam">
          <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Bijv. Griekse salade" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Id (uniek)">
          <TextInput value={effectiveId} onChangeText={(t) => { setIdTouched(true); setIdValue(t); }} editable={!isEdit} style={[styles.input, isEdit && styles.disabledInput]} autoCapitalize="none" />
        </Field>
        <Field label="Ondertitel">
          <TextInput value={subtitle} onChangeText={setSubtitle} style={styles.input} placeholder="Korte tagline" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Soort maaltijd">
          <View style={styles.chipRow}>
            {MEAL_TYPES.map((m) => (
              <FilterChip key={m} label={m} active={mealType === m} onPress={() => setMealType(m)} />
            ))}
          </View>
        </Field>
        <Field label="Seizoen">
          <View style={styles.chipRow}>
            {SEASONS.map((s) => (
              <FilterChip key={s} label={s} active={seasons.includes(s)} onPress={() => setSeasons(toggle(seasons, s))} />
            ))}
          </View>
        </Field>
        <Field label="Bereidingstijd (min)">
          <TextInput value={totalTime} onChangeText={setTotalTime} keyboardType="numeric" style={styles.input} />
        </Field>
      </Section>

      <Section title="Energiebehoefte">
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Past aan op energiebehoefte</Text>
            <Text style={styles.hint}>
              Aan: hoeveelheden én voedingswaarden schalen mee met de instelling
              (laag/gemiddeld/hoog) van de gebruiker. Uit: het gerecht is voor
              iedereen gelijk (bijv. sauzen, cocktails).
            </Text>
          </View>
          <Switch
            value={reactive}
            onValueChange={setReactive}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
            // `activeThumbColor` is a react-native-web prop: without it the web
            // Switch falls back to a teal thumb when on. Keep the knob white so
            // the control reads as fully orange, like the frontend settings.
            {...({ activeThumbColor: colors.surface } as object)}
          />
        </View>
        {reactive ? (
          <View style={styles.twoCol}>
            <Field label="Laag (% van gemiddeld)" style={{ flex: 1 }}>
              <TextInput value={lowPct} onChangeText={setLowPct} keyboardType="numeric" placeholder={DEFAULT_LOW_PCT} placeholderTextColor={colors.textMuted} style={styles.input} />
            </Field>
            <Field label="Hoog (% van gemiddeld)" style={{ flex: 1 }}>
              <TextInput value={highPct} onChangeText={setHighPct} keyboardType="numeric" placeholder={DEFAULT_HIGH_PCT} placeholderTextColor={colors.textMuted} style={styles.input} />
            </Field>
          </View>
        ) : null}
      </Section>

      <Section title="Foto">
        <Text style={styles.hint}>
          Deze foto verschijnt in de app bij het gerecht. Upload een afbeelding
          of plak een afbeeldings-URL. Laat leeg voor de standaard placeholder.
        </Text>
        {imageUrl.trim() ? (
          <Image source={{ uri: imageUrl.trim() }} style={styles.preview} resizeMode="cover" />
        ) : null}
        <Field label="Afbeelding-URL">
          <TextInput
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
            autoCapitalize="none"
            placeholder="https://…"
            placeholderTextColor={colors.textMuted}
          />
        </Field>
        {Platform.OS === 'web' ? (
          <View style={styles.photoActions}>
            <Pressable
              onPress={pickAndUpload}
              disabled={uploading}
              style={({ pressed }) => [styles.ghost, pressed && styles.pressed, uploading && styles.disabled]}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={styles.ghostText}>Foto uploaden…</Text>
              )}
            </Pressable>
            {imageUrl.trim() ? (
              <Pressable
                onPress={() => setImageUrl('')}
                style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
              >
                <Text style={styles.ghostText}>Verwijderen</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Section>

      <Section title="Tags">
        <View style={styles.chipRow}>
          {DIET_OPTIONS.map((d) => (
            <FilterChip key={d} label={d} active={suitableFor.includes(d)} onPress={() => setSuitableFor(toggle(suitableFor, d))} />
          ))}
        </View>
      </Section>

      <Section title="Ingrediënten">
        <Text style={styles.hint}>
          Groepeer ingrediënten onder een kop (bijv. "Basis", "Topping"). De kop
          verschijnt in de app boven de betreffende ingrediënten.
          {reactive
            ? ` Schaalbare hoeveelheden passen automatisch mee (laag ${Math.round(lowFactor * 100)}% / hoog ${Math.round(highFactor * 100)}%); "naar smaak" blijft gelijk.`
            : ''}
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
                style={[styles.input, styles.groupTitleInput, { flex: 1 }]}
              />
              {groups.length > 1 ? (
                <Pressable
                  onPress={() => setGroups((p) => p.filter((_, i) => i !== gi))}
                  style={styles.iconButton}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
            {group.items.map((ing, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <TextInput value={ing.quantity} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, quantity: t } : x)) } : g)))} placeholder="100" placeholderTextColor={colors.textMuted} style={[styles.input, styles.qtyInput]} />
                <TextInput value={ing.unit} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, unit: t } : x)) } : g)))} placeholder="g" placeholderTextColor={colors.textMuted} style={[styles.input, styles.unitInput]} />
                <TextInput value={ing.name} onChangeText={(t) => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.map((x, j) => (j === idx ? { ...x, name: t } : x)) } : g)))} placeholder="ingrediënt" placeholderTextColor={colors.textMuted} style={[styles.input, { flex: 1 }]} />
                <Pressable onPress={() => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: g.items.filter((_, j) => j !== idx) } : g)))} style={styles.iconButton}>
                  <Ionicons name="close" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            ))}
            <Pressable onPress={() => setGroups((p) => p.map((g, i) => (i === gi ? { ...g, items: [...g.items, emptyItem()] } : g)))} style={styles.addRow}>
              <Ionicons name="add" size={18} color={colors.primary} />
              <Text style={styles.addRowText}>Ingrediënt toevoegen</Text>
            </Pressable>
          </View>
        ))}
        <Pressable onPress={() => setGroups((p) => [...p, emptyGroup()])} style={styles.addRow}>
          <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.addRowText}>Kop toevoegen</Text>
        </Pressable>
      </Section>

      <Section title="Bereidingswijze">
        {steps.map((step, idx) => (
          <View key={idx} style={styles.stepRow}>
            <Text style={styles.stepNum}>{idx + 1}</Text>
            <TextInput value={step} onChangeText={(t) => setSteps((p) => p.map((x, i) => (i === idx ? t : x)))} placeholder="Stap…" placeholderTextColor={colors.textMuted} multiline style={[styles.input, { flex: 1 }]} />
            <Pressable onPress={() => setSteps((p) => p.filter((_, i) => i !== idx))} style={styles.iconButton}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        ))}
        <Pressable onPress={() => setSteps((p) => [...p, ''])} style={styles.addRow}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={styles.addRowText}>Stap toevoegen</Text>
        </Pressable>
      </Section>

      <Section title={reactive ? 'Voedingswaarden (gemiddeld, per portie)' : 'Voedingswaarden (per portie)'}>
        <View style={styles.macroGrid}>
          {MACROS.map((m) => (
            <Field key={m} label={`${MACRO_LABEL[m]} (${MACRO_UNIT[m]})`} style={styles.macroField}>
              <TextInput value={macros[m] ?? ''} onChangeText={(t) => setMacros((p) => ({ ...p, [m]: t }))} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} style={styles.input} />
            </Field>
          ))}
        </View>
        {reactive ? (
          <View style={styles.overrideBlock}>
            <Text style={styles.hint}>
              Laag/hoog worden automatisch berekend uit gemiddeld. Vul een veld
              alleen in om te overschrijven (bijv. voor ronde getallen); laat leeg
              voor automatisch.
            </Text>
            <View style={styles.overrideRow}>
              <Text style={[styles.label, styles.overrideLabel]} />
              <Text style={[styles.label, styles.overrideInput]}>Laag</Text>
              <Text style={[styles.label, styles.overrideInput]}>Hoog</Text>
            </View>
            {MACROS.map((m) => {
              const b = baseMacro(m);
              return (
                <View key={m} style={styles.overrideRow}>
                  <Text style={[styles.label, styles.overrideLabel]}>{`${MACRO_LABEL[m]} (${MACRO_UNIT[m]})`}</Text>
                  <TextInput
                    value={lowOverrides[m] ?? ''}
                    onChangeText={(t) => setLowOverrides((p) => ({ ...p, [m]: t }))}
                    keyboardType="numeric"
                    placeholder={String(Math.round(b * lowFactor))}
                    placeholderTextColor={colors.textMuted}
                    style={[styles.input, styles.overrideInput]}
                  />
                  <TextInput
                    value={highOverrides[m] ?? ''}
                    onChangeText={(t) => setHighOverrides((p) => ({ ...p, [m]: t }))}
                    keyboardType="numeric"
                    placeholder={String(Math.round(b * highFactor))}
                    placeholderTextColor={colors.textMuted}
                    style={[styles.input, styles.overrideInput]}
                  />
                </View>
              );
            })}
          </View>
        ) : null}
      </Section>

      <Pressable onPress={save} disabled={saving} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, saving && styles.disabled]}>
        {saving ? <ActivityIndicator size="small" color={colors.textOnPrimary} /> : <Text style={styles.saveButtonText}>Opslaan</Text>}
      </Pressable>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, style, children }: { label: string; style?: object; children: React.ReactNode }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  formHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  formTitle: { ...typography.heading, color: colors.textPrimary },
  section: { gap: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, ...shadow.soft },
  sectionTitle: { ...typography.heading, color: colors.textPrimary, marginBottom: spacing.xs },
  hint: { ...typography.caption, color: colors.textMuted },
  preview: { width: '100%', height: 180, borderRadius: radius.md, backgroundColor: colors.background },
  photoActions: { flexDirection: 'row', gap: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  overrideBlock: { gap: spacing.xs, marginTop: spacing.sm },
  overrideRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  overrideLabel: { width: 128 },
  overrideInput: { flex: 1 },
  field: { gap: 4 },
  label: { ...typography.label, color: colors.textSecondary },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  disabledInput: { opacity: 0.6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  twoCol: { flexDirection: 'row', gap: spacing.md },
  groupBlock: { gap: spacing.xs, paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.border, marginBottom: spacing.sm },
  groupHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  groupTitleInput: { ...typography.bodyStrong },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qtyInput: { width: 64 },
  unitInput: { width: 64 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepNum: { ...typography.bodyStrong, color: colors.primary, width: 18 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs },
  addRowText: { ...typography.label, color: colors.primary },
  macroGrid: { gap: spacing.md },
  macroField: { width: '100%' },
  iconButton: { padding: spacing.xs },
  error: { ...typography.bodyStrong, color: colors.fat },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonText: { ...typography.bodyStrong, color: colors.textOnPrimary },
  ghost: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  ghostText: { ...typography.label, color: colors.textSecondary },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
