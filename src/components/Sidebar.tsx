"use client"

import Link from "next/link"
import { PersonaType } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  persona: PersonaType
  onPersonaChange: (persona: PersonaType) => void
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ activeView, onViewChange, persona, onPersonaChange, isOpen, onClose }: SidebarProps) {
  const handleItemClick = (view: string) => {
    onViewChange(view)
    if (onClose) onClose()
  }

  return (
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="dash-brand" style={{ flex: 1 }}>
            <img src="/logo.png" alt="Wanda AI Logo" className="dash-mark" style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />
            <div className="dash-brand-text">
              <div className="dash-name">Wanda AI</div>
              <div className="dash-sub">Core System</div>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="dash-burger-btn"
              style={{ margin: "0 12px 0 0", width: 30, height: 30 }}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>

        <div className="dash-nav">
          <button
            className={`dash-nav-item ${activeView === "overview" ? "active" : ""}`}
            onClick={() => handleItemClick("overview")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
            System Overview
          </button>

          <button
            className={`dash-nav-item ${activeView === "core" ? "active" : ""}`}
            onClick={() => handleItemClick("core")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="4 17 10 11 4 5"/>
              <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            Wanda Core
          </button>

          <button
            className={`dash-nav-item ${activeView === "council" ? "active" : ""}`}
            onClick={() => handleItemClick("council")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="7" r="4"/>
              <path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/>
              <circle cx="19" cy="8" r="3"/>
              <path d="M17 14a4 4 0 0 1 4 4v3"/>
            </svg>
            Council Discussion
          </button>

          <button
            className={`dash-nav-item ${activeView === "logs" ? "active" : ""}`}
            onClick={() => handleItemClick("logs")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9"/>
              <polyline points="12 7 12 12 15 15"/>
            </svg>
            Data Logs
          </button>

          <button
            className={`dash-nav-item ${activeView === "config" ? "active" : ""}`}
            onClick={() => handleItemClick("config")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>
            </svg>
            Configuration
          </button>

          <Link href="/" className="dash-nav-item" style={{ marginTop: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Landing
          </Link>
        </div>
      </div>

      <div className="dash-sidebar-bottom">
        <div className="dash-model-label">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="4 17 10 11 4 5"/>
          </svg>
          Processing Model
        </div>

        <Select value={persona} onValueChange={(v) => onPersonaChange(v as PersonaType)}>
          <SelectTrigger className="dash-model-select">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent style={{ background: "var(--card)", border: "1px solid var(--line)" }}>
            <SelectItem value="conservative" style={{ fontSize: 13 }}>Conservative (Deep Value)</SelectItem>
            <SelectItem value="balanced" style={{ fontSize: 13 }}>Balanced (Standard)</SelectItem>
            <SelectItem value="aggressive" style={{ fontSize: 13 }}>Aggressive (High Growth)</SelectItem>
          </SelectContent>
        </Select>

        <div className="dash-node-active">
          <span className="dash-pulse"></span>
          Node Active
        </div>
      </div>
    </div>
  )
}