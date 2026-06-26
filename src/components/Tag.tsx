import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '../theme';

interface TagProps {
  label: string;
}

type Tone = { bg: string; text: string };

/**
 * Soft, distinct colour per tag so a row of tags is easy to scan. Each known
 * label keeps the same colour across the app; unknown labels fall back to a
 * stable colour derived from the text.
 */
const PALETTE: Tone[] = [
  { bg: '#DFF3E4', text: '#1F9D57' }, // green
  { bg: '#FFE2CC', text: '#E2592A' }, // orange
  { bg: '#FFEFC2', text: '#B5790F' }, // amber
  { bg: '#D2EFEA', text: '#14857A' }, // teal
  { bg: '#EAF1CD', text: '#6E8B1E' }, // olive
  { bg: '#DCE6FB', text: '#3D5FB0' }, // blue
  { bg: '#ECE0F5', text: '#7C4DA8' }, // plum
  { bg: '#FCDFDF', text: '#C0392B' }, // coral
];

const TAG_TONES: Record<string, Tone> = {
  Vegetarisch: PALETTE[0],
  Eiwitrijk: PALETTE[1],
  'Snel klaar': PALETTE[2],
  Gezond: PALETTE[3],
  Vezelrijk: PALETTE[4],
  'Meal prep proof': PALETTE[5],
  Restaurantwaardig: PALETTE[6],
  Sportief: PALETTE[7],
  BBQ: PALETTE[7],
};

function toneForLabel(label: string): Tone {
  const known = TAG_TONES[label];
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

/** Small rounded pill used for recipe tags. */
export function Tag({ label }: TagProps) {
  const tone = toneForLabel(label);
  return (
    <View style={[styles.tag, { backgroundColor: tone.bg }]}>
      <Text style={[styles.text, { color: tone.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.caption,
  },
});
