"use client";

import { useEffect, useRef } from "react";

export function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 620;
    const R = 330;
    const pts: { x: number; y: number; z: number; j: number }[] = [];
    const GA = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = GA * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, j: Math.random() * 6.28 });
    }

    let rot = 0;
    let visible = true;
    let raf: number | null = null;

    function frame(t: number) {
      raf = null;
      if (!ctx) return;
      ctx.clearRect(0, 0, 840, 840);
      rot += REDUCE ? 0 : 0.0028;
      const cx = 420;
      const cy = 420;

      for (const p of pts) {
        const x = p.x * Math.cos(rot) - p.z * Math.sin(rot);
        const z = p.x * Math.sin(rot) + p.z * Math.cos(rot);
        const s = (z + 2) / 3;
        const wob = REDUCE ? 0 : Math.sin(t / 900 + p.j) * 2;
        const px = cx + x * R + wob;
        const py = cy + p.y * R;
        const a = 0.12 + s * 0.55;
        ctx.fillStyle = z > 0.86 ? `rgba(30, 77, 216, ${a})` : `rgba(20, 20, 19, ${a})`;
        ctx.beginPath();
        ctx.arc(px, py, 0.9 + s * 1.5, 0, 6.283);
        ctx.fill();
      }

      if (visible && !REDUCE) {
        raf = requestAnimationFrame(frame);
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible = e.isIntersecting;
          if (e.isIntersecting && !raf) {
            raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting && raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        });
      },
      { threshold: 0.2 }
    );

    io.observe(cv);
    raf = requestAnimationFrame(frame);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="globe-wrap">
      <canvas id="globe" ref={canvasRef} width={840} height={840} aria-hidden="true" />
    </div>
  );
}
