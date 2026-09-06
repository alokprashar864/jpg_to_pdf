# 🎯 Project Milestones & Strategic Roadmap

> **Strategic Directive:** Operationalizing the Economic Sustainability, SEO Pivot, and Feature Moat strategies. This document establishes concrete GitHub milestones, issues, and delivery phases to ensure the platform scales profitably and withstands Google's algorithmic spam and scaled-content enforcement.

---

## 📑 Table of Contents
- [Executive Strategic Summary](#-executive-strategic-summary)
- [Milestone Architecture & Horizon](#-milestone-architecture--horizon)
- [Milestone 1: Economic Sustainability & Abuse Defense (v1.1)](#-milestone-1-economic-sustainability--abuse-defense-v11)
- [Milestone 2: The Wedge & Feature Moat (v1.2)](#-milestone-2-the-wedge--feature-moat-v12)
- [Milestone 3: Distribution Engine & Ecosystem (v1.3)](#-milestone-3-distribution-engine--ecosystem-v13)
- [Milestone 4: Programmatic SEO Pivot to High-Value Content (v1.4)](#-milestone-4-programmatic-seo-pivot-to-high-value-content-v14)
- [Milestone 5: Institutional Trust & Transparency (v1.5)](#-milestone-5-institutional-trust--transparency-v15)
- [Execution Phases & Go-To-Market Timeline](#-execution-phases--go-to-market-timeline)
- [Key Risk Register & Mitigation Controls](#-key-risk-register--mitigation-controls)

---

## 🛡️ Executive Strategic Summary

Uncapped free cloud compute is an existential trap. While Cloudflare R2 eliminates data egress fees, high-frequency Class A operations, Redis connection counts, and heavy image rasterization compute on Go daemons represent compounding variable costs that grow linearly with unmonetized traffic.

Simultaneously, traditional programmatic SEO (`/[tool]` doorway directories) triggers severe penalties under Google’s Search Updates (targeting scaled doorway pages and unoriginal programmatic content).

This milestone plan executes a decisive two-pronged pivot:
1. **Economic Inversion:** Transitioning 80–85% of traffic to client-side WebAssembly (`pdf-lib` / canvas), reducing cloud compute to a high-intent, rate-limited premium fallback.
2. **Intent-Driven Product Wedge:** Escaping commoditized "convert jpg" keyword wars by capturing high-intent utility searches like *"JPG to PDF under 200KB for government portals"* with targeted compression heuristics.

---

## 🗺️ Milestone Architecture & Horizon

| Milestone | Code | Theme | Primary Goal | Target Horizon |
|:---|:---:|:---|:---|:---:|
| **Milestone 1** | `v1.1` | **Economic Defense** | Client-side WASM engine, Redis rate-limiting & cloud usage tiers | Week 1 – 2 |
| **Milestone 2** | `v1.2` | **Feature Moat** | Target File Size compression (binary search) & Document Scanner mode | Week 3 – 4 |
| **Milestone 3** | `v1.3` | **Distribution Channels** | Chrome Extension, PWA offline mode, `@brand/jpg-to-pdf-core` NPM package | Week 5 – 6 |
| **Milestone 4** | `v1.4` | **SEO Pivot** | Eliminate programmatic doorway traps; publish 5 foundational research guides | Week 7 – 8 |
| **Milestone 5** | `v1.5` | **Trust & ADRs** | Public Transparency Dashboard (deletion audit) & Architectural Decision Records | Ongoing |

---

## 📦 Milestone 1: Economic Sustainability & Abuse Defense (v1.1)
**Goal:** Prevent cloud bill collapse by defaulting to client-side compute and enforcing strict edge defense.

### Issue #1: Implement Default Client-Side WASM Engine
- **Priority:** `P0 - CRITICAL`
- **Labels:** `enhancement`, `priority-critical`, `economics`
- **Scope & Approach:**
  - Standardize `pdf-lib` / WebAssembly conversion natively inside the user's browser.
  - Implement dynamic routing in frontend: All jobs with $\le 20$ images and total payload $\le 50\text{ MB}$ compile entirely on client hardware ($0 server cost).
  - Only route to the Go backend worker when job size $> 50\text{ MB}$, batch $> 20$ files, or when the user explicitly requests OCR or server compression.
- **Acceptance Criteria:**
  - [ ] Frontend automatically classifies payload and switches between WASM and Cloud engines.
  - [ ] WASM output passes visual parity checks against `pdfcpu` generated PDFs.
  - [ ] Clear UI status badge appears: *"⚡ Processed 100% locally on your device (Private & Instant)"*.
  - [ ] Anonymous telemetry tracks ratio of client vs cloud conversions (Target: $\ge 85\%$ client-side).

### Issue #2: Edge Rate Limiting & Bot Scrubbing
- **Priority:** `P0 - CRITICAL`
- **Labels:** `security`, `priority-critical`, `infrastructure`
- **Scope & Approach:**
  - Enforce Upstash Redis sliding-window rate limiters at the NestJS gateway.
  - Mitigate headless scraping bots that exploit conversion workers as free image compute.
- **Acceptance Criteria:**
  - [ ] Limit free IP usage to 100 conversions / hour.
  - [ ] Integrate Cloudflare Turnstile / CAPTCHA challenge after 10 requests within a 5-minute burst.
  - [ ] Block known automated headless agents (Puppeteer, Playwright, Selenium signatures).
  - [ ] Expose health and quota headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).

### Issue #3: Multi-Tiered Cloud Quotas & Upgrade Triggers
- **Priority:** `P1 - HIGH`
- **Labels:** `monetization`, `backend`, `priority-high`
- **Scope & Approach:**
  - Bound server-side conversion access while keeping local browser conversion unconditionally unlimited.
- **Acceptance Criteria:**
  - [ ] Unauthenticated / Free Tier capped at 20 cloud conversions per rolling 24 hours.
  - [ ] Client-side WASM conversions remain permanently unlimited and unthrottled.
  - [ ] Inline banner displays quota consumption: *"14 of 20 cloud conversions remaining today"*.
  - [ ] Graceful upgrade modal prompts when cloud limits are exceeded.

---

## 🎯 Milestone 2: The Wedge & Feature Moat (v1.2)
**Goal:** Introduce high-utility features that incumbents do not offer seamlessly without multi-step paywalls.

### Issue #4: Target File Size Binary Search Compression
- **Priority:** `P1 - HIGH`
- **Labels:** `enhancement`, `feature-moat`, `worker`
- **Scope & Approach:**
  - Implement a dedicated preset engine: *"Target Under 100KB"*, *"Under 200KB"*, *"Under 500KB"*, *"Under 1MB"*, *"Under 2MB"*.
  - Worker executes binary search algorithm iterating between JPEG quality levels ($85 \to 40$) and DPI downscaling ($300 \to 150 \to 72$) to hit the byte threshold within $\le 3$ passes.
- **Acceptance Criteria:**
  - [ ] UI provides quick-select chips for government/portal standard thresholds (200KB, 500KB, 1MB).
  - [ ] Output PDF size guarantees $\pm 8\%$ accuracy of chosen threshold.
  - [ ] UI warns if original image text resolution would fall below legibility minimums.
  - [ ] Live preview updates estimated resulting file size before download.

### Issue #5: "Document Scanner" Enhancement Filter
- **Priority:** `P2 - MEDIUM`
- **Labels:** `enhancement`, `ux`, `canvas`
- **Scope & Approach:**
  - Provide a 1-click preset that turns crumpled, shadowed, off-white smartphone photos of paper documents into crisp, scanner-quality monochrome or high-contrast prints.
  - Implemented via HTML5 Canvas shaders client-side (or `govips` matrix pipeline).
- **Acceptance Criteria:**
  - [ ] One-click toggle: *"Document Mode (Whitening & Deskew)"*.
  - [ ] Automatic shadow removal, background whitening, and gamma compensation ($1.3 - 1.5$).
  - [ ] Processing latency overhead remains below $400\text{ ms}$ on client hardware.
  - [ ] Split-screen slider comparing Original vs Enhanced document.

---

## 🚀 Milestone 3: Distribution Engine & Ecosystem (v1.3)
**Goal:** Build resilient acquisition loops independent of third-party search engine whims.

### Issue #6: Progressive Web App (PWA) Offline Engine
- **Priority:** `P1 - HIGH`
- **Labels:** `frontend`, `pwa`, `distribution`
- **Scope & Approach:**
  - Deploy Service Worker caching for the core Next.js application shell and WASM compilation runtime.
- **Acceptance Criteria:**
  - [ ] Web app fully operational in airplane mode with zero network connectivity.
  - [ ] Passes Google Lighthouse PWA checklist with a score of $100/100$.
  - [ ] Native install prompts on iOS Safari and Android Chrome.

### Issue #7: Standalone Chrome / Chromium Extension
- **Priority:** `P2 - MEDIUM`
- **Labels:** `extension`, `growth`, `distribution`
- **Scope & Approach:**
  - Build a Manifest v3 browser extension allowing users to right-click web images or local filesystem assets to immediately compile a PDF document.
- **Acceptance Criteria:**
  - [ ] Manifest v3 compliant extension bundle.
  - [ ] Native browser context menu hook: *"Add image to PDF"*.
  - [ ] Popup queue tray managing image reordering and 1-click compile.
  - [ ] Uses local WASM compilation without routing image data through external APIs.

### Issue #8: Open-Source Core SDK (`@jpgtopdf/core`)
- **Priority:** `P2 - MEDIUM`
- **Labels:** `open-source`, `npm`, `developer-relations`
- **Scope & Approach:**
  - Package the client-side conversion logic as an independent zero-dependency TypeScript package published on NPM.
- **Acceptance Criteria:**
  - [ ] Standalone NPM package with zero bloat and full TypeScript type definitions.
  - [ ] Supports both browser (`HTMLImageElement`, `Blob`) and Node.js environments.
  - [ ] Includes automated backlink reference to the main web application in documentation.

---

## 🔍 Milestone 4: Programmatic SEO Pivot to High-Value Content (v1.4)
**Goal:** Protect domain authority by stripping algorithmic spam traps and generating authoritative editorial guides.

### Issue #9: Decommission Programmatic Doorway Routes
- **Priority:** `P0 - CRITICAL`
- **Labels:** `seo`, `risk-mitigation`, `priority-critical`
- **Scope & Approach:**
  - Dismantle dynamic `/[tool]` route patterns producing thin, repetitive keyword variants (`/jpg-to-pdf-a4`, `/jpg-to-pdf-us-letter`).
- **Acceptance Criteria:**
  - [ ] Remove thin programmatic templates.
  - [ ] Issue clean HTTP 301 Permanent Redirects consolidating all historical keyword routes into the root application (`/`).
  - [ ] Generate and submit updated `sitemap.xml` to Google Search Console.

### Issue #10: Authoritative Long-Form Pillar Content
- **Priority:** `P1 - HIGH`
- **Labels:** `content`, `seo`, `growth`
- **Scope & Approach:**
  - Replace discarded programmatic directories with comprehensive, original research-backed guides answering specific high-intent queries.
- **Deliverables:**
  1. *"How to Convert JPG to PDF Under 200KB for Government Portals (UPSC, SSC, US Visa)"*
  2. *"Student Guide: Preserving 300 DPI Resolution for Academic Poster Submissions"*
  3. *"Phone Scans to Flat Documents: Eliminating Yellow Shadows Without a Hardware Scanner"*
  4. *"The Privacy Breakdown: Network Traffic Audits of Popular Online PDF Converters"*
  5. *"Batch Compressing Multi-Page Receipts for Tax & Expense Compliance"*
- **Acceptance Criteria:**
  - [ ] Articles average $> 2,000$ words with proprietary diagrams and step-by-step videos/GIFs.
  - [ ] Interactive converter module embedded directly within each guide.
  - [ ] Correct JSON-LD structured data (`Article`, `HowTo`, `FAQPage`).

---

## 🏛️ Milestone 5: Institutional Trust & Transparency (v1.5)
**Goal:** Validate all marketing assertions with automated open verification tools.

### Issue #11: Public Automated Privacy & Deletion Audit Page
- **Priority:** `P2 - MEDIUM`
- **Labels:** `trust`, `transparency`, `compliance`
- **Scope & Approach:**
  - Publish an unalterable transparency ledger demonstrating that uploaded artifacts are rigorously purged from Cloudflare R2 after 24 hours.
- **Acceptance Criteria:**
  - [ ] Public status endpoint verifying active Cloudflare R2 bucket lifecycle rules.
  - [ ] Live aggregation metrics: Total bytes processed locally vs cloud, total objects automatically pruned.
  - [ ] Zero-knowledge privacy declaration detailing network isolation during client WASM mode.

### Issue #12: Formal Architecture Decision Records (ADRs)
- **Priority:** `P3 - LOW`
- **Labels:** `documentation`, `architecture`
- **Scope & Approach:**
  - Standardize technical records under `.planning/adr/` documenting structural pivots.
- **Deliverables:**
  - `ADR-001`: Hybrid In-Browser WASM and Remote Go Queue Execution
  - `ADR-002`: Zero-Egress Economics: Transition to Cloudflare R2
  - `ADR-003`: Go Worker Engine Selection (`pdfcpu` + `govips` vs Node Canvas)
  - `ADR-004`: Rate-Limiting and Sliding-Window Token Throttling
  - `ADR-005`: Decommissioning Programmatic Doorways in Response to Search Spam Updates

---

## ⏱️ Execution Phases & Go-To-Market Timeline

```
Week 1 - 2: [ Phase 1: Economic Hardening ]
            ├── Issue #1: Client-Side WASM Engine (P0)
            ├── Issue #2: Redis Rate-Limiter & Turnstile (P0)
            └── Issue #9: Programmatic Doorway Decommission (P0)

Week 3 - 4: [ Phase 2: Feature Wedge Development ]
            ├── Issue #4: Target File Size Binary Search Compression (P1)
            ├── Issue #5: Document Scanner Enhancement Mode (P2)
            └── Issue #10: Release First 2 High-Value Pillar Guides (P1)

Week 5 - 6: [ Phase 3: Distribution & Public Launch ]
            ├── Issue #6: PWA Offline Conversion Capability (P1)
            ├── Issue #7: Chrome Web Store Extension (P2)
            ├── Launch: Product Hunt ("Target File Size Under 200KB")
            └── Launch: Hacker News ("Why we rebuilt our backend into WASM to survive")

Week 7+:    [ Phase 4: Sustainable Growth & Ecosystem ]
            ├── Issue #8: Open-source @jpgtopdf/core on NPM (P2)
            ├── Issue #11: Public Transparency & Compliance Page (P2)
            └── Issue #12: Commit Full ADR Suite (P3)
```

---

## ⚠️ Key Risk Register & Mitigation Controls

| Risk Event | Impact | Probability | Mitigation Strategy |
|:---|:---:|:---:|:---|
| **Viral Spike Exceeds Server Budget** | High | Medium | WASM handles 85% of traffic locally. Cloud endpoint strictly enforces Redis burst limits and CAPTCHA. |
| **Search Engine Scaled Content Penalty** | Critical | High | Completely purge thin `/[tool]` programmatic URLs; redirect authority to root domain and 5 comprehensive research pillars. |
| **Large In-Browser Batches Crash Mobile Browsers** | Medium | High | Memory monitoring in JS: Payloads $>20$ files or $>50\text{ MB}$ automatically trigger prompt to switch to Cloud Engine. |
| **User Mistrust of "Free" Proposition** | Medium | Medium | Display visible open-source badges, zero ads, and an automated transparency page verifying ephemeral deletion. |

---

<div align="center">
  <sub>Track all active progress and milestones inside GitHub Projects.</sub>
</div>
