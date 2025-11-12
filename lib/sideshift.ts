import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
const AFFILIATE_ID = process.env.NEXT_PUBLIC_AFFILIATE_ID || '';

export interface Coin {
  coin: string;
  name: string;
  networks: string[];
  fixedOnly: boolean | string[];
  variableOnly: boolean | string[];
  depositOffline: boolean | string[];
  settleOffline: boolean | string[];
  networksWithMemo: string[];
  tokenDetails?: Record<string, {
    contractAddress: string;
    decimals: number;
  }>;
}

export interface Pair {
  min: string;
  max: string;
  rate: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
}

export interface Quote {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  expiresAt: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  affiliateId?: string;
}

export interface Shift {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositNetwork: string;
  settleNetwork: string;
  depositAddress: string;
  depositMemo?: string;
  settleAddress: string;
  settleMemo?: string;
  depositMin: string;
  depositMax: string;
  refundAddress?: string;
  refundMemo?: string;
  type: 'fixed' | 'variable';
  quoteId?: string;
  depositAmount?: string;
  settleAmount?: string;
  expiresAt: string;
  status: string;
  averageShiftSeconds?: string;
  rate?: string;
  updatedAt?: string;
  depositHash?: string;
  settleHash?: string;
  depositReceivedAt?: string;
  issue?: string;
}

class SideShiftClient {
  // Public methods that don't require secret - can be called from frontend
  // Private methods that require secret are now handled by backend API routes

  async getCoins(): Promise<Coin[]> {
    const response = await axios.get(`${API_BASE_URL}/coins`);
    return response.data;
  }

  async getPair(
    from: string,
    to: string,
    amount?: number,
    commissionRate?: string
  ): Promise<Pair> {
    // Ensure coin-network format is lowercase for API
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    
    const params = new URLSearchParams({
      affiliateId: AFFILIATE_ID,
    });

    if (amount) {
      params.append('amount', amount.toString());
    }

    if (commissionRate) {
      params.append('commissionRate', commissionRate);
    }

    // Public endpoint - no secret needed
    const response = await axios.get(
      `${API_BASE_URL}/pair/${fromLower}/${toLower}?${params.toString()}`
    );
    return response.data;
  }

  async requestQuote(
    depositCoin: string,
    depositNetwork: string,
    settleCoin: string,
    settleNetwork: string,
    depositAmount?: string,
    settleAmount?: string,
    userIp?: string
  ): Promise<Quote> {
    // Call backend API route instead of SideShift directly
    const response = await axios.post('/api/quotes', {
      depositCoin,
      depositNetwork,
      settleCoin,
      settleNetwork,
      depositAmount,
      settleAmount,
    });
    return response.data;
  }

  async createFixedShift(
    quoteId: string,
    settleAddress: string,
    refundAddress?: string,
    settleMemo?: string,
    refundMemo?: string,
    userIp?: string
  ): Promise<Shift> {
    // Call backend API route instead of SideShift directly
    const response = await axios.post('/api/shifts/fixed', {
      quoteId,
      settleAddress,
      refundAddress,
      settleMemo,
      refundMemo,
    });
    return response.data;
  }

  async createVariableShift(
    depositCoin: string,
    depositNetwork: string,
    settleCoin: string,
    settleNetwork: string,
    settleAddress: string,
    refundAddress?: string,
    settleMemo?: string,
    refundMemo?: string,
    commissionRate?: string,
    userIp?: string
  ): Promise<Shift> {
    // Call backend API route instead of SideShift directly
    const response = await axios.post('/api/shifts/variable', {
      depositCoin,
      depositNetwork,
      settleCoin,
      settleNetwork,
      settleAddress,
      refundAddress,
      settleMemo,
      refundMemo,
      commissionRate,
    });
    return response.data;
  }

  async getShift(shiftId: string): Promise<Shift> {
    // Call backend API route instead of SideShift directly
    const response = await axios.get(`/api/shifts/${shiftId}`);
    return response.data;
  }

  async checkPermissions(userIp?: string): Promise<{ createShift: boolean }> {
    // Public endpoint - no secret needed
    const headers: Record<string, string> = {};
    if (userIp) {
      headers['x-user-ip'] = userIp;
    }

    const response = await axios.get(
      `${API_BASE_URL}/permissions`,
      { headers }
    );
    return response.data;
  }
}

export const sideShiftClient = new SideShiftClient();

