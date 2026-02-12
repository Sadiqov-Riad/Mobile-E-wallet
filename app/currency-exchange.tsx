import { useAppColors } from '@/store/theme-store';
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
import Svg, { Path } from 'react-native-svg';

const BackIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SwapIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M7 16L3 12L7 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M17 8L21 12L17 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CURRENCIES = [
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', rate: 1 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.588 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.541 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.462 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 21.46 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 52.94 },
];

export default function CurrencyExchangeScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState('');

  const from = CURRENCIES[fromIdx];
  const to = CURRENCIES[toIdx];
  const converted = amount ? (parseFloat(amount) * (to.rate / from.rate)).toFixed(2) : '0.00';

  const handleSwap = () => { setFromIdx(toIdx); setToIdx(fromIdx); };

  const handleConvert = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid amount');
      return;
    }
    Alert.alert(
      'Exchange',
      `${value.toFixed(2)} ${from.code} → ${converted} ${to.code}\n\nThis is a preview. Real exchange coming soon!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><BackIcon color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Currency Exchange</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* From */}
        <Text style={[styles.label, { color: colors.textMuted }]}>FROM</Text>
        <View style={[styles.currencyCard, { backgroundColor: colors.backgroundCard }]}>
          <View>
            <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{from.symbol} {from.code}</Text>
            <Text style={[styles.currencyName, { color: colors.textMuted }]}>{from.name}</Text>
          </View>
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Swap */}
        <TouchableOpacity style={[styles.swapButton, { backgroundColor: colors.backgroundCard }]} onPress={handleSwap}>
          <SwapIcon color={colors.primary} />
        </TouchableOpacity>

        {/* To */}
        <Text style={[styles.label, { color: colors.textMuted }]}>TO</Text>
        <View style={[styles.currencyCard, { backgroundColor: colors.backgroundCard }]}>
          <View>
            <Text style={[styles.currencyCode, { color: colors.textPrimary }]}>{to.symbol} {to.code}</Text>
            <Text style={[styles.currencyName, { color: colors.textMuted }]}>{to.name}</Text>
          </View>
          <Text style={[styles.resultAmount, { color: colors.primary }]}>{converted}</Text>
        </View>

        {/* Rate */}
        <View style={[styles.rateRow, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.rateText, { color: colors.textSecondary }]}>1 {from.code} = {(to.rate / from.rate).toFixed(4)} {to.code}</Text>
        </View>

        {/* Currency Picker */}
        <Text style={[styles.label, { marginTop: 24, color: colors.textMuted }]}>SELECT CURRENCIES</Text>
        <View style={styles.pickerRow}>
          {CURRENCIES.map((c, i) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.currencyPill, { backgroundColor: colors.backgroundCard }, fromIdx === i && { borderColor: colors.primary, backgroundColor: colors.primary + '18' }, toIdx === i && styles.pillActiveTo]}
              onPress={() => {
                if (fromIdx === i) return;
                if (toIdx === i) { setToIdx(fromIdx); setFromIdx(i); }
                else setToIdx(i);
              }}
            >
              <Text style={[
                styles.pillText, { color: colors.textMuted },
                (fromIdx === i || toIdx === i) && { color: colors.textPrimary },
              ]}>{c.code}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.convertButton, { backgroundColor: colors.primary }]} onPress={handleConvert} activeOpacity={0.8}>
          <Text style={styles.convertButtonText}>Convert</Text>
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
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 10 },
  currencyCard: {
    borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  currencyCode: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  currencyName: { fontSize: 13 },
  input: { fontSize: 28, fontWeight: '600', textAlign: 'right', minWidth: 80 },
  resultAmount: { fontSize: 28, fontWeight: '600' },
  swapButton: {
    alignSelf: 'center', width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginVertical: 8,
  },
  rateRow: {
    borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8,
  },
  rateText: { fontSize: 14 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  currencyPill: {
    borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'transparent',
  },
  pillActiveTo: { borderColor: '#10B981', backgroundColor: '#10B98118' },
  pillText: { fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 },
  convertButton: {
    borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  convertButtonText: { fontSize: 17, fontWeight: '600', color: 'white' },
});
