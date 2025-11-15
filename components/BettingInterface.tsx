'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useBettingStore } from '@/store/betting-store';
import { useTradeStore } from '@/store/trade-store';
import { sideShiftClient } from '@/lib/sideshift';
import { Trophy, Users, Zap, AlertTriangle, Info, ArrowRightLeft } from 'lucide-react';

export function BettingInterface({ userAddress }: { userAddress: string }) {
  const {
    selectedDepositCoin,
    selectedDepositNetwork,
    selectedSettleCoin,
    selectedSettleNetwork,
    betAmount,
    betType,
    betCondition,
    isLoading,
    error,
    setDepositCoin,
    setSettleCoin,
    setBetAmount,
    setBetType,
    setBetCondition,
    createBet,
    setLoading,
    setError,
  } = useBettingStore();

  const { coins } = useTradeStore();
  const { address } = useAccount();
  const [settleAmount, setSettleAmount] = useState<string>('');
  const [currentRate, setCurrentRate] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(true);

  useEffect(() => {
    if (selectedDepositCoin && selectedSettleCoin && selectedDepositNetwork && selectedSettleNetwork && betAmount) {
      const loadRate = async () => {
        try {
          const pair = await sideShiftClient.getPair(
            `${selectedDepositCoin.coin}-${selectedDepositNetwork}`,
            `${selectedSettleCoin.coin}-${selectedSettleNetwork}`,
            parseFloat(betAmount)
          );
          setCurrentRate(pair.rate);
          const calculatedSettle = (parseFloat(betAmount) * parseFloat(pair.rate)).toFixed(8);
          setSettleAmount(calculatedSettle);
        } catch (error) {
          console.error('Error loading rate:', error);
        }
      };
      loadRate();
    }
  }, [selectedDepositCoin, selectedSettleCoin, selectedDepositNetwork, selectedSettleNetwork, betAmount]);

  const handleSwap = () => {
    if (selectedDepositCoin && selectedSettleCoin && selectedDepositNetwork && selectedSettleNetwork) {
      const tempCoin = selectedDepositCoin;
      const tempNetwork = selectedDepositNetwork;
      setDepositCoin(selectedSettleCoin, selectedSettleNetwork);
      setSettleCoin(tempCoin, tempNetwork);
    }
  };

  const handleCreateBet = async () => {
    if (!selectedDepositCoin || !selectedSettleCoin || !selectedDepositNetwork || !selectedSettleNetwork || !betAmount || !address) {
      setError('Please fill in all required fields');
      return;
    }

    if (!betCondition && betType !== 'custom') {
      setError('Please enter a bet condition');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newBet = {
        id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        creator: address.slice(0, 6) + '...' + address.slice(-4),
        creatorAddress: address,
        depositCoin: selectedDepositCoin.coin,
        depositNetwork: selectedDepositNetwork,
        settleCoin: selectedSettleCoin.coin,
        settleNetwork: selectedSettleNetwork,
        betAmount,
        settleAmount: settleAmount || '0',
        betType,
        betCondition: betCondition || `${selectedDepositCoin.coin} price prediction`,
        status: 'open' as const,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };

      createBet(newBet);
      setShowCreateForm(false);
      
      // Reset form
      setBetAmount('');
      setBetCondition('');
      setSettleAmount('');
    } catch (error: any) {
      setError(error.message || 'Failed to create bet');
    } finally {
      setLoading(false);
    }
  };

  const getCoinOptions = (type: 'deposit' | 'settle') => {
    return coins
      .filter((coin) => {
        if (type === 'deposit') {
          return !selectedSettleCoin || coin.coin !== selectedSettleCoin.coin;
        }
        return !selectedDepositCoin || coin.coin !== selectedDepositCoin.coin;
      })
      .flatMap((coin) =>
        coin.networks.map((network) => ({
          coin,
          network,
          label: `${coin.name} (${network})`,
          value: `${coin.coin}-${network}`,
        }))
      );
  };

  return (
    <div className="neobrutal-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#FFD700]" />
          CREATE BET
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="neobrutal-button-cyan px-4 py-2 text-sm"
        >
          {showCreateForm ? 'HIDE' : 'SHOW'}
        </button>
      </div>

      {showCreateForm && (
        <div className="space-y-6">
          {/* Bet Type Selection */}
          <div>
            <label className="block text-white font-bold mb-2">BET TYPE</label>
            <div className="grid grid-cols-3 gap-2">
              {(['price', 'time', 'custom'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setBetType(type)}
                  className={`neobrutal-button px-4 py-3 text-sm font-black uppercase ${
                    betType === type
                      ? 'bg-[#00FFFF] text-black border-black'
                      : 'bg-[#1a1a1a] text-white border-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Coin Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deposit Coin */}
            <div>
              <label className="block text-white font-bold mb-2">YOU BET</label>
              <select
                value={
                  selectedDepositCoin && selectedDepositNetwork
                    ? `${selectedDepositCoin.coin}-${selectedDepositNetwork}`
                    : ''
                }
                onChange={(e) => {
                  const [coin, network] = e.target.value.split('-');
                  const selected = coins.find((c) => c.coin === coin);
                  if (selected) setDepositCoin(selected, network);
                }}
                className="w-full neobrutal-input p-3 bg-[#1a1a1a] border-4 border-white text-white font-bold"
              >
                <option value="">Select coin & network</option>
                {getCoinOptions('deposit').map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex items-end">
              <button
                onClick={handleSwap}
                className="w-full neobrutal-button-cyan p-3 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-5 h-5" />
                SWAP
              </button>
            </div>

            {/* Settle Coin */}
            <div>
              <label className="block text-white font-bold mb-2">YOU WIN</label>
              <select
                value={
                  selectedSettleCoin && selectedSettleNetwork
                    ? `${selectedSettleCoin.coin}-${selectedSettleNetwork}`
                    : ''
                }
                onChange={(e) => {
                  const [coin, network] = e.target.value.split('-');
                  const selected = coins.find((c) => c.coin === coin);
                  if (selected) setSettleCoin(selected, network);
                }}
                className="w-full neobrutal-input p-3 bg-[#1a1a1a] border-4 border-white text-white font-bold"
              >
                <option value="">Select coin & network</option>
                {getCoinOptions('settle').map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <label className="block text-white font-bold mb-2">BET AMOUNT</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="0.00"
              className="w-full neobrutal-input p-3 bg-[#1a1a1a] border-4 border-white text-white font-bold"
            />
            {currentRate && (
              <div className="mt-2 text-sm text-white/70">
                Rate: 1 {selectedDepositCoin?.coin} = {currentRate} {selectedSettleCoin?.coin}
              </div>
            )}
          </div>

          {/* Bet Condition */}
          <div>
            <label className="block text-white font-bold mb-2">
              BET CONDITION {betType === 'custom' && '(Optional)'}
            </label>
            <input
              type="text"
              value={betCondition}
              onChange={(e) => setBetCondition(e.target.value)}
              placeholder={
                betType === 'price'
                  ? 'e.g., BTC price > $50000 in 1 hour'
                  : betType === 'time'
                  ? 'e.g., First to deposit wins'
                  : 'Enter custom condition'
              }
              className="w-full neobrutal-input p-3 bg-[#1a1a1a] border-4 border-white text-white font-bold"
            />
          </div>

          {/* Info Box */}
          {selectedDepositCoin && selectedSettleCoin && betAmount && (
            <div className="neobrutal-border-cyan p-4 bg-[#1a1a1a]">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-[#00FFFF] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white">
                  <div className="font-bold mb-1">Bet Summary:</div>
                  <div>You bet: {betAmount} {selectedDepositCoin.coin} ({selectedDepositNetwork})</div>
                  <div>You win: ~{settleAmount || '0'} {selectedSettleCoin.coin} ({selectedSettleNetwork})</div>
                  <div className="mt-2 text-white/70">
                    When matched, the winner will receive the settlement via SideShift swap
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="neobrutal-border-red p-4 bg-red-900/20">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">{error}</span>
              </div>
            </div>
          )}

          {/* Create Bet Button */}
          <button
            onClick={handleCreateBet}
            disabled={isLoading || !selectedDepositCoin || !selectedSettleCoin || !betAmount}
            className="w-full neobrutal-button-yellow px-6 py-4 text-lg font-black uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                CREATING...
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5" />
                CREATE BET
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

