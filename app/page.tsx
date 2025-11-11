'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { TradeInterface } from '@/components/TradeInterface';
import { PriceDisplay } from '@/components/PriceDisplay';
import { ShiftHistory } from '@/components/ShiftHistory';
import { StatsPanel } from '@/components/StatsPanel';
import { TestnetBanner } from '@/components/TestnetBanner';
import { sideShiftClient } from '@/lib/sideshift';
import { useTradeStore } from '@/store/trade-store';
import { priceTracker } from '@/lib/price-tracker';
import { isTestnetChain } from '@/lib/chain-utils';
import { Zap, Globe, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isTestnet = isTestnetChain(chainId);
  const { setCoins, coins } = useTradeStore();
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalNetworks, setTotalNetworks] = useState(0);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinsData = await sideShiftClient.getCoins();
        setCoins(coinsData);
        setTotalCoins(coinsData.length);
        
        // Count unique networks
        const networks = new Set<string>();
        coinsData.forEach(coin => {
          coin.networks.forEach(network => networks.add(network));
        });
        setTotalNetworks(networks.size);
      } catch (error) {
        console.error('Error loading coins:', error);
      }
    };

    loadCoins();
  }, [setCoins]);

  useEffect(() => {
    priceTracker.start(10000); // Update prices every 10 seconds

    return () => {
      priceTracker.stop();
    };
  }, []);

  return (
    <main className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b-4 border-white bg-[#1a1a1a] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl md:text-3xl font-black text-white">
              <span className="text-[#FFD700]">FLASH</span>TRADES
            </div>
            {isConnected && isTestnet && (
              <div className="px-3 py-1 bg-[#FFD700] border-2 border-black text-black text-xs font-black uppercase">
                TESTNET
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="neobrutal-button-cyan px-4 py-2 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              HISTORY
            </button>
            <div className="[&>div>button]:neobrutal-button-cyan [&>div>button]:px-4 [&>div>button]:py-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="text-white">THE FUTURE OF</span>{' '}
            <span className="text-[#FFD700]">CROSS-CHAIN TRADING</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-semibold">
            Secure, transparent, and efficient cryptocurrency swaps powered by SideShift.ai across 200+ coins and 42+ blockchains.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-2">{totalCoins}+</div>
              <div className="text-sm font-bold text-white uppercase">Cryptocurrencies</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#00FFFF] mb-2">{totalNetworks}+</div>
              <div className="text-sm font-bold text-white uppercase">Blockchains</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-2">15min</div>
              <div className="text-sm font-bold text-white uppercase">Fixed Rate</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#00FFFF] mb-2">7days</div>
              <div className="text-sm font-bold text-white uppercase">Variable Rate</div>
            </div>
          </div>

          {!isConnected && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => document.getElementById('connect-wallet')?.click()}
                className="neobrutal-button-yellow px-8 py-4 text-lg flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                GET STARTED
              </button>
              <button className="neobrutal-button-cyan px-8 py-4 text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                LEARN MORE
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      {isConnected && (
        <section className="relative z-10 px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <TestnetBanner />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trading Interface */}
              <div className="lg:col-span-2">
                <TradeInterface userAddress={address || ''} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <StatsPanel />
                <PriceDisplay />
                <ShiftHistory />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Icons */}
      <div className="fixed bottom-6 left-6 z-20">
        <button className="w-14 h-14 rounded-full bg-[#1a1a1a] border-4 border-[#FFD700] flex items-center justify-center shadow-[6px_6px_0px_0px_#FFD700] hover:shadow-[4px_4px_0px_0px_#FFD700] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <Globe className="w-6 h-6 text-[#FFD700]" />
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-20">
        <button className="w-14 h-14 rounded-full bg-[#00FFFF] border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
          <TrendingUp className="w-6 h-6 text-black" />
        </button>
      </div>
    </main>
  );
}

