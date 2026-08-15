import { StockQuote } from '@/types';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export async function fetchQuoteData(ticker: string): Promise<StockQuote | null> {
  try {
    const symbol = ticker.toUpperCase().trim();

    const headers = {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json'
    };

    // 1. CHART API - Main data source (chart API works, quote API is blocked)
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=60d`;
    const chartRes = await fetch(chartUrl, { headers, cache: 'no-store' });

    if (!chartRes.ok) {
      throw new Error(`Chart API returned status: ${chartRes.status}`);
    }

    const chartData = await chartRes.json();
    const result = chartData.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const meta = result.meta || {};
    const timestamps = result.timestamp || [];
    const rawClosePrices = result.indicators?.quote?.[0]?.close || [];

    // Filter out null data (market holidays)
    const validData: { time: number; price: number }[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (rawClosePrices[i] !== null && rawClosePrices[i] !== undefined) {
        validData.push({
          time: timestamps[i],
          price: rawClosePrices[i]
        });
      }
    }

    const closePrices = validData.map(d => d.price);

    // Calculate technical indicators
    let sma20 = 0;
    let volatility = 0;
    let riskLevel = 'Unknown';
    let rsi14 = 0;
    let trend = 'Neutral';
    let historicalData: { date: string; price: number }[] = [];

    if (closePrices.length > 0) {
      const currentPrice = closePrices[closePrices.length - 1];

      // A. Chart data for UI
      historicalData = validData.map(d => ({
        date: new Date(d.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(d.price.toFixed(2))
      }));

      // B. SMA 20 Calculation
      const period20 = Math.min(20, closePrices.length);
      const recent20 = closePrices.slice(-period20);
      const sum20 = recent20.reduce((a, b) => a + b, 0);
      sma20 = sum20 / period20;

      // C. Volatility & Risk
      const mean = sma20;
      const variance = recent20.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period20;
      volatility = Math.sqrt(variance);
      riskLevel = volatility > (mean * 0.05) ? 'High' : volatility > (mean * 0.03) ? 'Medium' : 'Low';

      // D. Trend Detection
      trend = currentPrice > sma20 ? 'Bullish' : 'Bearish';

      // E. RSI 14 Calculation
      if (closePrices.length > 14) {
        let gains = 0;
        let losses = 0;
        for (let i = closePrices.length - 14; i < closePrices.length; i++) {
          const difference = closePrices[i] - closePrices[i - 1];
          if (difference >= 0) {
            gains += difference;
          } else {
            losses -= difference;
          }
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        if (avgLoss === 0) {
          rsi14 = 100;
        } else {
          const rs = avgGain / avgLoss;
          rsi14 = 100 - (100 / (1 + rs));
        }
      }
    }

    // 2. RECENT NEWS (using search API)
    let recentNews: { title: string; publisher: string; link: string }[] = [];
    try {
      const newsUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&quotesCount=0&newsCount=5`;
      const newsRes = await fetch(newsUrl, { headers, cache: 'no-store' });

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        recentNews = (newsData.news || []).map((item: any) => ({
          title: item.title,
          publisher: item.publisher || 'Yahoo Finance',
          link: item.link
        }));
      }
    } catch (newsError) {
      console.error(`[yahoo-finance.ts] Failed to fetch news for ${symbol}:`, newsError);
    }

    // 3. TAMBAHAN BARU: FETCH DATA FUNDAMENTAL DARI QUOTE SUMMARY API
    let sector = "Technology";
    let industry = "-";
    let trailingPE = null;
    let pegRatio = null;
    let actualMarketCap = meta.marketCap || 0;

    try {
      const summaryUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=summaryDetail,assetProfile,defaultKeyStatistics`;
      const summaryRes = await fetch(summaryUrl, { headers, cache: 'no-store' });

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        const quoteResult = summaryData.quoteSummary?.result?.[0];

        if (quoteResult) {
          sector = quoteResult.assetProfile?.sector || sector;
          industry = quoteResult.assetProfile?.industry || industry;
          actualMarketCap = quoteResult.summaryDetail?.marketCap?.raw || actualMarketCap;
          trailingPE = quoteResult.summaryDetail?.trailingPE?.raw || null;
          pegRatio = quoteResult.defaultKeyStatistics?.pegRatio?.raw || null;
        }
      }
    } catch (summaryError) {
      console.error(`[yahoo-finance.ts] Failed to fetch fundamentals for ${symbol}:`, summaryError);
    }

    // 4. COMBINE ALL DATA (Ubah bagian return Anda menjadi seperti ini)
    return {
      symbol: meta.symbol || symbol,
      companyName: meta.shortName || meta.longName || symbol,
      currentPrice: meta.regularMarketPrice || closePrices[closePrices.length - 1] || 0,
      marketCap: actualMarketCap,
      sector: sector,             // Tambahkan ini agar dibaca oleh History.tsx
      industry: industry,         // Tambahkan ini
      trailingPE: trailingPE,     // Tambahkan ini
      pegRatio: pegRatio,         // Tambahkan ini
      peRatio: trailingPE || 0,   // Fallback PE Ratio untuk komponen lain
      eps: 0, 
      dividendYield: 0, 
      week52High: meta.fiftyTwoWeekHigh || 0,
      week52Low: meta.fiftyTwoWeekLow || 0,
      volume: meta.regularMarketVolume || 0,
      historicalData,
      quantitative: {
        sma20: Number(sma20.toFixed(2)),
        volatility: Number(volatility.toFixed(2)),
        riskLevel,
        rsi14: Number(rsi14.toFixed(2)),
        trend
      },
      news: recentNews
    } as any; // Gunakan 'as any' sementara jika tipe StockQuote di types/index.ts belum Anda perbarui

  } catch (error: any) {
    console.error(`[yahoo-finance.ts] Error for ${ticker}:`, error.message);
    return null;
  }
}
