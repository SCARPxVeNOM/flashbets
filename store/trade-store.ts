import { create } from 'zustand';
import { Shift, Coin } from '@/lib/sideshift';

interface TradeState {
  selectedDepositCoin: Coin | null;
  selectedDepositNetwork: string | null;
  selectedSettleCoin: Coin | null;
  selectedSettleNetwork: string | null;
  depositAmount: string;
  settleAmount: string;
  currentShift: Shift | null;
  shifts: Shift[];
  coins: Coin[];
  isLoading: boolean;
  error: string | null;

  setDepositCoin: (coin: Coin, network: string) => void;
  setSettleCoin: (coin: Coin, network: string) => void;
  setDepositAmount: (amount: string) => void;
  setSettleAmount: (amount: string) => void;
  setCurrentShift: (shift: Shift | null) => void;
  addShift: (shift: Shift) => void;
  setCoins: (coins: Coin[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  selectedDepositCoin: null,
  selectedDepositNetwork: null,
  selectedSettleCoin: null,
  selectedSettleNetwork: null,
  depositAmount: '',
  settleAmount: '',
  currentShift: null,
  shifts: [],
  coins: [],
  isLoading: false,
  error: null,
};

export const useTradeStore = create<TradeState>((set) => ({
  ...initialState,

  setDepositCoin: (coin, network) =>
    set({
      selectedDepositCoin: coin,
      selectedDepositNetwork: network,
    }),

  setSettleCoin: (coin, network) =>
    set({
      selectedSettleCoin: coin,
      selectedSettleNetwork: network,
    }),

  setDepositAmount: (amount) => set({ depositAmount: amount }),

  setSettleAmount: (amount) => set({ settleAmount: amount }),

  setCurrentShift: (shift) => set({ currentShift: shift }),

  addShift: (shift) =>
    set((state) => ({
      shifts: [shift, ...state.shifts],
    })),

  setCoins: (coins) => set({ coins }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

