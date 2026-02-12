import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',

      toggleTheme: () =>
        set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),

      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/* ─── App color palettes ─── */

const DarkColors = {
  // Primary colors
  primary: '#A855F7',
  primaryLight: '#C084FC',
  primaryDark: '#7C3AED',

  // Background colors
  background: '#0a0a0f',
  backgroundSecondary: '#0d0d1a',
  backgroundCard: '#1a1a2e',
  backgroundElevated: '#252540',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textAccent: '#A855F7',

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Border colors
  border: '#2D2D3A',
  borderLight: '#3D3D4A',

  // Gradient colors
  gradientPurple: ['#A855F7', '#7C3AED'] as string[],
  gradientDark: ['#0a0a0f', '#0d0d1a', '#0a0a0f'] as string[],

  // Shadow color
  shadowPurple: '#A855F7',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const LightColors = {
  // Primary colors
  primary: '#A855F7',
  primaryLight: '#C084FC',
  primaryDark: '#7C3AED',

  // Background colors
  background: '#F5F5F7',
  backgroundSecondary: '#EEEEF0',
  backgroundCard: '#FFFFFF',
  backgroundElevated: '#FFFFFF',

  // Text colors
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textAccent: '#A855F7',

  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#D1D5DB',

  // Gradient colors
  gradientPurple: ['#A855F7', '#7C3AED'] as string[],
  gradientDark: ['#F5F5F7', '#EEEEF0', '#F5F5F7'] as string[],

  // Shadow color
  shadowPurple: '#A855F7',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',
};

export type AppColorsType = typeof DarkColors;

export function getThemeColors(mode: ThemeMode): AppColorsType {
  return mode === 'dark' ? DarkColors : LightColors;
}

/** Hook: returns the current palette based on the active theme */
export function useAppColors(): AppColorsType {
  const mode = useThemeStore((s) => s.mode);
  return getThemeColors(mode);
}
