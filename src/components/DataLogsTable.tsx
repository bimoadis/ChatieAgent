"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Tipe data gabungan dari API dan Mock (karena keterbatasan Chart API saat ini)
interface ScreenerData {
  id: number
  symbol: string
  name: string
  exchange: string
  sector: string
  industry: string
  marketCap: number | string
  peRatio: number | string
  pegRatio: number | string
}

// Daftar ticker yang ingin kita tampilkan seperti di gambar
const TARGET_TICKERS = ["NVDA", "GOOGL", "AAPL", "MSFT", "AMZN", "META", "TSLA"]

export function DataLogsTable() {
  const [data, setData] = useState<ScreenerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchScreenerData() {
      setLoading(true)
      try {
        // Fetch semua ticker secara paralel ke route handler lokal Anda
        const promises = TARGET_TICKERS.map(async (ticker, index) => {
          // Asumsi Anda memiliki route ini yang memanggil yahoo-finance.ts
          const res = await fetch(`/api/stock?ticker=${ticker}`) 
          if (!res.ok) return null
          const result = await res.json()
          
          return {
            id: index + 1,
            symbol: result.data.symbol || ticker,
            name: result.data.companyName || ticker,
            exchange: "NASDAQ", // Hardcode sementara karena tidak ada di Chart API
            sector: "Technology", // Hardcode sementara
            industry: "Software & IT Services", // Hardcode sementara
            // Format Market Cap ke format Triliun (T)
            marketCap: result.data.marketCap 
              ? `$${(result.data.marketCap / 1e12).toFixed(2)}T` 
              : "N/A",
            peRatio: result.data.peRatio || "30.5x", // Placeholder, Chart API = 0
            pegRatio: (Math.random() * 2 - 0.5).toFixed(2), // Placeholder random
          } as ScreenerData
        })

        const results = await Promise.all(promises)
        setData(results.filter((item): item is ScreenerData => item !== null))
      } catch (error) {
        console.error("Error fetching screener data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchScreenerData()
  }, [])

  if (loading) {
    return <div className="p-8 text-neutral-500 animate-pulse">Memuat Data Logs...</div>
  }

  return (
    <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm font-sans">
      <Table>
        <TableHeader className="bg-neutral-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="font-semibold text-neutral-600">Company</TableHead>
            <TableHead className="font-semibold text-neutral-600">Name</TableHead>
            <TableHead className="font-semibold text-neutral-600">Exchange</TableHead>
            <TableHead className="font-semibold text-neutral-600">Sector</TableHead>
            <TableHead className="font-semibold text-neutral-600">Industry</TableHead>
            <TableHead className="text-right font-semibold text-neutral-600">Market Cap</TableHead>
            <TableHead className="text-right font-semibold text-neutral-600">P/E Ratio</TableHead>
            <TableHead className="text-right font-semibold text-neutral-600">PEG Ratio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const pegNum = Number(row.pegRatio);
            const isPegPositive = pegNum > 0;

            return (
              <TableRow key={row.symbol} className="hover:bg-neutral-50 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-2 pl-2">
                    <Checkbox id={`check-${row.symbol}`} />
                    <span className="text-xs text-neutral-400">{row.id}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-neutral-900">
                  {/* Tempat logo/icon kecil jika ada */}
                  {row.symbol}
                </TableCell>
                <TableCell className="text-neutral-600">{row.name}</TableCell>
                <TableCell className="text-neutral-500">{row.exchange}</TableCell>
                <TableCell className="text-neutral-500">{row.sector}</TableCell>
                <TableCell className="text-neutral-500">{row.industry}</TableCell>
                <TableCell className="text-right font-medium text-neutral-900">{row.marketCap}</TableCell>
                <TableCell className="text-right font-medium text-neutral-900">{row.peRatio}</TableCell>
                <TableCell className={`text-right font-medium ${isPegPositive ? 'text-green-600' : 'text-red-500'}`}>
                  {row.pegRatio}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}