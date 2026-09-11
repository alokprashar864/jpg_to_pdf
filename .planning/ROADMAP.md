# Engineering Implementation Roadmap

## Milestone 1: Category Killer (v1.0.0) — [COMPLETED]
- [x] Phase 1: Local Subsystem Bootstrap (`docker-compose.yml`, Postgres 16, Redis 7, MinIO)
- [x] Phase 2: Orchestration & Ingestion Engine (NestJS 12, Prisma 5, Redis Streams, SSE)
- [x] Phase 3: High-Performance Go Worker Daemon (Go 1.25, `pdfcpu`, Redis Streams consumer group)
- [x] Phase 4: Frontend Client Core (Next.js 16, React 19, `@hello-pangea/dnd`, Lucide icons)
- [x] Phase 5: Anti-iLovePDF Core (100MB cloud upload, no watermarks, margin & orientation controls)
- [x] Phase 6: Trust Elements (60-min timer, instant purge)
- [x] Phase 7: Client-Side WASM Engine (`pdf-lib` local in-browser compilation)
- [x] Phase 8: Autonomous Multi-Agent & IDE Swarm Directives (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.clinerules`)

---

## Milestone 2: Expanding to PNG: The Transparency Challenge (Current)

### Phase 10: Binary Header Sanitization & Corrupt File Guard
- [ ] Implement fast magic byte scanner (`\x89PNG\r\n\x1a\n` and `\xFF\xD8\xFF`) in frontend before queuing.
- [ ] Add pre-flight validation in `backend-api` to prevent malformed binaries from clogging Redis Streams.
- [ ] Add corrupt file error handling in Go worker daemon to prevent panics and record failed job metrics.

### Phase 11: Color Profile Normalization & Alpha Flattening (Dual-Engine Core)
- [ ] **Client WASM Engine (`frontend/src/lib/localConverter.ts`)**:
  - Implement canvas-based alpha channel compositing for `FLATTEN_WHITE` and `FLATTEN_BLACK`.
  - Retain raw 32-bit RGBA for `KEEP_TRANSPARENT` embedding into `pdf-lib`.
  - Convert indexed palette and grayscale-alpha PNGs into standard sRGB canvas buffers.
- [ ] **Go Worker Engine (`worker-service/internal/`)**:
  - Update Go conversion options struct to accept `transparencyMode` (`flatten_white`, `flatten_black`, `keep_transparent`).
  - Implement Go-native image decoding/compositing for PNG alpha flattening before `pdfcpu` assembly.

### Phase 12: Memory Bounding & Auto-Fallback Routing
- [ ] Refactor client-side canvas rendering from parallel `Promise.all` into sequential, chunked stream execution.
- [ ] Add memory and batch size evaluation logic ($\le 20$ files && $\le 50\text{ MB} \rightarrow$ WASM, else auto-route to Cloud).
- [ ] Implement silent auto-fallback to Cloud when browser canvas allocation encounters low device RAM.

### Phase 13: UI Upgrades & Transparency Controls
- [ ] Expand file dropzone and file input to support `.png`, `.jpg`, `.jpeg`, `.webp`.
- [ ] Add CSS checkerboard backdrop styling to thumbnail preview cards in `ConverterWidget.tsx`.
- [ ] Add a segmented control for Transparency Modes: `Flatten White` (Default), `Flatten Black`, `Keep Transparent`.
- [ ] Build Engine State Indicator Badge: ⚡ *"Processing Locally (Zero-Trust)"* vs. ☁️ *"Cloud Batch Mode"*.
- [ ] Update frontend types and API client DTOs to support transparency settings.

### Phase 14: Monorepo Verification & E2E Test Suite
- [ ] Execute unit tests for PNG alpha flattening with white/black backdrops and transparent overlays.
- [ ] Verify `npx tsc --noEmit` and `npm run lint` across `frontend/` and `backend-api/`.
- [ ] Test end-to-end trace with sample transparent logos and indexed PNGs.
