'use client';

import { useEffect, useState } from 'react';
import { useTradeStore } from '@/store/trade-store';
import { sideShiftClient, Shift } from '@/lib/sideshift';
import { Clock, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

export function ShiftHistory() {
  const { shifts, setCurrentShift } = useTradeStore();
  const [monitoringShifts, setMonitoringShifts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(async () => {
      for (const shift of shifts) {
        if (shift.status === 'waiting' || shift.status === 'pending' || shift.status === 'processing') {
          try {
            const updatedShift = await sideShiftClient.getShift(shift.id);
            setMonitoringShifts(prev => new Set(prev).add(shift.id));
            
            if (updatedShift.status !== shift.status) {
              useTradeStore.setState((state) => ({
                shifts: state.shifts.map(s => s.id === shift.id ? updatedShift : s),
              }));
            }
          } catch (error) {
            console.error(`Error checking shift ${shift.id}:`, error);
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [shifts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled':
        return <CheckCircle className="w-5 h-5 text-[#00FFFF]" />;
      case 'refunded':
      case 'refund':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'waiting':
      case 'pending':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-[#FFD700] animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-white/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled':
        return 'neobrutal-card-cyan';
      case 'refunded':
      case 'refund':
        return 'bg-red-500 border-4 border-black';
      case 'waiting':
      case 'pending':
      case 'processing':
        return 'neobrutal-card-yellow';
      default:
        return 'neobrutal-card';
    }
  };

  if (shifts.length === 0) {
    return (
      <div className="neobrutal-card p-6">
        <h3 className="text-xl font-black mb-4 text-white uppercase">Shift History</h3>
        <div className="neobrutal-card-cyan p-4 text-center">
          <p className="text-sm font-bold text-white">
            No shifts yet. Create your first swap to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="neobrutal-card p-6">
      <h3 className="text-xl font-black mb-4 text-white uppercase">Shift History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className={`${getStatusColor(shift.status)} p-4 cursor-pointer hover:translate-x-1 hover:translate-y-1 transition-transform`}
            onClick={() => setCurrentShift(shift)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(shift.status)}
                  <span className="font-black text-sm text-white uppercase">
                    {shift.depositCoin} → {shift.settleCoin}
                  </span>
                </div>
                <div className="text-xs font-bold text-white/70 uppercase">
                  {shift.depositNetwork} → {shift.settleNetwork}
                </div>
              </div>
              <div className="text-xs font-bold text-white/50">
                {new Date(shift.createdAt).toLocaleDateString()}
              </div>
            </div>

            {shift.depositAmount && (
              <div className="text-sm font-bold text-white mb-1">
                Amount: <span className="text-[#FFD700]">{shift.depositAmount}</span> {shift.depositCoin.toUpperCase()}
              </div>
            )}

            {shift.settleAmount && (
              <div className="text-sm font-bold text-white mb-2">
                Received: <span className="text-[#00FFFF]">{shift.settleAmount}</span> {shift.settleCoin.toUpperCase()}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-black px-3 py-1 bg-black text-white uppercase border-2 border-white">
                {shift.status}
              </span>
              <a
                href={`https://sideshift.ai/orders/${shift.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#00FFFF] hover:text-[#FFD700] flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {shift.depositHash && (
              <div className="mt-2 text-xs text-white/50 font-mono break-all">
                Deposit: {shift.depositHash.slice(0, 20)}...
              </div>
            )}

            {shift.settleHash && (
              <div className="mt-1 text-xs text-white/50 font-mono break-all">
                Settle: {shift.settleHash.slice(0, 20)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
