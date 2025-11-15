'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { BettingInterface } from '@/components/BettingInterface';
import { ActiveBets } from '@/components/ActiveBets';
import { sideShiftClient } from '@/lib/sideshift';
import { useBettingStore } from '@/store/betting-store';
import { useTradeStore } from '@/store/trade-store';
import { isTestnetChain } from '@/lib/chain-utils';
import { Trophy, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BettingPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isTestnet = isTestnetChain(chainId);
  const { setCoins } = useTradeStore();
  const { bets, myBets } = useBettingStore();

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const coinsData = await sideShiftClient.getCoins();
        setCoins(coinsData);
      } catch (error) {
        console.error('Error loading coins:', error);
      }
    };

    loadCoins();
  }, [setCoins]);

  const activeBets = bets.filter((bet) => bet.status === 'active' || bet.status === 'matched');
  const openBets = bets.filter((bet) => bet.status === 'open');

  return (
    <main className="min-h-screen relative z-10">
      {/* Header */}
      <header className="border-b-4 border-white bg-[#1a1a1a] p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl md:text-3xl font-black text-white hover:opacity-80 transition-opacity">
              <span className="text-[#FFD700]">FLASH</span>TRADES
            </Link>
            {isConnected && isTestnet && (
              <div className="px-3 py-1 bg-[#FFD700] border-2 border-black text-black text-xs font-black uppercase">
                TESTNET
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="neobrutal-button-cyan px-4 py-2 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              TRADE
            </Link>
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
            <span className="text-white">BET AGAINST</span>{' '}
            <span className="text-[#FFD700]">EACH OTHER</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-semibold">
            Create bets, challenge opponents, and settle winnings with instant cross-chain swaps powered by SideShift.ai
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-2">{openBets.length}</div>
              <div className="text-sm font-bold text-white uppercase">Open Bets</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#00FFFF] mb-2">{activeBets.length}</div>
              <div className="text-sm font-bold text-white uppercase">Active Bets</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#FFD700] mb-2">{myBets.length}</div>
              <div className="text-sm font-bold text-white uppercase">My Bets</div>
            </div>
            <div className="neobrutal-card p-6">
              <div className="text-4xl font-black text-[#00FFFF] mb-2">
                <Trophy className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm font-bold text-white uppercase">Win Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {isConnected && (
        <section className="relative z-10 px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Betting Interface */}
              <div className="lg:col-span-2">
                <BettingInterface userAddress={address || ''} />
              </div>

              {/* Active Bets Sidebar */}
              <div className="space-y-6">
                <ActiveBets userAddress={address || ''} />
              </div>
            </div>
          </div>
        </section>
      )}

      {!isConnected && (
        <section className="relative z-10 px-4 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="neobrutal-card p-12 max-w-2xl mx-auto">
              <Trophy className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-4">Connect Your Wallet</h2>
              <p className="text-white/80 mb-6">
                Connect your wallet to start creating and joining bets
              </p>
              <div className="[&>div>button]:neobrutal-button-yellow [&>div>button]:px-6 [&>div>button]:py-3">
                <ConnectButton />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

