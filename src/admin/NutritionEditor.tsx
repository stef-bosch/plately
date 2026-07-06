import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../theme';
import { Field, formKit } from './formKit';

// Fiber ('fiber') is intentionally not offered here — it isn't shown anywhere
// in the app anymore. It stays in the Nutrition data model (saved as 0 for new
// dishes, preserved on edits) so nothing else has to change.
export const MACROS = ['calories', 'protein', 'carbs', 'fat'] as const;
export type MacroKey = (typeof MACROS)[number];

const MACRO_LABEL: Record<MacroKey, string> = {
  calories: 'Calorieën', protein: 'Eiwitten', carbs: 'Koolhydraten', fat: 'Vetten',
};
const MACRO_UNIT: Record<MacroKey, string> = {
  calories: 'kcal', protein: 'g', carbs: 'g', fat: 'g',
};

interface Props {
  macros: Record<string, string>;
  setMacros: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

/** Per-portion nutrition inputs (one field per macro). */
export function NutritionEditor({ macros, setMacros }: Props) {
  return (
    <View style={styles.grid}>
      {MACROS.map((m) => (
        <Field key={m} label={`${MACRO_LABEL[m]} (${MACRO_UNIT[m]})`} style={styles.macroField}>
          <TextInput
            value={macros[m] ?? ''}
            onChangeText={(t) => setMacros((p) => ({ ...p, [m]: t }))}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            style={formKit.input}
          />
        </Field>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 12 },
  macroField: { width: '100%' },
});
