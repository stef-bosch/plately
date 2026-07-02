import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FilterChip } from '../components/FilterChip';
import { getMenuRow, saveMenu } from '../data/adminApi';
import { getAllRecipes, reloadContent } from '../data/content';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { Menu, MenuCourse, MenuCourseType, RecipeTag } from '../types';
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
const TAG_OPTIONS: RecipeTag[] = ['Vegetarisch', 'Gezond', 'Restaurantwaardig', 'BBQ'];

interface MenuFormProps {
  menuId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

export function MenuForm({ menuId, onSaved, onCancel }: MenuFormProps) {
  const isEdit = Boolean(menuId);
  const allDishes = useMemo(
    () => getAllRecipes().map((r) => ({ id: r.id, title: r.title })),
    [],
  );

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await saveMenu(menu);
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
        <Text style={styles.formTitle}>{isEdit ? 'Menu bewerken' : 'Nieuw menu'}</Text>
        <Pressable onPress={onCancel} style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}>
          <Text style={styles.ghostText}>Annuleren</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.section}>
        <Field label="Naam">
          <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Bijv. Italiaans diner" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Id (uniek)">
          <TextInput value={effectiveId} onChangeText={(t) => { setIdTouched(true); setIdValue(t); }} editable={!isEdit} style={[styles.input, isEdit && styles.disabledInput]} autoCapitalize="none" />
        </Field>
        <Field label="Ondertitel">
          <TextInput value={subtitle} onChangeText={setSubtitle} style={styles.input} placeholder="Korte tagline" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Omschrijving">
          <TextInput value={description} onChangeText={setDescription} multiline style={[styles.input, { minHeight: 60 }]} placeholder="Intro-tekst" placeholderTextColor={colors.textMuted} />
        </Field>
        <Field label="Aantal personen (basis)">
          <TextInput value={baseServings} onChangeText={setBaseServings} keyboardType="numeric" style={[styles.input, { width: 90 }]} />
        </Field>
        <Field label="Tags">
          <View style={styles.chipRow}>
            {TAG_OPTIONS.map((t) => (
              <FilterChip key={t} label={t} active={tags.includes(t)} onPress={() => setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]))} />
            ))}
          </View>
        </Field>
      </View>

      {courses.map((course, idx) => (
        <View key={idx} style={styles.section}>
          <View style={styles.courseHeader}>
            <Text style={styles.sectionTitle}>Gang {idx + 1}</Text>
            <Pressable onPress={() => setCourses((p) => p.filter((_, i) => i !== idx))} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={18} color={colors.fat} />
            </Pressable>
          </View>
          <Field label="Type">
            <View style={styles.chipRow}>
              {COURSE_TYPES.map((t) => (
                <FilterChip key={t} label={COURSE_LABEL[t]} active={course.type === t} onPress={() => updateCourse(idx, { type: t })} />
              ))}
            </View>
          </Field>
          <Field label="Titel van de gang">
            <TextInput value={course.title} onChangeText={(t) => updateCourse(idx, { title: t })} style={styles.input} placeholder={COURSE_LABEL[course.type]} placeholderTextColor={colors.textMuted} />
          </Field>
          <Field label={`Gerechten (${course.recipeIds.length} gekozen)`}>
            <View style={styles.dishPicker}>
              {allDishes.map((d) => (
                <Pressable key={d.id} onPress={() => toggleDishInCourse(idx, d.id)} style={styles.dishPick}>
                  <Ionicons
                    name={course.recipeIds.includes(d.id) ? 'checkbox' : 'square-outline'}
                    size={18}
                    color={course.recipeIds.includes(d.id) ? colors.primary : colors.textMuted}
                  />
                  <Text style={styles.dishPickText} numberOfLines={1}>{d.title}</Text>
                </Pressable>
              ))}
            </View>
          </Field>
        </View>
      ))}

      <Pressable
        onPress={() => setCourses((p) => [...p, { type: 'hoofdgerecht', title: '', recipeIds: [] }])}
        style={styles.addRow}
      >
        <Ionicons name="add" size={18} color={colors.primary} />
        <Text style={styles.addRowText}>Gang toevoegen</Text>
      </Pressable>

      <Pressable onPress={save} disabled={saving} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed, saving && styles.disabled]}>
        {saving ? <ActivityIndicator size="small" color={colors.textOnPrimary} /> : <Text style={styles.saveButtonText}>Opslaan</Text>}
      </Pressable>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
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
  sectionTitle: { ...typography.heading, color: colors.textPrimary },
  courseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  dishPicker: { gap: spacing.xs, maxHeight: 220, overflow: 'scroll' },
  dishPick: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 2 },
  dishPickText: { ...typography.body, color: colors.textPrimary, flex: 1 },
  iconButton: { padding: spacing.xs },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs },
  addRowText: { ...typography.label, color: colors.primary },
  error: { ...typography.bodyStrong, color: colors.fat },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonText: { ...typography.bodyStrong, color: colors.textOnPrimary },
  ghost: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  ghostText: { ...typography.label, color: colors.textSecondary },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
