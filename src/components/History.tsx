"use client"

import React, { useState, useEffect } from "react";

interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCapValue: number;
  marketCapUnit: string;
  peRatio: number;
  pegRatio: number;
}

const LOGOS: Record<string, string> = {
  NVDA: '🟩', GOOGL: '🔵', AAPL: '⬛', MSFT: '🟦', AMZN: '🟧',
  AVGO: '🔴', META: '🔷', TSLA: '⬜', 'BRK-A': '🏛️', WMT: '🟡'
};

const INITIAL_STOCKS: StockData[] = [
  { symbol: "NVDA", name: "NVIDIA", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors & Se...", marketCapValue: 4.46, marketCapUnit: "T", peRatio: 37.4, pegRatio: 0.55 },
  { symbol: "GOOGL", name: "Alphabet A", exchange: "NASDAQ", sector: "Technology", industry: "Software & IT Services", marketCapValue: 3.85, marketCapUnit: "T", peRatio: 29.6, pegRatio: 0.79 },
  { symbol: "AAPL", name: "Apple", exchange: "NASDAQ", sector: "Technology", industry: "Computers, Phones & ...", marketCapValue: 3.82, marketCapUnit: "T", peRatio: 33.0, pegRatio: 1.23 },
  { symbol: "MSFT", name: "Microsoft", exchange: "NASDAQ", sector: "Technology", industry: "Software & IT Services", marketCapValue: 2.77, marketCapUnit: "T", peRatio: 23.2, pegRatio: 0.82 },
  { symbol: "AMZN", name: "Amazon.com", exchange: "NASDAQ", sector: "Consumer Cyclicals", industry: "Diversified Retail", marketCapValue: 2.51, marketCapUnit: "T", peRatio: 32.4, pegRatio: 0.98 },
  { symbol: "AVGO", name: "Broadcom", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors & Se...", marketCapValue: 1.67, marketCapUnit: "T", peRatio: 69.0, pegRatio: 0.42 },
  { symbol: "META", name: "Meta Platforms", exchange: "NASDAQ", sector: "Technology", industry: "Software & IT Services", marketCapValue: 1.59, marketCapUnit: "T", peRatio: 26.8, pegRatio: -15.51 },
  { symbol: "TSLA", name: "Tesla", exchange: "NASDAQ", sector: "Consumer Cyclicals", industry: "Automobiles & Auto P...", marketCapValue: 1.30, marketCapUnit: "T", peRatio: 320.2, pegRatio: -7.57 },
  { symbol: "BRK-A", name: "Berkshire Hathaway A", exchange: "NYSE", sector: "Consumer Non-Cyclic...", industry: "Consumer Goods Con...", marketCapValue: 1.05, marketCapUnit: "T", peRatio: 15.7, pegRatio: -0.62 },
  { symbol: "WMT", name: "Walmart", exchange: "NASDAQ", sector: "Consumer Non-Cyclic...", industry: "Food & Drug Retailing", marketCapValue: 1.03, marketCapUnit: "T", peRatio: 47.3, pegRatio: 3.45 },
  { symbol: "LLY", name: "Eli Lilly", exchange: "NYSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCapValue: 0.89, marketCapUnit: "T", peRatio: 85.2, pegRatio: 1.92 },
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE", sector: "Financials", industry: "Banks", marketCapValue: 0.87, marketCapUnit: "T", peRatio: 12.1, pegRatio: 2.15 },
  { symbol: "V", name: "Visa", exchange: "NYSE", sector: "Financials", industry: "Credit Services", marketCapValue: 0.85, marketCapUnit: "T", peRatio: 32.4, pegRatio: 1.68 },
  { symbol: "MA", name: "Mastercard", exchange: "NYSE", sector: "Financials", industry: "Credit Services", marketCapValue: 0.83, marketCapUnit: "T", peRatio: 38.6, pegRatio: 2.21 },
  { symbol: "XOM", name: "Exxon Mobil", exchange: "NYSE", sector: "Energy", industry: "Oil & Gas", marketCapValue: 0.79, marketCapUnit: "T", peRatio: 12.8, pegRatio: 1.45 },
  { symbol: "UNH", name: "UnitedHealth", exchange: "NYSE", sector: "Healthcare", industry: "Health Insurance", marketCapValue: 0.75, marketCapUnit: "T", peRatio: 23.5, pegRatio: 1.82 },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", sector: "Healthcare", industry: "Pharmaceuticals", marketCapValue: 0.72, marketCapUnit: "T", peRatio: 21.3, pegRatio: 3.12 },
  { symbol: "PG", name: "Procter & Gamble", exchange: "NYSE", sector: "Consumer Non-Cyclic...", industry: "Household Products", marketCapValue: 0.68, marketCapUnit: "T", peRatio: 26.8, pegRatio: 3.45 },
  { symbol: "HD", name: "Home Depot", exchange: "NYSE", sector: "Consumer Cyclicals", industry: "Home Improvement", marketCapValue: 0.65, marketCapUnit: "T", peRatio: 24.2, pegRatio: 2.18 },
  { symbol: "CVX", name: "Chevron", exchange: "NYSE", sector: "Energy", industry: "Oil & Gas", marketCapValue: 0.62, marketCapUnit: "T", peRatio: 14.5, pegRatio: 1.78 },
];

export default function History() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(stocks.length / itemsPerPage);
  const paginatedStocks = stocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const multiplier = 1 + (Math.random() * 0.004 - 0.002);
          const pegChange = Math.random() * 0.02 - 0.01;

          return {
            ...stock,
            marketCapValue: stock.marketCapValue * multiplier,
            peRatio: stock.peRatio * multiplier,
            pegRatio: stock.pegRatio + pegChange,
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const toggleSelect = (symbol: string) => {
    setSelectedStocks((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div>
      <h2 className="dash-dl-title">Data Logs</h2>
      
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th style={{ width: 40 }}>#</th>
              <th>Company</th>
              <th>Name</th>
              <th>Exchange</th>
              <th>Sector</th>
              <th>Industry</th>
              <th>Market Cap</th>
              <th>P/E Ratio</th>
              <th>PEG Ratio</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.map((r, index) => {
              const peClass = r.peRatio > 60 ? 'dash-neg' : '';
              const pegClass = r.pegRatio < 0 ? 'dash-neg' : (r.pegRatio < 1 ? 'dash-pos' : '');
              const isChecked = selectedStocks.includes(r.symbol);

              return (
                <tr key={r.symbol}>
                  <td>
                    <span
                      className="dash-checkbox"
                      onClick={() => toggleSelect(r.symbol)}
                      style={{
                        background: isChecked ? "var(--ink)" : "transparent",
                        borderColor: isChecked ? "var(--ink)" : "var(--line)"
                      }}
                    ></span>
                  </td>
                  <td className="dash-num">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    <div className="dash-co-cell">
                      <span className="dash-co-logo">{LOGOS[r.symbol] || r.symbol.charAt(0)}</span>
                      {r.symbol}
                    </div>
                  </td>
                  <td>{r.name}</td>
                  <td>{r.exchange}</td>
                  <td>{r.sector}</td>
                  <td>{r.industry}</td>
                  <td className="dash-num"><strong>${r.marketCapValue.toFixed(2)}{r.marketCapUnit}</strong></td>
                  <td className={`dash-num ${peClass}`}>{r.peRatio.toFixed(1)}x</td>
                  <td className={`dash-num ${pegClass}`}>{r.pegRatio.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="dash-pagination">
        <button
          className="dash-pg-btn"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          ‹ Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`dash-pg-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="dash-pg-btn"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
