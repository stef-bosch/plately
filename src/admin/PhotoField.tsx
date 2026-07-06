import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { supabase } from '../lib/supabase';
import { colors, radius, spacing } from '../theme';
import { Field, formKit } from './formKit';

const BUCKET = 'dish-images';

/** Extract the in-bucket path from a public storage URL, or null if it isn't one. */
function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : url.slice(i + marker.length);
}

/** Best-effort delete of a previously-uploaded image so it doesn't orphan. */
async function removeStored(url: string): Promise<void> {
  const path = storagePathFromUrl(url);
  if (!path || !supabase) return;
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // Non-fatal — a leftover file is better than blocking the save.
  }
}

interface PhotoFieldProps {
  imageUrl: string;
  onChange: (url: string) => void;
  /** Base for the uploaded filename (usually the dish id). */
  fileBaseName: string;
  onError: (message: string) => void;
}

export function PhotoField({ imageUrl, onChange, fileBaseName, onError }: PhotoFieldProps) {
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!supabase) {
        onError('Supabase is niet geconfigureerd.');
        return;
      }
      onError('');
      setUploading(true);
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `${fileBaseName || 'dish'}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        // Clean up the previous upload it replaces.
        if (imageUrl.trim()) await removeStored(imageUrl.trim());
        onChange(data.publicUrl);
      } catch (e) {
        onError(
          `Uploaden mislukt: ${(e as Error).message}. Bestaat de publieke bucket "${BUCKET}"?`,
        );
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  const remove = async () => {
    const current = imageUrl.trim();
    onChange('');
    if (current) await removeStored(current);
  };

  const trimmed = imageUrl.trim();

  return (
    <>
      <Text style={formKit.hint}>
        Deze foto verschijnt in de app bij het gerecht. Upload een afbeelding of
        plak een afbeeldings-URL. Laat leeg voor de standaard placeholder.
      </Text>
      {trimmed ? (
        <Image source={{ uri: trimmed }} style={styles.preview} resizeMode="cover" />
      ) : null}
      <Field label="Afbeelding-URL">
        <TextInput
          value={imageUrl}
          onChangeText={onChange}
          style={formKit.input}
          autoCapitalize="none"
          placeholder="https://…"
          placeholderTextColor={colors.textMuted}
        />
      </Field>
      {Platform.OS === 'web' ? (
        <View style={styles.actions}>
          <Pressable
            onPress={pickAndUpload}
            disabled={uploading}
            style={({ pressed }) => [formKit.ghost, pressed && formKit.pressed, uploading && formKit.disabled]}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={formKit.ghostText}>Foto uploaden…</Text>
            )}
          </Pressable>
          {trimmed ? (
            <Pressable
              onPress={remove}
              style={({ pressed }) => [formKit.ghost, pressed && formKit.pressed]}
            >
              <Text style={formKit.ghostText}>Verwijderen</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  preview: { width: '100%', height: 180, borderRadius: radius.md, backgroundColor: colors.background },
  actions: { flexDirection: 'row', gap: spacing.sm },
});
