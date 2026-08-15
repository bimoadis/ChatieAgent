"use client"

import { useState, useEffect } from "react"
import { StockChart } from "@/components/StockChart"
import { AgentCard } from "@/components/AgentCard"
import { AIReasoningPanel } from "@/components/AIReasoningPanel"
import { PortfolioDecision } from "@/components/PortfolioDecision"
import { AnalysisResult, PersonaType } from "@/types"
import { Loader2, AlertCircle } from "lucide-react"

interface StockAnalyzerProps {
  persona: PersonaType
  apiKey?: string
}

const LOADING_STEPS = [
  "Establishing market telemetry pipeline...",
  "Fetching order book, filings, and historical data: OK",
  "Deploying investor agent panel (Warren Buffett, Growth Hunter, Quant, Sentiment)...",
  "Analyzing intrinsic valuation, cash flows, and margin of safety...",
  "Synthesizing consensus spread & contested thesis items...",
  "Compiling final panel decision..."
];

export function StockAnalyzer({ persona, apiKey }: StockAnalyzerProps) {
  const [ticker, setTicker] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStepIdx, setLoadingStepIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
      }, 480) 
    } else {
      setLoadingStepIdx(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleAnalyze = async () => {
    const sym = ticker.trim().toUpperCase()
    if (!sym) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const [response] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticker: sym,
            persona,
            ...(apiKey ? { apiKey } : {}) 
          }),
        }),
        new Promise(resolve => setTimeout(resolve, 2800)) 
      ])

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 402) {
          throw new Error("API_ERROR_402: Insufficient OpenRouter credits. Please top up your balance at openrouter.ai.");
        }
        throw new Error(data.error || `Analysis failed with status: ${response.status}`);
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze()
    }
  }

  return (
    <div>
      {/* CLI Card */}
      <div className="dash-card" style={{ marginBottom: 22 }}>
        <div className="dash-cli-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <polyline points="8 9 11 12 8 15"/>
            <line x1="13" y1="15" x2="16" y2="15"/>
          </svg>
          Command Line Interface
        </div>
        <div className="dash-cli-row">
          <div className="dash-cli-input-box">
            <span className="dash-dollar">$</span>
            <input
              type="text"
              placeholder="enter target ticker (e.g., aapl, tsla, nvda)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            className="dash-exec-btn"
            onClick={handleAnalyze}
            disabled={isLoading || !ticker.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                Executing...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7z"/>
                </svg>
                Execute Analysis
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "rgba(180,35,24,0.06)", border: "1px solid rgba(180,35,24,0.2)", display: "flex", gap: 10, alignItems: "flex-start", color: "var(--down)", fontSize: 13 }}>
            <AlertCircle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{error}</div>
              {error.includes("API key") && (
                <div style={{ fontSize: 11.5, marginTop: 4, opacity: 0.85, fontFamily: "var(--mono)" }}>
                  ERR_API_KEY_MISSING: Configure OpenRouter API Key in the Configuration tab.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Progress State */}
        {isLoading && (
          <div style={{ marginTop: 16, padding: "18px 20px", borderRadius: 10, background: "var(--panel)", border: "1px solid var(--line)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink)", fontWeight: 600 }}>
              <span className="dash-pulse"></span>
              Neural Extraction Protocol Active · ${ticker}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
              {LOADING_STEPS.slice(0, loadingStepIdx + 1).map((s, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, color: idx === loadingStepIdx ? "var(--ink)" : "var(--faint)" }}>
                  <span style={{ color: "var(--cobalt)", fontWeight: 600 }}>&gt;</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && !isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stock Chart */}
          <div className="dash-card">
            <StockChart data={result.quote} />
          </div>

          {/* 4 Agent Cards */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "between", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", letterSpacing: "-.01em" }}>
                Multi-Agent Neural Breakdown
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {result.agents.map((agent) => (
                <AgentCard key={agent.agent} agent={agent} />
              ))}
            </div>
          </div>

          {/* Verdict and AI Reasoning */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16 }}>
            <PortfolioDecision result={result} />
            <AIReasoningPanel agents={result.agents} quote={result.quote} />
          </div>
        </div>
      )}

      {/* Awaiting Target Parameters (Empty State) */}
      {!result && !isLoading && !error && (
        <div className="dash-awaiting">
          <div className="dash-awaiting-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3>Awaiting Target Parameters</h3>
          <p>Input a valid equity ticker in the terminal above to initiate the data extraction and neural analysis protocol.</p>
        </div>
      )}
    </div>
  )
}