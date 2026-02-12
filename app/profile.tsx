import { useAppColors } from '@/store/theme-store';
import { useUserStore } from '@/store/user-store';
import { useWalletStore } from '@/store/wallet-store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

//Icons

const BackIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M7 3L5.5 5H3C2.45 5 2 5.45 2 6V16C2 16.55 2.45 17 3 17H17C17.55 17 18 16.55 18 16V6C18 5.45 17.55 5 17 5H14.5L13 3H7Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    <Circle cx="10" cy="10.5" r="3" stroke="white" strokeWidth="1.5" />
  </Svg>
);

const ChevronRight = ({ color = '#9CA3AF' }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M7 4L13 10L7 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VerifiedBadge = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Circle cx="9" cy="9" r="9" fill="#10B981" />
    <Path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PersonIcon = ({ color = '#3B82F6' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <Path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CurrencyIcon = ({ color = '#6366F1' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V17M9 10H15M9 14H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const LanguageIcon = ({ color = '#3B82F6' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M2 12H22M12 2C14.5 4.7 16 8.2 16 12C16 15.8 14.5 19.3 12 22C9.5 19.3 8 15.8 8 12C8 8.2 9.5 4.7 12 2Z" stroke={color} strokeWidth="2" />
  </Svg>
);

const HelpIcon = ({ color = '#F59E0B' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.66 13.66 12 12 12V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="18" r="1" fill={color} />
  </Svg>
);

const InfoIcon = ({ color = '#9CA3AF' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const LogoutIcon = ({ color = '#EF4444' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17L21 12L16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CloseIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

//Icon resource

const ICON_MAP: Record<string, (props: { color: string }) => React.JSX.Element> = {
  personal: PersonIcon,
  currency: CurrencyIcon,
  language: LanguageIcon,
  help: HelpIcon,
  about: InfoIcon,
  logout: LogoutIcon,
};

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, setProfile, setAvatar, logout } = useUserStore();
  const { balance, currency, toDisplayAmount } = useWalletStore();
  const displayBalance = toDisplayAmount(balance);
  const colors = useAppColors();

  const [editModal, setEditModal] = useState(false);
  const [editField, setEditField] = useState<'name' | 'email' | 'phone' | 'username'>('name');
  const [editValue, setEditValue] = useState('');

  //Image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permission.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) setAvatar(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permission.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) setAvatar(result.assets[0].uri);
  };

  const handleAvatarPress = () => {
    Alert.alert('Profile Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      ...(profile.avatar ? [{ text: 'Remove Photo', onPress: () => setAvatar(null), style: 'destructive' as const }] : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  };

  //Edit personal info
  const openEdit = (field: typeof editField) => {
    setEditField(field);
    setEditValue(profile[field]);
    setEditModal(true);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (!trimmed) { Alert.alert('Error', 'Field cannot be empty'); return; }
    setProfile({ [editField]: trimmed });
    setEditModal(false);
  };

  const fieldLabels: Record<string, string> = {
    name: 'Full Name', email: 'Email', phone: 'Phone', username: 'Username',
  };

  //Logout 
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  //Settings data
  type SettingItem = {
    id: string; label: string; value?: string;
    type: 'navigate' | 'action'; color: string; danger?: boolean;
  };

  const settingsGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: 'PERSONAL INFO',
      items: [
        { id: 'personal', label: 'Full Name', value: profile.name, type: 'navigate', color: '#3B82F6' },
        { id: 'personal', label: 'Email', value: profile.email, type: 'navigate', color: '#3B82F6' },
        { id: 'personal', label: 'Phone', value: profile.phone, type: 'navigate', color: '#3B82F6' },
        { id: 'personal', label: 'Username', value: profile.username, type: 'navigate', color: '#3B82F6' },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'help', label: 'Help Center', type: 'navigate', color: '#F59E0B' },
        { id: 'about', label: 'About', type: 'navigate', color: '#9CA3AF' },
        { id: 'logout', label: 'Log Out', type: 'action', color: '#EF4444', danger: true },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <BackIcon color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarInitials}>
                  {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Text>
              </View>
            )}
            <View style={[styles.cameraButton, { backgroundColor: colors.backgroundCard, borderColor: colors.background }]}>
              <CameraIcon />
            </View>
          </TouchableOpacity>

          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{profile.name}</Text>
            {profile.isVerified && <VerifiedBadge />}
          </View>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>{profile.email}</Text>
          <Text style={[styles.userPhone, { color: colors.textMuted }]}>{profile.phone}</Text>
        </View>

        {/* Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.balanceRow}>
            <View>
              <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>{displayBalance.toFixed(2)} {currency}</Text>
            </View>
            <View style={[styles.memberBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.memberText, { color: colors.primary }]}>Premium</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        {settingsGroups.map((group) => (
          <View key={group.title} style={styles.settingsGroup}>
            <Text style={[styles.groupTitle, { color: colors.textMuted }]}>{group.title}</Text>
            {group.items.map((item, idx) => {
              const Icon = ICON_MAP[item.id];
              const fieldMap: Record<string, typeof editField> = {
                'Full Name': 'name', 'Email': 'email', 'Phone': 'phone', 'Username': 'username',
              };

              return (
                <TouchableOpacity
                  key={`${item.id}-${idx}`}
                  style={[styles.settingItem, { borderBottomColor: colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.id === 'logout') handleLogout();
                    else if (group.title === 'PERSONAL INFO' && fieldMap[item.label]) openEdit(fieldMap[item.label]);
                  }}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIconBox, { backgroundColor: item.color + '18' }]}>
                      {Icon ? <Icon color={item.color} /> : null}
                    </View>
                    <Text style={[styles.settingLabel, { color: colors.textPrimary }, item.danger && styles.dangerText]}>
                      {item.label}
                    </Text>
                  </View>

                  <View style={styles.settingRight}>
                    {item.value && <Text style={[styles.settingValue, { color: colors.textMuted }]} numberOfLines={1}>{item.value}</Text>}
                    <ChevronRight color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <Text style={[styles.version, { color: colors.textMuted }]}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit {fieldLabels[editField]}</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <CloseIcon color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={fieldLabels[editField]}
              placeholderTextColor={colors.textMuted}
              autoFocus
              keyboardType={editField === 'email' ? 'email-address' : editField === 'phone' ? 'phone-pad' : 'default'}
              autoCapitalize={editField === 'name' ? 'words' : 'none'}
            />

            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={saveEdit} activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, marginBottom: 24,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { fontSize: 36, fontWeight: '700', color: 'white' },
  cameraButton: {
    position: 'absolute', bottom: 0, right: 0, width: 34, height: 34, borderRadius: 17,
    borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName: { fontSize: 22, fontWeight: '700' },
  userEmail: { fontSize: 14, marginBottom: 2 },
  userPhone: { fontSize: 14 },
  balanceCard: {
    borderRadius: 20, padding: 20,
    marginHorizontal: 20, marginBottom: 28,
  },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 13, marginBottom: 6 },
  balanceAmount: { fontSize: 28, fontWeight: '700' },
  memberBadge: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  memberText: { fontSize: 12, fontWeight: '700' },
  settingsGroup: { marginBottom: 24, paddingHorizontal: 20 },
  groupTitle: {
    fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  dangerText: { color: '#EF4444' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 180 },
  settingValue: { fontSize: 14 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalInput: {
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16,
    fontSize: 16, borderWidth: 1, marginBottom: 20,
  },
  saveButton: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
