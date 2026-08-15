export interface StockQuote {
  symbol: string;
  companyName: string;
  currentPrice: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
  volume: number;
  historicalData: {
    date: string;
    price: number;
  }[];
  quantitative: {
    sma20: number;
    volatility: number;
    riskLevel: string;
    rsi14: number;
    trend: string;
  };
  news: {
    title: string;
    publisher: string;
    link: string;
  }[];
}

export interface AgentInsight {
  agent: 'value' | 'growth' | 'quant' | 'sentiment';
  name: string;
  decision: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
}

export interface AnalysisResult {
  symbol: string;
  quote: StockQuote;
  agents: AgentInsight[];
  finalDecision: {
    decision: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    riskLevel: string;
    summary: string;
  };
  timestamp: Date;
}

export type PersonaType = 'conservative' | 'aggressive' | 'balanced';

export interface AnalysisHistory {
  id: string;
  symbol: string;
  result: AnalysisResult;
  timestamp: Date;
}
