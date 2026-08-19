import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Icon, PlatelyLogo, type BrandIconName } from '../components/BrandIcons';
import { colors, iconSize, radius, shadow, spacing, typography } from '../theme';

/**
 * First-open landing page (shown once, within the app frame). Explains what
 * Plately does with a hero photo and three feature highlights, then a button
 * into the app. The hero photo is a temporary remote stock image — swap the
 * uri for a bundled asset when final artwork is ready.
 */
const HERO_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
};

const FEATURES: { icon: BrandIconName; title: string; text: string }[] = [
  {
    icon: 'Home',
    title: 'Jouw dagmenu',
    text: 'Stel je dag samen; de voedingswaarden tellen automatisch op.',
  },
  {
    icon: 'ChefHat',
    title: 'Recepten',
    text: 'Blader door recepten en filter op categorie en seizoen.',
  },
  {
    icon: 'Menu',
    title: "Menu's",
    text: 'Complete meergangenmenu’s voor bijzondere momenten.',
  },
];

export function LandingScreen({ onEnter }: { onEnter: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image source={HERO_IMAGE} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroLogo}>
            <PlatelyLogo width={150} color={colors.white} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Eet lekker, eet in balans</Text>
          <Text style={styles.intro}>
            Plately helpt je makkelijk gezond te eten: stel je eigen dagmenu
            samen, ontdek recepten en menu’s, en houd je voedingswaarden in de
            gaten — allemaal op één plek.
          </Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Icon name={f.icon} size={iconSize.action} color={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureBody}>{f.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button label="Naar de app" variant="primary" onPress={onEnter} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  heroWrap: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'flex-end',
    ...shadow.card,
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 23, 8, 0.28)',
  },
  heroLogo: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  body: {
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.soft,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  featureBody: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
