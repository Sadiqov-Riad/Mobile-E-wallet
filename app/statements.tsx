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
import Svg, { Circle, Path } from 'react-native-svg';

const BackIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmptyIcon = ({ color }: { color: string }) => (
  <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="28" stroke={color} strokeWidth="2" opacity={0.3} />
    <Path d="M24 28H40M24 36H34" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.4} />
  </Svg>
);

export default function StatementsScreen() {
  const router = useRouter();
  const { transactions, currency, toDisplayAmount } = useWalletStore();
  const colors = useAppColors();

  const incomeBase = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expensesBase = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const income = toDisplayAmount(incomeBase);
  const expenses = toDisplayAmount(expensesBase);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><BackIcon color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Statements</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderLeftColor: '#10B981', backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Income</Text>
            <Text style={[styles.summaryAmount, { color: '#10B981' }]}>+{income.toFixed(2)} {currency}</Text>
          </View>
          <View style={[styles.summaryCard, { borderLeftColor: '#EF4444', backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Expenses</Text>
            <Text style={[styles.summaryAmount, { color: '#EF4444' }]}>-{expenses.toFixed(2)} {currency}</Text>
          </View>
        </View>

        {/* Transaction List */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ALL TRANSACTIONS</Text>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <EmptyIcon color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No transactions yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>Your transaction history will appear here</Text>
          </View>
        ) : (
          transactions.map((tx) => (
            <View key={tx.id} style={[styles.txItem, { borderBottomColor: colors.border }]}>
              <View style={[styles.txIconBox, { backgroundColor: colors.backgroundCard }]}>
                <Text style={[styles.txInitial, { color: colors.textSecondary }]}>{tx.name.charAt(0)}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txName, { color: colors.textPrimary }]}>{tx.name}</Text>
                <Text style={[styles.txCategory, { color: colors.textMuted }]}>{tx.category}</Text>
              </View>
              <Text style={[styles.txAmount, { color: colors.textPrimary }, tx.amount > 0 && styles.txPositive]}>
                {toDisplayAmount(tx.amount) > 0 ? '+' : ''}{toDisplayAmount(tx.amount).toFixed(2)} {currency}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, marginBottom: 20,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  summaryCard: {
    flex: 1, borderRadius: 14, padding: 16,
    borderLeftWidth: 3,
  },
  summaryLabel: { fontSize: 13, marginBottom: 6 },
  summaryAmount: { fontSize: 18, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 16,
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
