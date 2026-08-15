"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StockQuote } from "@/types"
import { Newspaper, ExternalLink } from "lucide-react"

interface NewsFeedProps {
  news: StockQuote['news']
}

export function NewsFeed({ news }: NewsFeedProps) {
  if (!news || news.length === 0) {
    return (
      <Card className="border-[#E7E5DE] bg-white shadow-sm font-[family-name:var(--font-geist-sans)]">
        <CardHeader className="pb-3 border-b border-[#EFEDE6]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#1E4DD8]" />
            <CardTitle className="text-sm font-bold text-[#141413]">Recent Disclosures & Filings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-[#A3A29B] text-center py-4 font-[family-name:var(--font-geist-mono)]">
            No recent items recorded
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#E7E5DE] bg-white shadow-sm font-[family-name:var(--font-geist-sans)]">
      <CardHeader className="pb-3 border-b border-[#EFEDE6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#1E4DD8]" />
            <CardTitle className="text-sm font-bold text-[#141413]">Recent Disclosures & Filings</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-[#FAF9F6] border border-[#E7E5DE] text-[10px] text-[#A3A29B] font-[family-name:var(--font-geist-mono)]">
            {news.length} items
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl border border-[#E7E5DE] hover:border-[#1E4DD8]/40 hover:bg-[#FAF9F6] transition-colors group"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#141413] group-hover:text-[#1E4DD8] line-clamp-2 transition-colors">
                  {item.title}
                </p>
                <p className="text-[10px] text-[#A3A29B] mt-1 uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
                  {item.publisher}
                </p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#A3A29B] group-hover:text-[#1E4DD8] flex-shrink-0 mt-0.5 transition-colors" />
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}
