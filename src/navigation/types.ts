import type { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tab routes. */
export type TabParamList = {
  Dashboard: undefined;
  Weekmenu: undefined;
  Recepten: { mealType?: string } | undefined;
  Instellingen: undefined;
};

/** Root stack: the tabs plus the pushable recipe and menu detail screens. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Receptdetail: { recipeId: string };
  Menudetail: { menuId: string };
};
