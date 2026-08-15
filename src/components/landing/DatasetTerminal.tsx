"use client";

import { useEffect, useState, useRef } from "react";
import { KPI_DATASETS, syntaxHighlightJSON } from "@/lib/landing-data";

export function DatasetTerminal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "json">("table");
  const termRef = useRef<HTMLDivElement>(null);
  const trowsRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const activeData = KPI_DATASETS[activeIdx];

  // Render row elements & trigger staggered animation
  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    const trowsContainer = trowsRef.current;
    if (!trowsContainer) return;

    const rowElements = Array.from(trowsContainer.querySelectorAll<HTMLDivElement>(".trow:not(.hdr)"));
    rowElements.forEach((el, k) => {
      el.classList.remove("on");
      const tid = setTimeout(() => {
        el.classList.add("on");
      }, 60 + k * 55);
      timersRef.current.push(tid);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [activeIdx]);

  // Auto-cycle timer when terminal is visible
  useEffect(() => {
    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (REDUCE) return;

    const termEl = termRef.current;
    if (!termEl) return;

    let cycleInterval: NodeJS.Timeout | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!cycleInterval) {
              cycleInterval = setInterval(() => {
                setActiveIdx((prev) => (prev + 1) % KPI_DATASETS.length);
              }, 5200);
            }
          } else {
            if (cycleInterval) {
              clearInterval(cycleInterval);
              cycleInterval = null;
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(termEl);

    return () => {
      io.disconnect();
      if (cycleInterval) clearInterval(cycleInterval);
    };
  }, []);

  // Build JSON representation
  const jsonObject: Record<string, { value: string; ref: string | null }> = {};
  activeData.rows.forEach((r) => {
    if (r[0] !== "hdr" && r[0] !== "g") {
      jsonObject[r[0]] = { value: r[1], ref: r[2] || null };
    }
  });
  const jsonRaw = JSON.stringify({ source: activeData.t.replace("· ", ""), data: jsonObject }, null, 2);
  const jsonHighlighted = syntaxHighlightJSON(jsonRaw);

  const categories = [
    { title: "Operational KPIs", desc: "Sector-specific metrics that drive the thesis" },
    { title: "Income statements", desc: "Revenue, expenses, profitability (30+ years)" },
    { title: "Balance sheets", desc: "Assets, liabilities, and equity" },
    { title: "Cash flow statements", desc: "Operating, investing, financing" },
    { title: "Filing excerpts", desc: "Section-level 10-K / 10-Q text, verbatim" },
    { title: "Insider trades", desc: "Executive transactions with timestamps" },
  ];

  return (
    <div className="split" style={{ gridTemplateColumns: "minmax(260px,340px) 1fr" }}>
      <ul className="dlist" id="dlist">
        {categories.map((cat, idx) => (
          <li
            key={idx}
            className={idx === activeIdx ? "on" : ""}
            onClick={() => setActiveIdx(idx)}
            data-i={idx}
          >
            <h3>{cat.title}</h3>
            <p>{cat.desc}</p>
          </li>
        ))}
      </ul>

      <div className={`term ${viewMode === "json" ? "json" : ""}`} id="term" ref={termRef}>
        <div className="term-bar">
          RESPONSE <span className="pill200">200 OK</span>{" "}
          <span id="term-title">{activeData.t}</span>
          <span className="sp">
            <button
              className={`tab ${viewMode === "table" ? "on" : ""}`}
              id="tabTable"
              type="button"
              onClick={() => setViewMode("table")}
            >
              ▦ Table
            </button>
            <button
              className={`tab ${viewMode === "json" ? "on" : ""}`}
              id="tabJson"
              type="button"
              onClick={() => setViewMode("json")}
            >
              {"{ }"} JSON
            </button>
          </span>
        </div>

        <div className="term-body">
          <div className="trows" id="trows" ref={trowsRef}>
            {activeData.rows.map((r, idx) => {
              if (r[0] === "hdr") {
                return (
                  <div key={idx} className="trow hdr on">
                    <span className="l"></span>
                    <span className="r">
                      <b>Value</b>
                      <i>{r[2]}</i>
                    </span>
                  </div>
                );
              }
              if (r[0] === "g") {
                return (
                  <div key={idx} className="trow on">
                    <span
                      className="l"
                      style={{ color: "var(--faint)", fontSize: "10px", letterSpacing: "0.1em" }}
                    >
                      {r[1]}
                    </span>
                    <span className="r"></span>
                  </div>
                );
              }
              const yoy = r[2] || "";
              const cls = yoy.startsWith("+") ? "pos" : yoy.startsWith("−") ? "neg" : "";
              return (
                <div key={idx} className="trow">
                  <span className="l">{r[0]}</span>
                  <span className="r">
                    <b>{r[1]}</b>
                    <i className={cls}>{yoy}</i>
                  </span>
                </div>
              );
            })}
          </div>
          <pre
            className="term-json"
            id="termJson"
            dangerouslySetInnerHTML={{ __html: jsonHighlighted }}
          />
        </div>
      </div>
    </div>
  );
}
