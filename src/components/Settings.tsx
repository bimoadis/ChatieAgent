"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface SettingsProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export function Settings({ apiKey, onApiKeyChange }: SettingsProps) {
  const [tempKey, setTempKey] = useState(apiKey)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onApiKeyChange(tempKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="dash-card">
      <div className="dash-cfg-head">
        <div className="dash-cfg-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"/>
          </svg>
        </div>
        <div>
          <h2>System Configuration</h2>
          <p>Adjust Chatie Agent neural parameters and core API access.</p>
        </div>
      </div>

      <div className="dash-cfg-label">OpenRouter API Key</div>

      <input
        type="password"
        className="dash-key-input"
        placeholder="sk-or-v1-xxxxxxxxxxxxxxxx"
        value={tempKey}
        onChange={(e) => setTempKey(e.target.value)}
      />

      <div className="dash-doc-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
          <strong>API Documentation</strong>
          <p>
            The system requires a valid OpenRouter token to initialize the agentic swarm. Obtain your credentials at{" "}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
              openrouter.ai/keys
            </a>
          </p>
        </div>
      </div>

      <button
        className="dash-update-btn"
        onClick={handleSave}
        disabled={!tempKey.trim()}
      >
        {saved ? (
          <>
            <Check style={{ width: 14, height: 14, color: "#0E7E48" }} />
            Parameters Saved Successfully
          </>
        ) : (
          <>
            <svg style={{ width: 14, height: 14, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Update API Parameters
          </>
        )}
      </button>

      <hr className="dash-divider" />

      <div className="dash-sys-id-title">System Identity</div>
      <div className="dash-sys-id-box">
        <p><strong>Chatie Agent Core Terminal</strong> bridges the gap between institutional-grade quantitative data and clean, actionable intelligence.</p>
        <p>Powered by multi-agent neural swarms, Chatie Agent simultaneously evaluates intrinsic valuation, growth trajectory, live quantitative indicators, and raw global sentiment to execute precision analysis.</p>
      </div>
    </div>
  )
}