export interface KPIDataset {
  t: string;
  rows: [string, string, string?][];
}

export const KPI_DATASETS: KPIDataset[] = [
  {
    t: "· Delta Air Lines, Inc. (DAL)",
    rows: [
      ["hdr", "", "YoY"],
      ["g", "REVENUE"],
      ["Premium Revenue", "$5.36B", "+13.9%"],
      ["Loyalty Revenue", "$1.22B", "+12.8%"],
      ["Cargo Revenue", "$226.0M", "+8.7%"],
      ["g", "UNIT ECONOMICS"],
      ["Total Revenue per ASM", "22.92¢", "+11.6%"],
      ["Passenger Yield", "21.78¢", "+5.6%"],
      ["CASM Ex-Fuel", "15.13¢", "+6.3%"],
      ["g", "FUEL"],
      ["Fuel Cost per Gallon", "$2.78", "+12.6%"],
      ["Fuel Gallons Consumed", "988M", "+1.2%"],
      ["g", "LIQUIDITY"],
      ["Total Liquidity", "$8.10B", "-"],
    ],
  },
  {
    t: "· Alphabet Inc. (GOOGL)",
    rows: [
      ["hdr", "", "YoY"],
      ["g", "INCOME STATEMENT"],
      ["Revenue", "$350.0B", "+13.9%"],
      ["COGS", "$146.3B", "+9.8%"],
      ["Gross Profit", "$203.7B", "+17.0%"],
      ["R&D", "$49.3B", "+8.6%"],
      ["SG&A", "$42.0B", "−5.2%"],
      ["Operating Income", "$112.4B", "+33.2%"],
      ["Net Income", "$112.0B", "+35.7%"],
    ],
  },
  {
    t: "· Alphabet Inc. (GOOGL)",
    rows: [
      ["hdr", "", "YoY"],
      ["g", "BALANCE SHEET"],
      ["Cash & Equivalents", "$95.7B", "+13.4%"],
      ["Total Assets", "$450.2B", "+11.0%"],
      ["Total Liabilities", "$125.2B", "+4.7%"],
      ["Shareholder Equity", "$325.0B", "+13.6%"],
      ["Net Debt", "−$83.3B", "-"],
    ],
  },
  {
    t: "· Alphabet Inc. (GOOGL)",
    rows: [
      ["hdr", "", "YoY"],
      ["g", "CASH FLOW"],
      ["Operating Cash Flow", "$125.3B", "+23.1%"],
      ["CapEx", "−$52.5B", "+62.8%"],
      ["Free Cash Flow", "$72.8B", "+4.2%"],
      ["Buybacks", "−$62.2B", "+0.9%"],
      ["Dividends", "−$7.4B", "-"],
    ],
  },
  {
    t: "· NVDA 10-K · excerpts",
    rows: [
      ["hdr", "", "§"],
      ["g", "FILING EXCERPTS"],
      ['"Data Center revenue grew on demand for…"', "Item 7", "p.41"],
      ['"Our operating results may fluctuate…"', "Item 1A", "p.18"],
      ['"A limited number of customers represent…"', "Item 1A", "p.22"],
      ['"We expect gross margin to be impacted…"', "Item 7", "p.44"],
    ],
  },
  {
    t: "· NVDA · Form 4 feed",
    rows: [
      ["hdr", "", "Shares"],
      ["g", "INSIDER TRADES"],
      ["J. Huang : Sell (10b5-1)", "2026-07-18", "120,000"],
      ["C. Kress : Sell", "2026-07-02", "25,000"],
      ["M. Stevens : Buy", "2026-06-21", "4,000"],
      ["T. Coxe : Sell (10b5-1)", "2026-06-10", "60,000"],
    ],
  },
];

export interface ChartSet {
  name: [string, string];
  unit: string;
  min: number;
  max: number;
  about: string;
  cats: string[];
  a: number[];
  b: number[];
}

export const CHART_SETS: ChartSet[] = [
  {
    name: ["BULL / BEAR SPREAD", "CONSENSUS CONVICTION"],
    unit: "%",
    min: 0,
    max: 100,
    about:
      "Dispersion is the gap between the most bullish and most bearish fair-value estimate in a run, as a percent of spot. Wide bars mean the panel genuinely disagrees, which is where reading the transcript pays.",
    cats: ["Semis", "Software", "Airlines", "Energy", "Banks"],
    a: [62, 41, 28, 35, 19],
    b: [58, 66, 71, 64, 77],
  },
  {
    name: ["P50 LATENCY (s)", "P95 LATENCY (s)"],
    unit: "s",
    min: 0,
    max: 100,
    about:
      "Wall-clock time for a full 19-agent run, measured server-side from dispatch to last agent returning. P95 spikes track upstream model latency, not queue depth.",
    cats: ["Semis", "Software", "Airlines", "Energy", "Banks"],
    a: [38, 36, 41, 39, 37],
    b: [61, 58, 72, 66, 63],
  },
  {
    name: ["CLAIMS SOURCED", "FILINGS FETCHED / RUN"],
    unit: "%",
    min: 0,
    max: 100,
    about:
      "Share of numeric claims in agent transcripts that resolve to a fetched document. Unsourced claims are flagged inline in the transcript, never silently kept.",
    cats: ["Semis", "Software", "Airlines", "Energy", "Banks"],
    a: [100, 100, 100, 100, 100],
    b: [86, 79, 88, 83, 91],
  },
];

export const CODE_SNIPPETS = {
  py: `<span class="sy-kw">import</span> requests

resp <span class="sy-c">=</span> requests.<span class="sy-fn">get</span>(
    <span class="sy-s">"https://api.chatie.agent/panel/run"</span>,
    headers<span class="sy-c">=</span>{<span class="sy-s">"X-API-KEY"</span>: <span class="sy-s">"&lt;your-api-key&gt;"</span>},
    params<span class="sy-c">=</span>{
        <span class="sy-s">"ticker"</span>: <span class="sy-s">"NVDA"</span>,
        <span class="sy-s">"agents"</span>: <span class="sy-s">"all"</span>,
        <span class="sy-s">"include"</span>: <span class="sy-s">"transcript,sources"</span>
    }
)

run <span class="sy-c">=</span> resp.<span class="sy-fn">json</span>()
<span class="sy-fn">print</span>(run[<span class="sy-s">"consensus"</span>][<span class="sy-s">"split"</span>])`,
  ts: `<span class="sy-kw">const</span> resp = <span class="sy-kw">await</span> <span class="sy-fn">fetch</span>(
  <span class="sy-s">"https://api.chatie.agent/panel/run?"</span> +
  <span class="sy-kw">new</span> <span class="sy-fn">URLSearchParams</span>({
    ticker: <span class="sy-s">"NVDA"</span>,
    agents: <span class="sy-s">"all"</span>,
    include: <span class="sy-s">"transcript,sources"</span>,
  }),
  { headers: { <span class="sy-s">"X-API-KEY"</span>: process.env.CHATIE_KEY! } }
);

<span class="sy-kw">const</span> run = <span class="sy-kw">await</span> resp.<span class="sy-fn">json</span>();
console.<span class="sy-fn">log</span>(run.consensus.split);`,
  sh: `<span class="sy-fn">curl</span> <span class="sy-s">"https://api.chatie.agent/panel/run"</span> \\
  -H <span class="sy-s">"X-API-KEY: &lt;your-api-key&gt;"</span> \\
  -G \\
  -d <span class="sy-s">ticker=NVDA</span> \\
  -d <span class="sy-s">agents=all</span> \\
  -d <span class="sy-s">include=transcript,sources</span>`,
};

export const API_RESPONSE_JSON = {
  ticker: "NVDA",
  spot: 174.85,
  run_id: "run_8f3k2",
  elapsed_s: 38.4,
  consensus: {
    split: "8 BUY / 6 HOLD / 5 SELL",
    dispersion_pct: 62.1,
    contested_items: 4,
  },
  agents: [
    {
      name: "warren_buffett",
      call: "HOLD",
      conviction: 0.54,
      fair_value: 142.0,
      thesis: "Wide moat, but price embeds perfection.",
      sources: ["10-K/2025#item7", "10-K/2025#item1a"],
    },
    {
      name: "cathie_wood",
      call: "BUY",
      conviction: 0.88,
      fair_value: 310.0,
      thesis: "Accelerating platform shift; TAM underestimated.",
      sources: ["10-K/2025#item7", "transcript/Q2-2026"],
    },
    {
      name: "michael_burry",
      call: "SELL",
      conviction: 0.71,
      fair_value: 96.5,
      thesis: "Customer concentration + capex cycle peak.",
      sources: ["10-K/2025#item1a"],
    },
  ],
  unsourced_claims: 0,
};

export const AGENT_MACHINE_SUMMARY = `# Chatie Agent : machine-readable summary
product: multi-agent equity research terminal
what_it_does: runs 19 investor-model agents (value, growth, macro, tail-risk)
  on one ticker; agents cannot see each other's output; returns the full
  spread of calls, conviction, fair values, and contested line items.
key_endpoint: GET https://api.chatie.agent/panel/run?ticker=NVDA
datasets: income statements, balance sheets, cash flow, operational KPIs,
  SEC filing excerpts (10-K/10-Q, section-level), insider trades (Form 4)
guarantee: every numeric claim in a transcript resolves to a fetched
  document; unsourced claims are flagged inline, never kept silently.
not: an advisor. no track record. model output != forecast. educational use.
pricing: 5 runs free, no card.
docs: /docs   pricing: /pricing`;

export function syntaxHighlightJSON(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"([^"]+)":/g, '<span class="sy-k">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="sy-s">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="sy-n">$1</span>')
    .replace(/: (true|false|null)/g, ': <span class="sy-kw">$1</span>');
}
