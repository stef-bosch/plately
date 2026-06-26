import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import type { SvgProps } from 'react-native-svg';

import type { MealType, Season } from '../types';

// Brand SVGs are imported as React components (react-native-svg-transformer).
// They use `currentColor`, so the `color` prop recolors them.
import Calendar from '../assets/brand/calendar.svg';
import ChefHat from '../assets/brand/chef-hat.svg';
import Fish from '../assets/brand/fish.svg';
import Fruit from '../assets/brand/fruit.svg';
import Grain from '../assets/brand/grain.svg';
import Heat from '../assets/brand/heat.svg';
import Home from '../assets/brand/home.svg';
import Like from '../assets/brand/like.svg';
import Line from '../assets/brand/line.svg';
import Logo from '../assets/brand/logo.svg';
import Measure from '../assets/brand/measure.svg';
import Meat from '../assets/brand/meat.svg';
import Notification from '../assets/brand/notification.svg';
import Plus from '../assets/brand/plus.svg';
import Scale from '../assets/brand/scale.svg';
import Search from '../assets/brand/search.svg';
import Settings from '../assets/brand/settings.svg';
import Symbol from '../assets/brand/symbol.svg';
import User from '../assets/brand/user.svg';
import Vegetable from '../assets/brand/vegetable.svg';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Wraps an Ionicon so it shares the brand SVG call signature (width/color),
 * letting `Icon` treat library and custom glyphs uniformly. We use these for a
 * handful of secondary icons (meals, seasons, clock, chart) where clean,
 * single-weight outline glyphs read better and sit closer to the outline-style
 * tab-bar icons than the busier hand-drawn originals.
 */
function ionicon(name: IoniconName) {
  return function BrandIonicon({ width = 24, color }: SvgProps) {
    const size =
      typeof width === 'number' ? width : Number.parseFloat(`${width}`) || 24;
    return <Ionicons name={name} size={size} color={color} />;
  };
}

export const BrandIcon = {
  Breakfast: ionicon('cafe-outline'),
  Calendar,
  ChefHat,
  Clock: ionicon('time-outline'),
  Dinner: ionicon('restaurant-outline'),
  Fish,
  Fruit,
  Grain,
  Graph: ionicon('stats-chart-outline'),
  Heat,
  Home,
  Like,
  Line,
  Logo,
  Lunch: ionicon('fast-food-outline'),
  Measure,
  Meat,
  Notification,
  Plus,
  Scale,
  Search,
  Settings,
  Snack: ionicon('nutrition-outline'),
  Snow: ionicon('snow-outline'),
  Sun: ionicon('sunny-outline'),
  Symbol,
  User,
  Vegetable,
} as const;

export type BrandIconName = keyof typeof BrandIcon;

interface IconProps extends SvgProps {
  /** Square size in px. The glyph sits centred within the artboard. */
  size?: number;
  color?: string;
}

/** Renders a brand icon by name with a single size + color. */
export function Icon({
  name,
  size = 24,
  color,
  ...rest
}: IconProps & { name: BrandIconName }) {
  const Component = BrandIcon[name];
  return <Component width={size} height={size} color={color} {...rest} />;
}

const MEAL_ICON: Record<MealType, BrandIconName> = {
  ontbijt: 'Breakfast',
  lunch: 'Lunch',
  diner: 'Dinner',
  tussendoortje: 'Snack',
};

/** Convenience component that picks the right brand icon for a meal type. */
export function MealIcon({
  mealType,
  size = 22,
  color,
}: {
  mealType: MealType;
  size?: number;
  color?: string;
}) {
  return <Icon name={MEAL_ICON[mealType]} size={size} color={color} />;
}

const SEASON_ICON: Record<Season, BrandIconName> = {
  'lente-zomer': 'Sun',
  'herfst-winter': 'Snow',
};

/** Convenience component that picks the right brand icon for a season. */
export function SeasonIcon({
  season,
  size = 16,
  color,
}: {
  season: Season;
  size?: number;
  color?: string;
}) {
  return <Icon name={SEASON_ICON[season]} size={size} color={color} />;
}

/** The Plately "P" mark (used as a small logo). */
export function PlatelyMark({
  size = 32,
  color,
}: {
  size?: number;
  color?: string;
}) {
  return <Symbol width={size} height={size} color={color} />;
}

/** The full Plately wordmark. Width-driven; height keeps the 299:100 ratio. */
export function PlatelyLogo({
  width = 150,
  color,
}: {
  width?: number;
  color?: string;
}) {
  const height = (width * 100) / 299.15;
  return <Logo width={width} height={height} color={color} />;
}
