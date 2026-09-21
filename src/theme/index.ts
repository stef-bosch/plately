/**
 * ChefStef design system.
 *
 * Calm, organic and food/wellness. Olive-green palette on a cool light-grey
 * background: dark olive text, mid olive accents, a soft lime for selected
 * states, and warm food photography as the visual contrast. Weight-driven
 * hierarchy in Poppins; almost no hard black.
 */

export const colors = {
  // Backgrounds
  background: '#F4F5F7', // cool light grey
  surface: '#FFFFFF', // cards
  surfaceMuted: '#F6F9E8', // soft cream-green fill

  // Brand / accents
  primary: '#6A7147', // olive — accents, active states, icons
  primaryStrong: '#40442A', // dark olive — filled primary buttons
  primarySoft: '#D4E2BD', // accent lime — selected / soft fills
  accent: '#6A7147', // olive (mono-green accent)
  accentSoft: '#E8F0D6', // light lime tint

  // Text
  textPrimary: '#40442A', // dark olive (no hard black)
  textSecondary: '#5B5B5B', // grey
  textMuted: '#9A9C90', // muted olive-grey
  textOnPrimary: '#FFFFFF',

  // Lines & shadows
  border: '#E6E8DC', // light olive-grey
  shadow: '#2C2E22', // dark olive-grey

  // Macro accent colours — muted earth tones that sit with the olive palette
  protein: '#BE6E45', // terracotta
  carbs: '#D3A64A', // amber
  fat: '#A98A3E', // gold-olive
  fiber: '#6E7A46', // olive green

  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14, // standard cards / controls
  lg: 18, // larger cards, recipe imagery
  xl: 22, // primary buttons, hero containers
  pill: 999,
} as const;

/**
 * Shared icon sizes. Brand glyphs are trimmed to their content box, so these
 * render visually identical to Ionicons of the same value — keeping every icon
 * in the app on one consistent scale.
 */
export const iconSize = {
  badge: 16, // inline with captions: badges, pills, meta rows
  action: 20, // interactive affordances: search, chevrons
  tab: 24, // bottom tab bar
  hero: 32, // large empty / error states
} as const;

/** Google Font family names as loaded by @expo-google-fonts. */
export const fontFamily = {
  fredokaSemiBold: 'Fredoka_600SemiBold',
  fredokaBold: 'Fredoka_700Bold',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
} as const;

/**
 * Poppins throughout, with hierarchy driven mostly by weight and only modest
 * size steps. Compact line-heights, little letter-spacing. (The ChefStef
 * wordmark keeps Fredoka as its one distinct brand touch.)
 */
export const typography = {
  display: { fontSize: 26, fontFamily: fontFamily.semiBold, letterSpacing: -0.3 },
  title: { fontSize: 22, fontFamily: fontFamily.semiBold, letterSpacing: -0.2 },
  heading: { fontSize: 16, fontFamily: fontFamily.semiBold, letterSpacing: -0.1 },
  subheading: { fontSize: 15, fontFamily: fontFamily.semiBold },
  body: { fontSize: 13, fontFamily: fontFamily.regular },
  bodyStrong: { fontSize: 13, fontFamily: fontFamily.semiBold },
  label: { fontSize: 12, fontFamily: fontFamily.medium },
  caption: { fontSize: 11, fontFamily: fontFamily.medium },
} as const;

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
} as const;

export const theme = { colors, spacing, radius, iconSize, typography, shadow, fontFamily };

export type Theme = typeof theme;
