"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockQuote } from "@/types"
import { formatCurrency, getRiskColor } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface StockChartProps {
  data: StockQuote
}

export function StockChart({ data }: StockChartProps) {
  const priceChange = data.historicalData && data.historicalData.length > 1
    ? data.historicalData[data.historicalData.length - 1].price - data.historicalData[0].price
    : 0
  const percentChange = data.historicalData && data.historicalData.length > 1
    ? ((priceChange / data.historicalData[0].price) * 100).toFixed(2)
    : "0.00"
  const isPositive = priceChange >= 0

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="pb-4 border-b border-[#EFEDE6] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#141413]">{data.companyName}</h2>
          <p className="text-xs font-semibold text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">{data.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-[#141413] font-[family-name:var(--font-geist-mono)] tabular-nums">
            ${data.currentPrice.toFixed(2)}
          </p>
          <p className={`text-xs font-semibold font-[family-name:var(--font-geist-mono)] ${isPositive ? "text-[#0E7E48]" : "text-[#B42318]"}`}>
            {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({percentChange}%)
          </p>
        </div>
      </div>

      <div>
        {/* Chart */}
        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.historicalData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#0E7E48" : "#B42318"} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={isPositive ? "#0E7E48" : "#B42318"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#A3A29B", fontFamily: "var(--font-geist-mono)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 11, fill: "#A3A29B", fontFamily: "var(--font-geist-mono)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E7E5DE',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#0E7E48" : "#B42318"}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
            <p className="text-[10px] uppercase font-semibold text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">P/E Ratio</p>
            <p className="text-base font-bold font-[family-name:var(--font-geist-mono)] text-[#141413] mt-0.5">
              {data.peRatio > 0 ? data.peRatio.toFixed(2) : "N/A"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
            <p className="text-[10px] uppercase font-semibold text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">RSI (14)</p>
            <p className="text-base font-bold font-[family-name:var(--font-geist-mono)] text-[#141413] mt-0.5">
              {data.quantitative.rsi14}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
            <p className="text-[10px] uppercase font-semibold text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">Trend Status</p>
            <p className={`text-base font-bold font-[family-name:var(--font-geist-mono)] mt-0.5 ${data.quantitative.trend === 'Bullish' ? 'text-[#0E7E48]' : 'text-[#B42318]'}`}>
              {data.quantitative.trend}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
            <p className="text-[10px] uppercase font-semibold text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">Risk Assessment</p>
            <Badge className={`mt-1 text-[11px] shadow-none font-[family-name:var(--font-geist-mono)] ${getRiskColor(data.quantitative.riskLevel)}`}>
              {data.quantitative.riskLevel}
            </Badge>
          </div>
        </div>

        {/* Market Cap & Range */}
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#EFEDE6] font-[family-name:var(--font-geist-mono)] text-xs">
          <div>
            <span className="text-[#A3A29B]">Market Cap: </span>
            <span className="font-semibold text-[#141413]">{formatCurrency(data.marketCap)}</span>
          </div>
          <div>
            <span className="text-[#A3A29B]">52W Range: </span>
            <span className="font-semibold text-[#141413]">${data.week52Low.toFixed(2)} - ${data.week52High.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#A3A29B]">Volume: </span>
            <span className="font-semibold text-[#141413]">{(data.volume / 1e6).toFixed(2)}M</span>
          </div>
        </div>
      </div>
    </div>
  )
}
