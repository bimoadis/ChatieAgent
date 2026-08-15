"use client";

import React from "react";
import { AnalysisResult } from "@/types";
import { Share2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

interface PortfolioDecisionProps {
  result: AnalysisResult;
}

export function PortfolioDecision({ result }: PortfolioDecisionProps) {
  const { finalDecision, symbol } = result;
  const isBuy = finalDecision.decision === "BUY";
  const isSell = finalDecision.decision === "SELL";

  const decisionBg = isBuy
    ? "rgba(14, 126, 72, 0.08)"
    : isSell
    ? "rgba(220, 38, 38, 0.08)"
    : "rgba(202, 138, 4, 0.08)";
  const decisionColor = isBuy ? "#0E7E48" : isSell ? "#DC2626" : "#CA8A04";
  const decisionBorder = isBuy
    ? "rgba(14, 126, 72, 0.3)"
    : isSell
    ? "rgba(220, 38, 38, 0.3)"
    : "rgba(202, 138, 4, 0.3)";

  const handleShare = () => {
    const text = `Chatie Agent Multi-Agent Equity Terminal analyzed $${symbol}:

→ Verdict: ${finalDecision.decision}
→ Conviction: ${finalDecision.confidence}%
→ Risk Profile: ${finalDecision.riskLevel}
→ Consensus: ${finalDecision.summary}

Run your ticker: http://localhost:3000`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "width=550,height=420");
  };

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
      }}
    >
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid var(--line-soft)", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles style={{ width: 15, height: 15, color: "var(--cobalt)" }} />
            <span style={{ fontSize: 11, fontFamily: "var(--mono)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)" }}>
              Consensus Output
            </span>
          </div>
          <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--faint)" }}>
            4 Models Synced
          </span>
        </div>

        {/* Big Decision Banner */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 32px",
              borderRadius: "12px",
              background: decisionBg,
              border: `1.5px solid ${decisionBorder}`,
              color: decisionColor,
            }}
          >
            {isBuy ? (
              <CheckCircle2 style={{ width: 26, height: 26 }} />
            ) : isSell ? (
              <AlertTriangle style={{ width: 26, height: 26 }} />
            ) : (
              <Sparkles style={{ width: 26, height: 26 }} />
            )}
            <span style={{ fontSize: 32, fontWeight: 800, fontFamily: "var(--mono)", letterSpacing: "0.02em" }}>
              {finalDecision.decision}
            </span>
          </div>
        </div>

        {/* 2-Column Metric Breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ padding: "12px 14px", borderRadius: 8, background: "#FAF9F6", border: "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: "var(--faint)", fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
              Conviction
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--mono)", color: "var(--ink)", marginTop: 4 }}>
              {finalDecision.confidence}%
            </div>
          </div>

          <div style={{ padding: "12px 14px", borderRadius: 8, background: "#FAF9F6", border: "1px solid var(--line)", textAlign: "center" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 600, color: "var(--faint)", fontFamily: "var(--mono)", letterSpacing: "0.05em" }}>
              Risk Profile
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 6,
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "var(--mono)",
                fontWeight: 700,
                background: finalDecision.riskLevel === "High" ? "rgba(220,38,38,0.1)" : "rgba(14,126,72,0.1)",
                color: finalDecision.riskLevel === "High" ? "#DC2626" : "#0E7E48",
                border: `1px solid ${finalDecision.riskLevel === "High" ? "rgba(220,38,38,0.25)" : "rgba(14,126,72,0.25)"}`,
              }}
            >
              {finalDecision.riskLevel}
            </div>
          </div>
        </div>

        {/* Narrative Summary */}
        <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--panel)", borderLeft: "3px solid var(--cobalt)", fontSize: 12.5, lineHeight: 1.55, color: "var(--ink)", marginBottom: 18 }}>
          {finalDecision.summary}
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "#141413",
          color: "#ffffff",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          fontSize: "12.5px",
          fontWeight: 600,
          fontFamily: "var(--font)",
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        className="hover:bg-[#2563EB]"
      >
        <Share2 style={{ width: 14, height: 14 }} />
        Share to X
      </button>
    </div>
  );
}
