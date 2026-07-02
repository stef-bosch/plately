import {
  NavigationContainer,
  DefaultTheme,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandHeader } from '../components/BrandHeader';
import { Icon, type BrandIconName } from '../components/BrandIcons';
import { WelcomeModal } from '../components/WelcomeModal';
import { colors, iconSize, typography } from '../theme';
import { hasSeenWelcome, markWelcomeSeen } from '../utils/welcome';
import { DashboardScreen } from '../screens/DashboardScreen';
import { WeekmenuScreen } from '../screens/WeekmenuScreen';
import { ReceptenScreen } from '../screens/ReceptenScreen';
import { ReceptdetailScreen } from '../screens/ReceptdetailScreen';
import { MenudetailScreen } from '../screens/MenudetailScreen';
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
  Weekmenu: 'Calendar',
  Recepten: 'ChefHat',
  Instellingen: 'Settings',
};

function Tabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);

  // One-time welcome popup (shown on the first web-app load only).
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [welcomeVisible, setWelcomeVisible] = useState(() => !hasSeenWelcome());
  const dismissWelcome = () => {
    markWelcomeSeen();
    setWelcomeVisible(false);
  };
  const goToSettings = () => {
    dismissWelcome();
    navigation.navigate('Tabs', { screen: 'Instellingen' });
  };

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
            height: 72 + bottomInset,
            paddingTop: 10,
            paddingBottom: bottomInset + 6,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
          tabBarLabel: ({ color }) => (
            <Text
              style={{ ...typography.caption, color, textAlign: 'center' }}
            >
              {route.name}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Icon name={TAB_ICON[route.name]} size={iconSize.tab} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Weekmenu" component={WeekmenuScreen} />
        <Tab.Screen name="Recepten" component={ReceptenScreen} />
        <Tab.Screen name="Instellingen" component={InstellingenScreen} />
      </Tab.Navigator>
      {welcomeVisible ? (
        <WelcomeModal
          onGoToSettings={goToSettings}
          onDismiss={dismissWelcome}
        />
      ) : null}
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
        <Stack.Screen
          name="Menudetail"
          component={MenudetailScreen}
          options={{
            title: 'Menu',
            headerBackTitle: 'Terug',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
