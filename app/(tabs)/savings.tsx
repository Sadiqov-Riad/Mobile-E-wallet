import { useAppColors } from '@/store/theme-store';
import { useWalletStore } from '@/store/wallet-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const VaultIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Rect x="4" y="6" width="20" height="16" rx="3" stroke="#F59E0B" strokeWidth="2" />
    <Circle cx="14" cy="14" r="4" stroke="#F59E0B" strokeWidth="2" />
    <Path d="M14 10V14L16 16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const GoalIcon = ({ size = 28 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="10" stroke="#A855F7" strokeWidth="2" />
    <Circle cx="14" cy="14" r="6" stroke="#A855F7" strokeWidth="1.5" />
    <Circle cx="14" cy="14" r="2" fill="#A855F7" />
  </Svg>
);

const CoinIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" />
    <Path d="M12 7V17M9 9.5H14C14.8 9.5 15.5 10.2 15.5 11C15.5 11.8 14.8 12.5 14 12.5H9H14.5C15.3 12.5 16 13.2 16 14C16 14.8 15.3 15.5 14.5 15.5H9" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const FireIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C8 8 4 11 4 15C4 19.4 7.6 22 12 22C16.4 22 20 19.4 20 15C20 11 16 8 12 2Z" stroke="#EF4444" strokeWidth="2" fill="none" />
    <Path d="M12 12C10 14 9 15.5 9 17C9 18.7 10.3 20 12 20C13.7 20 15 18.7 15 17C15 15.5 14 14 12 12Z" fill="#EF4444" opacity="0.3" />
  </Svg>
);

const StarIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L14.09 8.26L20.18 8.63L15.54 12.74L17.09 18.97L12 15.77L6.91 18.97L8.46 12.74L3.82 8.63L9.91 8.26L12 2Z" fill="#F59E0B" opacity="0.8" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7V12C3 17.5 7 22 12 23C17 22 21 17.5 21 12V7L12 2Z" stroke="#10B981" strokeWidth="2" fill="#10B981" fillOpacity={0.15} />
    <Path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChartUpIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M3 15L8 10L11 13L17 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function SavingsScreen() {
  const colors = useAppColors();
  const { totalSavings, savingsGoals, vaults, balance, currency, toDisplayAmount, createSavingsGoal, topUpGoal, createVault } = useWalletStore();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [vaultName, setVaultName] = useState('');
  const [vaultAmount, setVaultAmount] = useState('');
  const [vaultTerm, setVaultTerm] = useState('6');

  const displayBalance = toDisplayAmount(balance);
  const displayTotalSavings = toDisplayAmount(totalSavings);

  const handleCreateGoal = () => {
    const target = parseFloat(goalTarget);
    if (!goalName.trim() || isNaN(target) || target <= 0) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }
    createSavingsGoal({ name: goalName.trim(), targetAmount: target, icon: 'target' });
    setShowGoalModal(false);
    setGoalName('');
    setGoalTarget('');
  };

  const handleCreateVault = () => {
    const amt = parseFloat(vaultAmount);
    const term = parseInt(vaultTerm);
    if (!vaultName.trim() || isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }
    if (amt > displayBalance) {
      Alert.alert('Insufficient Funds', `Your balance is ${displayBalance.toFixed(2)} ${currency}`);
      return;
    }
    const rate = term >= 12 ? 11.7 : term >= 6 ? 9.5 : 7.0;
    createVault({ name: vaultName.trim(), amount: amt, interestRate: rate, termMonths: term });
    setShowVaultModal(false);
    setVaultName('');
    setVaultAmount('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceRow}>
            <Text style={[styles.balanceWhole, { color: colors.textPrimary }]}>{Math.floor(displayTotalSavings)}</Text>
            <Text style={[styles.balanceDecimal, { color: colors.textPrimary }]}>.{(displayTotalSavings % 1).toFixed(2).slice(2)}</Text>
            <View style={{ marginLeft: 6, marginBottom: 8 }}>
              <ChartUpIcon color={colors.primary} />
            </View>
          </View>
          <Text style={[styles.balanceLabel, { color: colors.textMuted }]}>Total savings</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setShowVaultModal(true)}>
            <View style={[styles.actionIconBox, { backgroundColor: colors.backgroundCard }]}>
              <VaultIcon />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Open{'\n'}Vault</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={() => setShowGoalModal(true)}>
            <View style={[styles.actionIconBox, { backgroundColor: colors.backgroundCard }]}>
              <GoalIcon />
            </View>
            <Text style={[styles.actionBtnText, { color: colors.textSecondary }]}>Create{'\n'}Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Savings Goals List */}
        {savingsGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Goals</Text>
            {savingsGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, { backgroundColor: colors.backgroundCard }]}
                activeOpacity={0.7}
                onPress={() => {
                  Alert.alert('Goal', `${goal.name}: ${toDisplayAmount(goal.currentAmount).toFixed(2)} / ${toDisplayAmount(goal.targetAmount).toFixed(2)} ${currency}`);
                }}
              >
                <View style={[styles.goalIcon, { backgroundColor: colors.backgroundElevated }]}>
                  <GoalIcon />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: colors.textPrimary }]}>{goal.name}</Text>
                  <View style={[styles.progressBar, { backgroundColor: colors.backgroundElevated }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.goalProgress, { color: colors.textMuted }]}>
                    {toDisplayAmount(goal.currentAmount).toFixed(2)} / {toDisplayAmount(goal.targetAmount).toFixed(2)} {currency}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Vaults List */}
        {vaults.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Vaults</Text>
            {vaults.map((vault) => (
              <View key={vault.id} style={[styles.vaultCard, { backgroundColor: colors.backgroundCard }]}>
                <View style={styles.vaultHeader}>
                  <VaultIcon size={20} />
                  <Text style={[styles.vaultName, { color: colors.textPrimary }]}>{vault.name}</Text>
                </View>
                <Text style={[styles.vaultAmount, { color: colors.textPrimary }]}>{toDisplayAmount(vault.amount).toFixed(2)} {currency}</Text>
                <Text style={[styles.vaultRate, { color: colors.textMuted }]}>{vault.interestRate}% p.a. · {vault.termMonths} months</Text>
              </View>
            ))}
          </View>
        )}

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.backgroundCard }]}>
          <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Savings & Goals</Text>

          <View style={styles.infoRow}>
            <CoinIcon />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Open a savings goal with any amount, top up or withdraw whenever you want.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <FireIcon />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Vaults are for a fixed term. No withdrawals allowed, but interest rates are significantly higher.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <StarIcon />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Earn up to <Text style={[styles.infoHighlight, { color: colors.primary }]}>11.7% p.a.</Text> on Vaults! Goals earn 6%, or 7% if you have a Prime status.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <ShieldIcon />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your funds are fully protected by the National Deposit Insurance Fund.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={showGoalModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create Savings Goal</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.backgroundElevated, color: colors.textPrimary }]}
              placeholder="Goal name"
              placeholderTextColor={colors.textMuted}
              value={goalName}
              onChangeText={setGoalName}
            />
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.backgroundElevated, color: colors.textPrimary }]}
              placeholder="Target amount"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={goalTarget}
              onChangeText={setGoalTarget}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.backgroundElevated }]} onPress={() => setShowGoalModal(false)}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]} onPress={handleCreateGoal}>
                <Text style={styles.createBtnText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Create Vault Modal */}
      <Modal visible={showVaultModal} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundCard }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Open Vault</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.backgroundElevated, color: colors.textPrimary }]}
              placeholder="Vault name"
              placeholderTextColor={colors.textMuted}
              value={vaultName}
              onChangeText={setVaultName}
            />
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.backgroundElevated, color: colors.textPrimary }]}
              placeholder="Amount to lock"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={vaultAmount}
              onChangeText={setVaultAmount}
            />
            <Text style={[styles.termLabel, { color: colors.textSecondary }]}>Term (months)</Text>
            <View style={styles.termOptions}>
              {['3', '6', '12', '24'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.termOption, { backgroundColor: vaultTerm === t ? colors.primary : colors.backgroundElevated }]}
                  onPress={() => setVaultTerm(t)}
                >
                  <Text style={[styles.termOptionText, { color: colors.textSecondary }, vaultTerm === t && styles.termOptionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.backgroundElevated }]} onPress={() => setShowVaultModal(false)}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.createBtn, { backgroundColor: colors.primary }]} onPress={handleCreateVault}>
                <Text style={styles.createBtnText}>Open Vault</Text>
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
  },
  scrollContent: {
    paddingBottom: 120,
  },
  balanceSection: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 24,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  balanceWhole: {
    fontSize: 56,
    fontWeight: '300',
  },
  balanceDecimal: {
    fontSize: 32,
    fontWeight: '300',
  },
  balanceLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 32,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
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
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  goalInfo: { flex: 1 },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  goalProgress: {
    fontSize: 12,
  },
  vaultCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  vaultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vaultName: {
    fontSize: 16,
    fontWeight: '600',
  },
  vaultAmount: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  vaultRate: {
    fontSize: 13,
  },
  infoCard: {
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 24,
    gap: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: '600',
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
    marginBottom: 20,
  },
  modalInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  termLabel: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 4,
  },
  termOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  termOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  termOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  termOptionTextActive: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
