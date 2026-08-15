"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PersonaType } from "@/types";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  persona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const PERSONA_OPTIONS: { value: PersonaType; label: string; tag: string }[] = [
  { value: "conservative", label: "Conservative", tag: "Deep Value" },
  { value: "balanced", label: "Balanced", tag: "Standard" },
  { value: "aggressive", label: "Aggressive", tag: "High Growth" },
];

export function Sidebar({ activeView, onViewChange, persona, onPersonaChange, isOpen, onClose }: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleItemClick = (view: string) => {
    onViewChange(view);
    if (onClose) onClose();
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const currentOption = PERSONA_OPTIONS.find((o) => o.value === persona) || PERSONA_OPTIONS[1];

  return (
    <div className={`dash-sidebar ${isOpen ? "open" : ""}`}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="dash-brand" style={{ flex: 1 }}>
            <img src="/logo.png" alt="Chatie Agent Logo" className="dash-mark" style={{ width: 24, height: 24, objectFit: "contain", borderRadius: 4 }} />
            <div className="dash-brand-text">
              <div className="dash-name">Chatie Agent</div>
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
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            System Overview
          </button>

          <button
            className={`dash-nav-item ${activeView === "core" ? "active" : ""}`}
            onClick={() => handleItemClick("core")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            Chatie Core
          </button>

          <button
            className={`dash-nav-item ${activeView === "discussion" ? "active" : ""}`}
            onClick={() => handleItemClick("discussion")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Council Discussion
          </button>

          <button
            className={`dash-nav-item ${activeView === "logs" ? "active" : ""}`}
            onClick={() => handleItemClick("logs")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
            Data Logs
          </button>

          <button
            className={`dash-nav-item ${activeView === "config" ? "active" : ""}`}
            onClick={() => handleItemClick("config")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
            </svg>
            Configuration
          </button>

          <Link href="/" className="dash-nav-item" style={{ marginTop: 8 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Landing
          </Link>
        </div>
      </div>

      {/* Sidebar Bottom Portfolio Risk Profile Dropdown */}
      <div className="dash-sidebar-bottom">
        <div className="dash-model-label">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="4 17 10 11 4 5" />
          </svg>
          Portfolio Risk Profile
        </div>

        {/* Custom Clean Elevated Dropdown */}
        <div className="dash-custom-dropdown-wrap" ref={dropdownRef}>
          {/* Dropdown Menu Popup (Opens above trigger) */}
          {dropdownOpen && (
            <div className="dash-custom-dropdown-menu">
              {PERSONA_OPTIONS.map((opt) => {
                const isSelected = opt.value === persona;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`dash-cd-item ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      onPersonaChange(opt.value);
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="dash-cd-item-text">
                      <span className="dash-cd-item-label">{opt.label}</span>
                      <span className="dash-cd-item-tag">({opt.tag})</span>
                    </div>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#2563EB" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Dropdown Trigger Button */}
          <button
            type="button"
            className="dash-custom-dropdown-trigger"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="dash-cdt-label">
              {currentOption.label} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({currentOption.tag})</span>
            </span>
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`dash-cdt-chevron ${dropdownOpen ? "open" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <div className="dash-node-active">
          <span className="dash-pulse"></span>
          Node Active
        </div>
      </div>
    </div>
  );
}