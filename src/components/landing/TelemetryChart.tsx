"use client";

import { useState, useEffect, useRef } from "react";
import { CHART_SETS } from "@/lib/landing-data";

export function TelemetryChart() {
  const [activeSetIdx, setActiveSetIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const activeSet = CHART_SETS[activeSetIdx];

  const W = 760;
  const H = 300;
  const L = 46;
  const Rp = 10;
  const T = 26;
  const B = 34;
  const iw = W - L - Rp;
  const ih = H - T - B;
  const n = activeSet.cats.length;

  const scale = (v: number) => (ih * (v - activeSet.min)) / (activeSet.max - activeSet.min);
  const gw = iw / n;
  const bw = Math.min(34, gw * 0.24);
  const gap = 8;

  // Grid lines
  const gridLines = [];
  for (let g = 0; g <= 4; g++) {
    const y = T + ih - (ih * g) / 4;
    const val = Math.round(activeSet.min + ((activeSet.max - activeSet.min) * g) / 4);
    gridLines.push({ y, val });
  }

  // Trigger bar growth animation on tab switch or visibility
  useEffect(() => {
    const card = cardRef.current;
    const svg = svgRef.current;
    if (!card || !svg) return;

    const bars = Array.from(svg.querySelectorAll<SVGRectElement>(".cbar"));
    bars.forEach((r) => {
      const y = Number(r.getAttribute("y"));
      const h = Number(r.getAttribute("height"));
      const x = Number(r.getAttribute("x"));
      const w = Number(r.getAttribute("width"));
      r.style.transformOrigin = `${x + w / 2}px ${y + h}px`;
    });

    card.classList.remove("play");
    void card.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.add("play");
      });
    });
  }, [activeSetIdx]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          card.classList.toggle("in", e.isIntersecting);
          if (e.isIntersecting) {
            card.classList.add("play");
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <div className="chart-card" id="chartCard" ref={cardRef}>
      <div className="ctabs" role="tablist">
        <button
          className={`ctab ${activeSetIdx === 0 ? "on" : ""}`}
          type="button"
          onClick={() => setActiveSetIdx(0)}
        >
          Dispersion
        </button>
        <button
          className={`ctab ${activeSetIdx === 1 ? "on" : ""}`}
          type="button"
          onClick={() => setActiveSetIdx(1)}
        >
          Run latency
        </button>
        <button
          className={`ctab ${activeSetIdx === 2 ? "on" : ""}`}
          type="button"
          onClick={() => setActiveSetIdx(2)}
        >
          Source coverage
        </button>
      </div>

      <div className="legend">
        <span>
          <b style={{ background: "#141413" }}></b>
          <span id="lg1">{activeSet.name[0]}</span>
        </span>
        <span>
          <b style={{ background: "#1E4DD8" }}></b>
          <span id="lg2">{activeSet.name[1]}</span>
        </span>
      </div>

      <svg id="chart" ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Panel telemetry chart">
        {gridLines.map((gl, i) => (
          <g key={i}>
            <line className="grid-dot" x1={L} y1={gl.y} x2={W - Rp} y2={gl.y} />
            <text className="axis-t" x={L - 8} y={gl.y + 3} textAnchor="end">
              {gl.val}
            </text>
          </g>
        ))}

        {activeSet.cats.map((c, i) => {
          const cx = L + gw * i + gw / 2;
          const ha = scale(activeSet.a[i]);
          const hb = scale(activeSet.b[i]);
          const del = i * 90;
          const ya = T + ih - ha;
          const yb = T + ih - hb;
          const xa = cx - bw - gap / 2;
          const xb = cx + gap / 2;

          return (
            <g key={i} style={{ transformBox: "fill-box" }}>
              <rect
                className="cbar"
                x={xa}
                y={ya}
                width={bw}
                height={Math.max(ha, 1)}
                rx={3}
                fill="#141413"
                style={{ transitionDelay: `${del}ms` }}
              />
              <rect
                className="cbar"
                x={xb}
                y={yb}
                width={bw}
                height={Math.max(hb, 1)}
                rx={3}
                fill="#1E4DD8"
                style={{ transitionDelay: `${del + 60}ms` }}
              />
              <text className="val-t" x={cx - bw / 2 - gap / 2} y={ya - 7} textAnchor="middle">
                {activeSet.a[i]}
                {activeSet.unit === "%" ? "%" : ""}
              </text>
              <text className="val-t" x={cx + bw / 2 + gap / 2} y={yb - 7} textAnchor="middle">
                {activeSet.b[i]}
                {activeSet.unit === "%" ? "%" : ""}
              </text>
              <text className="axis-t" x={cx} y={H - 12} textAnchor="middle">
                {c}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-note">
        <div>
          <h3>About this telemetry</h3>
          <p id="chartAbout">{activeSet.about}</p>
        </div>
        <div>
          <h3>Methodology</h3>
          <ul>
            <li>Sample: all public panel runs in the trailing 30 days.</li>
            <li>Each bar aggregates runs by sector, median values shown.</li>
            <li>Raw run transcripts are linked from every data point in the terminal.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
