import type { NavigatorScreenParams } from '@react-navigation/native';

import type { MealType } from '../types';

/** Bottom tab routes. */
export type TabParamList = {
  Dashboard: undefined;
  Recepten: { mealType?: string } | undefined;
  Boodschappen: undefined;
  Instellingen: undefined;
};

/** Root stack: the tabs plus the pushable recipe detail + slot picker screens. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Receptdetail: { recipeId: string };
  KiesRecept: { slot: MealType };
};
