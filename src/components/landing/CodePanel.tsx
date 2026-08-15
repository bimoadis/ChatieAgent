"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CODE_SNIPPETS, API_RESPONSE_JSON, syntaxHighlightJSON } from "@/lib/landing-data";

export function CodePanel() {
  const [lang, setLang] = useState<"py" | "ts" | "sh">("py");
  const [isBusy, setIsBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const respRef = useRef<HTMLPreElement>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedRef = useRef(false);

  const RESP_STR = JSON.stringify(API_RESPONSE_JSON, null, 2);

  const playStream = useCallback(() => {
    if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const respEl = respRef.current;
    if (!respEl) return;

    if (REDUCE) {
      respEl.innerHTML = syntaxHighlightJSON(RESP_STR);
      return;
    }

    let i = 0;
    respEl.innerHTML = "";

    function tick() {
      if (!respEl) return;
      i = Math.min(RESP_STR.length, i + 3 + Math.floor(Math.random() * 4));
      respEl.innerHTML = syntaxHighlightJSON(RESP_STR.slice(0, i));
      respEl.scrollTop = respEl.scrollHeight;

      if (i < RESP_STR.length) {
        streamTimerRef.current = setTimeout(tick, 16);
      }
    }
    tick();
  }, [RESP_STR]);

  const handleRun = () => {
    setIsBusy(true);
    setTimeout(() => setIsBusy(false), 900);
    playStream();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(RESP_STR);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            playStream();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(card);
    return () => {
      io.disconnect();
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    };
  }, [playStream]);

  return (
    <div className="code-grid">
      <div className="code-card" id="codeCard" ref={cardRef}>
        <div className="code-top">
          <span className="sel">
            GET /panel/run <span className="cv">▾</span>
          </span>
          <span className="sel">
            NVDA <span className="cv">▾</span>
          </span>
          <button
            className={`run ${isBusy ? "busy" : ""}`}
            id="runBtn"
            type="button"
            onClick={handleRun}
          >
            <svg className="r-ic" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M10 8.5v7l5.5-3.5L10 8.5z" fill="currentColor" />
            </svg>
            Run
          </button>
        </div>
        <div className="lang-tabs" id="langTabs">
          <button
            className={`ltab ${lang === "py" ? "on" : ""}`}
            data-l="py"
            type="button"
            onClick={() => setLang("py")}
          >
            Python
          </button>
          <button
            className={`ltab ${lang === "ts" ? "on" : ""}`}
            data-l="ts"
            type="button"
            onClick={() => setLang("ts")}
          >
            TypeScript
          </button>
          <button
            className={`ltab ${lang === "sh" ? "on" : ""}`}
            data-l="sh"
            type="button"
            onClick={() => setLang("sh")}
          >
            cURL
          </button>
        </div>
        <pre
          id="codeView"
          dangerouslySetInnerHTML={{ __html: CODE_SNIPPETS[lang] }}
        />
      </div>

      <div className="code-card">
        <div className="resp-bar">
          RESPONSE <span className="pill200">200 OK</span> · NVDA
          <button
            className="copybtn"
            type="button"
            aria-label="Copy response"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy JSON"}
          >
            {copied ? (
              <span style={{ fontSize: "11px", color: "var(--up)" }}>✓</span>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect
                  x="8"
                  y="8"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
        <pre id="resp" ref={respRef}></pre>
      </div>
    </div>
  );
}
