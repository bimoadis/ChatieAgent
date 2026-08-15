"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnalysisResult } from "@/types"
import { cn, getRiskColor } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, Share2 } from "lucide-react"

interface PortfolioDecisionProps {
  result: AnalysisResult
}

export function PortfolioDecision({ result }: PortfolioDecisionProps) {
  const { finalDecision, symbol } = result

  const DecisionIcon = finalDecision.decision === "BUY"
    ? TrendingUp
    : finalDecision.decision === "SELL"
    ? TrendingDown
    : Minus

  const handleShare = () => {
    const text = `Chatie Agent Multi-Agent Equity Terminal analyzed $${symbol}:

→ ${finalDecision.decision}
→ Conviction: ${finalDecision.confidence}%
→ Risk Profile: ${finalDecision.riskLevel}
→ Consensus: ${finalDecision.summary}

Run your ticker: localhost:3000`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank", "width=550,height=420")
  }

  return (
    <Card className="border border-[#E7E5DE] bg-white shadow-sm h-full flex flex-col justify-between font-[family-name:var(--font-geist-sans)]">
      <div>
        <CardHeader className="text-center pb-2 border-b border-[#EFEDE6]">
          <CardTitle className="text-xs font-semibold text-[#A3A29B] uppercase tracking-wider font-[family-name:var(--font-geist-mono)]">
            Consensus Output
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pt-6">
          {/* Main Decision */}
          <div className={cn(
            "inline-flex items-center gap-3 px-6 py-3 rounded-xl mb-4 border",
            finalDecision.decision === "BUY" && "bg-[#0E7E48]/10 text-[#0E7E48] border-[#0E7E48]/25",
            finalDecision.decision === "SELL" && "bg-[#B42318]/10 text-[#B42318] border-[#B42318]/25",
            finalDecision.decision === "HOLD" && "bg-[#F1F0EA] text-[#6F6E69] border-[#E7E5DE]"
          )}>
            <DecisionIcon className="w-8 h-8" />
            <span className="text-4xl font-bold font-[family-name:var(--font-geist-mono)]">
              {finalDecision.decision}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E7E5DE]">
              <p className="text-[10px] text-[#A3A29B] uppercase font-semibold font-[family-name:var(--font-geist-mono)]">Conviction</p>
              <p className="text-xl font-bold font-[family-name:var(--font-geist-mono)] text-[#141413] tabular-nums">{finalDecision.confidence}%</p>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F6] border border-[#E7E5DE]">
              <p className="text-[10px] text-[#A3A29B] uppercase font-semibold font-[family-name:var(--font-geist-mono)]">Risk Profile</p>
              <Badge className={cn("mt-1 shadow-none text-xs font-semibold font-[family-name:var(--font-geist-mono)]", getRiskColor(finalDecision.riskLevel))}>
                {finalDecision.riskLevel}
              </Badge>
            </div>
          </div>

          {/* Summary */}
          <p className="text-xs text-[#6F6E69] mb-4 leading-relaxed text-left">
            {finalDecision.summary}
          </p>
        </CardContent>
      </div>

      <div className="p-6 pt-0">
        <Button
          onClick={handleShare}
          className="w-full gap-2 bg-[#141413] hover:bg-[#1E4DD8] text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share to X
        </Button>
      </div>
    </Card>
  )
}
