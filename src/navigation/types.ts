import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tab routes. */
export type TabParamList = {
  Dashboard: undefined;
  Recepten: { mealType?: string } | undefined;
  Boodschappen: undefined;
  Instellingen: undefined;
};

/** Root stack: the tabs plus the pushable recipe detail screen. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Receptdetail: { recipeId: string };
};
