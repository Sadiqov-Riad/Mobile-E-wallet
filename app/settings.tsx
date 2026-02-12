import { useAppColors, useThemeStore, ThemeMode } from '@/store/theme-store';
import { useUserStore } from '@/store/user-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
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

const CheckIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M4 10L8 14L16 6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CurrencyIcon = ({ color = '#6366F1' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V17M9 10H15M9 14H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SunIcon = ({ color = '#F59E0B' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MoonIcon = ({ color = '#8B5CF6' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CURRENCIES = ['AZN', 'USD', 'EUR', 'GBP', 'TRY', 'RUB'];
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'az', label: 'Azerbaijani' },
  { code: 'ru', label: 'Russian' },
  { code: 'tr', label: 'Turkish' },
];

const THEMES: { code: ThemeMode; label: string }[] = [
  { code: 'light', label: 'Light' },
  { code: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, setProfile } = useUserStore();
  const { mode: themeMode, setTheme } = useThemeStore();
  const colors = useAppColors();
  const [showCurrency, setShowCurrency] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showTheme, setShowTheme] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><BackIcon color={colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PREFERENCES</Text>

        {/* Currency */}
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={() => setShowCurrency(true)} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#6366F118' }]}><CurrencyIcon /></View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Currency</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>{profile.currency}</Text>
            <ChevronRight color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Theme */}
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={() => setShowTheme(true)} activeOpacity={0.7}>
          <View style={styles.settingLeft}>
            <View style={[styles.iconBox, { backgroundColor: themeMode === 'dark' ? '#8B5CF618' : '#F59E0B18' }]}>
              {themeMode === 'dark' ? <MoonIcon /> : <SunIcon />}
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Theme</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>{themeMode === 'dark' ? 'Dark' : 'Light'}</Text>
            <ChevronRight color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Currency Modal */}
      <Modal visible={showCurrency} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrency(false)}><CloseIcon color={colors.textPrimary} /></TouchableOpacity>
            </View>
            {CURRENCIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.optionRow, { borderBottomColor: colors.border }]} onPress={() => { setProfile({ currency: c }); setShowCurrency(false); }}>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>{c}</Text>
                {profile.currency === c && <CheckIcon color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLanguage} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Language</Text>
              <TouchableOpacity onPress={() => setShowLanguage(false)}><CloseIcon color={colors.textPrimary} /></TouchableOpacity>
            </View>
            {LANGUAGES.map((l) => (
              <TouchableOpacity key={l.code} style={[styles.optionRow, { borderBottomColor: colors.border }]} onPress={() => { setProfile({ language: l.code }); setShowLanguage(false); }}>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>{l.label}</Text>
                {profile.language === l.code && <CheckIcon color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Theme Modal */}
      <Modal visible={showTheme} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Theme</Text>
              <TouchableOpacity onPress={() => setShowTheme(false)}><CloseIcon color={colors.textPrimary} /></TouchableOpacity>
            </View>
            {THEMES.map((t) => (
              <TouchableOpacity key={t.code} style={[styles.optionRow, { borderBottomColor: colors.border }]} onPress={() => { setTheme(t.code); setShowTheme(false); }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  {t.code === 'light' ? <SunIcon color="#F59E0B" /> : <MoonIcon color="#8B5CF6" />}
                  <Text style={[styles.optionText, { color: colors.textPrimary }]}>{t.label}</Text>
                </View>
                {themeMode === t.code && <CheckIcon color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  sectionLabel: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 14,
  },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  optionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1,
  },
  optionText: { fontSize: 16 },
});
