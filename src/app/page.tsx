"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { ScrollSpine } from "@/components/landing/ScrollSpine";
import { ParticleGlobe } from "@/components/landing/ParticleGlobe";
import { AgentDemo } from "@/components/landing/AgentDemo";
import { DatasetTerminal } from "@/components/landing/DatasetTerminal";
import { TelemetryChart } from "@/components/landing/TelemetryChart";
import { CodePanel } from "@/components/landing/CodePanel";
import { LimitsNote } from "@/components/landing/LimitsNote";
import { ModeToggle } from "@/components/landing/ModeToggle";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const [activeSec, setActiveSec] = useState<string | null>(null);

  const heroWords = "A research desk behind every ticker you type.".split(" ");

  return (
    <>
      <Nav activeSec={activeSec} />

      <main id="top" className="landing-main">
        <ScrollSpine onActiveSecChange={setActiveSec} />

        <div className="content">
          {/* ============ HERO ============ */}
          <div className="wrap hero">
            <div>
              <div className="eyebrow">Multi-agent equity research</div>
              <h1 className="hero-title" id="heroline">
                {heroWords.map((word, i) => (
                  <span
                    key={i}
                    className="h-word"
                    style={{ animationDelay: `${0.12 + i * 0.055}s` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </h1>
              <p className="lede">
                Chatie Agent runs a panel of investor-model agents across live market data, then
                shows you where they disagree, because the disagreement is the signal, not the
                headline verdict.
              </p>
              <div className="cta">
                <Link className="btn lg" href="/dashboard">
                  Run your first ticker
                </Link>
                <a className="btn lg ghost" href="#panel">
                  Watch a panel run
                </a>
                <span className="note" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <i className="pulse"></i>NO CARD · 5 RUNS FREE
                </span>
              </div>
            </div>
            <ParticleGlobe />
          </div>

          {/* ============ STATS ============ */}
          <div className="wrap">
            <div className="stats">
              <div className="stat rv">
                <div className="v" data-count="19">
                  0
                </div>
                <div className="k">investor agents</div>
              </div>
              <div className="stat rv d1">
                <div className="v" data-count="27530">
                  0
                </div>
                <div className="k">tickers covered</div>
              </div>
              <div className="stat rv d2">
                <div className="v" data-count="40" data-prefix="~" data-suffix="s">
                  0
                </div>
                <div className="k">per full panel run</div>
              </div>
              <div className="stat rv d3">
                <div className="v" data-count="100" data-suffix="%">
                  0
                </div>
                <div className="k">claims linked to source</div>
              </div>
            </div>
          </div>

          {/* ============ 01 PANEL DEMO ============ */}
          <section className="wrap landing-sec" id="panel" data-at="0.09">
            <div className="sec-head">
              <span className="step">01</span>
              <h2 className="sec-title rv">Watch the desk argue</h2>
            </div>
            <div className="split flip">
              <AgentDemo
                id="demo1"
                ariaLabel="Simulated panel run"
                query="Run the full panel on NVDA and show the split"
                searching="dispatching 19 agents"
                doneMsg="19/19 returned · 38.4s"
                loopMs={12500}
                tableHead={
                  <tr>
                    <th>Agent</th>
                    <th>Call</th>
                    <th>Conviction</th>
                    <th style={{ textAlign: "right" }}>Fair value</th>
                    <th style={{ textAlign: "right" }}>Δ spot</th>
                  </tr>
                }
              >
                <tr>
                  <td>
                    <div className="who">
                      Warren Buffett<span>MOAT &amp; OWNER EARNINGS</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag">HOLD</span>
                  </td>
                  <td>
                    <div className="bar">
                      <i style={{ "--w": "54%" } as React.CSSProperties}></i>
                    </div>
                  </td>
                  <td className="num">$142.00</td>
                  <td className="num neg">−18.6%</td>
                </tr>
                <tr>
                  <td>
                    <div className="who">
                      Cathie Wood<span>DISRUPTION CURVE</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag buy">BUY</span>
                  </td>
                  <td>
                    <div className="bar">
                      <i style={{ "--w": "88%" } as React.CSSProperties}></i>
                    </div>
                  </td>
                  <td className="num">$310.00</td>
                  <td className="num pos">+77.6%</td>
                </tr>
                <tr>
                  <td>
                    <div className="who">
                      Michael Burry<span>DEEP VALUE</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag sell">SELL</span>
                  </td>
                  <td>
                    <div className="bar">
                      <i style={{ "--w": "71%" } as React.CSSProperties}></i>
                    </div>
                  </td>
                  <td className="num">$96.50</td>
                  <td className="num neg">−44.7%</td>
                </tr>
                <tr>
                  <td>
                    <div className="who">
                      Stanley Druckenmiller<span>MACRO ASYMMETRY</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag buy">BUY</span>
                  </td>
                  <td>
                    <div className="bar">
                      <i style={{ "--w": "76%" } as React.CSSProperties}></i>
                    </div>
                  </td>
                  <td className="num">$248.00</td>
                  <td className="num pos">+42.1%</td>
                </tr>
                <tr className="ghostable">
                  <td>
                    <div className="who">
                      Nassim Taleb<span>TAIL RISK</span>
                    </div>
                  </td>
                  <td>
                    <span className="tag sell">SELL</span>
                  </td>
                  <td>
                    <div className="bar">
                      <i style={{ "--w": "63%" } as React.CSSProperties}></i>
                    </div>
                  </td>
                  <td className="num">-</td>
                  <td className="num">-</td>
                </tr>
              </AgentDemo>

              <div className="side">
                <h3 className="sub-title rv">Nineteen mandates, one ticker</h3>
                <p className="lede rv d1">
                  Each agent reasons from a fixed philosophy (value, growth, macro, tail-risk) and
                  cannot see the others&apos; output before submitting. You get a spread of views, not
                  one averaged opinion.
                </p>
              </div>
            </div>
          </section>

          {/* ============ 02 CONSENSUS DEMO ============ */}
          <section className="wrap landing-sec" id="method" data-at="0.26">
            <div className="sec-head">
              <span className="step">02</span>
              <h2 className="sec-title rv">The spread is the output</h2>
            </div>
            <div className="split">
              <div className="side">
                <h3 className="sub-title rv">Dissent, itemised</h3>
                <p className="lede rv d1">
                  When the panel splits 8-6-5, that is information. Chatie surfaces the exact line
                  item each agent disagreed on, so you can judge whose reasoning you actually buy.
                </p>
              </div>

              <AgentDemo
                id="demo2"
                ariaLabel="Simulated consensus breakdown"
                query="Where exactly does the panel disagree on NVDA?"
                searching="diffing agent theses"
                doneMsg="4 contested line items found"
                loopMs={12500}
                tableHead={
                  <tr>
                    <th>Point of disagreement</th>
                    <th>Split</th>
                    <th>Driver</th>
                  </tr>
                }
              >
                <tr>
                  <td>Data Center forward CAGR (FY27)</td>
                  <td>
                    <span className="split-num">11 / 8</span>
                  </td>
                  <td className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Hyperscaler capex commitment vs. capacity digestion
                  </td>
                </tr>
                <tr>
                  <td>Gross margin durability past FY26</td>
                  <td>
                    <span className="split-num">14 / 5</span>
                  </td>
                  <td className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Custom ASIC competition vs. CUDA lock-in moat
                  </td>
                </tr>
                <tr>
                  <td>Networking (Quantum-X / Spectrum) attach rate</td>
                  <td>
                    <span className="split-num">9 / 10</span>
                  </td>
                  <td className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Ethernet share gain vs. InfiniBand margin mix
                  </td>
                </tr>
                <tr>
                  <td>Sovereign AI revenue contribution</td>
                  <td>
                    <span className="split-num">6 / 13</span>
                  </td>
                  <td className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Export restriction overhang vs. tier-2 cloud pipeline
                  </td>
                </tr>
              </AgentDemo>
            </div>
          </section>

          {/* ============ 03 DATASETS ============ */}
          <section className="wrap landing-sec" id="sources" data-at="0.45">
            <div className="sec-head">
              <span className="step">03</span>
              <h2 className="sec-title rv">The data the agents read</h2>
            </div>
            <p className="lede rv d1" style={{ marginTop: "6px" }}>
              Every claim in every transcript is linked to a row in one of six underlying datasets.
              If an agent cites a number, you can click it and see the filing it came from.
            </p>
            <DatasetTerminal />
          </section>

          {/* ============ 04 DISPERSION CHART ============ */}
          <section className="wrap landing-sec" id="dispersion" data-at="0.62">
            <div className="sec-head">
              <span className="step">04</span>
              <h2 className="sec-title rv">Panel telemetry, in the open</h2>
            </div>
            <p className="lede rv d1" style={{ marginTop: "6px" }}>
              Live stats from the last 30 days of panel runs. Not performance claims; the panel has
              no track record and we won&apos;t invent one.
            </p>
            <TelemetryChart />
          </section>

          {/* ============ 05 API / CODE ============ */}
          <section className="wrap landing-sec" id="api" data-at="0.76">
            <div className="sec-head">
              <span className="step">05</span>
              <h2 className="sec-title rv">Wire the panel into your stack</h2>
            </div>
            <p className="lede rv d1" style={{ marginTop: "6px" }}>
              One endpoint runs the full panel and streams every agent&apos;s reasoning back. Build
              your first request in seconds.
            </p>
            <CodePanel />
          </section>

          {/* ============ 06 LIMITS ============ */}
          <section className="wrap landing-sec" id="limits" data-at="0.90">
            <div className="sec-head">
              <span className="step">06</span>
              <h2 className="sec-title rv">What this is not</h2>
            </div>
            <p className="lede rv d1" style={{ marginTop: "6px" }}>
              Worth saying plainly, because most tools in this category won&apos;t.
            </p>
            <LimitsNote />
          </section>

          {/* ============ CLOSER ============ */}
          <div className="wrap closer">
            <h2 className="rv sec-title" style={{ maxWidth: "16ch" }}>
              Type a ticker. Read the argument.
            </h2>
            <p className="lede rv d1" style={{ marginTop: "18px", marginBottom: "30px" }}>
              Five runs on the house. No card, no sales call.
            </p>
            <div className="cta rv d2" style={{ animation: "none", opacity: 0 }}>
              <Link className="btn lg" href="/dashboard">
                Open terminal
              </Link>
              <a className="btn lg ghost" href="#api">
                Read the docs
              </a>
            </div>
          </div>

          <Footer />
        </div>
      </main>

      <ModeToggle />
    </>
  );
}