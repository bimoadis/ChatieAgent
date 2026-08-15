"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { DashboardView } from "@/components/DashboardView"
import { StockAnalyzer } from "@/components/StockAnalyzer"
import { Settings } from "@/components/Settings"
import AgentDiscussion from "@/components/AgentDiscussion"
import { AnalysisHistory, PersonaType } from "@/types"
import { Terminal } from "lucide-react"
import History from "@/components/History"
import "@/app/dashboard.css"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("overview")
  const [persona, setPersona] = useState<PersonaType>("balanced")
  const [apiKey, setApiKey] = useState("")
  const [history, setHistory] = useState<AnalysisHistory[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // State untuk Booting Screen
  const [isBooting, setIsBooting] = useState(true)
  const [bootLog, setBootLog] = useState<string[]>([])

  // Load dari localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openrouter_api_key")
    const savedHistory = localStorage.getItem("analysis_history")
    const savedPersona = localStorage.getItem("ai_persona") as PersonaType

    if (savedApiKey) setApiKey(savedApiKey)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp),
          result: {
            ...h.result,
            timestamp: new Date(h.result.timestamp),
          },
        })))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
    if (savedPersona) setPersona(savedPersona)
  }, [])

  // Efek Booting Screen
  useEffect(() => {
    const sequence = [
      "CHATIE_AGENT [Core System v2.0]",
      "Establishing quantitative telemetry feeds: OK",
      "Loading 19 multi-agent reasoning engines...",
      "Authenticating workspace credentials...",
      "Access Granted. Initializing Core Terminal..."
    ];
    
    let currentIndex = 0;
    
    const logInterval = setInterval(() => {
      if (currentIndex < sequence.length) {
        const currentText = sequence[currentIndex];
        if (currentText) {
          setBootLog(prev => [...prev, currentText]);
        }
        currentIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 180); 

    const finishTimeout = setTimeout(() => {
      setIsBooting(false);
    }, 1200); 

    return () => {
      clearInterval(logInterval);
      clearTimeout(finishTimeout);
    };
  }, []);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key)
    localStorage.setItem("openrouter_api_key", key)
  }

  const handleHistoryUpdate = (newHistory: AnalysisHistory[]) => {
    setHistory(newHistory)
    localStorage.setItem("analysis_history", JSON.stringify(newHistory))
  }

  const formattedDashboardHistory = history.map((h) => ({
    id: h.id,
    symbol: h.symbol,
    decision: h.result.finalDecision.decision,
    timestamp: h.timestamp,
  }))

  if (isBooting) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--mono)", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 480, padding: 28, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "0 4px 20px -8px rgba(20,20,19,.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
            <img src="/logo.png" alt="Chatie Agent" style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", letterSpacing: "-.02em" }}>Chatie Agent</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".1em", color: "var(--faint)", textTransform: "uppercase" }}>Core Terminal</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 110, justifyContent: "flex-end" }}>
            {bootLog.map((log, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: index === bootLog.length - 1 ? "var(--ink)" : "var(--muted)" }}>
                <span style={{ color: "var(--cobalt)", fontWeight: 600 }}>&gt;</span>
                <span style={{ fontWeight: index === bootLog.length - 1 ? 600 : 400 }}>{log}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, width: "100%", height: 3, background: "var(--panel)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "var(--cobalt)", width: "100%", transition: "width 1s ease" }}></div>
          </div>
        </div>
      </div>
    )
  }

  const viewTitles: Record<string, string> = {
    overview: "System Overview",
    core: "Chatie Core",
    discussion: "Council Discussion",
    council: "Council Discussion",
    logs: "Data Logs",
    config: "Configuration",
  };

  return (
    <div className="dashboard-root" style={{ flexDirection: "column" }}>
      {/* Mobile Top Bar */}
      <div className="dash-mobile-bar">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="dash-burger-btn"
          aria-label="Open navigation menu"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/logo.png" alt="Chatie Agent" style={{ width: 20, height: 20, objectFit: "contain", borderRadius: 4 }} />
          <span style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>
            {viewTitles[activeView] || "Dashboard"}
          </span>
        </div>

        <div style={{ width: 36 }}></div>
      </div>

      {/* Backdrop for mobile drawer */}
      <div
        className={`dash-drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          persona={persona}
          onPersonaChange={setPersona}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
        
        <main className="dash-main">
          {activeView === "overview" && <DashboardView history={formattedDashboardHistory} />}
          {activeView === "core" && <StockAnalyzer persona={persona} apiKey={apiKey} />}
          {(activeView === "discussion" || activeView === "council") && <AgentDiscussion />}
          {activeView === "logs" && <History />}
          {activeView === "config" && <Settings apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />}
        </main>
      </div>
    </div>
  )
}