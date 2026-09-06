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

## 🧭 System Map & Navigation

```mermaid
graph TD
    classDef core fill:#7928CA,stroke:#FFF,stroke-width:2px,color:#FFF,font-weight:bold;
    classDef prod fill:#0070F3,stroke:#FFF,stroke-width:1px,color:#FFF;
    classDef dev fill:#10B981,stroke:#FFF,stroke-width:1px,color:#FFF;
    classDef infra fill:#F5A623,stroke:#FFF,stroke-width:1px,color:#FFF;
    classDef comm fill:#EC4899,stroke:#FFF,stroke-width:1px,color:#FFF;

    Core(("⚡ JPG to PDF<br/>Platform")):::core

    subgraph Product ["🎯 Product & Moat"]
        direction TB
        P1["💡 Why This Exists"]:::prod
        P2["✨ Key Features"]:::prod
        P3["🥊 Us vs. Them"]:::prod
    end

    subgraph Developer ["🚀 Developer Hub"]
        direction TB
        D1["📋 Prerequisites"]:::dev
        D2["⚡ Quick Start (Local)"]:::dev
        D3["📖 Web & API Usage"]:::dev
    end

    subgraph Infrastructure ["☁️ Cloud & Architecture"]
        direction TB
        I1["🏗 Architecture Overview"]:::infra
        I2["⚙️ Configuration (.env)"]:::infra
        I3["🪣 Cloudflare R2 ($0 Egress)"]:::infra
    end

    subgraph Community ["🤝 Quality & Governance"]
        direction TB
        C1["🧪 Testing & QA"]:::comm
        C2["🗺️ Strategic Roadmap"]:::comm
        C3["❓ FAQ & Troubleshooting"]:::comm
    end

    Core <---> Product
    Core <---> Developer
    Core <---> Infrastructure
    Core <---> Community

    click P1 href "#-why-this-exists" "Go to Why This Exists"
    click P2 href "#-key-features" "Go to Key Features"
    click P3 href "#-us-vs-them" "Go to Us vs. Them"
    click D1 href "#-prerequisites" "Go to Prerequisites"
    click D2 href "#-quick-start-local-development" "Go to Quick Start"
    click D3 href "#-usage-guide" "Go to Usage Guide"
    click I1 href "#-architecture-overview" "Go to Architecture"
    click I2 href "#️-configuration-reference" "Go to Configuration"
    click I3 href "#️-production-deployment-cloudflare-r2" "Go to Cloudflare R2"
    click C1 href "#-testing--quality-assurance" "Go to Testing"
    click C2 href "#️-roadmap" "Go to Roadmap"
    click C3 href "#-troubleshooting--faq" "Go to FAQ"
```

<p align="center">
  <a href="#-why-this-exists"><b>💡 Why This Exists</b></a> •
  <a href="#-key-features"><b>✨ Features</b></a> •
  <a href="#-architecture-overview"><b>🏗 Architecture</b></a> •
  <a href="#-quick-start-local-development"><b>🚀 Quick Start</b></a> •
  <a href="#-usage-guide"><b>📖 API</b></a> •
  <a href="#️-production-deployment-cloudflare-r2"><b>☁️ Cloudflare R2</b></a> •
  <a href="#️-roadmap"><b>🗺️ Roadmap</b></a> •
  <a href="#-contributing"><b>🤝 Contributing</b></a> •
  <a href="#-license"><b>📄 License</b></a>
</p>

---

## 💡 Why This Exists

Most conventional "free" PDF conversion websites are predatory or user-hostile:
- ❌ **Aggressive Paywalls:** 15–25 MB arbitrary file size caps that force you into recurring monthly subscriptions.
- ❌ **Degraded Output:** Forced heavy re-compression, downsampling to 72 DPI, or branding your documents with intrusive watermarks.
- ❌ **Hostile UI:** Deceptive download buttons, banner pop-ups, and trackers.
- ❌ **Data Privacy Vulnerabilities:** Your sensitive legal docs, ID scans, or invoices are uploaded and stored indefinitely on third-party servers.

### 🌟 Our Solution
- ✅ **100 MB Free File Limits** — 4x larger than industry incumbents without paying a penny.
- ✅ **Zero Watermarks & Lossless Quality** — Export clean PDFs preserving original 150/300 DPI resolutions.
- ✅ **Dual-Engine Privacy Architecture** — Switch to **Local In-Browser Mode (WASM)** where files never touch a server, or use **Cloud Worker Mode** for massive multi-gigabyte queues.
- ✅ **Automated Ephemeral Storage** — Any file uploaded to the cloud worker automatically self-destructs via strict 24-hour lifecycle rules with an instant manual "Delete Now" button.

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
