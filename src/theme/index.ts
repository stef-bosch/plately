/**
 * Plately design system.
 *
 * Friendly, fresh and warm. Brand palette: sunny orange, soft honey-yellow,
 * mint and a creamy off-white background, with near-black warm text.
 * Headings use Fredoka (rounded), body copy uses Poppins.
 */

export const colors = {
  // Backgrounds
  background: '#FFF6E9', // cream
  surface: '#FFFFFF',
  surfaceMuted: '#FDEAD0', // warm sand

  // Brand / accents
  primary: '#FF7A1A', // sunny orange
  primarySoft: '#FFE6A6', // honey yellow tint
  accent: '#1F9D57', // deep mint-green (legible on light)
  accentSoft: '#C7F2D6', // mint

  // Text
  textPrimary: '#222222',
  textSecondary: '#6E6A60', // warm grey
  textMuted: '#A89F8E',
  textOnPrimary: '#FFFFFF',

  // Lines & shadows
  border: '#F1E5CF',
  shadow: '#3D2A12', // warm brown

  // Macro accent colours
  protein: '#FF7A1A', // orange
  carbs: '#F4B740', // amber
  fat: '#E2592A', // deep orange
  fiber: '#1F9D57', // mint green

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
  md: 16,
  lg: 22,
  xl: 28,
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

export const typography = {
  display: { fontSize: 30, fontFamily: fontFamily.fredokaBold, letterSpacing: -0.5 },
  title: { fontSize: 24, fontFamily: fontFamily.fredokaSemiBold, letterSpacing: -0.3 },
  heading: { fontSize: 19, fontFamily: fontFamily.fredokaSemiBold, letterSpacing: -0.2 },
  subheading: { fontSize: 16, fontFamily: fontFamily.semiBold },
  body: { fontSize: 15, fontFamily: fontFamily.regular },
  bodyStrong: { fontSize: 15, fontFamily: fontFamily.semiBold },
  label: { fontSize: 13, fontFamily: fontFamily.semiBold },
  caption: { fontSize: 12, fontFamily: fontFamily.medium },
} as const;

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const theme = { colors, spacing, radius, iconSize, typography, shadow, fontFamily };

export type Theme = typeof theme;
