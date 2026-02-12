import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  username: string;
  joinedDate: string;
  isVerified: boolean;
  currency: string;
  language: string;
};

type UserState = {
  profile: UserProfile;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;

  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setAvatar: (uri: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;

};

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Riad Sadiqov',
  email: 'riad@gmail.com',
  phone: '+994 50 123 45 67',
  avatar: null,
  username: '@username',
  joinedDate: '2024-06-15',
  isVerified: true,
  currency: 'AZN',
  language: 'en',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      isAuthenticated: false,
      hasSeenOnboarding: false,

      setProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),

      setAvatar: (uri) =>
        set((state) => ({
          profile: { ...state.profile, avatar: uri },
        })),

      login: async (email, _password) => {
        // simulate login
        await new Promise((r) => setTimeout(r, 800));
        set({
          isAuthenticated: true,
          profile: { ...get().profile, email },
        });
        return true;
      },

      register: async (name, email, phone, _password) => {
        // simulate registration
        await new Promise((r) => setTimeout(r, 800));
        set({
          isAuthenticated: true,
          profile: {
            ...get().profile,
            name,
            email,
            phone,
            id: `user_${Date.now()}`,
            joinedDate: new Date().toISOString().split('T')[0],
          },
        });
        return true;
      },

      logout: () =>
        set({
          isAuthenticated: false,
        }),

      completeOnboarding: () => set({ hasSeenOnboarding: true }),


    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
