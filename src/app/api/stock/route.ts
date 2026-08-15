import { NextRequest, NextResponse } from 'next/server';
import { fetchQuoteData } from '@/lib/yahoo-finance';

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticker = searchParams.get('ticker');
  const tickers = searchParams.get('tickers');

  try {
    // 1. Batch fetch multiple tickers: /api/stock?tickers=NVDA,AAPL,MSFT
    if (tickers) {
      const symbolList = tickers
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(Boolean)
        .slice(0, 30); // Max 30 at a time

      const results = await Promise.allSettled(
        symbolList.map(sym => fetchQuoteData(sym))
      );

      const successfulStocks = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value);

      return NextResponse.json(
        {
          success: true,
          count: successfulStocks.length,
          data: successfulStocks
        },
        {
          headers: {
            'Cache-Control': 's-maxage=20, stale-while-revalidate=40'
          }
        }
      );
    }

    // 2. Single ticker fetch: /api/stock?ticker=NVDA
    if (ticker) {
      const data = await fetchQuoteData(ticker);

      if (!data) {
        return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
      }

      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 's-maxage=15, stale-while-revalidate=30'
        }
      });
    }

    return NextResponse.json({ error: 'Either ticker or tickers parameter is required' }, { status: 400 });

  } catch (error) {
    console.error('Stock API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
