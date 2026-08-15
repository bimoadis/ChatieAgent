"use client";

import React from "react";

interface TechnicalGaugeProps {
  score?: number; // 0 to 100
  label?: string; // Strong Buy, Buy, Neutral, Sell, Strong Sell
  rsi?: number;
  smaTrend?: string;
}

export function TechnicalGauge({
  score = 75,
  label = "Strong Buy",
  rsi = 58.4,
  smaTrend = "Bullish",
}: TechnicalGaugeProps) {
  // Calculate angle between -90deg and +90deg (180 deg total)
  // score 0 -> -90deg, score 50 -> 0deg, score 100 -> +90deg
  const clampedScore = Math.max(0, Math.min(100, score));
  const angle = -90 + (clampedScore / 100) * 180;

  // Determine label & color based on score
  let displayLabel = label;
  let labelColor = "var(--up)";

  if (clampedScore >= 70) {
    displayLabel = "Strong Buy";
    labelColor = "#0E7E48";
  } else if (clampedScore >= 55) {
    displayLabel = "Buy";
    labelColor = "#10B981";
  } else if (clampedScore >= 45) {
    displayLabel = "Neutral";
    labelColor = "#F59E0B";
  } else if (clampedScore >= 30) {
    displayLabel = "Sell";
    labelColor = "#F97316";
  } else {
    displayLabel = "Strong Sell";
    labelColor = "#DC2626";
  }

  return (
    <div className="dash-gauge-wrap">
      <div className="dash-gauge-header">
        <span className="dash-gauge-title">Technical Analysis</span>
        <span className="dash-gauge-badge" style={{ color: labelColor, borderColor: `${labelColor}40`, background: `${labelColor}12` }}>
          {displayLabel}
        </span>
      </div>

      <div className="dash-gauge-svg-box">
        <svg viewBox="0 0 200 110" className="dash-gauge-svg">
          {/* Arc Background Sectors (Continuous with White Cut Lines) */}
          <path d="M 20 100 A 80 80 0 0 1 35.3 53" fill="none" stroke="#DC2626" strokeWidth="13" strokeLinecap="round" />
          <path d="M 35.3 53 A 80 80 0 0 1 75.3 23.9" fill="none" stroke="#F97316" strokeWidth="13" />
          <path d="M 75.3 23.9 A 80 80 0 0 1 124.7 23.9" fill="none" stroke="#F59E0B" strokeWidth="13" />
          <path d="M 124.7 23.9 A 80 80 0 0 1 164.7 53" fill="none" stroke="#10B981" strokeWidth="13" />
          <path d="M 164.7 53 A 80 80 0 0 1 180 100" fill="none" stroke="#0E7E48" strokeWidth="13" strokeLinecap="round" />

          {/* 4 Crisp White Separator Lines */}
          <line x1="44" y1="60" x2="26" y2="46" stroke="#ffffff" strokeWidth="3" />
          <line x1="79" y1="35" x2="71" y2="13" stroke="#ffffff" strokeWidth="3" />
          <line x1="121" y1="35" x2="129" y2="13" stroke="#ffffff" strokeWidth="3" />
          <line x1="156" y1="60" x2="174" y2="46" stroke="#ffffff" strokeWidth="3" />

          {/* Needle Center Pin */}
          <circle cx="100" cy="100" r="7" fill="#ffffff" stroke="var(--ink)" strokeWidth="3" />
          <circle cx="100" cy="100" r="2.5" fill="var(--ink)" />

          {/* Pointer Needle */}
          <g transform={`rotate(${angle}, 100, 100)`} style={{ transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <line x1="100" y1="100" x2="100" y2="35" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round" />
            <polygon points="97,42 100,30 103,42" fill="var(--ink)" />
          </g>
        </svg>

        <div className="dash-gauge-ticks">
          <span>Sell</span>
          <span>Neutral</span>
          <span>Buy</span>
        </div>
      </div>

      <div className="dash-gauge-meta">
        <div className="dash-gauge-item">
          <span className="dash-gm-label">RSI (14)</span>
          <span className="dash-gm-val">{rsi.toFixed(1)}</span>
        </div>
        <div className="dash-gauge-item">
          <span className="dash-gm-label">Trend (SMA 20)</span>
          <span className="dash-gm-val" style={{ color: smaTrend === "Bullish" ? "var(--up)" : "var(--down)" }}>
            {smaTrend}
          </span>
        </div>
      </div>
    </div>
  );
}
