'use client';

import { useState, useEffect } from 'react';
import { useBettingStore } from '@/store/betting-store';
import { sideShiftClient } from '@/lib/sideshift';
import { Trophy, Users, Clock, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export function ActiveBets({ userAddress }: { userAddress: string }) {
  const { bets, myBets, joinBet, updateBet, setLoading, setError } = useBettingStore();
  const [selectedBet, setSelectedBet] = useState<string | null>(null);

  const openBets = bets.filter((bet) => bet.status === 'open' && bet.creatorAddress !== userAddress);
  
  // Combine bets and myBets, removing duplicates by ID
  const allBets = [...bets, ...myBets];
  const uniqueBets = Array.from(
    new Map(allBets.map((bet) => [bet.id, bet])).values()
  );
  
  const userActiveBets = uniqueBets.filter(
    (bet) =>
      (bet.creatorAddress === userAddress || bet.opponentAddress === userAddress) &&
      (bet.status === 'active' || bet.status === 'matched' || bet.status === 'settled')
  );

  const handleJoinBet = async (betId: string) => {
    if (!userAddress) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      joinBet(betId, userAddress);
      updateBet(betId, { status: 'active' });
    } catch (error: any) {
      setError(error.message || 'Failed to join bet');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleBet = async (bet: any) => {
    if (!userAddress) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine winner (for demo, we'll use a simple logic)
      // In production, this would check the bet condition
      const winner = bet.creatorAddress === userAddress ? bet.creatorAddress : bet.opponentAddress;
      const winnerAddress = winner === bet.creatorAddress ? bet.creatorAddress : bet.opponentAddress;

      // Create SideShift swap for the winner
      const shift = await sideShiftClient.createVariableShift(
        bet.depositCoin,
        bet.depositNetwork,
        bet.settleCoin,
        bet.settleNetwork,
        winnerAddress, // Winner receives the settlement
        undefined, // refund address
        undefined, // settle memo
        undefined, // refund memo
        bet.commissionRate
      );

      // Update bet status
      updateBet(bet.id, {
        status: 'settled',
        winner: winnerAddress,
        shiftId: shift.id,
      });
    } catch (error: any) {
      setError(error.message || 'Failed to settle bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Open Bets */}
      <div className="neobrutal-card p-6">
        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00FFFF]" />
          OPEN BETS
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {openBets.length === 0 ? (
            <div className="text-white/60 text-center py-8">No open bets available</div>
          ) : (
            openBets.map((bet) => (
              <div
                key={bet.id}
                className="neobrutal-border-cyan p-4 bg-[#1a1a1a] cursor-pointer hover:bg-[#252525] transition-colors"
                onClick={() => setSelectedBet(selectedBet === bet.id ? null : bet.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">
                      {bet.depositCoin} → {bet.settleCoin}
                    </div>
                    <div className="text-sm text-white/70">
                      {bet.betAmount} {bet.depositCoin} bet
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      by {bet.creator}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinBet(bet.id);
                    }}
                    className="neobrutal-button-yellow px-3 py-1 text-xs font-black uppercase"
                  >
                    JOIN
                  </button>
                </div>
                {selectedBet === bet.id && (
                  <div className="mt-3 pt-3 border-t-2 border-white/20 text-xs text-white/70">
                    <div>Condition: {bet.betCondition}</div>
                    <div>Network: {bet.depositNetwork} → {bet.settleNetwork}</div>
                    <div>Expires: {new Date(bet.expiresAt).toLocaleString()}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* My Active Bets */}
      <div className="neobrutal-card p-6">
        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FFD700]" />
          MY ACTIVE BETS
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {userActiveBets.length === 0 ? (
            <div className="text-white/60 text-center py-8">No active bets</div>
          ) : (
            userActiveBets.map((bet) => (
              <div
                key={bet.id}
                className="neobrutal-border-yellow p-4 bg-[#1a1a1a]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">
                      {bet.depositCoin} → {bet.settleCoin}
                    </div>
                    <div className="text-sm text-white/70">
                      {bet.betAmount} {bet.depositCoin} bet
                    </div>
                    <div className="text-xs text-white/50 mt-1">
                      {bet.opponentAddress
                        ? `vs ${bet.opponentAddress.slice(0, 6)}...${bet.opponentAddress.slice(-4)}`
                        : 'Waiting for opponent...'}
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-[#FFD700] border-2 border-black text-black text-xs font-black uppercase">
                    {bet.status.toUpperCase()}
                  </div>
                </div>
                {bet.status === 'active' && bet.opponentAddress && (
                  <button
                    onClick={() => handleSettleBet(bet)}
                    className="w-full neobrutal-button-cyan px-3 py-2 text-xs font-black uppercase mt-2 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    SETTLE BET
                  </button>
                )}
                {bet.status === 'settled' && bet.shiftId && (
                  <div className="mt-2 p-2 bg-green-900/20 border-2 border-green-500">
                    <div className="flex items-center gap-2 text-green-400 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      <span>Settled! Shift ID: {bet.shiftId.slice(0, 8)}...</span>
                    </div>
                    {bet.winner === userAddress && (
                      <div className="text-xs text-green-300 mt-1">You won! Check SideShift for your swap.</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

