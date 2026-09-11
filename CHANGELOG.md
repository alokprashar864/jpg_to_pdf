# Changelog

All notable changes to the **KrocPDF** (`Bus-Driver`) project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned / In-Progress (v1.1.0 — Economic Defense & Ecosystem)
- **Automatic Dual-Engine Router**: Dynamic client-side routing defaulting batches $\le 20$ images and $\le 50\text{ MB}$ directly to local WASM.
- **Edge Defense**: Redis-backed rate limiting and automated bot scrubbing on conversion creation endpoints.
- **Target File Size Compression**: Binary-search compression optimization targeting government and portal upload size caps (e.g., `< 200 KB`).
- **Autonomous Agent Swarm Directives**: Monorepo-wide AI agent orchestration guides ([`AGENTS.md`](./AGENTS.md), [`CLAUDE.md`](./CLAUDE.md), [`.cursorrules`](./.cursorrules), and [`.clinerules`](./.clinerules)).

---

## [1.0.0] - 2026-09-06

### Added
- **Dual-Engine Architecture**:
  - **In-Browser WASM Engine**: Complete, private client-side image-to-PDF conversion using `pdf-lib` and HTML5 Canvas API with zero server data transfer.
  - **Distributed Cloud Engine**: Scalable backend processing pipeline using NestJS 12, Redis 7 Streams, and Go 1.25 workers.
- **Frontend Experience (`frontend/`)**:
  - Next.js 16 (App Router with Turbopack) and React 19 architecture.
  - Minimalist glassmorphism UI styled with Tailwind CSS v4.
  - Smooth drag-and-drop canvas thumbnail reordering via `@hello-pangea/dnd`.
  - Comprehensive conversion settings: Page sizes (A4, Letter, Auto), margins (None, Small, Normal, Large), page orientation (Portrait, Landscape), and DPI scaling (150 DPI / 300 DPI).
  - Brand assets in `frontend/public/brand/` for KrocPDF logo variants.
- **API Gateway (`backend-api/`)**:
  - NestJS 12 application with modular architecture (`ConversionsModule`, `RedisModule`, `StorageModule`).
  - Presigned S3 PUT URL generation for direct-to-storage client uploads, eliminating server memory buffering.
  - Real-time Server-Sent Events (SSE) streaming conversion status and progress updates to clients.
  - Prisma 5 ORM integration with PostgreSQL 16 schema migrations.
  - Oxlint linter and Vitest test harness.
- **High-Performance Worker (`worker-service/`)**:
  - High-throughput Go 1.25 background worker service.
  - Native PDF assembly and optimization powered by `pdfcpu`.
  - Redis 7 Stream consumer group processing with automatic task acknowledgment.
  - Direct S3 asset streaming via `aws-sdk-go-v2`.
- **Infrastructure & Containerization**:
  - `docker-compose.yml` orchestrating PostgreSQL 16, Redis 7 (AOF enabled), and MinIO object storage.
  - Automated MinIO initialization container setting public access and a 1-day bucket lifecycle expiration policy.
- **Documentation & Governance**:
  - Master technical specification in `ARCHITECTURE.md`.
  - Open source community guidelines: `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE`.
  - Milestone and strategic roadmap in `MILESTONE.md`.

### Security & Privacy
- Zero file watermarks across both local and cloud modes.
- Ephemeral cloud storage with automated 24-hour file purges and instant user deletion endpoints.
- Strict input validation via NestJS `class-validator` DTOs and MIME-type restrictions.
