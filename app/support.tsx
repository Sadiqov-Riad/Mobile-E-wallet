import { useAppColors } from '@/store/theme-store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Linking,
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

const ChevronRight = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M7 4L13 10L7 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChatIcon = ({ color = '#10B981' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const EmailIcon = ({ color = '#3B82F6' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M22 6L12 13L2 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = ({ color = '#F59E0B' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const QuestionIcon = ({ color = '#A855F7' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="18" r="1" fill={color} />
  </Svg>
);

type SupportItem = { id: string; label: string; subtitle: string; color: string; Icon: any; onPress: () => void };

export default function SupportScreen() {
  const router = useRouter();
  const colors = useAppColors();

  const items: SupportItem[] = [
    {
      id: 'chat', label: 'Live Chat', subtitle: 'Chat with our support team',
      color: '#10B981', Icon: ChatIcon,
      onPress: () => Alert.alert('Live Chat', 'Live chat will be available soon.'),
    },
    {
      id: 'email', label: 'Email Support', subtitle: 'support@e-wallet.com',
      color: '#3B82F6', Icon: EmailIcon,
      onPress: () => Linking.openURL('mailto:support@e-wallet.com'),
    },
    {
      id: 'phone', label: 'Phone Support', subtitle: '+994 12 345 67 89',
      color: '#F59E0B', Icon: PhoneIcon,
      onPress: () => Linking.openURL('tel:+994123456789'),
    },
    {
      id: 'faq', label: 'FAQ', subtitle: 'Frequently asked questions',
      color: '#A855F7', Icon: QuestionIcon,
      onPress: () => Alert.alert('FAQ', 'FAQ section coming soon.'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><BackIcon color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Support</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>How can we help?</Text>
        <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>Choose a support channel below</Text>

        {items.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: colors.backgroundCard }]} onPress={item.onPress} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
                <item.Icon color={item.color} />
              </View>
              <View>
                <Text style={[styles.cardLabel, { color: colors.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
              </View>
            </View>
            <ChevronRight color={colors.textMuted} />
          </TouchableOpacity>
        ))}
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
  heroTitle: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  heroSubtitle: { fontSize: 15, marginBottom: 32 },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 16, padding: 18, marginBottom: 12,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { fontSize: 16, fontWeight: '600', marginBottom: 3 },
  cardSubtitle: { fontSize: 13 },
});
