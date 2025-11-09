'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useTradeStore } from '@/store/trade-store';
import { sideShiftClient } from '@/lib/sideshift';
import { priceTracker } from '@/lib/price-tracker';
import { ArrowRightLeft, Loader2, Zap, Info, Clock, Shield } from 'lucide-react';

export function TradeInterface({ userAddress }: { userAddress: string }) {
  const {
    selectedDepositCoin,
    selectedDepositNetwork,
    selectedSettleCoin,
    selectedSettleNetwork,
    depositAmount,
    settleAmount,
    coins,
    isLoading,
    error,
    currentShift,
    setDepositCoin,
    setSettleCoin,
    setDepositAmount,
    setSettleAmount,
    setCurrentShift,
    addShift,
    setLoading,
    setError,
  } = useTradeStore();

  const { address } = useAccount();
  const [shiftType, setShiftType] = useState<'fixed' | 'variable'>('variable');
  const [currentRate, setCurrentRate] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  useEffect(() => {
    if (selectedDepositCoin && selectedSettleCoin && selectedDepositNetwork && selectedSettleNetwork) {
      const pairKey = `${selectedDepositCoin.coin}-${selectedDepositNetwork}/${selectedSettleCoin.coin}-${selectedSettleNetwork}`;
      
      const unsubscribe = priceTracker.subscribe((prices) => {
        const price = prices.get(pairKey);
        if (price) {
          setCurrentRate(price.rate);
          setMinAmount(price.min);
          setMaxAmount(price.max);
        }
      });

      priceTracker.trackPair(
        `${selectedDepositCoin.coin}-${selectedDepositNetwork}`,
        `${selectedSettleCoin.coin}-${selectedSettleNetwork}`,
        depositAmount ? parseFloat(depositAmount) : undefined
      );

      return unsubscribe;
    }
  }, [selectedDepositCoin, selectedSettleCoin, selectedDepositNetwork, selectedSettleNetwork, depositAmount]);

  const handleSwap = () => {
    if (selectedDepositCoin && selectedSettleCoin && selectedDepositNetwork && selectedSettleNetwork) {
      const tempCoin = selectedDepositCoin;
      const tempNetwork = selectedDepositNetwork;
      setDepositCoin(selectedSettleCoin, selectedSettleNetwork);
      setSettleCoin(tempCoin, tempNetwork);
    }
  };

  const handleCreateShift = async () => {
    if (!selectedDepositCoin || !selectedSettleCoin || !selectedDepositNetwork || !selectedSettleNetwork || !address) {
      setError('Please select coins and ensure wallet is connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (shiftType === 'fixed') {
        if (!depositAmount) {
          setError('Please enter deposit amount for fixed rate shift');
          setLoading(false);
          return;
        }

        const quote = await sideShiftClient.requestQuote(
          selectedDepositCoin.coin,
          selectedDepositNetwork,
          selectedSettleCoin.coin,
          selectedSettleNetwork,
          depositAmount,
          undefined,
          undefined
        );

        const shift = await sideShiftClient.createFixedShift(
          quote.id,
          address,
          address
        );

        setCurrentShift(shift);
        addShift(shift);
      } else {
        const shift = await sideShiftClient.createVariableShift(
          selectedDepositCoin.coin,
          selectedDepositNetwork,
          selectedSettleCoin.coin,
          selectedSettleNetwork,
          address,
          address
        );

        setCurrentShift(shift);
        addShift(shift);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to create shift');
      console.error('Error creating shift:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableNetworks = (coin: typeof selectedDepositCoin) => {
    if (!coin) return [];
    return coin.networks.filter(network => {
      const isOffline = Array.isArray(coin.depositOffline)
        ? coin.depositOffline.includes(network)
        : coin.depositOffline;
      return !isOffline;
    });
  };

  return (
    <div className="neobrutal-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase">
          CREATE SWAP
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShiftType('fixed')}
            className={`px-4 py-2 font-black text-sm uppercase border-4 transition-all ${
              shiftType === 'fixed'
                ? 'bg-[#FFD700] text-black border-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-[#1a1a1a] text-white border-white shadow-[4px_4px_0px_0px_white]'
            }`}
          >
            Fixed
          </button>
          <button
            onClick={() => setShiftType('variable')}
            className={`px-4 py-2 font-black text-sm uppercase border-4 transition-all ${
              shiftType === 'variable'
                ? 'bg-[#00FFFF] text-black border-black shadow-[4px_4px_0px_0px_#000]'
                : 'bg-[#1a1a1a] text-white border-white shadow-[4px_4px_0px_0px_white]'
            }`}
          >
            Variable
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="neobrutal-card-cyan p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#00FFFF] flex-shrink-0 mt-0.5" />
        <div className="text-sm font-bold text-white">
          <div className="mb-1">
            {shiftType === 'fixed' 
              ? 'Fixed Rate: Locked for 15 minutes. Send exact amount required.'
              : 'Variable Rate: Rate determined on deposit. Valid for 7 days.'}
          </div>
          {minAmount && maxAmount && (
            <div className="text-[#00FFFF]">
              Min: {minAmount} | Max: {maxAmount}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500 border-4 border-black p-4 text-white font-bold">
          {error}
        </div>
      )}

      {/* Deposit Coin Selection */}
      <div className="space-y-3">
        <label className="text-lg font-black text-white uppercase">From</label>
        <div className="flex gap-3">
          <select
            value={selectedDepositCoin?.coin || ''}
            onChange={(e) => {
              const coin = coins.find(c => c.coin === e.target.value);
              if (coin) {
                const networks = getAvailableNetworks(coin);
                setDepositCoin(coin, networks[0] || '');
              }
            }}
            className="flex-1 neobrutal-select px-4 py-3 text-base"
          >
            <option value="">SELECT COIN</option>
            {coins.map(coin => (
              <option key={coin.coin} value={coin.coin}>
                {coin.name.toUpperCase()} ({coin.coin.toUpperCase()})
              </option>
            ))}
          </select>
          {selectedDepositCoin && (
            <select
              value={selectedDepositNetwork || ''}
              onChange={(e) => setDepositCoin(selectedDepositCoin, e.target.value)}
              className="neobrutal-select px-4 py-3 text-base min-w-[140px]"
            >
              {getAvailableNetworks(selectedDepositCoin).map(network => (
                <option key={network} value={network}>
                  {network.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
        {shiftType === 'fixed' && (
          <input
            type="number"
            placeholder="AMOUNT"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full neobrutal-input px-4 py-3 text-base font-bold"
          />
        )}
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        className="w-full flex items-center justify-center p-4 bg-[#1a1a1a] border-4 border-white hover:border-[#00FFFF] transition-colors"
      >
        <ArrowRightLeft className="w-6 h-6 text-white" />
      </button>

      {/* Settle Coin Selection */}
      <div className="space-y-3">
        <label className="text-lg font-black text-white uppercase">To</label>
        <div className="flex gap-3">
          <select
            value={selectedSettleCoin?.coin || ''}
            onChange={(e) => {
              const coin = coins.find(c => c.coin === e.target.value);
              if (coin) {
                const networks = getAvailableNetworks(coin);
                setSettleCoin(coin, networks[0] || '');
              }
            }}
            className="flex-1 neobrutal-select px-4 py-3 text-base"
          >
            <option value="">SELECT COIN</option>
            {coins.map(coin => (
              <option key={coin.coin} value={coin.coin}>
                {coin.name.toUpperCase()} ({coin.coin.toUpperCase()})
              </option>
            ))}
          </select>
          {selectedSettleCoin && (
            <select
              value={selectedSettleNetwork || ''}
              onChange={(e) => setSettleCoin(selectedSettleCoin, e.target.value)}
              className="neobrutal-select px-4 py-3 text-base min-w-[140px]"
            >
              {getAvailableNetworks(selectedSettleCoin).map(network => (
                <option key={network} value={network}>
                  {network.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
        {shiftType === 'fixed' && settleAmount && (
          <div className="neobrutal-card-yellow p-4">
            <div className="text-sm font-bold text-black mb-1">YOU WILL RECEIVE</div>
            <div className="text-2xl font-black text-black">{settleAmount}</div>
          </div>
        )}
      </div>

      {/* Rate Display */}
      {currentRate && (
        <div className="neobrutal-card-cyan p-6">
          <div className="text-sm font-bold text-[#00FFFF] mb-2 uppercase">Exchange Rate</div>
          <div className="text-4xl font-black text-white">{currentRate}</div>
          <div className="text-xs text-white/70 mt-2">
            {shiftType === 'fixed' ? 'Locked for 15 minutes' : 'Rate determined on deposit'}
          </div>
        </div>
      )}

      {/* Create Shift Button */}
      <button
        onClick={handleCreateShift}
        disabled={isLoading || !selectedDepositCoin || !selectedSettleCoin}
        className="w-full neobrutal-button-yellow py-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            CREATING SHIFT...
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            CREATE SHIFT
          </>
        )}
      </button>

      {/* Current Shift Info */}
      {currentShift && (
        <div className="neobrutal-card-yellow p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-black" />
            <h3 className="text-xl font-black text-black uppercase">Shift Created!</h3>
          </div>
          
          <div className="bg-black p-4 border-4 border-black">
            <div className="text-sm font-bold text-[#FFD700] mb-2 uppercase">
              Send {currentShift.depositAmount || 'amount'} {currentShift.depositCoin.toUpperCase()} to:
            </div>
            <code className="block text-xs text-white break-all font-mono p-2 bg-[#1a1a1a] border-2 border-white">
              {currentShift.depositAddress}
            </code>
          </div>

          {currentShift.depositMemo && (
            <div className="bg-black p-4 border-4 border-black">
              <div className="text-sm font-bold text-[#FFD700] mb-2 uppercase">Memo (Required):</div>
              <code className="block text-xs text-white font-mono p-2 bg-[#1a1a1a] border-2 border-white">
                {currentShift.depositMemo}
              </code>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-black font-bold">
            <Clock className="w-4 h-4" />
            Expires: {new Date(currentShift.expiresAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
