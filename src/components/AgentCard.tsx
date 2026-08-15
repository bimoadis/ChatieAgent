"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AgentInsight } from "@/types";
import { Briefcase, Activity, ShieldAlert, Zap } from "lucide-react";

interface AgentCardProps {
  agent: AgentInsight;
  compact?: boolean;
}

const agentIcons: Record<string, React.ReactNode> = {
  value: <Briefcase className="w-4 h-4 text-emerald-600" />,
  growth: <Zap className="w-4 h-4 text-blue-600" />,
  quant: <Activity className="w-4 h-4 text-purple-600" />,
  sentiment: <ShieldAlert className="w-4 h-4 text-amber-600" />,
};

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const isBuy = agent.decision === "BUY";
  const isSell = agent.decision === "SELL";

  const decisionBg = isBuy
    ? "rgba(14, 126, 72, 0.08)"
    : isSell
    ? "rgba(220, 38, 38, 0.08)"
    : "rgba(202, 138, 4, 0.08)";
  const decisionColor = isBuy ? "#0E7E48" : isSell ? "#DC2626" : "#CA8A04";
  const decisionBorder = isBuy
    ? "rgba(14, 126, 72, 0.25)"
    : isSell
    ? "rgba(220, 38, 38, 0.25)"
    : "rgba(202, 138, 4, 0.25)";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          style={{
            background: "#FAF9F6",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            padding: "16px 18px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="dash-agent-box group hover:-translate-y-1 hover:shadow-md hover:border-blue-500/40"
        >
          <div>
            {/* Top Bar: Icon + Name + Decision Badge */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  {agentIcons[agent.agent] || <Activity className="w-4 h-4 text-blue-600" />}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                  {agent.name}
                </div>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  background: decisionBg,
                  color: decisionColor,
                  border: `1px solid ${decisionBorder}`,
                }}
              >
                {isBuy ? "▲" : isSell ? "▼" : "◆"} {agent.decision}
              </div>
            </div>

            {/* Conviction Bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <span style={{ fontSize: 10, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 600, color: "var(--faint)", letterSpacing: "0.04em" }}>
                  Conviction Score
                </span>
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", fontWeight: 700, color: "var(--ink)" }}>
                  {agent.confidence}%
                </span>
              </div>
              <div style={{ height: 5, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${agent.confidence}%`,
                    borderRadius: 3,
                    background: isBuy ? "#0E7E48" : isSell ? "#DC2626" : "#2563EB",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>

            {/* Reasoning Paragraph */}
            {!compact && (
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>
                {agent.reasoning}
              </p>
            )}
          </div>

          <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid rgba(0,0,0,0.04)", fontSize: 10.5, fontFamily: "var(--mono)", color: "var(--cobalt)", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Inspect Agent Thesis</span>
            <span>→</span>
          </div>
        </div>
      </DialogTrigger>

      {/* MODAL / DIALOG CONTENT */}
      <DialogContent
        style={{
          maxWidth: "580px",
          background: "#ffffff",
          border: "1px solid var(--line)",
          borderRadius: "14px",
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Modal Header Bar with Safe Right Margin for Close Button */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--line)",
            background: "#FAF9F6",
          }}
        >
          <DialogHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "#ffffff",
                    border: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {agentIcons[agent.agent] || <Activity className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 700, color: "var(--faint)", letterSpacing: "0.08em" }}>
                    Investor Mandate
                  </div>
                  <DialogTitle style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", margin: "2px 0 0" }}>
                    {agent.name}
                  </DialogTitle>
                </div>
              </div>

              {/* Status Badge Positioned Safely to Left of Close Button */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                  background: decisionBg,
                  color: decisionColor,
                  border: `1px solid ${decisionBorder}`,
                }}
              >
                {isBuy ? "▲" : isSell ? "▼" : "◆"} {agent.decision}
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "14px 16px", borderRadius: 10, background: "#FAF9F6", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 10.5, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 600, color: "var(--faint)", letterSpacing: "0.05em" }}>
                Conviction Rating
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--ink)", marginTop: 4 }}>
                {agent.confidence}%
              </div>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: 10, background: "#FAF9F6", border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 10.5, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 600, color: "var(--faint)", letterSpacing: "0.05em" }}>
                Agent Archetype
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginTop: 6, textTransform: "capitalize" }}>
                {agent.agent} Model
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 700, color: "var(--faint)", letterSpacing: "0.06em", marginBottom: 8 }}>
              Thesis &amp; Strategic Outlook
            </div>
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 10,
                background: "#FAF9F6",
                border: "1px solid var(--line)",
                fontSize: 13.5,
                lineHeight: 1.6,
                color: "var(--ink)",
              }}
            >
              {agent.reasoning}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}