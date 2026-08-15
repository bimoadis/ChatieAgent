"use client";

import { useState } from "react";
import Link from "next/link";

interface NavProps {
  activeSec?: string | null;
}

export function Nav({ activeSec }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#panel", label: "The panel", sec: "panel" },
    { href: "#sources", label: "Datasets", sec: "sources" },
    { href: "#dispersion", label: "Telemetry", sec: "dispersion" },
    { href: "#api", label: "API", sec: "api" },
    { href: "#limits", label: "Limits", sec: "limits" },
  ];

  return (
    <header className="site-header">
      <nav className="wrap nav" id="mainNav">
        <Link className="brand" href="#top">
          <img
            src="/logo.png"
            alt="Chatie Agent"
            className="mark"
            style={{ width: 22, height: 22, objectFit: "contain", borderRadius: 4 }}
          />
          Chatie Agent
        </Link>
        <ul id="navlinks">
          {navLinks.map((link) => (
            <li
              key={link.sec}
              className={activeSec === link.sec ? "active" : ""}
              data-sec={link.sec}
            >
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="right">
          <Link className="small" href="/dashboard" style={{ color: "var(--muted)" }}>
            Log in
          </Link>
          <Link className="btn" href="/dashboard">
            Open terminal
          </Link>
          <button
            className={`mobile-toggle ${isOpen ? "on" : ""}`}
            id="mobileToggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobilePanel"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="burger-ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <svg
              className="x-ic"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
        </div>
      </nav>
      <div className={`mobile-panel ${isOpen ? "open" : ""}`} id="mobilePanel">
        {navLinks.map((link) => (
          <a
            key={link.sec}
            href={link.href}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <Link href="/dashboard" className="mp-cta" onClick={() => setIsOpen(false)}>
          Log in
        </Link>
        <Link href="/dashboard" className="mp-cta" onClick={() => setIsOpen(false)}>
          Open terminal →
        </Link>
      </div>
    </header>
  );
}
