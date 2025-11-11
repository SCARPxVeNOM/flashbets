import { create } from 'zustand';
import { Shift, Coin } from '@/lib/sideshift';
import { PriceData } from '@/lib/price-tracker';

interface DemoState {
  isDemoMode: boolean;
  demoStep: number;
  demoShifts: Shift[];
  demoPrices: Map<string, PriceData>;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  addDemoShift: (shift: Shift) => void;
  updateDemoShift: (shiftId: string, updates: Partial<Shift>) => void;
  addDemoPrice: (pairKey: string, priceData: PriceData) => void;
}

// Demo data
const createDemoShift = (status: string, step: number): Shift => {
  const baseShift: Shift = {
    id: `demo-shift-${Date.now()}`,
    createdAt: new Date(Date.now() - (4 - step) * 60000).toISOString(),
    depositCoin: 'POL',
    settleCoin: 'USDC',
    depositNetwork: 'polygon',
    settleNetwork: 'ethereum',
    depositAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    settleAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    depositMin: '10',
    depositMax: '10000',
    type: 'variable',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status,
    depositAmount: '100',
    settleAmount: status === 'settled' ? '85.5' : undefined,
    rate: '0.855',
    depositHash: status !== 'waiting' ? '0x1234567890abcdef1234567890abcdef12345678' : undefined,
    settleHash: status === 'settled' ? '0xabcdef1234567890abcdef1234567890abcdef12' : undefined,
  };
  return baseShift;
};

export const useDemoStore = create<DemoState>((set, get) => {
  const runDemoFlow = () => {
    // Step 1: Add demo price (0.5s delay)
    setTimeout(() => {
      const { addDemoPrice } = get();
      addDemoPrice('POL-polygon/USDC-ethereum', {
        pair: 'POL-polygon/USDC-ethereum',
        rate: '1 POL = 0.855 USDC',
        min: '10 POL',
        max: '10000 POL',
        timestamp: Date.now(),
      });
      get().nextStep();
    }, 500);

    // Step 2: Create shift (1.5s delay)
    setTimeout(() => {
      const { addDemoShift } = get();
      const shift = createDemoShift('waiting', 0);
      addDemoShift(shift);
      get().nextStep();
    }, 1500);

    // Step 3: Shift to pending (3s delay)
    setTimeout(() => {
      const { updateDemoShift, demoShifts } = get();
      if (demoShifts.length > 0) {
        updateDemoShift(demoShifts[0].id, {
          status: 'pending',
          depositHash: '0x1234567890abcdef1234567890abcdef12345678',
        });
        get().nextStep();
      }
    }, 3000);

    // Step 4: Shift to processing (5s delay)
    setTimeout(() => {
      const { updateDemoShift, demoShifts } = get();
      if (demoShifts.length > 0) {
        updateDemoShift(demoShifts[0].id, {
          status: 'processing',
        });
        get().nextStep();
      }
    }, 5000);

    // Step 5: Shift to settled (7s delay)
    setTimeout(() => {
      const { updateDemoShift, demoShifts } = get();
      if (demoShifts.length > 0) {
        updateDemoShift(demoShifts[0].id, {
          status: 'settled',
          settleAmount: '85.5',
          settleHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        });
        get().nextStep();
      }
    }, 7000);

    // Step 6: Add second shift (9s delay)
    setTimeout(() => {
      const { addDemoShift } = get();
      const shift2 = createDemoShift('waiting', 1);
      addDemoShift(shift2);
      get().nextStep();
    }, 9000);

    // Step 7: Second shift to settled (12s delay)
    setTimeout(() => {
      const { updateDemoShift, demoShifts } = get();
      if (demoShifts.length > 1) {
        updateDemoShift(demoShifts[1].id, {
          status: 'settled',
          settleAmount: '42.75',
        });
        get().nextStep();
      }
    }, 12000);
  };

  return {
    isDemoMode: false,
    demoStep: 0,
    demoShifts: [],
    demoPrices: new Map(),

    startDemo: () => {
      set({ 
        isDemoMode: true, 
        demoStep: 0,
        demoShifts: [],
        demoPrices: new Map(),
      });
      
      // Start demo flow
      runDemoFlow();
    },

  stopDemo: () => {
    set({ 
      isDemoMode: false, 
      demoStep: 0,
      demoShifts: [],
      demoPrices: new Map(),
    });
  },

  nextStep: () => {
    const { demoStep } = get();
    set({ demoStep: demoStep + 1 });
  },

  addDemoShift: (shift) => {
    set((state) => ({
      demoShifts: [shift, ...state.demoShifts],
    }));
  },

  updateDemoShift: (shiftId, updates) => {
    set((state) => ({
      demoShifts: state.demoShifts.map((s) =>
        s.id === shiftId ? { ...s, ...updates } : s
      ),
    }));
  },

  addDemoPrice: (pairKey, priceData) => {
    set((state) => {
      const newPrices = new Map(state.demoPrices);
      newPrices.set(pairKey, priceData);
      return { demoPrices: newPrices };
    });
  },
  };
});

