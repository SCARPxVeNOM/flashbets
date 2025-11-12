import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET || '';
const AFFILIATE_ID = process.env.AFFILIATE_ID || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quoteId,
      settleAddress,
      refundAddress,
      settleMemo,
      refundMemo,
    } = body;

    // Validate required fields
    if (!quoteId || !settleAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: quoteId and settleAddress are required' },
        { status: 400 }
      );
    }

    // Get user IP from request
    const userIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   undefined;

    const requestBody: any = {
      quoteId,
      settleAddress,
      affiliateId: AFFILIATE_ID,
    };

    if (refundAddress) {
      requestBody.refundAddress = refundAddress;
    }

    if (settleMemo) {
      requestBody.settleMemo = settleMemo;
    }

    if (refundMemo) {
      requestBody.refundMemo = refundMemo;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (SIDESHIFT_SECRET) {
      headers['x-sideshift-secret'] = SIDESHIFT_SECRET;
    }

    if (userIp) {
      headers['x-user-ip'] = userIp;
    }

    const response = await axios.post(
      `${API_BASE_URL}/shifts/fixed`,
      requestBody,
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error creating fixed shift:', error);
    return NextResponse.json(
      { 
        error: error.response?.data?.error?.message || error.message || 'Failed to create shift' 
      },
      { status: error.response?.status || 500 }
    );
  }
}

