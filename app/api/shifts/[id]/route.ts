import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.SIDESHIFT_API_URL || 'https://sideshift.ai/api/v2';
const SIDESHIFT_SECRET = process.env.SIDESHIFT_SECRET || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: shiftId } = await params;
    
    if (!shiftId) {
      return NextResponse.json(
        { error: 'Shift ID is required' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (SIDESHIFT_SECRET) {
      headers['x-sideshift-secret'] = SIDESHIFT_SECRET;
    }

    const response = await axios.get(
      `${API_BASE_URL}/shifts/${shiftId}`,
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching shift:', error);
    return NextResponse.json(
      { 
        error: error.response?.data?.error?.message || error.message || 'Failed to fetch shift' 
      },
      { status: error.response?.status || 500 }
    );
  }
}

