"use client"

import { useEffect, useState } from "react"

const sparklineSvg = (points: number[], color: string) => {
  const w = 76, h = 30;
  if (!points || points.length === 0) return null;
  const max = Math.max(...points), min = Math.min(...points);
  const norm = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="dash-sparkline" viewBox={`0 0 ${w} ${h}`}>
      <polyline points={norm} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const DEFAULT_TICKERS = [
  { sym: 'SPY', price: '$776.34', chg: '4.73%', points: [50, 52, 49, 53, 56, 54, 58, 62, 59, 64, 63, 67, 65, 70] },
  { sym: 'QQQ', price: '$731.07', chg: '2.51%', points: [40, 43, 42, 46, 45, 49, 52, 50, 54, 57, 56, 60, 58, 63] },
  { sym: 'AAPL', price: '$305.93', chg: '1.22%', points: [60, 58, 62, 61, 65, 63, 67, 66, 68, 71, 70, 74, 73, 75] },
  { sym: 'NVDA', price: '$225.16', chg: '0.76%', points: [45, 48, 47, 50, 53, 51, 55, 58, 56, 60, 59, 63, 62, 65] },
];

const DEFAULT_NEWS = [
  { src: 'Gurufocus.com', text: "Ray Dalio's Top Q2 2026 Move: State Street SPDR S&P 500 ETF Trust at a 2.93% Portfolio Impact", link: "#" },
  { src: 'Gurufocus.com', text: "Joel Greenblatt's Top Q2 2026 Move: State Street SPDR S&P 500 ETF Trust at a 4. ...", link: "#" },
  { src: '24/7 Wall St.', text: "Cash Pays 3.8% and the Fed May Hike. This T-Bill Fund Pays the Same but Sends No Tax Bill Until You Sell", link: "#" },
  { src: '24/7 Wall St.', text: "Dividend Aristocrats Screening for Yield and Growth Heading Into Autumn 2026", link: "#" },
];

interface DashboardViewProps {
  history?: { id: string; symbol: string; decision: string; timestamp: Date }[];
}

export function DashboardView({ history }: DashboardViewProps) {
  const [tickersData, setTickersData] = useState(DEFAULT_TICKERS);
  const [newsData, setNewsData] = useState(DEFAULT_NEWS);

  useEffect(() => {
    const fetchMarketData = async () => {
      const tickers = ["SPY", "QQQ", "AAPL", "NVDA"]; 
      try {
        const responses = await Promise.all(
          tickers.map(t => fetch(`/api/stock?ticker=${t}`).then(res => res.json()))
        );
        
        const formatted = responses.map((data, idx) => {
          if (data && !data.error) {
            const firstPrice = data.historicalData?.[0]?.price || data.currentPrice;
            const changePct = ((data.currentPrice - firstPrice) / firstPrice) * 100;
            return {
              sym: data.symbol,
              price: `$${data.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
              chg: `${changePct.toFixed(2)}%`,
              points: data.historicalData?.map((d: any) => d.price) || DEFAULT_TICKERS[idx].points
            };
          }
          return DEFAULT_TICKERS[idx];
        });

        setTickersData(formatted);

        if (responses[0]?.news && responses[0].news.length > 0) {
          setNewsData(responses[0].news.map((n: any) => ({
            src: n.publisher || 'Market Wire',
            text: n.title,
            link: n.link || '#'
          })));
        }
      } catch (e) {
        console.error("Market feed fetch fallback to static", e);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <div className="dash-hero">
        <div className="dash-status-pill">Status: Online</div>
        <h1>Wanda <span>Core Terminal</span></h1>
        <p>Institutional-grade quantitative analysis. Deploying multi-agent neural swarms to parse global market datasets in real-time.</p>
      </div>

      {/* Ticker Grid */}
      <div className="dash-ticker-grid">
        {tickersData.map((t) => (
          <div key={t.sym} className="dash-ticker-card">
            <div className="dash-ticker-sym">{t.sym}</div>
            <div className="dash-ticker-row">
              <div>
                <div className="dash-ticker-price">{t.price}</div>
                <div className="dash-ticker-change">↗ {t.chg}</div>
              </div>
              {sparklineSvg(t.points, '#0E7E48')}
            </div>
          </div>
        ))}
      </div>

      {/* Split Section */}
      <div className="dash-split">
        {/* Fear & Greed Card */}
        <div className="dash-card">
          <div className="dash-panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4.9 19.1A9 9 0 1 1 19.1 4.9"/>
            </svg>
            Fear &amp; Greed Index
          </div>
          <div className="dash-gauge-wrap">
            <svg width="180" height="100" viewBox="0 0 180 100">
              <path d="M10,95 A80,80 0 0,1 170,95" fill="none" stroke="#EFEDE6" strokeWidth="13"/>
              <path d="M10,95 A80,80 0 0,1 170,95" fill="none" stroke="url(#g1)" strokeWidth="13" strokeLinecap="round"/>
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B42318"/>
                  <stop offset="50%" stopColor="#B58900"/>
                  <stop offset="100%" stopColor="#0E7E48"/>
                </linearGradient>
              </defs>
              <line x1="90" y1="95" x2="128" y2="42" stroke="#141413" strokeWidth="2.5" strokeLinecap="round" transform="rotate(6 90 95)"/>
              <circle cx="90" cy="95" r="4.5" fill="#141413"/>
            </svg>
            <div className="dash-gauge-val">62</div>
            <div className="dash-gauge-label">Greed</div>
            <div className="dash-gauge-sub">Market Sentiment Indicator</div>
          </div>
        </div>

        {/* Recent Market News */}
        <div className="dash-card">
          <div className="dash-panel-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h13l3 3v13H4z"/>
              <line x1="8" y1="9" x2="16" y2="9"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="12" y2="17"/>
            </svg>
            Recent Market News
          </div>
          <div className="dash-news-list">
            {newsData.map((n, i) => (
              <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="dash-news-item">
                <div className="dash-news-src">{n.src}</div>
                <div className="dash-news-headline">{n.text}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}