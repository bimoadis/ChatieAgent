import { NextRequest, NextResponse } from 'next/server';
import { fetchQuoteData } from '@/lib/yahoo-finance';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }

  try {
    const data = await fetchQuoteData(ticker);

    if (!data) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
