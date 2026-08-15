"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AgentInsight, StockQuote } from "@/types"
import { cn, getDecisionColor } from "@/lib/utils"
import { MessageSquare, Bot, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface AIReasoningPanelProps {
  agents: AgentInsight[]
  quote: StockQuote
}

export function AIReasoningPanel({ agents, quote }: AIReasoningPanelProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)

  const toggleAgent = (agentName: string) => {
    setExpandedAgent(expandedAgent === agentName ? null : agentName)
  }

  return (
    <Card className="border border-[#E7E5DE] bg-white shadow-sm font-[family-name:var(--font-geist-sans)]">
      <CardHeader className="pb-3 border-b border-[#EFEDE6]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#1E4DD8]" />
          <CardTitle className="text-sm font-bold text-[#141413]">Reasoning Matrix Breakdown</CardTitle>
          <Badge variant="secondary" className="ml-auto bg-[#FAF9F6] border border-[#E7E5DE] text-[#6F6E69] text-[11px] font-[family-name:var(--font-geist-mono)]">
            <Bot className="w-3 h-3 mr-1 text-[#1E4DD8]" />
            Multi-Agent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {agents.map((agent) => {
          const isExpanded = expandedAgent === agent.name
          const decisionClass = getDecisionColor(agent.decision)

          return (
            <div
              key={agent.agent}
              className="border border-[#E7E5DE] rounded-xl overflow-hidden bg-white transition-colors"
            >
              {/* Agent Header */}
              <button
                onClick={() => toggleAgent(agent.name)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-[#FAF9F6] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Badge className={cn("font-bold text-[10px] shadow-none", decisionClass)}>
                    {agent.decision}
                  </Badge>
                  <span className="text-xs font-semibold text-[#141413]">{agent.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#A3A29B] font-[family-name:var(--font-geist-mono)] tabular-nums">
                    {agent.confidence}% conviction
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#6F6E69]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#6F6E69]" />
                  )}
                </div>
              </button>

              {/* Expanded Reasoning */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-[#EFEDE6] bg-[#FAF9F6]">
                  <p className="text-xs text-[#6F6E69] mt-2 leading-relaxed font-[family-name:var(--font-geist-mono)]">
                    {agent.reasoning}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        {/* Summary Insight */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A3A29B] mb-1 font-[family-name:var(--font-geist-mono)]">
            Quantitative Indicator Summary
          </p>
          <p className="text-xs text-[#141413] leading-relaxed">
            {quote.quantitative.trend === 'Bullish'
              ? `Price above SMA20 confirms upward momentum. RSI at ${quote.quantitative.rsi14} indicates ${quote.quantitative.rsi14 > 70 ? 'overbought' : quote.quantitative.rsi14 < 30 ? 'oversold' : 'neutral'} technical condition.`
              : `Price below SMA20 indicates downward pressure. RSI at ${quote.quantitative.rsi14} indicates ${quote.quantitative.rsi14 > 70 ? 'overbought' : quote.quantitative.rsi14 < 30 ? 'oversold' : 'neutral'} technical condition.`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
