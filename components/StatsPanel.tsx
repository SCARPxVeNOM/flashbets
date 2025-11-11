'use client';

import { useEffect, useState } from 'react';
import { useTradeStore } from '@/store/trade-store';
import { useDemoStore } from '@/store/demo-store';
import { priceTracker } from '@/lib/price-tracker';
import { TrendingUp, Coins, Network, Zap } from 'lucide-react';

export function StatsPanel() {
  const { shifts } = useTradeStore();
  const { isDemoMode, demoShifts, demoPrices } = useDemoStore();
  const [activePairs, setActivePairs] = useState(0);
  const prices = priceTracker.getAllPrices();
  
  const displayShifts = isDemoMode ? demoShifts : shifts;
  const displayPrices = isDemoMode ? demoPrices : prices;

  useEffect(() => {
    if (isDemoMode) {
      setActivePairs(demoPrices.size);
    } else {
      const unsubscribe = priceTracker.subscribe((newPrices) => {
        setActivePairs(newPrices.size);
      });
      return unsubscribe;
    }
  }, [isDemoMode, demoPrices]);

  const settledShifts = displayShifts.filter(s => s.status === 'settled').length;
  const totalVolume = displayShifts
    .filter(s => s.status === 'settled' && s.depositAmount)
    .reduce((sum, s) => sum + parseFloat(s.depositAmount || '0'), 0);

  return (
    <div className="neobrutal-card p-6">
      <h3 className="text-xl font-black mb-4 text-white uppercase">Live Stats</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border-2 border-white">
          <div className="flex items-center gap-3">
            <Coins className="w-5 h-5 text-[#FFD700]" />
            <span className="font-bold text-white">Total Swaps</span>
          </div>
          <span className="text-2xl font-black text-[#FFD700]">{displayShifts.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border-2 border-white">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#00FFFF]" />
            <span className="font-bold text-white">Settled</span>
          </div>
          <span className="text-2xl font-black text-[#00FFFF]">{settledShifts}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border-2 border-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#FFD700]" />
            <span className="font-bold text-white">Active Pairs</span>
          </div>
          <span className="text-2xl font-black text-[#FFD700]">{activePairs}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#0a0a0a] border-2 border-white">
          <div className="flex items-center gap-3">
            <Network className="w-5 h-5 text-[#00FFFF]" />
            <span className="font-bold text-white">Total Volume</span>
          </div>
          <span className="text-lg font-black text-[#00FFFF]">
            {totalVolume.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}

