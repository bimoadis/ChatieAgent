# Chatie Agent — Landing Page Dev Brief

**Versi:** 1.0 · Agustus 2026
**Referensi hidup:** `chatie-agent.html` (prototype 1-file, semua behavior final ada di situ — file ini adalah spec, prototype adalah kebenaran)
**Referensi visual:** financialdatasets.ai (struktur & motion language), BUKAN warnanya — brand kita cobalt, bukan hijau
**Target stack:** Next.js 14+ (App Router) · TypeScript · Tailwind v4 · deploy Vercel

---

## 0. Prinsip desain (baca dulu)

1. **Animasi = simulasi produk, bukan dekorasi.** Semua motion di halaman ini adalah produk yang "berjalan sendiri": agent mengetik query, tabel streaming, JSON streaming, chart tumbuh. Jangan tambah animasi yang tidak merepresentasikan perilaku produk.
2. **Satu aksen.** Cobalt `#1E4DD8` hanya untuk: garis spine, brand mark, elemen interaktif aktif, angka di syntax highlight. Hijau/merah HANYA untuk semantik pasar (naik/turun, buy/sell, 200 OK). Jangan pakai cobalt untuk positif/negatif.
3. **Klaim jujur.** Tidak ada kata "institutional-grade", tidak ada chart performa, tidak ada track record. Chart hanya telemetry (dispersion, latency, coverage). Section "What this is not" wajib ada dan tidak boleh dihapus.
4. **Reduced motion = fitur.** Setiap animasi harus punya fallback state akhir yang statis. User `prefers-reduced-motion` melihat halaman lengkap tanpa satu pun elemen bergerak.

---

## 1. Design tokens

### 1.1 Warna
| Token | Hex | Pakai untuk |
|---|---|---|
| `--paper` | `#FAF9F6` | Background halaman (warm off-white — JANGAN putih murni) |
| `--panel` | `#F1F0EA` | Background demo panel / terminal / code card |
| `--card` | `#FFFFFF` | Kartu di dalam panel (tabel, qbox, tab aktif) |
| `--line` | `#E7E5DE` | Border utama |
| `--line-soft` | `#EFEDE6` | Border baris tabel internal |
| `--ink` | `#141413` | Teks utama, tombol primary, bar chart seri A |
| `--muted` | `#6F6E69` | Teks sekunder |
| `--faint` | `#A3A29B` | Label mono, placeholder |
| `--cobalt` | `#1E4DD8` | Brand accent (lihat prinsip #2) |
| `--up` | `#0E7E48` | Positif / BUY / 200 OK |
| `--down` | `#B42318` | Negatif / SELL |

### 1.2 Syntax highlight (light theme, hand-rolled)
| Token | Hex | Untuk |
|---|---|---|
| `--sy-key` | `#A03B22` | JSON keys |
| `--sy-str` | `#8A6A00` | String values |
| `--sy-num` | `#1E4DD8` | Angka |
| `--sy-kw` | `#6D28D9` | Keywords (`import`, `const`, `await`, `true/false/null`) |
| `--sy-fn` | `#0E7E48` | Function calls |

### 1.3 Typography
- **Sans:** Geist (300–700) — via `next/font`, bukan Google Fonts `<link>`
- **Mono:** Geist Mono (400–500)
- Skala: `h1` clamp(38px, 5.6vw, 64px) / ls -0.035em · `h2` clamp(25px, 3.2vw, 36px) / ls -0.03em · lede clamp(16px, 1.55vw, 18px) · body 16px · mono labels 10–12.5px dengan `letter-spacing: .06–.14em` uppercase
- Semua angka finansial: `font-variant-numeric: tabular-nums` (wajib — kolom angka tidak boleh goyang saat berubah)

### 1.4 Spacing & radius
- Container: max-w 1180px, padding-x `clamp(20px, 5vw, 64px)`
- Section padding-y: `clamp(52px, 7vw, 88px)`
- Radius: kartu besar 14px, elemen dalam 8–10px, chip/tag 4–5px
- Rail spine: 112px di kiri konten (desktop), collapse ke 0 di <900px

---

## 2. Struktur halaman

```
Nav (sticky, blur backdrop)
Hero          — copy kiri, particle globe kanan, CTA, stats row 4 kolom
01 Panel      — demo agent loop #1 (kiri) + copy (kanan)     [flip layout]
02 Consensus  — copy (kiri) + demo agent loop #2 (kanan)
03 Datasets   — list kategori (kiri) + terminal response (kanan)
04 Telemetry  — chart card full-width (tabs + grouped bars + methodology)
05 API        — code card (kiri) + response card streaming (kanan)
06 Limits     — disclaimer block
Closer CTA
Footer
Fixed: spine SVG (kiri), readout scroll % (kiri bawah), pill HUMAN/AGENT (tengah bawah)
```

Layout section 01 dan 02 **zig-zag** (demo kiri lalu kanan) — pola dari referensi.

---

## 3. Spesifikasi komponen & animasi

### 3.1 Spine (garis scroll kiri)
Path SVG vertikal berkelok dengan `preserveAspectRatio="none"`, tinggi = `document.scrollHeight`.

**Tiga path bertumpuk:**
1. `track` — abu statis, stroke 1.25
2. `draw` — cobalt, `strokeDasharray = LEN`, `strokeDashoffset = LEN * (1 - progress)`
3. `trail` (komet) — cobalt + `feGaussianBlur(3.2)`, dasharray `${t} ${LEN+t}`, dashoffset `t - (LEN*progress)`, dengan `t = 26 + min(1, speed*55) * 210`

**Physics:** `current += (target - current) * 0.13` per frame (lerp). `speed = |Δcurrent|` per frame. Speed memodulasi: lebar trail (2.2→5.6), opacity trail (0.20→0.75), radius head (3.2→4.8), radius glow (8→21).

**Head:** dua `<circle>` (glow blur + dot solid) di posisi `path.getPointAtLength(LEN * progress)`.

**Node per section:** section punya `data-at` (fraksi 0–1): panel 0.09, method 0.26, sources 0.43, dispersion 0.60, api 0.76, limits 0.90. Saat `progress >= data-at`: node fill cobalt, ring ripple 0.9s (scale 0.35→1, opacity 0.55→0), section dapat class `live` (nomor step jadi cobalt), semua `.rv` di section dapat class `in`. **Reversibel** — scroll balik mematikan semuanya.

**rAF lifecycle:** loop hanya jalan saat `|target - current| > 0.00035` atau `vel > 0.00002`; berhenti sendiri saat settle. Jangan rAF permanen.

Di Next.js: `ScrollSpine.tsx` sebagai client component, di luar React render cycle (langsung manipulasi DOM via ref — jangan setState per frame).

### 3.2 Particle globe (hero)
Canvas 840×840 (ditampilkan ≤420px), **bukan** three.js:
- 620 titik distribusi fibonacci sphere (golden angle `π(3−√5)`)
- Rotasi sumbu-Y `0.0028 rad/frame`; proyeksi ortografis sederhana
- Depth `s = (z+2)/3` → radius titik `0.9 + s*1.5`, alpha `0.12 + s*0.55`
- Titik dengan `z > 0.86` (menghadap depan) berwarna cobalt, sisanya ink — efek "kutub" halus
- Wobble per titik: `sin(t/900 + jitter) * 2px`
- **Pause via IntersectionObserver** saat off-screen; static render untuk reduced-motion

### 3.3 Agent demo panel (section 01 & 02) — komponen paling penting
State machine loop, aktif hanya saat visible (IO threshold 0.25):

```
IDLE → TYPING query (24ms/char + jitter)
     → DISPATCH  (350ms delay): baris "> Agent: dispatching 19 agents [chip] [spinner]"
     → STREAM    (1500ms delay): tabel muncul, baris masuk satu-satu interval 380ms;
                  baris terakhir class .ghost (opacity .35) selama streaming
     → DONE      : "✓ Agent: 19/19 returned · 38.4s" (hijau), ghost dilepas
     → RESET     (loop total 12.5s) → TYPING lagi
```

Reset penuh saat panel keluar viewport (clear semua timer — simpan array timer id). Dua instance dengan konten beda (panel run NVDA; consensus breakdown). Conviction bar dalam baris: width 0 → var(--w) saat baris dapat `.on`, transition 0.7s delay 0.15s.

Di Next.js: `AgentDemo.tsx` menerima props `{query, dispatchLabel, doneLabel, rows}`; gunakan `useRef` untuk timer array, cleanup di effect return.

### 3.4 Dataset terminal (section 03)
- Kiri: 6 item list (`Operational KPIs`, `Income statements`, `Balance sheets`, `Cash flow`, `Filing excerpts`, `Insider trades`). Klik = render dataset. Item aktif bg `--panel`.
- **Auto-cycle 5.2s** antar dataset saat visible (matikan interval saat blur/off-screen; reduced-motion tanpa auto-cycle).
- Kanan: terminal card. Bar atas: `RESPONSE [200 OK] · {source}` + toggle **▦ Table / { } JSON**.
- Table view: baris flex mono, muncul stagger 55ms/baris. Group header (REVENUE, dst.) uppercase faint. YoY `+` hijau `−` merah.
- JSON view: object yang sama diserialisasi + syntax highlight (regex sederhana di prototype; di production boleh tetap regex — inputnya trusted, bukan user content).

### 3.5 Telemetry chart (section 04)
SVG hand-rolled viewBox `760×300` (JANGAN recharts untuk ini — bundle tidak sepadan):
- 3 tab dataset: **Dispersion** (bull–bear spread vs consensus conviction), **Run latency** (P50 vs P95), **Source coverage** (claims sourced vs filings fetched)
- Grouped bars: seri A `#141413`, seri B `#1E4DD8`, lebar ≤34px, gap 8px, rx 3
- Gridlines horizontal dotted (`stroke-dasharray: 1 5`), label sumbu mono 10px
- Value label di atas tiap bar (mono 10.5px)
- **Animasi masuk:** `transform: scaleY(0→1)` per bar, `transform-origin` di baseline bar masing-masing (set via JS setelah render), stagger 90ms per kategori, +60ms untuk seri B. Re-trigger saat ganti tab (remove class → force reflow → add class).
- Bawah chart: 2 kolom "About this telemetry" + "Methodology" — copy berubah per tab.
- **Framing wajib:** ini telemetry operasional, bukan klaim performa. Jangan pernah ganti dataset ini dengan chart return/akurasi prediksi.

### 3.6 Code + response card (section 05)
**Kiri (request):**
- Bar atas: pseudo-select `GET /panel/run ▾` + `NVDA ▾` + tombol **Run** hitam (ikon play spin saat busy 900ms)
- Tab bahasa: Python / TypeScript / cURL — konten pre-highlighted (hardcoded HTML spans, bukan library)
- Endpoint fiktif konsisten: `api.chatie.agent/panel/run?ticker=NVDA&agents=all&include=transcript,sources`

**Kanan (response):**
- Bar: `RESPONSE [200 OK] · NVDA` + tombol copy
- JSON streaming: full string di-slice maju 3–6 char per tick 16ms, `scrollTop = scrollHeight` mengikuti; syntax highlight per tick
- Play sekali saat card pertama visible; tombol Run me-replay
- Shape JSON harus mencerminkan produk: `consensus.split`, `dispersion_pct`, array `agents[]` dengan `call/conviction/fair_value/thesis/sources[]`, dan `unsourced_claims: 0`

### 3.7 Reveal system
- `.rv` = `opacity 0 / translateY(18px)` → `.in` via spine (bukan IO) untuk konten section; delay class `.d1/.d2/.d3` (+70ms step)
- Elemen di luar section (stats, closer): IO-style check `rect.top < innerHeight * 0.88` di dalam `paint()`
- Hero: split kata per kata, `blur(6px) + translateY(24px)` → tajam, delay `120ms + i*55ms`
- Stats: count-up cubic ease-out 1200ms, trigger sekali di `progress > 0.02`

### 3.8 HUMAN / AGENT pill
Fixed bottom-center. HUMAN = default. AGENT = overlay fullscreen berisi ringkasan plaintext machine-readable (produk, endpoint, datasets, disclaimer). Ini easter egg yang on-brand untuk produk agen — pertahankan.

### 3.9 Nav
Sticky + `backdrop-filter: blur(14px) saturate(180%)`, bg `rgba(250,249,246,.85)`. Link aktif mengikuti node spine terakhir yang lit (underline cobalt scaleX). Brand mark: garis chart di dalam rounded square, self-draw 1.1s saat load.

---

## 4. Struktur file Next.js

```
app/
  layout.tsx              # font Geist via next/font, tokens di globals
  page.tsx                # server component; komposisi section
  globals.css             # @theme Tailwind v4 dengan semua token §1
components/
  landing/
    ScrollSpine.tsx       # 'use client' — spine + head + nodes + readout
    ParticleGlobe.tsx     # 'use client' — canvas hero
    AgentDemo.tsx         # 'use client' — state machine §3.3 (dipakai 2×)
    DatasetTerminal.tsx   # 'use client' — list + table/json + auto-cycle
    TelemetryChart.tsx    # 'use client' — SVG chart + tabs
    CodePanel.tsx         # 'use client' — request/response streaming
    ModeToggle.tsx        # 'use client' — HUMAN/AGENT
    Reveal.tsx            # wrapper .rv (menerima signal dari spine context)
    StatsRow.tsx, Nav.tsx, Footer.tsx, LimitsNote.tsx
lib/
  landing-data.ts         # SEMUA konten demo: rows, KPI datasets, chart sets,
                          # code snippets, JSON response — satu file, gampang diedit
hooks/
  useReducedMotion.ts
  useOnVisible.ts         # IntersectionObserver wrapper
```

**Pola penting:**
- `page.tsx` tetap server component; hanya leaf yang `'use client'`.
- Spine mem-broadcast progress via context ATAU custom event `spine:progress` — komponen Reveal subscribe. Jangan lift state ke React per-frame.
- Semua konten demo di `landing-data.ts` supaya copywriting bisa diubah tanpa sentuh komponen.
- Semua timer/interval/rAF: cleanup di unmount DAN saat off-screen.

---

## 5. Copy (final, jangan improvisasi tanpa approval)

- **H1:** "A research desk behind every ticker you type."
- **Lede:** "Chatie Agent runs a panel of investor-model agents across live market data, then shows you where they disagree — because the disagreement is the signal, not the headline verdict."
- Section heads: 01 "Watch the desk argue" · 02 "The spread is the output" · 03 "Every claim carries its receipt" · 04 "Panel telemetry, in the open" · 05 "Wire the panel into your stack" · 06 "What this is not"
- **Disclaimer (06) — verbatim, non-negotiable:** teks lengkap ada di prototype. Termasuk kalimat nama investor = *style of reasoning*, bukan afiliasi. Footer memuat `EDUCATIONAL USE ONLY`.
- CTA: "Run your first ticker" / "Open terminal" · micro-copy "NO CARD · 5 RUNS FREE"

---

## 6. Acceptance criteria

**Motion**
- [ ] Spine tergambar mengikuti scroll dengan lerp; komet terlihat, ekornya memanjang saat scroll cepat
- [ ] Ripple + step number menyala tepat saat garis mencapai tiap section; reversibel saat scroll balik
- [ ] Agent demo loop penuh (type → dispatch → stream → done → reset) dan berhenti total saat off-screen (cek: tidak ada timer jalan via DevTools Performance)
- [ ] Dataset terminal auto-cycle 5.2s, klik manual override, toggle Table/JSON bekerja
- [ ] Chart bars tumbuh dari baseline dengan stagger; re-animate saat ganti tab
- [ ] JSON response streaming dengan auto-scroll; tombol Run me-replay
- [ ] `prefers-reduced-motion`: nol animasi, semua konten pada state akhir, halaman tetap lengkap

**Kualitas**
- [ ] Lighthouse Performance ≥ 90 mobile; CLS < 0.05 (perhatikan: tinggi min demo panel 340px supaya loop tidak menggeser layout)
- [ ] Tidak ada rAF/interval berjalan saat idle di luar viewport elemen terkait
- [ ] Semua angka pakai tabular-nums; kolom tidak bergeser saat konten berubah
- [ ] Responsive: 360px (rail hilang, hero stack, stats 2×2), 768px, 1280px
- [ ] Keyboard: semua tab/toggle/tombol focusable dengan focus ring cobalt; demo panel `aria-label` deskriptif
- [ ] Font via next/font (tidak ada FOUT yang menggeser hero)

**Konten**
- [ ] Section 06 + footer disclaimer utuh
- [ ] Tidak ada klaim performa/track record di mana pun
- [ ] Warna hijau/merah hanya untuk semantik pasar

---

## 7. Yang secara eksplisit TIDAK dikerjakan (v1)

- Integrasi API nyata (semua demo hardcoded dari `landing-data.ts`)
- CMS — copy diedit langsung di file data
- Dark mode
- Recharts/three.js/GSAP/Lenis — semua motion vanilla, sudah terbukti cukup di prototype
- Halaman selain landing (docs/pricing = link mati untuk sekarang)