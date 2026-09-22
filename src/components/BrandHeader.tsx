import { Ionicons } from '@expo/vector-icons';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/types';
import { colors, spacing } from '../theme';
import { BrandLogo } from './BrandIcons';

/**
 * App-level top bar above the main tab screens: the centred ChefStef wordmark,
 * a profile shortcut to settings on the right, clearing the device safe-area.
 */
export function BrandHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.side} />
      <View style={styles.logoWrap}>
        <BrandLogo height={26} color={colors.primary} />
      </View>
      <Pressable
        onPress={() => navigation.navigate('Tabs', { screen: 'Instellingen' })}
        accessibilityRole="button"
        accessibilityLabel="Instellingen"
        style={({ pressed }) => [styles.side, pressed && styles.pressed]}
      >
        <View style={styles.profile}>
          <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  side: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
