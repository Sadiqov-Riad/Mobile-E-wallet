import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/store/theme-store';
import { useUserStore } from '@/store/user-store';
import { useWalletStore } from '@/store/wallet-store';
import LoadingScreen from './loading';
import OnboardingScreen from './onboarding';
import SignInScreen from './sign-in';
import SignUpScreen from './sign-up';

export const unstable_settings = {
  anchor: '(tabs)',
};

type AppState = 'loading' | 'onboarding' | 'sign-in' | 'sign-up' | 'main';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';
  const { isAuthenticated, hasSeenOnboarding, completeOnboarding, profile } = useUserStore();
  const setWalletCurrency = useWalletStore((s) => s.setCurrency);
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        setAppState('main');
      } else if (hasSeenOnboarding) {
        setAppState('sign-in');
      } else {
        setAppState('onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // React to logout
  useEffect(() => {
    if (appState === 'main' && !isAuthenticated) {
      setAppState('sign-in');
    }
  }, [isAuthenticated]);

  // делает sync вылюты между профилем и кошельком
  useEffect(() => {
    if (profile?.currency) {
      setWalletCurrency(profile.currency);
    }
  }, [profile?.currency, setWalletCurrency]);

  const handleOnboardingComplete = () => {
    completeOnboarding();
    setAppState('sign-in');
  };

  const handleSignInComplete = () => {
    setAppState('main');
  };

  const handleGoToSignUp = () => {
    setAppState('sign-up');
  };

  const handleGoToSignIn = () => {
    setAppState('sign-in');
  };

  return (
    <>
      {appState === 'loading' ? (
        <>
          <LoadingScreen />
          <StatusBar style="light" />
        </>
      ) : appState === 'onboarding' ? (
        <>
          <OnboardingScreen onComplete={handleOnboardingComplete} />
          <StatusBar style="light" />
        </>
      ) : appState === 'sign-in' ? (
        <>
          <SignInScreen onComplete={handleSignInComplete} onSignUp={handleGoToSignUp} />
          <StatusBar style="light" />
        </>
      ) : appState === 'sign-up' ? (
        <>
          <SignUpScreen onComplete={handleSignInComplete} onBack={handleGoToSignIn} />
          <StatusBar style="light" />
        </>
      ) : (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: isDark ? '#0a0a0f' : '#F5F5F7' },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="send-money" options={{ presentation: 'card' }} />
            <Stack.Screen name="add-funds" options={{ presentation: 'card' }} />
            <Stack.Screen name="profile" options={{ presentation: 'card' }} />
            <Stack.Screen name="currency-exchange" options={{ presentation: 'card' }} />
            <Stack.Screen name="statements" options={{ presentation: 'card' }} />
            <Stack.Screen name="settings" options={{ presentation: 'card' }} />
            <Stack.Screen name="support" options={{ presentation: 'card' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} />
        </ThemeProvider>
      )}
    </>
  );
}
