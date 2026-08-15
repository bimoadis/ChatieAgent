"use client";

import React, { useEffect, useRef } from "react";

interface AgentDemoProps {
  id: string;
  ariaLabel: string;
  query: string;
  searching: string;
  doneMsg: string;
  loopMs?: number;
  tableHead: React.ReactNode;
  children: React.ReactNode;
}

export function AgentDemo({
  id,
  ariaLabel,
  query,
  searching,
  doneMsg,
  loopMs = 12500,
  tableHead,
  children,
}: AgentDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qTextRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const container = containerRef.current;
    const qEl = qTextRef.current;
    const lineEl = lineRef.current;
    const tableEl = tableRef.current;

    if (!container || !qEl || !lineEl || !tableEl) return;

    const rows = Array.from(tableEl.querySelectorAll<HTMLTableRowElement>("tbody tr"));
    let timers: NodeJS.Timeout[] = [];
    let typerStop: (() => void) | null = null;
    let active = false;
    let running = false;

    const addTimer = (fn: () => void, ms: number) => {
      const tid = setTimeout(fn, ms);
      timers.push(tid);
      return tid;
    };

    function reset() {
      timers.forEach(clearTimeout);
      timers = [];
      if (typerStop) typerStop();
      typerStop = null;
      if (qEl) qEl.textContent = "";
      if (tableEl) tableEl.style.display = "none";
      rows.forEach((r) => r.classList.remove("on", "ghost"));
      if (lineEl) {
        lineEl.innerHTML = '<span class="chev">&gt;</span><span>&nbsp;</span>';
      }
      running = false;
    }

    function typeInto(el: HTMLElement, text: string, speed: number, done?: () => void) {
      if (REDUCE) {
        el.textContent = text;
        if (done) done();
        return () => {};
      }
      let i = 0;
      let t: NodeJS.Timeout | null = null;
      let stopped = false;

      function tick() {
        if (stopped) return;
        el.textContent = text.slice(0, i++);
        if (i <= text.length) {
          t = setTimeout(tick, speed + Math.random() * speed);
        } else {
          if (done) done();
        }
      }
      tick();

      return () => {
        stopped = true;
        if (t) clearTimeout(t);
      };
    }

    function play() {
      if (running) return;
      running = true;

      typerStop = typeInto(qEl!, query, 24, () => {
        addTimer(() => {
          if (!lineEl) return;
          lineEl.innerHTML = `<span class="chev">&gt;</span> Agent: ${searching} <span class="chip">Chatie panel</span> <span class="spin"></span>`;
        }, 350);

        addTimer(() => {
          if (!tableEl) return;
          tableEl.style.display = "table";
          rows.forEach((r, idx) =>
            addTimer(() => {
              r.classList.add("on");
              if (idx === rows.length - 1 && r.classList.contains("ghostable")) {
                r.classList.add("ghost");
              }
            }, idx * 380)
          );

          addTimer(() => {
            if (!lineEl) return;
            lineEl.innerHTML = `<span class="chev ok">✓</span> <span class="ok">Agent: ${doneMsg}</span>`;
            if (rows.length > 0) {
              rows[rows.length - 1].classList.remove("ghost");
            }
          }, rows.length * 380 + 500);

          addTimer(() => {
            reset();
            if (active) play();
          }, loopMs);
        }, 1500);
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          active = e.isIntersecting;
          container.classList.toggle("in", e.isIntersecting);
          if (e.isIntersecting) {
            play();
          } else {
            reset();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(container);

    return () => {
      io.disconnect();
      reset();
    };
  }, [query, searching, doneMsg, loopMs]);

  return (
    <div className="demo" id={id} ref={containerRef} aria-label={ariaLabel}>
      <div className="qbox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="qtext" ref={qTextRef}></span>
        <span className="caret"></span>
      </div>
      <div className="agent-line" ref={lineRef}>
        <span className="chev">&gt;</span>
        <span>&nbsp;</span>
      </div>
      <table ref={tableRef} style={{ display: "none" }}>
        <thead>{tableHead}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
