"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CaBadgeProps {
  address?: string;
}

export function CaBadge({
  address = "2aP9mKoc7Jb88En1FwQxkuzMM2TyB9LpaVPiFaqepump",
}: CaBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginBottom: "14px",
      }}
    >
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied to clipboard!" : "Click to copy Contract Address"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 10px 5px 8px",
          background: copied ? "rgba(14, 126, 72, 0.08)" : "var(--card, #ffffff)",
          border: `1px solid ${copied ? "var(--up, #0E7E48)" : "var(--line, #E7E5DE)"}`,
          borderRadius: "8px",
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "11px",
          color: "var(--ink, #141413)",
          cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease",
          userSelect: "none",
          outline: "none",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "var(--panel, #F1F0EA)",
            padding: "2px 7px",
            borderRadius: "9999px",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            color: "var(--muted, #6F6E69)",
          }}
        >
          CA
        </span>

        <span
          style={{
            letterSpacing: "0.02em",
            color: "var(--ink, #141413)",
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {address}
        </span>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "6px",
            borderLeft: "1px solid var(--line, #E7E5DE)",
            color: copied ? "var(--up, #0E7E48)" : "var(--muted, #6F6E69)",
            transition: "color 0.15s ease",
          }}
        >
          {copied ? (
            <Check size={14} strokeWidth={2.5} />
          ) : (
            <Copy size={13} strokeWidth={2} />
          )}
        </span>
      </button>
    </div>
  );
}
