"use client";

import { useState, useEffect } from "react";
import { AGENT_MACHINE_SUMMARY } from "@/lib/landing-data";

export function ModeToggle() {
  const [mode, setMode] = useState<"human" | "agent">("human");

  useEffect(() => {
    if (mode === "agent") {
      document.body.classList.add("agent");
    } else {
      document.body.classList.remove("agent");
    }
  }, [mode]);

  return (
    <>
      <div id="agentview" aria-hidden={mode !== "agent"}>
        <div className="wrap">
          <pre id="agenttxt">{AGENT_MACHINE_SUMMARY}</pre>
        </div>
      </div>

      <div className="mode" role="group" aria-label="View mode">
        <button
          className={mode === "human" ? "on" : ""}
          id="mHuman"
          type="button"
          onClick={() => setMode("human")}
        >
          <span className="dot2"></span>HUMAN
        </button>
        <button
          className={mode === "agent" ? "on" : ""}
          id="mAgent"
          type="button"
          onClick={() => setMode("agent")}
        >
          <span className="dot2"></span>AGENT
        </button>
      </div>
    </>
  );
}
