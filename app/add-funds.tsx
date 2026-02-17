import { useResultOverlay } from '@/components/result-overlay';
import { createTopUpIntent, pollTopUpStatus } from '@/services/payments-api';
import { getBalance } from '@/services/profile-api';
import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const BackIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CardIcon = ({ color = '#A855F7' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
  </Svg>
);

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function AddFundsScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { currency } = useWalletStore();
  const setBalance = useWalletStore((s) => s.setBalance);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const { show, overlay } = useResultOverlay();
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const handleStripePayment = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      show('error', 'Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setBusy(true);
    try {
      const intent = await createTopUpIntent(value, currency.toLowerCase());

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: intent.clientSecret,
        merchantDisplayName: 'E-Wallet',
      });
      if (initError) {
        show('error', 'Payment Error', initError.message);
        return;
      }

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code !== 'Canceled') {
          show('error', 'Payment Failed', presentError.message);
        }
        return;
      }

      const status = await pollTopUpStatus(intent.topUpId);
      if (status.status === 'completed') {
        const bal = await getBalance();
        setBalance(bal.balance);
        show('success', 'Funds Added!', `${value.toFixed(2)} ${currency} has been added.`);
        setTimeout(() => router.back(), 2000);
      } else {
        show('error', 'Payment Failed', 'The payment could not be completed.');
      }
    } catch (err: any) {
      show('error', 'Error', err?.message ?? 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Add Funds</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
              editable={!busy}
            />
          </View>
        </View>

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((qa) => (
            <TouchableOpacity
              key={qa}
              disabled={busy}
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

        <View style={[styles.methodCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.methodLeft}>
            <View style={[styles.methodIconBox, { backgroundColor: '#A855F718' }]}>
              <CardIcon />
            </View>
            <Text style={[styles.methodLabel, { color: colors.textPrimary }]}>Pay with Card</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }, busy && { opacity: 0.6 }]}
          onPress={handleStripePayment}
          activeOpacity={0.8}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Funds</Text>
          )}
        </TouchableOpacity>
      </View>

      {overlay}
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
