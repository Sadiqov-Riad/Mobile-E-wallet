import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Card = {
  id: string;
  number: string;
  expiry: string;
  type: 'visa' | 'mastercard' | 'maestro';
  isDefault?: boolean;
  holderName: string;
};

export type Transaction = {
  id: string;
  name: string;
  category: string;
  amount: number;
  type: 'declined' | 'payment' | 'received' | 'transfer' | 'deposit';
  date: 'today' | 'yesterday' | 'older';
  icon?: 'libraff' | 'metro' | 'avatar' | 'user';
  avatar?: string;
  createdAt: string;
};

export type Contact = {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  avatar?: string;
  initials: string;
  color: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  createdAt: string;
};

export type Vault = {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  createdAt: string;
};

type WalletState = {
  balance: number;
  // Stored amounts are in base currency (AZN). UI can display in another currency.
  currency: string; // symbol for current UI currency
  currencyCode: string; // code for current UI currency (e.g. AZN, USD, EUR)
  cards: Card[];
  transactions: Transaction[];
  contacts: Contact[];
  savingsGoals: SavingsGoal[];
  vaults: Vault[];
  totalSavings: number;

  // Actions
  setBalance: (balance: number) => void;
  setCurrency: (currencyCode: string) => void;
  toDisplayAmount: (amountBase: number) => number;
  toBaseAmount: (amountDisplay: number) => number;
  addTransaction: (tx: Transaction) => void;
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  sendMoney: (to: Contact, amount: number) => void;
  addFunds: (amount: number, method: string) => void;
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount'>) => void;
  topUpGoal: (goalId: string, amount: number) => void;
  withdrawFromGoal: (goalId: string, amount: number) => void;
  createVault: (vault: Omit<Vault, 'id' | 'createdAt'>) => void;
};

const CURRENCY_SYMBOL_BY_CODE: Record<string, string> = {
  AZN: '₼',
  USD: '$',
  EUR: '€',
  GBP: '£',
  TRY: '₺',
  RUB: '₽',
};

// Fixed FX rates (approx). These are AZN per 1 unit of currency.
// Example: 1 USD ≈ 1.70 AZN, so to convert AZN->USD: amountAZN / 1.70
const FX_AZN_PER_UNIT: Record<string, number> = {
  AZN: 1,
  USD: 1.7,
  EUR: 1.85,
  GBP: 2.15,
  TRY: 0.055,
  RUB: 0.018,
};

const resolveCurrencySymbol = (currencyCode: string) => {
  const normalized = (currencyCode ?? '').trim().toUpperCase();
  return CURRENCY_SYMBOL_BY_CODE[normalized] ?? normalized;
};

const normalizeCurrencyCode = (currencyCode: string) => (currencyCode ?? '').trim().toUpperCase();

const resolveFxRate = (currencyCode: string) => {
  const code = normalizeCurrencyCode(currencyCode);
  return FX_AZN_PER_UNIT[code] ?? 1;
};

const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'Alex Rivera', username: '@arivera88', initials: 'AR', color: '#6366F1' },
  { id: '2', name: 'Sarah Miller', phone: '+1 202 555 0124', initials: 'SM', color: '#A855F7' },
  { id: '3', name: 'Jordan Vance', username: '@jvance_pay', initials: 'JV', color: '#EC4899' },
  { id: '4', name: 'Bank of Kapital', phone: '+4357, Main Account', initials: 'BK', color: '#3B82F6' },
  { id: '5', name: 'David Chen', username: '@d_chen.global', initials: 'DC', color: '#10B981' },
  { id: '6', name: 'Abulfet M.', phone: '+380 67 332 85 44', initials: 'AM', color: '#F59E0B' },
];

const DEMO_TRANSACTIONS: Transaction[] = [];

const DEMO_CARDS: Card[] = [
  {
    id: 'c1', number: '•••• •••• •••• 4357', expiry: '12/27',
    type: 'visa', isDefault: true, holderName: 'RIAD ALIYEV',
  },
  {
    id: 'c2', number: '•••• •••• •••• 8821', expiry: '03/28',
    type: 'mastercard', isDefault: false, holderName: 'RIAD ALIYEV',
  },
];

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 4832.50,
      currency: '₼',
      currencyCode: 'AZN',
      cards: DEMO_CARDS,
      transactions: DEMO_TRANSACTIONS,
      contacts: DEMO_CONTACTS,
      savingsGoals: [],
      vaults: [],
      totalSavings: 0,

      setBalance: (balance) => set({ balance }),

      setCurrency: (currencyCode) => {
        const code = normalizeCurrencyCode(currencyCode) || 'AZN';
        set({ currencyCode: code, currency: resolveCurrencySymbol(code) });
      },

      toDisplayAmount: (amountBase) => {
        const state = get();
        const rate = resolveFxRate(state.currencyCode);
        return amountBase / rate;
      },

      toBaseAmount: (amountDisplay) => {
        const state = get();
        const rate = resolveFxRate(state.currencyCode);
        return amountDisplay * rate;
      },

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      addCard: (card) =>
        set((state) => ({ cards: [...state.cards, card] })),

      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),

      sendMoney: (to, amount) => {
        const state = get();
        const amountBase = state.toBaseAmount(amount);
        if (amountBase > state.balance) return;

        const tx: Transaction = {
          id: `tx_${Date.now()}`,
          name: to.name,
          category: 'Transfer',
          amount: -amountBase,
          type: 'transfer',
          date: 'today',
          icon: 'user',
          createdAt: new Date().toISOString(),
        };

        set({
          balance: state.balance - amountBase,
          transactions: [tx, ...state.transactions],
        });
      },

      addFunds: (amount, method) => {
        const state = get();
        const amountBase = state.toBaseAmount(amount);
        const tx: Transaction = {
          id: `tx_${Date.now()}`,
          name: `Top Up via ${method}`,
          category: 'Deposit',
          amount: amountBase,
          type: 'deposit',
          date: 'today',
          icon: 'user',
          createdAt: new Date().toISOString(),
        };
        set({
          balance: state.balance + amountBase,
          transactions: [tx, ...state.transactions],
        });
      },

      createSavingsGoal: (goal) =>
        set((state) => ({
          savingsGoals: [
            ...state.savingsGoals,
            {
              ...goal,
              targetAmount: state.toBaseAmount(goal.targetAmount),
              id: `sg_${Date.now()}`,
              createdAt: new Date().toISOString(),
              currentAmount: 0,
            },
          ],
        })),

      topUpGoal: (goalId, amount) => {
        const state = get();
        const amountBase = state.toBaseAmount(amount);
        if (amountBase > state.balance) return;

        set({
          balance: state.balance - amountBase,
          totalSavings: state.totalSavings + amountBase,
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === goalId ? { ...g, currentAmount: g.currentAmount + amountBase } : g
          ),
        });
      },

      withdrawFromGoal: (goalId, amount) => {
        const state = get();
        const goal = state.savingsGoals.find((g) => g.id === goalId);
        const amountBase = state.toBaseAmount(amount);
        if (!goal || amountBase > goal.currentAmount) return;

        set({
          balance: state.balance + amountBase,
          totalSavings: state.totalSavings - amountBase,
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === goalId ? { ...g, currentAmount: g.currentAmount - amountBase } : g
          ),
        });
      },

      createVault: (vault) =>
        set((state) => ({
          balance: state.balance - state.toBaseAmount(vault.amount),
          totalSavings: state.totalSavings + state.toBaseAmount(vault.amount),
          vaults: [
            ...state.vaults,
            {
              ...vault,
              amount: state.toBaseAmount(vault.amount),
              id: `v_${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
