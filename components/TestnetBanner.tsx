'use client';

import { useChainId } from 'wagmi';
import { isTestnetChain, getChainType } from '@/lib/chain-utils';
import { AlertTriangle } from 'lucide-react';

export function TestnetBanner() {
  const chainId = useChainId();
  const isTestnet = isTestnetChain(chainId);
  const chainType = getChainType(chainId);

  if (!isTestnet) return null;

  return (
    <div className="bg-[#FFD700] border-4 border-black shadow-[8px_8px_0px_0px_#000] p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-black flex-shrink-0" />
        <div className="flex-1">
          <div className="font-black text-black text-lg uppercase mb-1">
            ⚠️ TESTNET MODE ACTIVE
          </div>
          <div className="text-sm font-bold text-black">
            You are connected to a testnet network (Chain ID: {chainId}). 
            All transactions use test tokens and have no real value.
          </div>
        </div>
      </div>
    </div>
  );
}

