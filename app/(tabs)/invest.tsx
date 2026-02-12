import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TrendUpIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M3 15L8 10L11 13L17 5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13 5H17V9" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrendDownIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M3 5L8 10L11 7L17 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13 15H17V11" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type Stock = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
};

const STOCKS: Stock[] = [
  { id: '1', name: 'Apple Inc.', symbol: 'AAPL', price: 178.72, change: 2.34, changePercent: 1.33, color: '#9CA3AF' },
  { id: '2', name: 'Tesla Inc.', symbol: 'TSLA', price: 248.50, change: -5.12, changePercent: -2.02, color: '#EF4444' },
  { id: '3', name: 'Microsoft', symbol: 'MSFT', price: 415.20, change: 3.50, changePercent: 0.85, color: '#3B82F6' },
  { id: '4', name: 'Amazon', symbol: 'AMZN', price: 185.60, change: 1.22, changePercent: 0.66, color: '#F59E0B' },
  { id: '5', name: 'Nvidia', symbol: 'NVDA', price: 875.30, change: 12.40, changePercent: 1.44, color: '#10B981' },
  { id: '6', name: 'Google', symbol: 'GOOG', price: 153.85, change: -0.95, changePercent: -0.61, color: '#6366F1' },
];

const CRYPTO: Stock[] = [
  { id: 'c1', name: 'Bitcoin', symbol: 'BTC', price: 67250.40, change: 1250.20, changePercent: 1.89, color: '#F59E0B' },
  { id: 'c2', name: 'Ethereum', symbol: 'ETH', price: 3520.80, change: -45.30, changePercent: -1.27, color: '#6366F1' },
  { id: 'c3', name: 'Solana', symbol: 'SOL', price: 142.35, change: 8.50, changePercent: 6.35, color: '#10B981' },
];

export default function InvestScreen() {
  const colors = useAppColors();
  const { balance, currency, toDisplayAmount } = useWalletStore();
  const displayBalance = toDisplayAmount(balance);

  const renderStockItem = (stock: Stock) => {
    const isPositive = stock.change >= 0;
    return (
      <TouchableOpacity key={stock.id} style={[styles.stockItem, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
        <View style={[styles.stockIcon, { backgroundColor: stock.color + '20' }]}>
          <Text style={[styles.stockSymbolIcon, { color: stock.color }]}>{stock.symbol[0]}</Text>
        </View>
        <View style={styles.stockInfo}>
          <Text style={[styles.stockName, { color: colors.textPrimary }]}>{stock.name}</Text>
          <Text style={[styles.stockSymbol, { color: colors.textMuted }]}>{stock.symbol}</Text>
        </View>
        <View style={styles.stockPriceSection}>
          <Text style={[styles.stockPrice, { color: colors.textPrimary }]}>${stock.price.toLocaleString()}</Text>
          <View style={styles.changeRow}>
            {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
            <Text style={[styles.changeText, { color: isPositive ? '#10B981' : '#EF4444' }]}>
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Invest</Text>
          <Text style={[styles.balanceText, { color: colors.textMuted }]}>Available: {displayBalance.toFixed(2)} {currency}</Text>
        </View>

        {/* Portfolio Card */}
        <View style={[styles.portfolioCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.portfolioLabel, { color: colors.textMuted }]}>Portfolio Value</Text>
          <Text style={[styles.portfolioAmount, { color: colors.textPrimary }]}>$0.00</Text>
          <View style={styles.portfolioChangeRow}>
            <Text style={styles.portfolioChange}>+$0.00 (0.00%)</Text>
            <Text style={[styles.portfolioTime, { color: colors.textMuted }]}>All time</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: colors.backgroundCard }]} activeOpacity={0.7}>
            <View style={[styles.quickIcon, { backgroundColor: '#10B98120' }]}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path d="M10 4V16M4 10H16" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: colors.backgroundCard }]} activeOpacity={0.7}>
            <View style={[styles.quickIcon, { backgroundColor: '#EF444420' }]}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path d="M4 10H16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: colors.backgroundCard }]} activeOpacity={0.7}>
            <View style={[styles.quickIcon, { backgroundColor: '#3B82F620' }]}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path d="M4 15L8 10L11 13L16 5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Stocks */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Popular Stocks</Text>
          {STOCKS.map(renderStockItem)}
        </View>

        {/* Crypto */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Cryptocurrency</Text>
          {CRYPTO.map(renderStockItem)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 14,
  },
  portfolioCard: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  portfolioLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  portfolioAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  portfolioChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portfolioChange: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  portfolioTime: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginHorizontal: 20,
    marginBottom: 28,
  },
  quickBtn: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  stockIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stockSymbolIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  stockSymbol: {
    fontSize: 13,
  },
  stockPriceSection: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
