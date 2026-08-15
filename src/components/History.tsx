"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { StockDetailModal } from "./StockDetailModal";

export interface StockData {
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
  AVGO: '🔴', META: '🔷', TSLA: '⬜', 'BRK-A': '🏛️', WMT: '🟡',
  LLY: '🧪', JPM: '🏦', V: '💳', MA: '💳', XOM: '🛢️',
  UNH: '🏥', JNJ: '💊', PG: '🧼', HD: '🔨', CVX: '⛽',
  COST: '🛒', ORCL: '💾', BAC: '🏦', KO: '🥤', PEP: '🥤',
  ADBE: '🎨', CRM: '☁️', AMD: '⚡', NFLX: '🎬', QCOM: '📶',
  TMO: '🔬', DIS: '🏰', INTC: '💻', CSCO: '🌐', IBM: '🖥️',
  UBER: '🚗', TXN: '📟', NOW: '⚡', AMAT: '🔬', BKNG: '✈️',
  PLTR: '👁️', COIN: '🪙', SNOW: '❄️', SHOP: '🛍️', CRWD: '🛡️',
  PANW: '🔒', ABNB: '🏠', SQ: '💳', SPOT: '🎵', PYPL: '💳',
  MU: '💾', LRCX: '⚙️', KLAC: '🔬', MCD: '🍔', GE: '⚡',
  CAT: '🚜', RTX: '🚀', BA: '✈️', GS: '🏦', MS: '🏦',
  C: '🏦', WFC: '🏦', AXP: '💳', PFE: '💊', MRK: '💊',
  ABBV: '🧪', AMGN: '🧬', GILD: '🧪', ISRG: '🤖', ABT: '🏥',
  DHR: '🔬', LIN: '🧪', NKE: '👟', LOW: '🔨', TGT: '🎯',
  TJX: '👗', SBUX: '☕', CMCSA: '📡', T: '📞', VZ: '📱',
  TMUS: '📶', INTU: '💼', ADI: '📟', MELI: '🛍️', DELL: '💻',
  ARM: '📱', APP: '📲', MSTR: '₿', CRCL: '🪙', HOOD: '🏹',
  RBLX: '🎮', RDDT: '🤖', MARA: '⛏️', IONQ: '⚛️', SMCI: '🖥️',
  MRVL: '🔌', ON: '🔋', CEG: '💡'
};

function CompanyLogo({ symbol }: { symbol: string }) {
  const [hasError, setHasError] = useState(false);
  const normalizedSymbol = symbol.replace(/\./g, "-");

  if (hasError) {
    return (
      <span className="dash-co-logo">
        {LOGOS[symbol] || symbol.charAt(0)}
      </span>
    );
  }

  return (
    <span className="dash-co-logo">
      <img
        src={`/logos/${normalizedSymbol}.png`}
        alt={`${symbol} logo`}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </span>
  );
}

const INITIAL_STOCKS: StockData[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 4.46, marketCapUnit: "T", peRatio: 37.4, pegRatio: 0.55 },
  { symbol: "GOOGL", name: "Alphabet Inc. (Class A)", exchange: "NASDAQ", sector: "Communication Services", industry: "Internet Content & Information", marketCapValue: 3.85, marketCapUnit: "T", peRatio: 29.6, pegRatio: 0.79 },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Consumer Electronics", marketCapValue: 3.82, marketCapUnit: "T", peRatio: 33.0, pegRatio: 1.23 },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 2.77, marketCapUnit: "T", peRatio: 23.2, pegRatio: 0.82 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Internet Retail", marketCapValue: 2.51, marketCapUnit: "T", peRatio: 32.4, pegRatio: 0.98 },
  { symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 1.67, marketCapUnit: "T", peRatio: 69.0, pegRatio: 0.42 },
  { symbol: "META", name: "Meta Platforms, Inc.", exchange: "NASDAQ", sector: "Communication Services", industry: "Internet Content & Information", marketCapValue: 1.59, marketCapUnit: "T", peRatio: 26.8, pegRatio: -15.51 },
  { symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Auto Manufacturers", marketCapValue: 1.30, marketCapUnit: "T", peRatio: 320.2, pegRatio: -7.57 },
  { symbol: "BRK-A", name: "Berkshire Hathaway Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Insurance - Diversified", marketCapValue: 1.05, marketCapUnit: "T", peRatio: 15.7, pegRatio: -0.62 },
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", sector: "Consumer Defensive", industry: "Discount Stores", marketCapValue: 1.03, marketCapUnit: "T", peRatio: 47.3, pegRatio: 3.45 },
  { symbol: "LLY", name: "Eli Lilly and Company", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.89, marketCapUnit: "T", peRatio: 85.2, pegRatio: 1.92 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financial Services", industry: "Banks - Diversified", marketCapValue: 0.87, marketCapUnit: "T", peRatio: 12.1, pegRatio: 2.15 },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Credit Services", marketCapValue: 0.85, marketCapUnit: "T", peRatio: 32.4, pegRatio: 1.68 },
  { symbol: "MA", name: "Mastercard Incorporated", exchange: "NYSE", sector: "Financial Services", industry: "Credit Services", marketCapValue: 0.83, marketCapUnit: "T", peRatio: 38.6, pegRatio: 2.21 },
  { symbol: "XOM", name: "Exxon Mobil Corporation", exchange: "NYSE", sector: "Energy", industry: "Oil & Gas Integrated", marketCapValue: 0.79, marketCapUnit: "T", peRatio: 12.8, pegRatio: 1.45 },
  { symbol: "UNH", name: "UnitedHealth Group Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Healthcare Plans", marketCapValue: 0.75, marketCapUnit: "T", peRatio: 23.5, pegRatio: 1.82 },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.72, marketCapUnit: "T", peRatio: 21.3, pegRatio: 3.12 },
  { symbol: "PG", name: "Procter & Gamble Company", exchange: "NYSE", sector: "Consumer Defensive", industry: "Household & Personal Products", marketCapValue: 0.68, marketCapUnit: "T", peRatio: 26.8, pegRatio: 3.45 },
  { symbol: "HD", name: "The Home Depot, Inc.", exchange: "NYSE", sector: "Consumer Cyclical", industry: "Home Improvement Retail", marketCapValue: 0.65, marketCapUnit: "T", peRatio: 24.2, pegRatio: 2.18 },
  { symbol: "CVX", name: "Chevron Corporation", exchange: "NYSE", sector: "Energy", industry: "Oil & Gas Integrated", marketCapValue: 0.62, marketCapUnit: "T", peRatio: 14.5, pegRatio: 1.78 },
  { symbol: "COST", name: "Costco Wholesale Corporation", exchange: "NASDAQ", sector: "Consumer Defensive", industry: "Discount Stores", marketCapValue: 0.44, marketCapUnit: "T", peRatio: 52.8, pegRatio: 4.12 },
  { symbol: "ORCL", name: "Oracle Corporation", exchange: "NYSE", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.49, marketCapUnit: "T", peRatio: 39.5, pegRatio: 2.05 },
  { symbol: "BAC", name: "Bank of America Corporation", exchange: "NYSE", sector: "Financial Services", industry: "Banks - Diversified", marketCapValue: 0.35, marketCapUnit: "T", peRatio: 13.6, pegRatio: 1.85 },
  { symbol: "KO", name: "The Coca-Cola Company", exchange: "NYSE", sector: "Consumer Defensive", industry: "Beverages - Non-Alcoholic", marketCapValue: 0.31, marketCapUnit: "T", peRatio: 26.4, pegRatio: 3.20 },
  { symbol: "PEP", name: "PepsiCo, Inc.", exchange: "NASDAQ", sector: "Consumer Defensive", industry: "Beverages - Non-Alcoholic", marketCapValue: 0.25, marketCapUnit: "T", peRatio: 22.8, pegRatio: 2.90 },
  { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.22, marketCapUnit: "T", peRatio: 41.2, pegRatio: 1.65 },
  { symbol: "CRM", name: "Salesforce, Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Application", marketCapValue: 0.28, marketCapUnit: "T", peRatio: 48.0, pegRatio: 1.95 },
  { symbol: "AMD", name: "Advanced Micro Devices, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.24, marketCapUnit: "T", peRatio: 110.4, pegRatio: 1.15 },
  { symbol: "NFLX", name: "Netflix, Inc.", exchange: "NASDAQ", sector: "Communication Services", industry: "Entertainment", marketCapValue: 0.38, marketCapUnit: "T", peRatio: 45.6, pegRatio: 1.42 },
  { symbol: "QCOM", name: "QUALCOMM Incorporated", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.19, marketCapUnit: "T", peRatio: 17.8, pegRatio: 1.25 },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Diagnostics & Research", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 31.2, pegRatio: 2.45 },
  { symbol: "DIS", name: "The Walt Disney Company", exchange: "NYSE", sector: "Communication Services", industry: "Entertainment", marketCapValue: 0.20, marketCapUnit: "T", peRatio: 35.8, pegRatio: 1.70 },
  { symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.11, marketCapUnit: "T", peRatio: -42.0, pegRatio: -3.10 },
  { symbol: "CSCO", name: "Cisco Systems, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Communication Equipment", marketCapValue: 0.23, marketCapUnit: "T", peRatio: 20.4, pegRatio: 2.80 },
  { symbol: "IBM", name: "International Business Machines", exchange: "NYSE", sector: "Technology", industry: "Information Technology Services", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 22.1, pegRatio: 2.10 },
  { symbol: "UBER", name: "Uber Technologies, Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Application", marketCapValue: 0.16, marketCapUnit: "T", peRatio: 34.0, pegRatio: 0.88 },
  { symbol: "TXN", name: "Texas Instruments Incorporated", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.18, marketCapUnit: "T", peRatio: 32.5, pegRatio: 3.60 },
  { symbol: "NOW", name: "ServiceNow, Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Application", marketCapValue: 0.19, marketCapUnit: "T", peRatio: 88.0, pegRatio: 2.10 },
  { symbol: "AMAT", name: "Applied Materials, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductor Equipment", marketCapValue: 0.15, marketCapUnit: "T", peRatio: 21.0, pegRatio: 1.35 },
  { symbol: "BKNG", name: "Booking Holdings Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Travel Services", marketCapValue: 0.16, marketCapUnit: "T", peRatio: 28.5, pegRatio: 1.20 },
  { symbol: "PLTR", name: "Palantir Technologies Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.14, marketCapUnit: "T", peRatio: 125.0, pegRatio: 2.40 },
  { symbol: "COIN", name: "Coinbase Global, Inc.", exchange: "NASDAQ", sector: "Financial Services", industry: "Financial Data & Exchanges", marketCapValue: 0.08, marketCapUnit: "T", peRatio: 44.2, pegRatio: 0.95 },
  { symbol: "SNOW", name: "Snowflake Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Application", marketCapValue: 0.06, marketCapUnit: "T", peRatio: -65.0, pegRatio: -2.10 },
  { symbol: "SHOP", name: "Shopify Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Application", marketCapValue: 0.13, marketCapUnit: "T", peRatio: 78.5, pegRatio: 1.60 },
  { symbol: "CRWD", name: "CrowdStrike Holdings, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.09, marketCapUnit: "T", peRatio: 82.0, pegRatio: 1.75 },
  { symbol: "PANW", name: "Palo Alto Networks, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.12, marketCapUnit: "T", peRatio: 46.8, pegRatio: 2.15 },
  { symbol: "ABNB", name: "Airbnb, Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Travel Services", marketCapValue: 0.09, marketCapUnit: "T", peRatio: 30.2, pegRatio: 1.45 },
  { symbol: "SQ", name: "Block, Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Software - Infrastructure", marketCapValue: 0.05, marketCapUnit: "T", peRatio: 36.4, pegRatio: 0.85 },
  { symbol: "SPOT", name: "Spotify Technology S.A.", exchange: "NYSE", sector: "Communication Services", industry: "Entertainment", marketCapValue: 0.09, marketCapUnit: "T", peRatio: 72.0, pegRatio: 1.10 },
  { symbol: "PYPL", name: "PayPal Holdings, Inc.", exchange: "NASDAQ", sector: "Financial Services", industry: "Credit Services", marketCapValue: 0.07, marketCapUnit: "T", peRatio: 18.2, pegRatio: 1.12 },
  { symbol: "MU", name: "Micron Technology, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.11, marketCapUnit: "T", peRatio: 19.5, pegRatio: 0.74 },
  { symbol: "LRCX", name: "Lam Research Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductor Equipment", marketCapValue: 0.10, marketCapUnit: "T", peRatio: 24.8, pegRatio: 1.42 },
  { symbol: "KLAC", name: "KLA Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductor Equipment", marketCapValue: 0.09, marketCapUnit: "T", peRatio: 28.4, pegRatio: 1.65 },
  { symbol: "MCD", name: "McDonald's Corporation", exchange: "NYSE", sector: "Consumer Cyclical", industry: "Restaurants", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 25.1, pegRatio: 2.80 },
  { symbol: "GE", name: "GE Aerospace", exchange: "NYSE", sector: "Industrials", industry: "Aerospace & Defense", marketCapValue: 0.19, marketCapUnit: "T", peRatio: 38.2, pegRatio: 1.95 },
  { symbol: "CAT", name: "Caterpillar Inc.", exchange: "NYSE", sector: "Industrials", industry: "Farm & Heavy Construction", marketCapValue: 0.19, marketCapUnit: "T", peRatio: 18.4, pegRatio: 1.85 },
  { symbol: "RTX", name: "RTX Corporation", exchange: "NYSE", sector: "Industrials", industry: "Aerospace & Defense", marketCapValue: 0.16, marketCapUnit: "T", peRatio: 32.1, pegRatio: 1.72 },
  { symbol: "BA", name: "The Boeing Company", exchange: "NYSE", sector: "Industrials", industry: "Aerospace & Defense", marketCapValue: 0.11, marketCapUnit: "T", peRatio: -28.0, pegRatio: -1.50 },
  { symbol: "GS", name: "The Goldman Sachs Group, Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Capital Markets", marketCapValue: 0.18, marketCapUnit: "T", peRatio: 15.2, pegRatio: 1.35 },
  { symbol: "MS", name: "Morgan Stanley", exchange: "NYSE", sector: "Financial Services", industry: "Capital Markets", marketCapValue: 0.17, marketCapUnit: "T", peRatio: 16.8, pegRatio: 1.48 },
  { symbol: "C", name: "Citigroup Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Banks - Diversified", marketCapValue: 0.13, marketCapUnit: "T", peRatio: 14.1, pegRatio: 1.60 },
  { symbol: "WFC", name: "Wells Fargo & Company", exchange: "NYSE", sector: "Financial Services", industry: "Banks - Diversified", marketCapValue: 0.23, marketCapUnit: "T", peRatio: 12.8, pegRatio: 1.40 },
  { symbol: "AXP", name: "American Express Company", exchange: "NYSE", sector: "Financial Services", industry: "Credit Services", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 21.4, pegRatio: 1.55 },
  { symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.15, marketCapUnit: "T", peRatio: 14.6, pegRatio: 2.10 },
  { symbol: "MRK", name: "Merck & Co., Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.25, marketCapUnit: "T", peRatio: 16.4, pegRatio: 1.25 },
  { symbol: "ABBV", name: "AbbVie Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.34, marketCapUnit: "T", peRatio: 62.4, pegRatio: 1.80 },
  { symbol: "AMGN", name: "Amgen Inc.", exchange: "NASDAQ", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.16, marketCapUnit: "T", peRatio: 22.8, pegRatio: 1.95 },
  { symbol: "GILD", name: "Gilead Sciences, Inc.", exchange: "NASDAQ", sector: "Healthcare", industry: "Drug Manufacturers - General", marketCapValue: 0.11, marketCapUnit: "T", peRatio: 15.2, pegRatio: 1.45 },
  { symbol: "ISRG", name: "Intuitive Surgical, Inc.", exchange: "NASDAQ", sector: "Healthcare", industry: "Medical Instruments & Supplies", marketCapValue: 0.18, marketCapUnit: "T", peRatio: 82.5, pegRatio: 3.10 },
  { symbol: "ABT", name: "Abbott Laboratories", exchange: "NYSE", sector: "Healthcare", industry: "Medical Devices", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 26.4, pegRatio: 2.40 },
  { symbol: "DHR", name: "Danaher Corporation", exchange: "NYSE", sector: "Healthcare", industry: "Diagnostics & Research", marketCapValue: 0.17, marketCapUnit: "T", peRatio: 42.1, pegRatio: 2.85 },
  { symbol: "LIN", name: "Linde plc", exchange: "NASDAQ", sector: "Basic Materials", industry: "Specialty Chemicals", marketCapValue: 0.21, marketCapUnit: "T", peRatio: 33.2, pegRatio: 2.50 },
  { symbol: "NKE", name: "NIKE, Inc.", exchange: "NYSE", sector: "Consumer Cyclical", industry: "Footwear & Accessories", marketCapValue: 0.12, marketCapUnit: "T", peRatio: 24.5, pegRatio: 2.10 },
  { symbol: "LOW", name: "Lowe's Companies, Inc.", exchange: "NYSE", sector: "Consumer Cyclical", industry: "Home Improvement Retail", marketCapValue: 0.14, marketCapUnit: "T", peRatio: 19.8, pegRatio: 1.90 },
  { symbol: "TGT", name: "Target Corporation", exchange: "NYSE", sector: "Consumer Defensive", industry: "Discount Stores", marketCapValue: 0.06, marketCapUnit: "T", peRatio: 14.2, pegRatio: 1.30 },
  { symbol: "TJX", name: "The TJX Companies, Inc.", exchange: "NYSE", sector: "Consumer Cyclical", industry: "Apparel Retail", marketCapValue: 0.13, marketCapUnit: "T", peRatio: 28.6, pegRatio: 2.45 },
  { symbol: "SBUX", name: "Starbucks Corporation", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Restaurants", marketCapValue: 0.11, marketCapUnit: "T", peRatio: 27.5, pegRatio: 2.60 },
  { symbol: "CMCSA", name: "Comcast Corporation", exchange: "NASDAQ", sector: "Communication Services", industry: "Telecom Services", marketCapValue: 0.16, marketCapUnit: "T", peRatio: 10.4, pegRatio: 1.15 },
  { symbol: "T", name: "AT&T Inc.", exchange: "NYSE", sector: "Communication Services", industry: "Telecom Services", marketCapValue: 0.15, marketCapUnit: "T", peRatio: 11.2, pegRatio: 1.05 },
  { symbol: "VZ", name: "Verizon Communications Inc.", exchange: "NYSE", sector: "Communication Services", industry: "Telecom Services", marketCapValue: 0.17, marketCapUnit: "T", peRatio: 10.8, pegRatio: 1.10 },
  { symbol: "TMUS", name: "T-Mobile US, Inc.", exchange: "NASDAQ", sector: "Communication Services", industry: "Telecom Services", marketCapValue: 0.24, marketCapUnit: "T", peRatio: 24.2, pegRatio: 1.65 },
  { symbol: "INTU", name: "Intuit Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Application", marketCapValue: 0.18, marketCapUnit: "T", peRatio: 54.2, pegRatio: 2.15 },
  { symbol: "ADI", name: "Analog Devices, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.11, marketCapUnit: "T", peRatio: 42.6, pegRatio: 2.80 },
  { symbol: "MELI", name: "MercadoLibre, Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Internet Retail", marketCapValue: 0.10, marketCapUnit: "T", peRatio: 68.4, pegRatio: 1.45 },
  { symbol: "DELL", name: "Dell Technologies Inc.", exchange: "NYSE", sector: "Technology", industry: "Computer Hardware", marketCapValue: 0.09, marketCapUnit: "T", peRatio: 22.4, pegRatio: 1.15 },
  { symbol: "ARM", name: "Arm Holdings plc", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.14, marketCapUnit: "T", peRatio: 145.0, pegRatio: 2.90 },
  { symbol: "APP", name: "AppLovin Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Software - Application", marketCapValue: 0.11, marketCapUnit: "T", peRatio: 85.2, pegRatio: 1.85 },
  { symbol: "MSTR", name: "MicroStrategy Incorporated", exchange: "NASDAQ", sector: "Technology", industry: "Software - Application", marketCapValue: 0.08, marketCapUnit: "T", peRatio: 95.0, pegRatio: 2.20 },
  { symbol: "CRCL", name: "Circle Internet Financial", exchange: "NYSE", sector: "Financial Services", industry: "Financial Technology", marketCapValue: 0.04, marketCapUnit: "T", peRatio: 35.0, pegRatio: 1.50 },
  { symbol: "HOOD", name: "Robinhood Markets, Inc.", exchange: "NASDAQ", sector: "Financial Services", industry: "Capital Markets", marketCapValue: 0.03, marketCapUnit: "T", peRatio: 42.0, pegRatio: 1.20 },
  { symbol: "RBLX", name: "Roblox Corporation", exchange: "NYSE", sector: "Communication Services", industry: "Electronic Gaming & Multimedia", marketCapValue: 0.03, marketCapUnit: "T", peRatio: -25.0, pegRatio: -1.80 },
  { symbol: "RDDT", name: "Reddit, Inc.", exchange: "NYSE", sector: "Communication Services", industry: "Internet Content & Information", marketCapValue: 0.03, marketCapUnit: "T", peRatio: 65.0, pegRatio: 2.10 },
  { symbol: "MARA", name: "MARA Holdings, Inc.", exchange: "NASDAQ", sector: "Financial Services", industry: "Capital Markets", marketCapValue: 0.01, marketCapUnit: "T", peRatio: 18.0, pegRatio: 0.90 },
  { symbol: "IONQ", name: "IonQ, Inc.", exchange: "NYSE", sector: "Technology", industry: "Computer Hardware", marketCapValue: 0.01, marketCapUnit: "T", peRatio: -15.0, pegRatio: -1.10 },
  { symbol: "SMCI", name: "Super Micro Computer, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Computer Hardware", marketCapValue: 0.03, marketCapUnit: "T", peRatio: 16.5, pegRatio: 0.65 },
  { symbol: "MRVL", name: "Marvell Technology, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.08, marketCapUnit: "T", peRatio: 55.0, pegRatio: 1.95 },
  { symbol: "ON", name: "ON Semiconductor Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors", marketCapValue: 0.03, marketCapUnit: "T", peRatio: 14.8, pegRatio: 1.20 },
  { symbol: "CEG", name: "Constellation Energy Corp.", exchange: "NASDAQ", sector: "Utilities", industry: "Utilities - Independent Power", marketCapValue: 0.08, marketCapUnit: "T", peRatio: 32.4, pegRatio: 1.85 },
  { symbol: "NET", name: "Cloudflare, Inc.", exchange: "NYSE", sector: "Technology", industry: "Software - Infrastructure", marketCapValue: 0.04, marketCapUnit: "T", peRatio: -110.0, pegRatio: 2.10 },
  { symbol: "WDAY", name: "Workday, Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Software - Application", marketCapValue: 0.07, marketCapUnit: "T", peRatio: 48.5, pegRatio: 1.75 }
];

const INITIAL_BATCH_SIZE = 15;
const BATCH_INCREMENT = 12;

export default function History() {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);
  const [selectedStockForModal, setSelectedStockForModal] = useState<StockData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);
  
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // 1. Fetch real market data from Yahoo Finance API endpoint on mount & in batches
  useEffect(() => {
    let isMounted = true;

    async function fetchRealMarketData() {
      if (!isMounted) return;
      setIsLiveSyncing(true);
      try {
        // Fetch in batches of 20 stocks to sync smoothly
        const allSymbols = INITIAL_STOCKS.map(s => s.symbol);
        const batchSize = 25;
        
        for (let i = 0; i < Math.min(allSymbols.length, 50); i += batchSize) {
          const chunk = allSymbols.slice(i, i + batchSize).join(",");
          const res = await fetch(`/api/stock?tickers=${chunk}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
              setStocks((prev) =>
                prev.map((stock) => {
                  const real = json.data.find((d: any) => d.symbol === stock.symbol);
                  if (!real) return stock;

                  let mcVal = stock.marketCapValue;
                  let mcUnit = stock.marketCapUnit;
                  if (real.marketCap && real.marketCap > 0) {
                    if (real.marketCap >= 1e12) {
                      mcVal = Number((real.marketCap / 1e12).toFixed(2));
                      mcUnit = "T";
                    } else if (real.marketCap >= 1e9) {
                      mcVal = Number((real.marketCap / 1e9).toFixed(2));
                      mcUnit = "B";
                    }
                  }

                  const peVal = real.trailingPE !== null && real.trailingPE !== undefined && real.trailingPE > 0
                    ? Number(real.trailingPE)
                    : stock.peRatio;

                  const pegVal = real.pegRatio !== null && real.pegRatio !== undefined
                    ? Number(real.pegRatio)
                    : stock.pegRatio;

                  const finalSector = (real.sector && real.sector !== "-") ? real.sector : stock.sector;
                  const finalIndustry = (real.industry && real.industry !== "-") ? real.industry : stock.industry;
                  const finalExchange = (real.exchange && real.exchange !== "-") ? real.exchange : stock.exchange;

                  return {
                    ...stock,
                    name: real.companyName || stock.name,
                    exchange: finalExchange,
                    sector: finalSector,
                    industry: finalIndustry,
                    marketCapValue: mcVal,
                    marketCapUnit: mcUnit,
                    peRatio: peVal,
                    pegRatio: pegVal,
                  };
                })
              );
            }
          }
        }
        if (isMounted) {
          setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.warn("[History] Live market data sync warning:", err);
      } finally {
        if (isMounted) setIsLiveSyncing(false);
      }
    }

    fetchRealMarketData();
    const interval = setInterval(fetchRealMarketData, 45000); // 45s periodic real sync

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. Micro-fluctuation telemetry ticker effect for visual dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const multiplier = 1 + (Math.random() * 0.002 - 0.001);
          const pegChange = Math.random() * 0.008 - 0.004;

          return {
            ...stock,
            marketCapValue: Number((stock.marketCapValue * multiplier).toFixed(2)),
            peRatio: Number((stock.peRatio * multiplier).toFixed(1)),
            pegRatio: Number((stock.pegRatio + pegChange).toFixed(2)),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Filtered dataset based on search query
  const filteredStocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stocks;

    return stocks.filter((stock) =>
      stock.symbol.toLowerCase().includes(query) ||
      stock.name.toLowerCase().includes(query) ||
      stock.sector.toLowerCase().includes(query) ||
      stock.industry.toLowerCase().includes(query) ||
      stock.exchange.toLowerCase().includes(query)
    );
  }, [stocks, searchQuery]);

  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [searchQuery]);

  // Infinite Scroll Trigger
  const loadMore = useCallback(() => {
    if (visibleCount >= filteredStocks.length || isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, filteredStocks.length));
      setIsLoadingMore(false);
    }, 150);
  }, [visibleCount, filteredStocks.length, isLoadingMore]);

  // IntersectionObserver specifically inside the table card scroll container
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = tableContainerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root: container, rootMargin: "150px", threshold: 0.05 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Scroll listener on the table container as a robust secondary trigger
  const handleContainerScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 120) {
      loadMore();
    }
  }, [loadMore]);

  const displayedStocks = filteredStocks.slice(0, visibleCount);

  // If a stock is clicked, replace the entire Data Logs view with the Stock Detail View
  if (selectedStockForModal) {
    return (
      <StockDetailModal
        stock={selectedStockForModal}
        onBack={() => setSelectedStockForModal(null)}
      />
    );
  }

  return (
    <div>
      {/* Header Toolbar with Search Bar */}
      <div className="dash-dl-head">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 className="dash-dl-title">Data Logs</h2>
          {lastSyncedTime && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--mono)", color: "var(--up)", background: "var(--up-soft)", padding: "3px 8px", borderRadius: 4, border: "1px solid rgba(14, 126, 72, 0.2)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--up)", display: "inline-block" }}></span>
              Live Synced {lastSyncedTime}
            </span>
          )}
        </div>

        <div className="dash-dl-toolbar">
          <div className="dash-search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="dash-search-input"
              placeholder="Search symbol, company name, sector, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="dash-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="dash-dl-badge">
            {displayedStocks.length} of {filteredStocks.length}
          </div>
        </div>
      </div>

      {/* Main Table Card (Only this scrolls) */}
      <div
        ref={tableContainerRef}
        onScroll={handleContainerScroll}
        className="dash-table-wrap"
      >
        <table className="dash-table">
          <thead>
            <tr>
              <th style={{ width: 45 }}>#</th>
              <th>Company</th>
              <th>Name</th>
              <th>Exchange</th>
              <th>Sector</th>
              <th>Industry</th>
              <th style={{ textAlign: "right" }}>Market Cap</th>
              <th style={{ textAlign: "right" }}>P/E Ratio</th>
              <th style={{ textAlign: "right" }}>PEG Ratio</th>
            </tr>
          </thead>
          <tbody>
            {displayedStocks.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "48px 16px", color: "var(--muted)" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "13px" }}>
                    No equities found matching &quot;{searchQuery}&quot;
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--faint)", marginTop: "6px" }}>
                    Try searching by another ticker symbol, company name, or sector.
                  </div>
                </td>
              </tr>
            ) : (
              displayedStocks.map((r, index) => {
                const peClass = r.peRatio > 60 ? 'dash-neg' : (r.peRatio > 0 && r.peRatio < 25 ? 'dash-pos' : '');
                const pegClass = r.pegRatio < 0 ? 'dash-neg' : (r.pegRatio < 1 ? 'dash-pos' : '');

                return (
                  <tr
                    key={r.symbol}
                    onClick={() => setSelectedStockForModal(r)}
                    style={{ cursor: "pointer" }}
                    title={`Click to view interactive charts & fundamentals for ${r.symbol}`}
                  >
                    <td className="dash-num" style={{ color: "var(--faint)", fontSize: "12px" }}>{index + 1}</td>
                    <td>
                      <div className="dash-co-cell">
                        <CompanyLogo symbol={r.symbol} />
                        <span>{r.symbol}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td><span style={{ fontFamily: "var(--mono)", fontSize: "11.5px", color: "var(--muted)" }}>{r.exchange}</span></td>
                    <td>{r.sector}</td>
                    <td style={{ color: "var(--muted)", fontSize: "12.5px" }}>{r.industry}</td>
                    <td className="dash-num" style={{ textAlign: "right" }}>
                      <strong>${r.marketCapValue.toFixed(2)}{r.marketCapUnit}</strong>
                    </td>
                    <td className={`dash-num ${peClass}`} style={{ textAlign: "right" }}>
                      {r.peRatio > 0 ? `${r.peRatio.toFixed(1)}x` : `${r.peRatio.toFixed(1)}`}
                    </td>
                    <td className={`dash-num ${pegClass}`} style={{ textAlign: "right" }}>
                      {r.pegRatio.toFixed(2)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Infinite Scroll Sentinel & Loader */}
        {visibleCount < filteredStocks.length && (
          <div ref={sentinelRef} className="dash-infinite-loading">
            <svg style={{ animation: "spin 1s linear infinite", width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            <span>Loading additional equities ({visibleCount} of {filteredStocks.length})...</span>
          </div>
        )}

        {visibleCount >= filteredStocks.length && filteredStocks.length > 0 && (
          <div className="dash-infinite-end">
            All records loaded • {filteredStocks.length} equities indexed
          </div>
        )}
      </div>
    </div>
  );
}
