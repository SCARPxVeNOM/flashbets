import { sideShiftClient, Pair } from './sideshift';

export interface PriceData {
  pair: string;
  rate: string;
  min: string;
  max: string;
  timestamp: number;
}

interface TrackedPair {
  from: string;
  to: string;
}

class PriceTracker {
  private priceCache: Map<string, PriceData> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: Set<(prices: Map<string, PriceData>) => void> = new Set();
  private trackedPairs: Map<string, TrackedPair> = new Map();

  subscribe(callback: (prices: Map<string, PriceData>) => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => {
      callback(new Map(this.priceCache));
    });
  }

  async trackPair(from: string, to: string, amount?: number) {
    const pairKey = `${from}/${to}`;
    this.trackedPairs.set(pairKey, { from, to });

    try {
      const pair = await sideShiftClient.getPair(from, to, amount);
      const priceData: PriceData = {
        pair: pairKey,
        rate: pair.rate,
        min: pair.min,
        max: pair.max,
        timestamp: Date.now(),
      };

      this.priceCache.set(pairKey, priceData);
      this.notify();
    } catch (error) {
      console.error(`Error tracking pair ${pairKey}:`, error);
    }
  }

  async updatePrices() {
    const updatePromises = Array.from(this.trackedPairs.entries()).map(async ([pairKey, { from, to }]) => {
      try {
        const pair = await sideShiftClient.getPair(from, to);
        const priceData: PriceData = {
          pair: pairKey,
          rate: pair.rate,
          min: pair.min,
          max: pair.max,
          timestamp: Date.now(),
        };

        this.priceCache.set(pairKey, priceData);
      } catch (error) {
        console.error(`Error updating pair ${pairKey}:`, error);
      }
    });

    await Promise.all(updatePromises);
    this.notify();
  }

  start(intervalMs: number = 10000) {
    if (this.updateInterval) {
      this.stop();
    }

    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, intervalMs);
  }

  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  getPrice(pairKey: string): PriceData | undefined {
    return this.priceCache.get(pairKey);
  }

  getAllPrices(): Map<string, PriceData> {
    return new Map(this.priceCache);
  }
}

export const priceTracker = new PriceTracker();

