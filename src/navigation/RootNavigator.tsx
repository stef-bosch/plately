import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '../components/BrandHeader';
import { Icon, type BrandIconName } from '../components/BrandIcons';
import { colors, iconSize, typography } from '../theme';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ReceptenScreen } from '../screens/ReceptenScreen';
import { BoodschappenlijstScreen } from '../screens/BoodschappenlijstScreen';
import { ReceptdetailScreen } from '../screens/ReceptdetailScreen';
import { InstellingenScreen } from '../screens/InstellingenScreen';
import type { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

const TAB_ICON: Record<keyof TabParamList, BrandIconName> = {
  Dashboard: 'Home',
  Recepten: 'ChefHat',
  Boodschappen: 'Cart',
  Instellingen: 'Settings',
};

const TAB_LABEL: Record<keyof TabParamList, string> = {
  Dashboard: 'Dashboard',
  Recepten: 'Recepten',
  Boodschappen: 'Boodschappen',
  Instellingen: 'Instellingen',
};

function Tabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <BrandHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          // Subtle cross-shift when switching tabs for a smoother feel.
          animation: 'shift',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 92 + bottomInset,
            paddingTop: 14,
            paddingBottom: bottomInset + 10,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
          tabBarLabel: ({ color }) => (
            <Text
              style={{ ...typography.caption, color, textAlign: 'center' }}
            >
              {TAB_LABEL[route.name]}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon name={TAB_ICON[route.name]} size={iconSize.tab} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Recepten" component={ReceptenScreen} />
        <Tab.Screen name="Boodschappen" component={BoodschappenlijstScreen} />
        <Tab.Screen name="Instellingen" component={InstellingenScreen} />
      </Tab.Navigator>
    </View>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { ...typography.subheading, color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Receptdetail"
          component={ReceptdetailScreen}
          options={{
            title: 'Recept',
            headerBackTitle: 'Terug',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
