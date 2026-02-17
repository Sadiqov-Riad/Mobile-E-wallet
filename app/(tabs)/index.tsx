import { useNotificationStore } from '@/store/notification-store';
import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export default function HomeScreen() {
  const router = useRouter();
  const { balance, currency, transactions, toDisplayAmount } = useWalletStore();
  const colors = useAppColors();
  const displayBalance = toDisplayAmount(balance);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const BellIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={colors.textPrimary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const PlusIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5V19M5 12H19" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );

  const ArrowRightIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

  const WalletIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="18" height="14" rx="2" stroke={colors.primary} strokeWidth="2" />
      <Path d="M3 10H21" stroke={colors.primary} strokeWidth="2" />
      <Rect x="15" y="13" width="3" height="3" rx="1" fill={colors.primary} />
    </Svg>
  );

  const EmptyIcon = () => (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="32" r="28" stroke={colors.textMuted} strokeWidth="2" opacity={0.3} />
      <Path d="M22 32H42" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" opacity={0.4} />
      <Path d="M32 22V42" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" opacity={0.4} />
    </Svg>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Bell */}
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
            <BellIcon />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceAmount}>
              <Text style={[styles.balanceWhole, { color: colors.textPrimary }]}>{Math.floor(displayBalance)}</Text>
              <Text style={[styles.balanceDecimal, { color: colors.textPrimary }]}>.{(displayBalance % 1).toFixed(2).slice(2)}</Text>
              <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}> {currency}</Text>
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => router.push('/add-funds')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.backgroundCard }]}>
                <PlusIcon />
              </View>
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{'Add\nFunds'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => router.push('/send-money')}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.backgroundCard }]}>
                <ArrowRightIcon />
              </View>
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{'Send\nMoney'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <View style={[styles.actionIconContainer, { backgroundColor: colors.backgroundCard }]}>
                <WalletIcon />
              </View>
              <Text style={[styles.actionText, { color: colors.textSecondary }]}>{'Other\nPayments'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.activitySection, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>RECENT ACTIVITY</Text>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <EmptyIcon />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No transactions yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Your activity will appear here</Text>
            </View>
          ) : (
            transactions.slice(0, 10).map((tx) => (
              <View key={tx.id} style={[styles.txItem, { borderBottomColor: colors.border }]}>
                <View style={[styles.txIconBox, { backgroundColor: colors.backgroundCard }]}>
                  <Text style={[styles.txInitial, { color: colors.textSecondary }]}>{tx.name.charAt(0)}</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txName, { color: colors.textPrimary }]}>{tx.name}</Text>
                  <Text style={[styles.txCategory, { color: colors.textMuted }]}>{tx.category}</Text>
                </View>
                <Text style={[styles.txAmount, { color: colors.textPrimary }, tx.amount > 0 && styles.txPositive]}>
                  {tx.amount > 0 ? '+' : ''}{toDisplayAmount(tx.amount).toFixed(2)} {currency}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 60,
  },
  bellBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: -2, right: -4,
    backgroundColor: '#EF4444', borderRadius: 10,
    minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  balanceSection: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 20 },
  balanceContainer: { alignItems: 'center', marginBottom: 36, marginTop: 60},
  balanceAmount: { flexDirection: 'row', alignItems: 'baseline' },
  balanceWhole: { fontSize: 64, fontWeight: '300' },
  balanceDecimal: { fontSize: 40, fontWeight: '300' },
  balanceCurrency: { fontSize: 40, fontWeight: '300' },
  quickActions: {
    flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 20,
  },
  actionButton: { alignItems: 'center' },
  actionIconContainer: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
  },
  actionText: { fontSize: 12, textAlign: 'center', lineHeight: 16 },
  activitySection: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24, minHeight: 400,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 1.5, marginBottom: 20,
  },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  emptySubtitle: { fontSize: 14 },
  txItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1,
  },
  txIconBox: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  txInitial: { fontSize: 18, fontWeight: '600' },
  txInfo: { flex: 1 },
  txName: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  txCategory: { fontSize: 13 },
  txAmount: { fontSize: 15, fontWeight: '600' },
  txPositive: { color: '#10B981' },
});
