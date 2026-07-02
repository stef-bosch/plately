import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PlatelyMark } from './BrandIcons';
import { colors, radius, shadow, spacing, typography } from '../theme';

interface WelcomeModalProps {
  /** Primary action: send the user to the settings screen. */
  onGoToSettings: () => void;
  /** Dismiss without navigating (e.g. tapping the backdrop). */
  onDismiss: () => void;
}

/**
 * One-time welcome overlay shown right after the splash. Kept as an in-tree
 * absolute overlay (not a RN Modal) so on web it stays within the phone frame.
 */
export function WelcomeModal({ onGoToSettings, onDismiss }: WelcomeModalProps) {
  return (
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Sluiten"
      />
      <View style={styles.card}>
        <View style={styles.logoWrap}>
          <PlatelyMark size={52} color={colors.primary} />
        </View>
        <Text style={styles.title}>Welkom!</Text>
        <Text style={styles.body}>
          Pas je leefstijl en dieetvoorkeuren aan in de instellingen, dan
          stemmen we je recepten daarop af.
        </Text>
        <Pressable
          onPress={onGoToSettings}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Ga naar instellingen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 23, 8, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.card,
  },
  logoWrap: {
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.bodyStrong,
    color: colors.textOnPrimary,
  },
});
