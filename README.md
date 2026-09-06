# JPG to PDF Converter Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](#)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com/)
[![Go](https://img.shields.io/badge/Go-1.21-00ADD8?logo=go)](https://go.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://www.postgresql.org/)
[![Redis Streams](https://img.shields.io/badge/Redis-Streams-DC382D?logo=redis)](https://redis.io/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2_%240_Egress-F38020?logo=cloudflare)](https://www.cloudflare.com/products/r2/)

> **The Anti-iLovePDF**: An enterprise-grade, privacy-first JPG to PDF conversion platform. Experience **100 MB free file limits**, **zero forced watermarks**, **zero intrusive ads**, and a dual-engine architecture offering **100% in-browser WebAssembly conversion** or **high-throughput distributed cloud processing**.

---

### 🌐 Live Demo & Deployment
- **Web App:** [https://jpg-to-pdf-zeta.vercel.app](https://jpg-to-pdf-zeta.vercel.app)
- **API Status:** Production Ready (Vercel Edge + Render Go Worker)

---

## 📑 Interactive System Radar & Directory

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'fontSize': '13px', 'fontFamily': 'Inter, system-ui, sans-serif' }}}%%
flowchart TB
    classDef core fill:#7928CA,stroke:#C084FC,stroke-width:3px,color:#FFFFFF,font-weight:bold;
    classDef quadrant1 fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#E0F2FE,font-weight:600;
    classDef quadrant2 fill:#0F172A,stroke:#34D399,stroke-width:2px,color:#ECFDF5,font-weight:600;
    classDef quadrant3 fill:#0F172A,stroke:#F59E0B,stroke-width:2px,color:#FEF3C7,font-weight:600;
    classDef quadrant4 fill:#0F172A,stroke:#F43F5E,stroke-width:2px,color:#FFE4E6,font-weight:600;

    classDef nodeBlue fill:#0369A1,stroke:#38BDF8,stroke-width:1px,color:#FFFFFF;
    classDef nodeGreen fill:#047857,stroke:#34D399,stroke-width:1px,color:#FFFFFF;
    classDef nodeAmber fill:#B45309,stroke:#F59E0B,stroke-width:1px,color:#FFFFFF;
    classDef nodeRose fill:#BE123C,stroke:#F43F5E,stroke-width:1px,color:#FFFFFF;

    subgraph NorthEast ["🚀 QUADRANT I: VALUE & DIFFERENTIATION"]
        direction TB
        Q1["💡 Core Proposition"]:::quadrant1
        N1_1["💡 Why This Exists<br/>• Zero predatory paywalls<br/>• 100MB free files"]:::nodeBlue
        N1_2["✨ Key Capabilities<br/>• Lossless 300 DPI<br/>• Drag-and-drop sort"]:::nodeBlue
        N1_3["🥊 The Differentiator<br/>• Us vs. iLovePDF / Smallpdf"]:::nodeBlue
        Q1 --> N1_1
        N1_1 --> N1_2
        N1_2 --> N1_3
    end

    subgraph NorthWest ["⚙️ QUADRANT II: ARCHITECTURE & ENGINE"]
        direction TB
        Q2["🏗️ Distributed Engine"]:::quadrant2
        N2_1["⚡ Dual-Engine Topology<br/>• WASM Client Engine<br/>• Go Worker Daemon"]:::nodeGreen
        N2_2["☁️ Cloudflare R2 Storage<br/>• Zero-egress bandwidth<br/>• 24h ephemeral purge"]:::nodeGreen
        N2_3["⚙️ Environment Matrix<br/>• Full .env specifications"]:::nodeGreen
        Q2 --> N2_1
        N2_1 --> N2_2
        N2_2 --> N2_3
    end

    %% Central Hub
    CORE(("⚡ JPG to PDF<br/>PLATFORM<br/>CORE")):::core

    subgraph SouthEast ["🛠️ QUADRANT III: DEVELOPER ONBOARDING"]
        direction TB
        Q3["💻 Developer Workspace"]:::quadrant3
        N3_1["📋 Prerequisites<br/>• Docker, Go 1.21, Node 20"]:::nodeAmber
        N3_2["🚀 Local Quick Start<br/>• 5-min Docker Compose"]:::nodeAmber
        N3_3["📖 API Reference<br/>• REST endpoints & SSE streams"]:::nodeAmber
        Q3 --> N3_1
        N3_1 --> N3_2
        N3_2 --> N3_3
    end

    subgraph SouthWest ["🛡️ QUADRANT IV: QUALITY & GOVERNANCE"]
        direction TB
        Q4["⚖️ Governance & Evolution"]:::quadrant4
        N4_1["🧪 Automated Test Suite<br/>• Unit, Vitest, Go test"]:::nodeRose
        N4_2["🗺️ Strategic Roadmap<br/>• v1.1 WASM to v1.5 ADRs"]:::nodeRose
        N4_3["❓ Diagnostics & FAQ<br/>• CORS & memory tuning"]:::nodeRose
        Q4 --> N4_1
        N4_1 --> N4_2
        N4_2 --> N4_3
    end

    %% Cross-Quadrant Hub Links
    CORE ===>|Strategy| Q1
    CORE ===>|Orchestration| Q2
    CORE ===>|Execution| Q3
    CORE ===>|Compliance| Q4

    %% Inter-Quadrant Orbital Resonance Links
    N1_3 -.- N3_1
    N2_3 -.- N4_1
```

<p align="center">
  <b>Jump Directly:</b>
  <a href="#-why-this-exists"><code>💡 Why Us</code></a> •
  <a href="#-key-features"><code>✨ Features</code></a> •
  <a href="#-us-vs-them"><code>🥊 Comparison</code></a> •
  <a href="#-architecture-overview"><code>🏗 Architecture</code></a> •
  <a href="#-prerequisites"><code>📋 Prerequisites</code></a> •
  <a href="#-quick-start-local-development"><code>🚀 Quick Start</code></a> •
  <a href="#-usage-guide"><code>📖 API Guide</code></a> •
  <a href="#️-production-deployment-cloudflare-r2"><code>☁️ Cloudflare R2</code></a> •
  <a href="#-testing--quality-assurance"><code>🧪 Testing</code></a> •
  <a href="#️-roadmap"><code>🗺️ Roadmap</code></a> •
  <a href="#-troubleshooting--faq"><code>❓ FAQ</code></a> •
  <a href="#-contributing"><code>🤝 Contributing</code></a>
</p>

---

## 💡 Why This Exists

> [!CAUTION]
> ### 🛑 The Problem: The Predatory "Free" Converter Trap
> Most commercial online converters (iLovePDF, Smallpdf, PDF Candy) lure users with a "free" claim, then aggressively monetize document urgency through user-hostile mechanics:
> - **Arbitrary Paywalls:** 15–25 MB caps strategically engineered to fail on high-res camera scans or multi-page documents.
> - **Permanent Data Harvesting:** Invoices, tax returns, and ID scans are uploaded to opaque third-party cloud disks with no proof of deletion.
> - **Degraded Quality & Watermarks:** Files are re-compressed down to 72 DPI, ruining small print unless you purchase a monthly subscription.
> - **Deceptive Dark Patterns:** Full-screen popups, countdown blockers, and fake download buttons running tracking scripts.

> [!TIP]
> ### ⚡ The Mission: Enterprise Quality with Zero-Compromise Privacy
> We engineered this platform to be the definitive **open-source, privacy-first alternative**:
> - **Client-First Inversion (WASM):** Small-to-medium files compile right inside your browser's WebAssembly sandbox. **0 bytes leave your machine.**
> - **High-Throughput Distributed Cloud Worker:** Massive multi-gigabyte queues scale seamlessly through Go goroutines (`pdfcpu` + `govips`).
> - **Zero Bandwidth Penalties:** Integrated with Cloudflare R2's zero-egress S3 API, allowing unlimited 100 MB free conversions without cost traps.

### 🥊 The Architecture Shift at a Glance

| ❌ **The Predatory Incumbents** | 🟢 **Our Open-Source Architecture** |
| :--- | :--- |
| 🚫 **Capped at 15–25 MB**<br>Forces paid subscription traps when submitting documents. | ⚡ **100 MB Free File Limits**<br>4x higher than standard industry ceilings. |
| 📉 **Forced Recompression & Branding**<br>Downsamples to 72 DPI and adds unwanted watermarks. | 💎 **Lossless 150/300 DPI Fidelity**<br>Pixel-perfect clarity, zero watermarks, legal-ready output. |
| 👁️ **Opaque Server Logging**<br>Sensitive personal files uploaded and retained indefinitely. | 🛡️ **Dual-Engine Privacy (WASM First)**<br>Local mode runs 100% in-browser; files never touch a wire. |
| ⏳ **Indefinite Retention**<br>No visibility into when or if files are permanently deleted. | ⏱️ **Strict 24h Purge + Instant Delete**<br>Enforced automated lifecycle deletion rules on Cloudflare R2. |
| 🪤 **Aggressive Ad Banners & Trackers**<br>Cluttered, deceptive UI designed to harvest ad impressions. | 🧼 **Zero Ads & Pure Glassmorphism**<br>Minimalist, focused, distraction-free open-source workspace. |

---

## ✨ Key Features

| Feature | Details | Benefit |
|:---|:---|:---|
| **Dual Engine** | Client-side WASM + Go daemon backend | Full privacy for confidential files; high throughput for heavy jobs |
| **100 MB Limit** | 4x larger than standard competitors | Convert high-res scans and multi-page books without splitting |
| **Zero Watermarks** | No branding added to documents | Fully professional PDFs ready for legal, corporate, or academic use |
| **Lossless DPI** | Preserves 150 & 300 DPI resolutions | Crisp text and sharp photography; no forced artifacting |
| **Layout Controls** | Margins (None, Small, Large), Orientation (Portrait, Landscape), Page Size (A4, Letter, Legal) | Complete styling flexibility before generating documents |
| **Visual Reordering** | Drag-and-drop preview grid | Intuitively sort pages before stitching into a single PDF |
| **Real-Time Progress**| Server-Sent Events (SSE) streaming | Accurate live feedback during heavy multi-image compilations |
| **Zero-Egress Cost** | Cloudflare R2 S3-compatible storage | Sustainable open-source deployment with zero bandwidth penalty |

---

## 🥊 Us vs. Them

| Metric / Capability | Conventional Tools (iLovePDF, Smallpdf) | Our Platform |
|:---|:---|:---|
| **Max File Upload** | 15 MB – 25 MB | **100 MB (Free)** |
| **Watermarks** | Forced on free tier | **Zero (Always Clean)** |
| **Privacy Guarantee** | Server-side upload required | **Client-side WASM Engine Option** |
| **Data Retention** | Indefinite / Opaque retention | **Strict 24h Purge + Instant Purge Action** |
| **Interface** | Ad-heavy & deceptive redirect traps | **Clean Glassmorphic UI, Zero Ads** |
| **Worker Architecture** | Slow single-threaded Node scripts | **Parallel Go Routines (`pdfcpu` + `govips`)** |

---

## 🏗 Architecture Overview

Our platform decouples stateful API orchestration from CPU-bound image processing through an asynchronous, event-driven queue:

```
[ User Browser ]
       │
       ├─── (Privacy Mode) ──> [ Client-Side WASM Engine ] ──> [ Instant PDF Download ]
       │
       └─── (Batch Mode) ───> [ Next.js Frontend ]
                                     │
                                     ├── (Presigned PUT) ──> [ Cloudflare R2 Bucket ]
                                     │
                                     └── (Job Metadata) ───> [ NestJS API Gateway ]
                                                                   │
                                                                   ├── (Save Record) ──> [ Neon PostgreSQL ]
                                                                   │
                                                                   └── (Enqueue Job) ──> [ Redis Streams ]
                                                                                               │
                                                                                               ▼
                                                                                   [ Go Worker Daemon ]
                                                                                   (govips + pdfcpu)
                                                                                               │
                                                                                               ├── (Stream Output) ──> Cloudflare R2
                                                                                               └── (SSE Progress)  ──> Next.js UI
```

---

## 📋 Prerequisites

Before running the project locally, ensure you have the following installed:

- **Node.js:** `v20.x` or later
- **Go:** `v1.21` or later
- **Docker & Docker Compose:** `v24.x` or later (for local DB, Redis, MinIO)
- **Package Manager:** `npm` or `pnpm`

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Setup Environment
```bash
git clone https://github.com/alokprashar864/jpg_to_pdf.git
cd jpg_to_pdf
cp .env.example .env
```

### 2. Start Local Infrastructure
Spin up local PostgreSQL, Redis, and MinIO storage (pre-configured with CORS and automatic bucket provisioning):
```bash
docker-compose up -d
```

### 3. Initialize & Run Backend API
```bash
cd backend-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*API will run on: `http://localhost:3000`*

### 4. Start the Go Conversion Worker
```bash
cd ../worker-service
go run cmd/main.go
```
*Worker connects to Redis Streams and listens for conversion tasks.*

### 5. Launch the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Web client will be available at: `http://localhost:3001` (or Next.js allocated port).*

---

## 📖 Usage Guide

### 1. Web Interface
1. Open your browser to `http://localhost:3001` or [Live Demo](https://jpg-to-pdf-zeta.vercel.app).
2. Choose your mode:
   - **Privacy Mode (WASM):** Best for sensitive IDs, confidential documents, under 50MB. Files never leave your browser.
   - **Cloud Batch Mode:** Best for large collections, batch operations up to 100MB.
3. Drag and drop your JPG/PNG files into the upload zone.
4. Reorder images dynamically by dragging cards.
5. Customize page size (**A4, US Letter, Legal**), orientation (**Portrait, Landscape**), and margins (**None, Small, Large**).
6. Click **"Convert to PDF"** and download your clean, unwatermarked document!

### 2. REST API (For Developers)

Create an automated conversion job via our HTTP endpoints:

#### Create Job & Obtain Presigned URLs
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "pageSize": "A4",
    "orientation": "portrait",
    "margins": "small",
    "imageCount": 2
  }'
```

#### Upload Files Directly to Storage
```bash
curl -X PUT --upload-file page1.jpg "<PRESIGNED_UPLOAD_URL_1>"
curl -X PUT --upload-file page2.jpg "<PRESIGNED_UPLOAD_URL_2>"
```

#### Listen for Progress (SSE)
```bash
curl -N http://localhost:3000/api/jobs/<JOB_ID>/progress
```

---

## ⚙️ Configuration Reference

All application secrets and endpoints can be customized in `.env`:

| Variable | Required | Default / Example | Purpose |
|:---|:---:|:---|:---|
| `DATABASE_URL` | ✅ | `postgresql://postgres:password@localhost:5432/jpg2pdf` | PostgreSQL database connection string |
| `REDIS_URL` | ✅ | `redis://localhost:6379` | Redis broker connection for streaming queues |
| `S3_ENDPOINT` | ✅ | `http://localhost:9000` *(Local)* / `https://<ID>.r2.cloudflarestorage.com` | S3-compatible endpoint (MinIO / Cloudflare R2) |
| `AWS_ACCESS_KEY_ID` | ✅ | `admin` *(Local)* / Cloudflare Token ID | S3 API client access identifier |
| `AWS_SECRET_ACCESS_KEY` | ✅ | `admin123` *(Local)* / Cloudflare Secret | S3 API authentication secret |
| `AWS_REGION` | ❌ | `us-east-1` *(Local)* / `auto` *(R2)* | Storage bucket geographic region |
| `S3_BUCKET_NAME` | ❌ | `conversions` | Storage bucket name for temporary artifacts |
| `API_PORT` | ❌ | `3000` | Port for the NestJS API gateway |

---

## ☁️ Production Deployment (Cloudflare R2)

To deploy at scale with zero bandwidth egress costs:

1. **Create an R2 Bucket:** In the Cloudflare Dashboard, create a bucket named `conversions`.
2. **CORS Policy:** Add the following CORS rule to allow uploads directly from your frontend domain:
   ```json
   [
     {
       "AllowedOrigins": ["https://jpg-to-pdf-zeta.vercel.app", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
3. **Lifecycle Rule:** Enable an Object Lifecycle Rule set to expire and purge objects after 24 hours (1 day).
4. **Deploy Backend & Worker:** Set `S3_ENDPOINT`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` on Render or Railway.

---

## 🧪 Testing & Quality Assurance

Run test suites across each microservice:

```bash
# 1. Test Backend API Unit & Integration Tests
cd backend-api
npm run test

# 2. Test Go Worker Daemon
cd ../worker-service
go test -v ./...

# 3. Test Frontend Next.js Components
cd ../frontend
npm run test
```

---

## ❓ Troubleshooting & FAQ

<details>
<summary><strong>Q: I get a "CORS Policy Blocked" error during cloud uploads</strong></summary>

Ensure your Cloudflare R2 or MinIO bucket has CORS enabled for your domain. For MinIO local development, the provided `docker-compose.yml` automatically applies this. For R2, verify your bucket CORS settings contain your exact origin.
</details>

<details>
<summary><strong>Q: How does Local In-Browser Mode protect my privacy?</strong></summary>

In-browser conversion utilizes WebAssembly and client-side canvas rendering. The raw image binary data is processed entirely within your browser sandbox and never transmitted across the network.
</details>

<details>
<summary><strong>Q: Why does the Go worker use `pdfcpu`?</strong></summary>

`pdfcpu` is a high-performance PDF processing library written natively in Go without external Cgo dependencies, delivering sub-second compilation for high-resolution images.
</details>

---

## 🗺️ Roadmap

- [x] **v1.0 (Current):**
  - [x] Dual-engine architecture (Local WASM + Cloud Go Worker)
  - [x] 100 MB file upload support with zero watermarks
  - [x] Real-time SSE conversion progress streaming
  - [x] Cloudflare R2 zero-egress integration
- [ ] **v1.1 (Upcoming):**
  - [ ] Interactive PDF multi-page canvas preview prior to download
  - [ ] Preset profiles (*Print Ready 300 DPI*, *Email Friendly*, *Archival*)
- [ ] **v1.2 (Planned):**
  - [ ] Client-side OCR text extraction for searchable PDFs (Tesseract WASM)
  - [ ] One-click cloud import from Google Drive, Dropbox, and OneDrive

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for a cleaner, privacy-first web. Star this repo if you find it helpful!</sub>
</div>
