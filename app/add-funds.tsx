import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

//Icons

const BackIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CardMethodIcon = ({ color = '#A855F7' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
  </Svg>
);

const BankMethodIcon = ({ color = '#3B82F6' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21M4 18H20M5 14H19M12 3L2 9H22L12 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CashMethodIcon = ({ color = '#10B981' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
    <Circle cx="5" cy="8" r="1" fill={color} />
    <Circle cx="19" cy="16" r="1" fill={color} />
  </Svg>
);

const CheckIcon = ({ color = '#6C5CE7' }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M4 10L8 14L16 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/* ───────── Component ───────── */

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];
const METHODS = [
  { id: 'card', label: 'Debit / Credit Card', Icon: CardMethodIcon, color: '#A855F7' },
  { id: 'bank', label: 'Bank Transfer', Icon: BankMethodIcon, color: '#3B82F6' },
  { id: 'cash', label: 'Cash Deposit', Icon: CashMethodIcon, color: '#10B981' },
];

export default function AddFundsScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { addFunds, currency } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    const selectedMethod = METHODS.find((m) => m.id === method);
    addFunds(value, selectedMethod?.label ?? 'Card');
    Alert.alert('Success', `${value.toFixed(2)} ${currency} has been added to your balance.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Add Funds</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Amount</Text>
          <View style={[styles.amountInputRow, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>{currency}</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((qa) => (
            <TouchableOpacity
              key={qa}
              style={[
                styles.quickBtn,
                { backgroundColor: colors.backgroundCard },
                amount === String(qa) && { backgroundColor: colors.primary + '20', borderWidth: 1, borderColor: colors.primary },
              ]}
              onPress={() => setAmount(String(qa))}
            >
              <Text style={[
                styles.quickBtnText,
                { color: colors.textSecondary },
                amount === String(qa) && { color: colors.primary },
              ]}>
                {qa} {currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PAYMENT METHOD</Text>
        {METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.methodCard,
              { backgroundColor: colors.backgroundCard, borderColor: 'transparent' },
              method === m.id && { borderColor: colors.primary },
            ]}
            onPress={() => setMethod(m.id)}
            activeOpacity={0.7}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.methodIconBox, { backgroundColor: m.color + '18' }]}>
                <m.Icon color={m.color} />
              </View>
              <Text style={[styles.methodLabel, { color: colors.textPrimary }]}>{m.label}</Text>
            </View>
            {method === m.id && <CheckIcon color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAdd} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  amountSection: { marginBottom: 24 },
  amountLabel: { fontSize: 13, marginBottom: 12 },
  amountInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, paddingHorizontal: 20, paddingVertical: 18,
  },
  currencySymbol: { fontSize: 28, fontWeight: '700', marginRight: 12 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '600' },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  quickBtn: {
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
  },
  quickBtnText: { fontSize: 14, fontWeight: '500' },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 14,
  },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1,
  },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  methodIconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  methodLabel: { fontSize: 15, fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  addButton: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  addButtonText: { fontSize: 17, fontWeight: '600', color: 'white' },
});
