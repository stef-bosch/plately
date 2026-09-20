import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';
import { BrandLogo } from './BrandIcons';

/**
 * App-level top bar shown above the main tab screens. Holds the ChefStef
 * wordmark and clears the device safe-area (notch / status bar).
 */
export function BrandHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.sm }]}>
      <BrandLogo size={24} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
