import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList, TabParamList } from './types';

/**
 * Navigation prop available inside tab screens: can switch tabs AND push the
 * recipe detail screen on the root stack.
 */
export type AppNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function useAppNavigation(): AppNavigation {
  return useNavigation<AppNavigation>();
}

/** Convenience: navigate to a recipe detail from anywhere. */
export function useOpenRecipe() {
  const navigation = useAppNavigation();
  return (recipeId: string) =>
    navigation.navigate('Receptdetail', { recipeId });
}

/** Convenience: navigate to a menu detail from anywhere. */
export function useOpenMenu() {
  const navigation = useAppNavigation();
  return (menuId: string) => navigation.navigate('Menudetail', { menuId });
}
