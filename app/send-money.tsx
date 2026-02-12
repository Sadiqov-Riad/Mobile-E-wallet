import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const BackIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const QRIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3H10V10H3V3Z" stroke={color} strokeWidth="2" />
    <Path d="M14 3H21V10H14V3Z" stroke={color} strokeWidth="2" />
    <Path d="M3 14H10V21H3V14Z" stroke={color} strokeWidth="2" />
    <Path d="M14 14H17V17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M21 17V21H14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SearchIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.5" />
    <Path d="M14 14L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const ArrowRightCircle = () => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Circle cx="20" cy="20" r="20" fill="#F59E0B" />
    <Path d="M16 20H24M24 20L20 16M24 20L20 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ContactIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
    <Path d="M4 20C4 16.134 7.582 13 12 13C16.418 13 20 16.134 20 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default function SendMoneyScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const { contacts, balance, sendMoney, currency, toDisplayAmount } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);
  const [amount, setAmount] = useState('');

  const displayBalance = toDisplayAmount(balance);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
  );

  const handleSelectContact = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setShowAmountModal(true);
  };

  const handleSend = () => {
    const amountNum = parseFloat(amount);
    if (!selectedContact || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (amountNum > displayBalance) {
      Alert.alert('Insufficient Funds', `Your balance is ${displayBalance.toFixed(2)} ${currency}`);
      return;
    }
    sendMoney(selectedContact, amountNum);
    setShowAmountModal(false);
    setAmount('');
    setSelectedContact(null);
    Alert.alert('Success', `Sent ${amountNum.toFixed(2)} ${currency} to ${selectedContact.name}`);
  };

  const renderContact = ({ item }: { item: typeof contacts[0] }) => (
    <TouchableOpacity style={styles.contactItem} activeOpacity={0.7} onPress={() => handleSelectContact(item)}>
      <View style={[styles.contactAvatar, { backgroundColor: item.color }]}>
        <Text style={styles.contactInitials}>{item.initials}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.contactSub, { color: colors.textMuted }]}>{item.username || item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <BackIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.qrButton}>
          <QRIcon color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Send Money</Text>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.backgroundCard }]}>
        <SearchIcon color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search by name or ID"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Enter Wallet ID */}
      <TouchableOpacity style={[styles.walletIdRow, { borderBottomColor: colors.border }]} activeOpacity={0.7}>
        <ArrowRightCircle />
        <Text style={[styles.walletIdText, { color: colors.textPrimary }]}>Enter Wallet ID</Text>
      </TouchableOpacity>

      {/* Frequent Contacts */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>FREQUENT CONTACTS</Text>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]} activeOpacity={0.8}>
        <ContactIcon />
      </TouchableOpacity>

      {/* Amount Modal */}
      <Modal visible={showAmountModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Send to {selectedContact?.name}</Text>
            <Text style={[styles.modalBalance, { color: colors.textMuted }]}>Balance: {displayBalance.toFixed(2)} {currency}</Text>

            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary, borderBottomColor: colors.border }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.backgroundElevated }]}
                onPress={() => { setShowAmountModal(false); setAmount(''); }}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  backButton: { padding: 4 },
  qrButton: { padding: 4 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  walletIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  walletIdText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  contactInfo: { flex: 1 },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactSub: {
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalBalance: {
    fontSize: 14,
    marginBottom: 24,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
