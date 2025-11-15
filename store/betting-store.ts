import { create } from 'zustand';
import { Coin } from '@/lib/sideshift';

export interface Bet {
  id: string;
  creator: string;
  creatorAddress: string;
  opponent?: string;
  opponentAddress?: string;
  depositCoin: string;
  depositNetwork: string;
  settleCoin: string;
  settleNetwork: string;
  betAmount: string;
  settleAmount: string;
  betType: 'price' | 'time' | 'custom';
  betCondition: string; // e.g., "BTC price > $50000 in 1 hour"
  status: 'open' | 'matched' | 'active' | 'settled' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  winner?: string;
  shiftId?: string; // SideShift shift ID when settled
  commissionRate?: string;
}

interface BettingState {
  bets: Bet[];
  myBets: Bet[];
  activeBet: Bet | null;
  selectedDepositCoin: Coin | null;
  selectedDepositNetwork: string | null;
  selectedSettleCoin: Coin | null;
  selectedSettleNetwork: string | null;
  betAmount: string;
  betType: 'price' | 'time' | 'custom';
  betCondition: string;
  isLoading: boolean;
  error: string | null;

  setDepositCoin: (coin: Coin, network: string) => void;
  setSettleCoin: (coin: Coin, network: string) => void;
  setBetAmount: (amount: string) => void;
  setBetType: (type: 'price' | 'time' | 'custom') => void;
  setBetCondition: (condition: string) => void;
  createBet: (bet: Bet) => void;
  joinBet: (betId: string, opponentAddress: string) => void;
  updateBet: (betId: string, updates: Partial<Bet>) => void;
  setActiveBet: (bet: Bet | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  bets: [],
  myBets: [],
  activeBet: null,
  selectedDepositCoin: null,
  selectedDepositNetwork: null,
  selectedSettleCoin: null,
  selectedSettleNetwork: null,
  betAmount: '',
  betType: 'price' as const,
  betCondition: '',
  isLoading: false,
  error: null,
};

export const useBettingStore = create<BettingState>((set, get) => ({
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

  setBetAmount: (amount) => set({ betAmount: amount }),

  setBetType: (type) => set({ betType: type }),

  setBetCondition: (condition) => set({ betCondition: condition }),

  createBet: (bet) =>
    set((state) => ({
      bets: [bet, ...state.bets],
      myBets: [bet, ...state.myBets],
    })),

  joinBet: (betId, opponentAddress) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet.id === betId
          ? { ...bet, opponentAddress, status: 'matched' as const }
          : bet
      ),
      myBets: state.myBets.map((bet) =>
        bet.id === betId
          ? { ...bet, opponentAddress, status: 'matched' as const }
          : bet
      ),
    })),

  updateBet: (betId, updates) =>
    set((state) => ({
      bets: state.bets.map((bet) =>
        bet.id === betId ? { ...bet, ...updates } : bet
      ),
      myBets: state.myBets.map((bet) =>
        bet.id === betId ? { ...bet, ...updates } : bet
      ),
      activeBet:
        state.activeBet?.id === betId
          ? { ...state.activeBet, ...updates }
          : state.activeBet,
    })),

  setActiveBet: (bet) => set({ activeBet: bet }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));

