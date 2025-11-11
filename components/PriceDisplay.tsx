'use client';

import { useState, useEffect } from 'react';
import { priceTracker, PriceData } from '@/lib/price-tracker';
import { useDemoStore } from '@/store/demo-store';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function PriceDisplay() {
  const { isDemoMode, demoPrices } = useDemoStore();
  const [prices, setPrices] = useState<Map<string, PriceData>>(new Map());
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setPrices(new Map(demoPrices));
      if (!selectedPair && demoPrices.size > 0) {
        setSelectedPair(Array.from(demoPrices.keys())[0]);
      }
    } else {
      const unsubscribe = priceTracker.subscribe((newPrices) => {
        setPrices(new Map(newPrices));
        if (!selectedPair && newPrices.size > 0) {
          setSelectedPair(Array.from(newPrices.keys())[0]);
        }
      });
      return unsubscribe;
    }
  }, [selectedPair, isDemoMode, demoPrices]);

  const priceData = selectedPair ? prices.get(selectedPair) : null;

  return (
    <div className="neobrutal-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#00FFFF]" />
        <h3 className="text-xl font-black text-white uppercase">Price Tracker</h3>
      </div>
      
      {prices.size === 0 ? (
        <div className="neobrutal-card-cyan p-4 text-center">
          <p className="text-sm font-bold text-white">
            No prices being tracked. Create a swap to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <select
            value={selectedPair || ''}
            onChange={(e) => setSelectedPair(e.target.value)}
            className="w-full neobrutal-select px-4 py-3 text-sm font-bold"
          >
            {Array.from(prices.keys()).map(pair => {
              const [from, to] = pair.split('/');
              return (
                <option key={pair} value={pair}>
                  {from.toUpperCase()} → {to.toUpperCase()}
                </option>
              );
            })}
          </select>

          {priceData && (
            <div className="space-y-3">
              <div className="neobrutal-card-cyan p-6">
                <div className="text-xs font-bold text-[#00FFFF] mb-2 uppercase">Exchange Rate</div>
                <div className="text-3xl font-black text-white flex items-center gap-2">
                  {priceData.rate}
                  <TrendingUp className="w-6 h-6 text-[#00FFFF]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="neobrutal-card p-4">
                  <div className="text-xs font-bold text-white/70 mb-1 uppercase">Min</div>
                  <div className="text-lg font-black text-[#FFD700]">{priceData.min}</div>
                </div>
                <div className="neobrutal-card p-4">
                  <div className="text-xs font-bold text-white/70 mb-1 uppercase">Max</div>
                  <div className="text-lg font-black text-[#00FFFF]">{priceData.max}</div>
                </div>
              </div>

              <div className="text-xs text-white/50 font-bold">
                Updated: {new Date(priceData.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
