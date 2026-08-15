"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

const MEMBERS = [
  { id: "Aswath Damodaran", role: "Valuation Dean", avatar: "/avatars/Aswath Damodaran.png" },
  { id: "Benjamin Graham", role: "Value Godfather", avatar: "/avatars/Benjamin Graham.png" },
  { id: "Bill Ackman", role: "Activist Investor", avatar: "/avatars/Bill Ackman.png" },
  { id: "Cathie Wood", role: "Growth & Disruption", avatar: "/avatars/Cathie Wood.png" },
  { id: "Charlie Munger", role: "Quality at Fair Price", avatar: "/avatars/Charlie Munger.png" },
  { id: "Michael Burry", role: "Deep Value & Contrarian", avatar: "/avatars/Michael Burry.png" },
  { id: "Mohnish Pabrai", role: "Dhandho Investor", avatar: "/avatars/Mohnish Pabrai.png" },
  { id: "Nassim Nicholas Taleb", role: "Tail Risk & Antifragile", avatar: "/avatars/Nassim Nicholas Taleb.png" },
  { id: "Peter Lynch", role: "Ten-Bagger Hunter", avatar: "/avatars/Peter Lynch.png" },
];

type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  agentName?: string;
  timestamp: string;
};

export default function AgentDiscussion() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["Cathie Wood", "Michael Burry"]);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((a) => a !== agentId) : [...prev, agentId]
    );
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!prompt.trim() || selectedAgents.length === 0) return;

    const timeString = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
    const userMessage: Message = { id: Date.now().toString(), role: "user", content: prompt, timestamp: timeString };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.content, agents: selectedAgents }),
      });

      const data = await res.json();

      if (data.responses) {
        const agentMessages: Message[] = data.responses.map((r: any, idx: number) => ({
          id: `agent-${Date.now()}-${idx}`,
          role: "agent",
          agentName: r.agentName,
          content: r.content,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })
        }));
        setMessages((prev) => [...prev, ...agentMessages]);
      }
    } catch (error) {
      console.error("Error fetching agent responses", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="dash-wr-head">
        <div>
          <div className="dash-wr-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="6" cy="6" r="2.5"/>
              <circle cx="18" cy="6" r="2.5"/>
              <circle cx="12" cy="18" r="2.5"/>
              <line x1="6" y1="8.5" x2="12" y2="15.5"/>
              <line x1="18" y1="8.5" x2="12" y2="15.5"/>
            </svg>
            War <span>Room</span>
          </div>
          <div className="dash-wr-sub">Simulate a high-stakes investment committee meeting with quantitative focus.</div>
        </div>
        <div className="dash-seats-pill">Active Seats: {selectedAgents.length}</div>
      </div>

      <div className="dash-wr-grid">
        {/* Committee Members List */}
        <div className="dash-member-list">
          <div className="dash-member-list-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9"/>
            </svg>
            Committee Members
          </div>
          <div>
            {MEMBERS.map((m) => {
              const isSelected = selectedAgents.includes(m.id);
              let stateClass = "";
              if (isSelected) {
                stateClass = m.id === "Cathie Wood" ? "active-a" : m.id === "Michael Burry" ? "active-b" : "active-c";
              }
              return (
                <button
                  key={m.id}
                  onClick={() => toggleAgent(m.id)}
                  className={`dash-member ${stateClass}`}
                >
                  <div className="dash-member-left">
                    <img
                      src={m.avatar}
                      alt={m.id}
                      className="dash-member-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div>
                      <div className="dash-member-name">{m.id}</div>
                      <div className="dash-member-role">{m.role}</div>
                    </div>
                  </div>
                  <div className="dash-member-dot"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Transcript Console */}
        <div className="dash-transcript-card">
          <div className="dash-transcript-head">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <polyline points="8 9 11 12 8 15"/>
            </svg>
            Live Transcript
          </div>

          <div className="dash-transcript-body">
            {messages.length === 0 ? (
              <div className="dash-transcript-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/>
                  <path d="M19 15l.7 2.1 2.1.7-2.1.7L19 20.6l-.7-2.1-2.1-.7 2.1-.7z"/>
                </svg>
                <div className="dash-idle">Committee_Idle</div>
                <p>Present a thesis or asset to the selected committee members to begin the debate.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  const agentObj = !isUser ? MEMBERS.find(m => m.id.toLowerCase() === msg.agentName?.toLowerCase() || msg.agentName?.toLowerCase().includes(m.id.toLowerCase())) : null;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isUser ? "flex-end" : "flex-start",
                        maxWidth: "85%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isUser ? "flex-end" : "flex-start",
                        gap: 3
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--mono)", color: "var(--faint)" }}>
                        {agentObj && (
                          <img
                            src={agentObj.avatar}
                            alt={msg.agentName}
                            style={{ width: 18, height: 18, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--line)" }}
                          />
                        )}
                        <span style={{ fontWeight: 600, color: isUser ? "var(--ink)" : "var(--cobalt)" }}>
                          {isUser ? "Chairman" : msg.agentName}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          fontSize: 13.5,
                          lineHeight: 1.5,
                          background: isUser ? "var(--card)" : "#FFFFFF",
                          border: "1px solid var(--line)",
                          color: "var(--ink)",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, fontSize: 12, fontFamily: "var(--mono)", color: "var(--muted)" }}>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Committee agents are synthesizing viewpoints...</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          <div className="dash-transcript-foot">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Present a ticker or market thesis to the committee (e.g. Is NVDA valuation sustainable?)..."
              className="dash-transcript-input"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !prompt.trim()}
              className="dash-btn-primary"
              style={{ padding: "8px 16px", fontSize: 13, gap: 6 }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Deploy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}