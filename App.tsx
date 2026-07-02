import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AdminApp } from './src/admin/AdminApp';
import { SplashScreen } from './src/components/SplashScreen';
import { SettingsProvider } from './src/context/SettingsContext';
import { loadContent } from './src/data/content';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

const isWeb = Platform.OS === 'web';

/** The hidden admin lives at /admin on web only (not linked from the app). */
const isAdminRoute =
  isWeb &&
  typeof window !== 'undefined' &&
  /^\/admin(\/|$)/.test(window.location.pathname);

/** Minimum time the splash stays up so it reads as a splash, not a flicker. */
const SPLASH_MIN_MS = 1800;

export default function App() {
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [minTimePassed, setMinTimePassed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, []);

  // Load dishes from the backend (if configured) before showing the app, with a
  // timeout so a slow/unavailable backend can't keep us on the splash forever.
  const [contentReady, setContentReady] = useState(false);
  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        setContentReady(true);
      }
    };
    loadContent().finally(finish);
    const timer = setTimeout(finish, 4000);
    return () => clearTimeout(timer);
  }, []);

  // The admin is a separate, full-screen web surface — only fonts need to be
  // ready (it loads its own data from Supabase).
  if (isAdminRoute) {
    if (!fontsLoaded) return <SplashScreen />;
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AdminApp />
      </SafeAreaProvider>
    );
  }

  if (!fontsLoaded || !minTimePassed || !contentReady) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.frame}>
        <SafeAreaProvider>
          <SettingsProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </SettingsProvider>
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // On web the app is centred in a phone-sized frame so the mobile-first
  // layout reads correctly on a desktop browser. On native it just fills.
  root: {
    flex: 1,
    backgroundColor: isWeb ? colors.surfaceMuted : colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.background,
    ...(isWeb
      ? {
          maxWidth: 440,
          boxShadow: '0 12px 40px rgba(61, 42, 18, 0.18)',
        }
      : null),
  },
});
