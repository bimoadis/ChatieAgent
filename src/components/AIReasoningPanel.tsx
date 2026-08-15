"use client";

import React, { useState } from "react";
import { AgentInsight, StockQuote } from "@/types";
import { MessageSquare, Bot, ChevronDown, ChevronUp, Cpu } from "lucide-react";

interface AIReasoningPanelProps {
  agents: AgentInsight[];
  quote: StockQuote;
}

export function AIReasoningPanel({ agents, quote }: AIReasoningPanelProps) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(agents[0]?.name || null);

  const toggleAgent = (agentName: string) => {
    setExpandedAgent(expandedAgent === agentName ? null : agentName);
  };

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        padding: "22px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      {/* Panel Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--line-soft)", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquare style={{ width: 15, height: 15, color: "var(--cobalt)" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Reasoning Matrix Breakdown
          </span>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 6,
            background: "rgba(37, 99, 235, 0.08)",
            color: "#2563EB",
            fontSize: 11,
            fontFamily: "var(--mono)",
            fontWeight: 600,
          }}
        >
          <Bot style={{ width: 12, height: 12 }} />
          Multi-Agent Swarm
        </div>
      </div>

      {/* Expandable Agent Accordion List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {agents.map((agent) => {
          const isExpanded = expandedAgent === agent.name;
          const isBuy = agent.decision === "BUY";
          const isSell = agent.decision === "SELL";

          const badgeBg = isBuy
            ? "rgba(14, 126, 72, 0.08)"
            : isSell
            ? "rgba(220, 38, 38, 0.08)"
            : "rgba(202, 138, 4, 0.08)";
          const badgeColor = isBuy ? "#0E7E48" : isSell ? "#DC2626" : "#CA8A04";
          const badgeBorder = isBuy
            ? "rgba(14, 126, 72, 0.25)"
            : isSell
            ? "rgba(220, 38, 38, 0.25)"
            : "rgba(202, 138, 4, 0.25)";

          return (
            <div
              key={agent.agent}
              style={{
                border: "1px solid var(--line)",
                borderRadius: "10px",
                overflow: "hidden",
                background: isExpanded ? "#ffffff" : "#FAF9F6",
                transition: "all 0.15s ease",
              }}
            >
              {/* Accordion Row Header */}
              <button
                type="button"
                onClick={() => toggleAgent(agent.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 7px",
                      borderRadius: 4,
                      fontSize: 10.5,
                      fontFamily: "var(--mono)",
                      fontWeight: 700,
                      background: badgeBg,
                      color: badgeColor,
                      border: `1px solid ${badgeBorder}`,
                    }}
                  >
                    {isBuy ? "▲" : isSell ? "▼" : "◆"} {agent.decision}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                    {agent.name}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11.5, fontFamily: "var(--mono)", color: "var(--muted)", fontWeight: 500 }}>
                    {agent.confidence}% conviction
                  </span>
                  {isExpanded ? (
                    <ChevronUp style={{ width: 14, height: 14, color: "var(--muted)" }} />
                  ) : (
                    <ChevronDown style={{ width: 14, height: 14, color: "var(--muted)" }} />
                  )}
                </div>
              </button>

              {/* Expanded Reasoning Body */}
              {isExpanded && (
                <div
                  style={{
                    padding: "12px 14px 14px",
                    borderTop: "1px solid var(--line-soft)",
                    background: "#ffffff",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "var(--muted)",
                  }}
                >
                  {agent.reasoning}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quantitative Summary Box */}
      <div
        style={{
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: "10px",
          background: "#FAF9F6",
          border: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
          <Cpu style={{ width: 13, height: 13, color: "var(--cobalt)" }} />
          <span style={{ fontSize: 10.5, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 700, color: "var(--faint)", letterSpacing: "0.06em" }}>
            Quantitative Indicator Summary
          </span>
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--ink)", margin: 0 }}>
          {quote.quantitative.trend === "Bullish"
            ? `Price above SMA20 confirms upward momentum. RSI at ${quote.quantitative.rsi14} indicates ${quote.quantitative.rsi14 > 70 ? "overbought" : quote.quantitative.rsi14 < 30 ? "oversold" : "neutral"} technical condition.`
            : `Price below SMA20 indicates downward pressure. RSI at ${quote.quantitative.rsi14} indicates ${quote.quantitative.rsi14 > 70 ? "overbought" : quote.quantitative.rsi14 < 30 ? "oversold" : "neutral"} technical condition.`
          }
        </p>
      </div>
    </div>
  );
}
