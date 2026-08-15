"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AgentInsight } from "@/types"
import { cn, getDecisionColor } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, User, Briefcase, Activity, ShieldAlert, Terminal } from "lucide-react"

interface AgentCardProps {
  agent: AgentInsight
  compact?: boolean
}

const agentIcons: Record<string, React.ReactNode> = {
  value: <Briefcase className="w-4 h-4" />,
  growth: <TrendingUp className="w-4 h-4" />,
  quant: <Activity className="w-4 h-4" />,
  sentiment: <ShieldAlert className="w-4 h-4" />,
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const decisionClass = getDecisionColor(agent.decision)

  const DecisionIcon = agent.decision === "BUY"
    ? TrendingUp
    : agent.decision === "SELL"
    ? TrendingDown
    : Minus

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 bg-white border border-[#E7E5DE] hover:border-[#1E4DD8]/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#FAF9F6] group-hover:bg-[#1E4DD8]/10 transition-colors border border-[#E7E5DE] text-[#6F6E69] group-hover:text-[#1E4DD8]">
                  {agentIcons[agent.agent] || <User className="w-4 h-4" />}
                </div>
                <CardTitle className="text-sm font-bold text-[#141413] group-hover:text-[#1E4DD8] transition-colors">
                  {agent.name}
                </CardTitle>
              </div>
              <Badge className={cn("font-bold text-[11px] shadow-none", decisionClass)}>
                <DecisionIcon className="w-3 h-3 mr-1" />
                {agent.decision}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#A3A29B] font-semibold uppercase tracking-wider text-[10px] font-[family-name:var(--font-geist-mono)]">
                    Conviction Score
                  </span>
                  <span className="font-bold font-[family-name:var(--font-geist-mono)] text-[#141413] tabular-nums">
                    {agent.confidence}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#EFEDE6] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      agent.decision === "BUY" ? "bg-[#0E7E48]" : agent.decision === "SELL" ? "bg-[#B42318]" : "bg-[#1E4DD8]"
                    )}
                    style={{ width: `${agent.confidence}%` }}
                  />
                </div>
              </div>

              {!compact && (
                <p className="text-xs text-[#6F6E69] leading-relaxed line-clamp-3">
                  {agent.reasoning}
                </p>
              )}
            </div>
            
            <div className="mt-3 pt-2.5 border-t border-[#EFEDE6] text-[10px] text-[#A3A29B] uppercase tracking-widest font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-geist-mono)]">
               View Full Dossier →
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* MODAL / DIALOG CONTENT */}
      <DialogContent className="sm:max-w-[600px] bg-white border-[#E7E5DE] text-[#141413] p-0 overflow-hidden font-[family-name:var(--font-geist-sans)] shadow-2xl">
        <div className="p-6 border-b border-[#E7E5DE] bg-[#FAF9F6] relative overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E7E5DE] flex items-center justify-center text-[#1E4DD8] shadow-sm">
                  {agentIcons[agent.agent] || <User className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A3A29B] font-[family-name:var(--font-geist-mono)] mb-0.5">
                    Investor Mandate
                  </p>
                  <DialogTitle className="text-lg font-bold text-[#141413]">{agent.name}</DialogTitle>
                </div>
              </div>
              <Badge className={cn("font-bold text-xs px-3 py-1 shadow-none", decisionClass)}>
                <DecisionIcon className="w-3.5 h-3.5 mr-1.5" />
                {agent.decision}
              </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE]">
              <p className="text-[10px] text-[#A3A29B] uppercase tracking-wider font-semibold mb-1 font-[family-name:var(--font-geist-mono)]">
                Conviction Score
              </p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold font-[family-name:var(--font-geist-mono)] text-[#141413] tabular-nums">
                  {agent.confidence}%
                </span>
                <span className="text-xs text-[#0E7E48] font-semibold mb-1 font-[family-name:var(--font-geist-mono)]">HIGH</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE] flex flex-col justify-center">
              <p className="text-[10px] text-[#A3A29B] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5 font-[family-name:var(--font-geist-mono)]">
                <Terminal className="w-3 h-3 text-[#1E4DD8]" /> Execution Node
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold text-[#1E4DD8] bg-[#1E4DD8]/10 px-2 py-1 rounded inline-block self-start border border-[#1E4DD8]/20">
                chatie_node_{agent.agent}_v2
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#6F6E69] font-semibold uppercase tracking-widest mb-2 font-[family-name:var(--font-geist-mono)] flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#1E4DD8]" /> Model Reasoning Output
            </p>
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E7E5DE] font-[family-name:var(--font-geist-mono)] text-xs text-[#141413] leading-relaxed h-[180px] overflow-y-auto">
              {agent.reasoning}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}