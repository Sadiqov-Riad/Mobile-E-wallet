import { Tabs } from 'expo-router';
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { HapticTab } from '@/components/haptic-tab';
import { useAppColors } from '@/store/theme-store';

// Tab Icons
const HomeIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={focused ? color : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
  </Svg>
);

const SavingsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill={focused ? color : 'none'} fillOpacity={focused ? 0.2 : 0} />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const InvestIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L9 11L13 15L21 7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M17 7H21V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CardsIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="2"
      fill={focused ? color : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
  </Svg>
);

const MenuIcon = ({ color, focused }: { color: string; focused: boolean }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 12H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M4 18H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default function TabLayout() {
  const colors = useAppColors();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 85,
          paddingTop: 10,
          paddingBottom: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color, focused }) => <SavingsIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invest',
          tabBarIcon: ({ color, focused }) => <InvestIcon color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => <MenuIcon color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
