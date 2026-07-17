import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { dishCategory } from '../constants/labels';
import { getMenuRow, saveMenu } from '../data/adminApi';
import { getRecipeLibrary, reloadContent } from '../data/content';
import { colors, spacing, typography } from '../theme';
import type { Menu, MenuCourse, MenuCourseType, RecipeTag } from '../types';
import { Field, FormHeader, SaveButton, formKit } from './formKit';
import { slugify } from './slugify';

const COURSE_TYPES: MenuCourseType[] = [
  'welkom', 'voorgerecht', 'hoofdgerecht', 'bijgerecht', 'nagerecht',
];
const COURSE_LABEL: Record<MenuCourseType, string> = {
  welkom: 'Welkom / aperitief',
  voorgerecht: 'Voorgerecht',
  hoofdgerecht: 'Hoofdgerecht',
  bijgerecht: 'Bijgerecht',
  nagerecht: 'Nagerecht',
};
const TAG_OPTIONS: RecipeTag[] = ['BBQ', 'Gezond', 'Restaurantwaardig', 'Vegetarisch'];

interface DishOption {
  id: string;
  title: string;
  category: string;
}

const dishOptions = (): DishOption[] =>
  getRecipeLibrary().map((r) => ({ id: r.id, title: r.title, category: dishCategory(r) }));

interface MenuFormProps {
  menuId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function MenuForm({ menuId, onSaved, onCancel }: MenuFormProps) {
  const isEdit = Boolean(menuId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The dishes a course can reference. Loaded defensively so an admin that
  // opens this before the content store is ready still gets a full list.
  const [allDishes, setAllDishes] = useState<DishOption[]>(dishOptions);
  const [dishSearch, setDishSearch] = useState('');

  const [title, setTitle] = useState('');
  const [idValue, setIdValue] = useState('');
  const [idTouched, setIdTouched] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [baseServings, setBaseServings] = useState('4');
  const [tags, setTags] = useState<RecipeTag[]>([]);
  const [courses, setCourses] = useState<MenuCourse[]>([
    { type: 'hoofdgerecht', title: 'Hoofdgerecht', recipeIds: [] },
  ]);

  useEffect(() => {
    (async () => {
      if (getRecipeLibrary().length === 0) await reloadContent();
      setAllDishes(dishOptions());
    })();
  }, []);

  useEffect(() => {
    if (!menuId) return;
    (async () => {
      try {
        const row = await getMenuRow(menuId);
        if (!row) {
          setError('Menu niet gevonden.');
        } else {
          const m = row.data as Menu;
          setTitle(m.title);
          setIdValue(m.id);
          setIdTouched(true);
          setSubtitle(m.subtitle ?? '');
          setDescription(m.description ?? '');
          setBaseServings(String(m.baseServings));
          setTags(m.tags);
          setCourses(m.courses);
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [menuId]);

  const effectiveId = idTouched ? idValue : slugify(title);

  const updateCourse = (idx: number, patch: Partial<MenuCourse>) =>
    setCourses((p) => p.map((c, i) => (i === idx ? { ...c, ...patch } : c)));

  const toggleDishInCourse = (idx: number, dishId: string) =>
    setCourses((p) =>
      p.map((c, i) =>
        i === idx
          ? {
              ...c,
              recipeIds: c.recipeIds.includes(dishId)
                ? c.recipeIds.filter((d) => d !== dishId)
                : [...c.recipeIds, dishId],
            }
          : c,
      ),
    );

  // Dishes referenced by a course that no longer exist (deleted/renamed).
  const knownIds = new Set(allDishes.map((d) => d.id));
  const missingIds =
    allDishes.length > 0
      ? [...new Set(courses.flatMap((c) => c.recipeIds).filter((id) => !knownIds.has(id)))]
      : [];

  const visibleDishes = (() => {
    const q = dishSearch.trim().toLowerCase();
    if (!q) return allDishes;
    return allDishes.filter((d) => d.title.toLowerCase().includes(q));
  })();

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError('Geef het menu een naam.');
    if (!effectiveId) return setError('De id mag niet leeg zijn.');

    const menu: Menu = {
      id: effectiveId,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      baseServings: Number(baseServings) || 1,
      tags,
      courses: courses
        .map((c) => ({ ...c, title: c.title.trim() || COURSE_LABEL[c.type] }))
        .filter((c) => c.recipeIds.length > 0),
    };

    if (menu.courses.length === 0) {
      return setError('Voeg minstens één gang met een gerecht toe.');
    }

    setSaving(true);
    try {
      // Guard against silently overwriting an existing menu with the same id.
      if (!isEdit) {
        const existing = await getMenuRow(effectiveId);
        if (existing) {
          setSaving(false);
          return setError(
            'Er bestaat al een menu met deze id. Kies een andere naam of pas de id aan.',
          );
        }
      }
      await saveMenu(menu);
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
      <FormHeader title={isEdit ? 'Menu bewerken' : 'Nieuw menu'} onCancel={onCancel} />

      {error ? <Text style={formKit.error}>{error}</Text> : null}
      {missingIds.length > 0 ? (
        <Text style={styles.warning}>
          Let op: {missingIds.length} gekozen gerecht(en) bestaan niet meer
          ({missingIds.join(', ')}). Kies een ander gerecht of sla opnieuw op.
        </Text>
      ) : null}

      <View style={formKit.section}>
        <Field label="Naam">
          <TextInput value={title} onChangeText={setTitle} style={formKit.input} placeholder="Bijv. Italiaans diner" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Id (uniek)">
          <TextInput value={effectiveId} onChangeText={(t) => { setIdTouched(true); setIdValue(t); }} editable={!isEdit} style={[formKit.input, isEdit && formKit.disabledInput]} autoCapitalize="none" />
        </Field>
        <Field label="Ondertitel">
          <TextInput value={subtitle} onChangeText={setSubtitle} style={formKit.input} placeholder="Korte tagline" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Omschrijving">
          <TextInput value={description} onChangeText={setDescription} multiline style={[formKit.input, { minHeight: 60 }]} placeholder="Intro-tekst" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Aantal personen (basis)">
          <TextInput value={baseServings} onChangeText={setBaseServings} keyboardType="numeric" style={[formKit.input, { width: 90 }]} />
        </Field>
        <Field label="Tags">
          <View style={formKit.chipRow}>
            {TAG_OPTIONS.map((t) => (
              <FilterChip key={t} label={t} active={tags.includes(t)} onPress={() => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))} />
            ))}
          </View>
        </Field>
        <Field label="Gerechten zoeken (in de keuzes hieronder)">
          <TextInput value={dishSearch} onChangeText={setDishSearch} style={formKit.input} placeholder="Typ om te filteren…" placeholderTextColor={colors.textMuted} />
        </Field>
      </View>

      {courses.map((course, idx) => (
        <View key={idx} style={formKit.section}>
          <View style={styles.courseHeader}>
            <Text style={formKit.sectionTitle}>Gang {idx + 1}</Text>
            <Pressable onPress={() => setCourses((p) => p.filter((_, i) => i !== idx))} style={formKit.iconButton}>
              <Ionicons name="trash-outline" size={18} color={colors.fat} />
            </Pressable>
          </View>
          <Field label="Type">
            <View style={formKit.chipRow}>
              {COURSE_TYPES.map((t) => (
                <FilterChip key={t} label={COURSE_LABEL[t]} active={course.type === t} onPress={() => updateCourse(idx, { type: t })} />
              ))}
            </View>
          </Field>
          <Field label="Titel van de gang">
            <TextInput value={course.title} onChangeText={(t) => updateCourse(idx, { title: t })} style={formKit.input} placeholder={COURSE_LABEL[course.type]} placeholderTextColor={colors.textMuted} />
          </Field>
          <Field label={`Gerechten (${course.recipeIds.length} gekozen)`}>
            <View style={styles.dishPicker}>
              {visibleDishes.length === 0 ? (
                <Text style={formKit.hint}>Geen gerechten gevonden.</Text>
              ) : (
                visibleDishes.map((d) => {
                  const checked = course.recipeIds.includes(d.id);
                  return (
                    <Pressable key={d.id} onPress={() => toggleDishInCourse(idx, d.id)} style={styles.dishPick}>
                      <Ionicons
                        name={checked ? 'checkbox' : 'square-outline'}
                        size={18}
                        color={checked ? colors.primary : colors.textMuted}
                      />
                      <Text style={styles.dishPickText} numberOfLines={1}>{d.title}</Text>
                      <Text style={styles.dishPickCat}>{d.category}</Text>
                    </Pressable>
                  );
                })
              )}
            </View>
          </Field>
        </View>
      ))}

      <Pressable
        onPress={() => setCourses((p) => [...p, { type: 'hoofdgerecht', title: '', recipeIds: [] }])}
        style={formKit.addRow}
      >
        <Ionicons name="add" size={18} color={colors.primary} />
        <Text style={formKit.addRowText}>Gang toevoegen</Text>
      </Pressable>

      <SaveButton saving={saving} onPress={save} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  warning: { ...typography.caption, color: colors.fat },
  courseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dishPicker: { gap: spacing.xs, maxHeight: 240, overflow: 'scroll' },
  dishPick: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2 },
  dishPickText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  dishPickCat: { ...typography.caption, color: colors.textMuted },
});
