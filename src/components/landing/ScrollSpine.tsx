"use client";

import { useEffect, useRef } from "react";

interface ScrollSpineProps {
  onActiveSecChange?: (sec: string | null) => void;
}

export function ScrollSpine({ onActiveSecChange }: ScrollSpineProps) {
  const spineRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const nodesGRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const pctRef = useRef<HTMLElement>(null);
  const velRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spineEl = spineRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const drawp = drawRef.current;
    const trailp = trailRef.current;
    const nodesG = nodesGRef.current;
    const headEl = headRef.current;
    const glowEl = glowRef.current;
    const pctEl = pctRef.current;
    const velEl = velRef.current;

    if (!spineEl || !svg || !track || !drawp || !trailp || !nodesG || !headEl || !glowEl || !pctEl || !velEl) {
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-at]"));
    const STOPS = sections.map((s) => parseFloat(s.dataset.at || "0"));
    let markers: { f: number; c: SVGCircleElement; ring: SVGCircleElement; sec: HTMLElement }[] = [];
    let LEN = 0;
    let target = 0;
    let current = 0;
    let running = false;
    let lastC = 0;
    let vel = 0;
    let counted = false;

    function buildNodes() {
      if (!nodesG || !track) return;
      nodesG.innerHTML = "";
      markers = STOPS.map((f, i) => {
        const p = track.getPointAtLength(LEN * f);
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("class", "ring");
        ring.setAttribute("cx", String(p.x));
        ring.setAttribute("cy", String(p.y));
        ring.setAttribute("r", "18");
        ring.setAttribute("vector-effect", "non-scaling-stroke");
        ring.style.transformOrigin = `${p.x}px ${p.y}px`;

        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("class", "node");
        c.setAttribute("cx", String(p.x));
        c.setAttribute("cy", String(p.y));
        c.setAttribute("r", "4.2");
        c.setAttribute("vector-effect", "non-scaling-stroke");

        nodesG.appendChild(ring);
        nodesG.appendChild(c);
        return { f, c, ring, sec: sections[i] };
      });
    }

    function prog() {
      const m = document.documentElement.scrollHeight - window.innerHeight;
      return m <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / m));
    }

    function countUp() {
      if (counted) return;
      counted = true;
      const countEls = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
      countEls.forEach((el) => {
        const to = Number(el.dataset.count) || 0;
        const pre = el.dataset.prefix || "";
        const suf = el.dataset.suffix || "";
        if (REDUCE) {
          el.textContent = pre + to.toLocaleString() + suf;
          return;
        }
        const t0 = performance.now();
        function step(now: number) {
          const kk = Math.min(1, (now - t0) / 1200);
          const e = 1 - Math.pow(1 - kk, 3);
          el.textContent = pre + Math.round(to * e).toLocaleString() + suf;
          if (kk < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    function paint(v: number, sp: number) {
      if (!track || !drawp || !trailp || !headEl || !glowEl || !pctEl || !velEl) return;
      const at = LEN * v;
      drawp.style.strokeDashoffset = String(LEN * (1 - v));
      const k = Math.min(1, sp * 55);
      const t = 26 + k * 210;
      trailp.style.strokeWidth = String(2.2 + k * 3.4);
      trailp.style.opacity = String(0.2 + k * 0.55);
      trailp.style.strokeDasharray = `${t} ${LEN + t}`;
      trailp.style.strokeDashoffset = String(t - at);

      const p = track.getPointAtLength(at);
      headEl.setAttribute("cx", String(p.x));
      headEl.setAttribute("cy", String(p.y));
      glowEl.setAttribute("cx", String(p.x));
      glowEl.setAttribute("cy", String(p.y));
      glowEl.setAttribute("r", String(8 + k * 13));
      headEl.setAttribute("r", String(3.2 + k * 1.6));

      const vis = v > 0.001 && v < 0.999 ? 1 : 0.35;
      headEl.style.opacity = String(vis);
      glowEl.style.opacity = String(0.16 * vis);
      pctEl.textContent = Math.round(v * 100) + "%";
      velEl.style.width = Math.min(100, sp * 3400) + "%";

      let activeId: string | null = null;
      markers.forEach((m) => {
        const rect = m.sec.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.88;
        const on = v >= m.f || inView;
        if (on !== m.c.classList.contains("lit")) {
          m.c.classList.toggle("lit", on);
          m.sec.classList.toggle("live", on);
          m.sec.querySelectorAll(".rv").forEach((e) => e.classList.toggle("in", on));
          if (on) {
            m.ring.classList.remove("fire");
            void (m.ring as unknown as HTMLElement).offsetWidth;
            m.ring.classList.add("fire");
          }
        }
        if (v >= m.f || (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0)) {
          activeId = m.sec.id;
        }
      });

      if (onActiveSecChange) {
        onActiveSecChange(activeId);
      }

      const allRvs = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
      allRvs.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          el.classList.add("in");
        }
      });

      if (v > 0.02) countUp();
    }

    function loop() {
      current += (target - current) * 0.13;
      vel = Math.abs(current - lastC);
      lastC = current;
      if (Math.abs(target - current) < 0.00035) current = target;
      paint(current, vel);
      if (current !== target || vel > 0.00002) {
        requestAnimationFrame(loop);
      } else {
        running = false;
        paint(current, 0);
      }
    }

    function onScroll() {
      target = prog();
      if (REDUCE) {
        current = target;
        paint(current, 0);
        return;
      }
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    }

    function layout() {
      if (!spineEl || !svg || !track || !drawp) return;
      const h = document.documentElement.scrollHeight;
      spineEl.style.height = h + "px";
      svg.setAttribute("height", String(h));
      LEN = track.getTotalLength();
      drawp.style.strokeDasharray = String(LEN);
      drawp.style.strokeDashoffset = String(LEN);
      buildNodes();
      target = current = prog();
      paint(current, 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout);
    }
    const timer = setTimeout(layout, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
    };
  }, [onActiveSecChange]);

  return (
    <>
      <div id="spine" ref={spineRef} aria-hidden="true">
        <svg id="spine-svg" ref={svgRef} viewBox="0 0 112 1000" preserveAspectRatio="none">
          <defs>
            <filter id="soften" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="3.2" />
            </filter>
          </defs>
          <path
            id="trackp"
            ref={trackRef}
            className="track"
            vectorEffect="non-scaling-stroke"
            d="M56 0 C56 55, 22 84, 22 138 C22 196, 90 222, 90 280 C90 338, 22 364, 22 422
           C22 480, 90 506, 90 564 C90 622, 30 648, 30 706 C30 764, 88 790, 88 848
           C88 900, 60 924, 60 968 L60 1000"
          />
          <path
            id="drawp"
            ref={drawRef}
            className="drawp"
            vectorEffect="non-scaling-stroke"
            d="M56 0 C56 55, 22 84, 22 138 C22 196, 90 222, 90 280 C90 338, 22 364, 22 422
           C22 480, 90 506, 90 564 C90 622, 30 648, 30 706 C30 764, 88 790, 88 848
           C88 900, 60 924, 60 968 L60 1000"
          />
          <path
            id="trailp"
            ref={trailRef}
            className="trail"
            vectorEffect="non-scaling-stroke"
            d="M56 0 C56 55, 22 84, 22 138 C22 196, 90 222, 90 280 C90 338, 22 364, 22 422
           C22 480, 90 506, 90 564 C90 622, 30 648, 30 706 C30 764, 88 790, 88 848
           C88 900, 60 924, 60 968 L60 1000"
          />
          <g id="nodes" ref={nodesGRef}></g>
          <circle id="headGlow" ref={glowRef} className="head-glow" r="9" cx="56" cy="0" />
          <circle id="head" ref={headRef} className="head" r="3.4" cx="56" cy="0" />
        </svg>
      </div>

      <div className="readout">
        <span>SCROLL</span>
        <b id="pct" ref={pctRef}>
          0%
        </b>
        <span className="vbar">
          <i id="vel" ref={velRef}></i>
        </span>
      </div>
    </>
  );
}
