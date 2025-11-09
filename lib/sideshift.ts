import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
const SIDESHIFT_SECRET = process.env.NEXT_PUBLIC_SIDESHIFT_SECRET || '';
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
  private getHeaders(userIp?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (SIDESHIFT_SECRET) {
      headers['x-sideshift-secret'] = SIDESHIFT_SECRET;
    }

    if (userIp) {
      headers['x-user-ip'] = userIp;
    }

    return headers;
  }

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
    const params = new URLSearchParams({
      affiliateId: AFFILIATE_ID,
    });

    if (amount) {
      params.append('amount', amount.toString());
    }

    if (commissionRate) {
      params.append('commissionRate', commissionRate);
    }

    const response = await axios.get(
      `${API_BASE_URL}/pair/${from}/${to}?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
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
    const body: any = {
      depositCoin,
      depositNetwork,
      settleCoin,
      settleNetwork,
      affiliateId: AFFILIATE_ID,
    };

    if (depositAmount) {
      body.depositAmount = depositAmount;
    } else if (settleAmount) {
      body.settleAmount = settleAmount;
    }

    const response = await axios.post(
      `${API_BASE_URL}/quotes`,
      body,
      {
        headers: this.getHeaders(userIp),
      }
    );
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
    const body: any = {
      quoteId,
      settleAddress,
      affiliateId: AFFILIATE_ID,
    };

    if (refundAddress) {
      body.refundAddress = refundAddress;
    }

    if (settleMemo) {
      body.settleMemo = settleMemo;
    }

    if (refundMemo) {
      body.refundMemo = refundMemo;
    }

    const response = await axios.post(
      `${API_BASE_URL}/shifts/fixed`,
      body,
      {
        headers: this.getHeaders(userIp),
      }
    );
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
    const body: any = {
      depositCoin,
      depositNetwork,
      settleCoin,
      settleNetwork,
      settleAddress,
      affiliateId: AFFILIATE_ID,
    };

    if (refundAddress) {
      body.refundAddress = refundAddress;
    }

    if (settleMemo) {
      body.settleMemo = settleMemo;
    }

    if (refundMemo) {
      body.refundMemo = refundMemo;
    }

    if (commissionRate) {
      body.commissionRate = commissionRate;
    }

    const response = await axios.post(
      `${API_BASE_URL}/shifts/variable`,
      body,
      {
        headers: this.getHeaders(userIp),
      }
    );
    return response.data;
  }

  async getShift(shiftId: string): Promise<Shift> {
    const response = await axios.get(
      `${API_BASE_URL}/shifts/${shiftId}`,
      {
        headers: this.getHeaders(),
      }
    );
    return response.data;
  }

  async checkPermissions(userIp?: string): Promise<{ createShift: boolean }> {
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

