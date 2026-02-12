import { useAppColors } from '@/store/theme-store';
import { useUserStore } from '@/store/user-store';
import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

//Icons

const ChevronRight = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M7 4L13 10L7 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SendIcon = ({ color = '#A855F7' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ExchangeIcon = ({ color = '#6366F1' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M7 16L3 12L7 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 8L21 12L17 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ color = '#EF4444' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7V12C3 17.5 7 22 12 23C17 22 21 17.5 21 12V7L12 2Z" stroke={color} strokeWidth="2" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CreditIcon = ({ color = '#F59E0B' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
  </Svg>
);

const GiftIcon = ({ color = '#EC4899' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="12" width="18" height="8" rx="2" stroke={color} strokeWidth="2" />
    <Rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth="2" />
    <Path d="M12 8V20" stroke={color} strokeWidth="2" />
    <Path d="M12 8C12 8 12 4 9 4C7 4 6 5.5 7 7C8 8.5 12 8 12 8Z" stroke={color} strokeWidth="1.5" />
    <Path d="M12 8C12 8 12 4 15 4C17 4 18 5.5 17 7C16 8.5 12 8 12 8Z" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const UserIcon = ({ color = '#3B82F6' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <Path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FileTextIcon = ({ color = '#9CA3AF' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C5.45 2 5 2.45 5 3V21C5 21.55 5.45 22 6 22H18C18.55 22 19 21.55 19 21V7L14 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M14 2V7H19" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M9 13H15M9 17H13" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = '#6B7280' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke={color} strokeWidth="2" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChatIcon = ({ color = '#10B981' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const LogoutIcon = ({ color = '#EF4444' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

//Icon resolver

const ICON_MAP: Record<string, (props: { color: string }) => React.JSX.Element> = {
  send: SendIcon,
  exchange: ExchangeIcon,
  insurance: ShieldIcon,
  loans: CreditIcon,
  cashback: GiftIcon,
  profile: UserIcon,
  statements: FileTextIcon,
  settings: SettingsIcon,
  support: ChatIcon,
  logout: LogoutIcon,
};

// Menu data

type MenuItem = { id: string; label: string; color: string; route?: string; badge?: string };

const AddFundsIcon = ({ color = '#10B981' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M12 9V15M9 12H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ICON_MAP_EXT: Record<string, (props: { color: string }) => React.JSX.Element> = {
  ...ICON_MAP,
  addfunds: AddFundsIcon,
};

const MENU_SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'PAYMENTS',
    items: [
      { id: 'send', label: 'Send Money', color: '#A855F7', route: '/send-money' },
      { id: 'addfunds', label: 'Add Funds', color: '#10B981', route: '/add-funds' },
    ],
  },
  {
    title: 'SERVICES',
    items: [
      { id: 'exchange', label: 'Currency Exchange', color: '#6366F1', route: '/currency-exchange' },
      { id: 'insurance', label: 'Insurance', color: '#EF4444', badge: 'Soon' },
      { id: 'loans', label: 'Loans', color: '#F59E0B', badge: 'Soon' },
      { id: 'cashback', label: 'Cashback & Rewards', color: '#EC4899', badge: 'Soon' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'profile', label: 'My Profile', color: '#3B82F6', route: '/profile' },
      { id: 'statements', label: 'Statements', color: '#9CA3AF', route: '/statements' },
      { id: 'settings', label: 'Settings', color: '#6B7280', route: '/settings' },
      { id: 'support', label: 'Support', color: '#10B981', route: '/support' },
      { id: 'logout', label: 'Log Out', color: '#EF4444' },
    ],
  },
];

/* ───────── Component ───────── */

export default function MenuScreen() {
  const router = useRouter();
  const { profile, logout } = useUserStore();
  const { balance, currency, toDisplayAmount } = useWalletStore();
  const colors = useAppColors();
  const displayBalance = toDisplayAmount(balance);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <TouchableOpacity style={[styles.profileHeader, { borderBottomColor: colors.border }]} activeOpacity={0.7} onPress={() => router.push('/profile')}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.profileAvatar} />
          ) : (
            <View style={[styles.profileAvatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.profileInitials}>
                {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>{profile.name}</Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{profile.email}</Text>
          </View>
          <ChevronRight color={colors.textMuted} />
        </TouchableOpacity>

        {/* Quick Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Balance</Text>
          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{displayBalance.toFixed(2)} {currency}</Text>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{section.title}</Text>
            {section.items.map((item) => {
              const Icon = ICON_MAP_EXT[item.id] || ICON_MAP[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, { borderBottomColor: colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.id === 'logout') handleLogout();
                    else if (item.route) router.push(item.route as any);
                  }}
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: item.color + '18' }]}>
                      {Icon ? <Icon color={item.color} /> : null}
                    </View>
                    <Text style={[styles.menuLabel, { color: colors.textPrimary }, item.id === 'logout' && styles.dangerText]}>
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.menuRight}>
                    {item.badge && (
                      <View style={[styles.menuBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.menuBadgeText, { color: colors.primary }]}>{item.badge}</Text>
                      </View>
                    )}
                    <ChevronRight color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 70, paddingHorizontal: 20, paddingBottom: 20,
    borderBottomWidth: 1,
  },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
  profileAvatarPlaceholder: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  profileInitials: { fontSize: 22, fontWeight: '700', color: 'white' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  profileEmail: { fontSize: 14 },
  balanceCard: {
    borderRadius: 16, padding: 18,
    marginHorizontal: 20, marginTop: 20, marginBottom: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  balanceLabel: { fontSize: 14 },
  balanceAmount: { fontSize: 20, fontWeight: '700' },
  menuSection: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  dangerText: { color: '#EF4444' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  menuBadgeText: { fontSize: 11, fontWeight: '600' },
});
