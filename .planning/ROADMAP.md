# Engineering Implementation Roadmap

### Phase 1: Local Subsystem Bootstrap
- [ ] Configure `docker-compose.yml` with Postgres 16, Redis 7 (Streams enabled), and MinIO.
- [ ] Set up MinIO bucket with a local CORS policy (`PUT`, `GET`, headers: `*`) and 24h lifecycle expiry.
- [ ] Initialize NestJS project with Prisma ORM and generate database migrations.

### Phase 2: Orchestration & Ingestion Engine (NestJS)
- [ ] Implement AWS S3 SDK wrapper targeting MinIO/R2 endpoints.
- [ ] Build `POST /conversions` generating pre-signed PUT URLs with strict content-length and MIME restrictions.
- [ ] Implement `POST /conversions/{id}/start` with `s3.headObject()` validation and Redis Stream `XADD` dispatch.
- [ ] Implement SSE gateway using NestJS `Observable` hooked to Redis Pub/Sub status events.

### Phase 3: High-Performance Go Worker Daemon
- [ ] Implement Go consumer group loop using `go-redis` (`XREADGROUP`, `XACK`).
- [ ] Add 64 KB S3 byte-range header reader for PNG/JPG dimension parsing and bomb rejection.
- [ ] Integrate `govips` for memory-bounded image normalization and `pdfcpu` for multi-page compilation.
- [ ] Implement parent-child execution sandboxing (`setrlimit` / isolation) to survive unexpected decode panics.
- [ ] Build crash recovery daemon using `XAUTOCLAIM` for orphaned tasks.

### Phase 4: Frontend Client (Next.js)
- [ ] Build drag-and-drop upload zone with client-side image re-ordering.
- [ ] Implement chunked direct-to-S3 upload handler with per-file progress tracking.
- [ ] Connect SSE subscriber to handle real-time progress indicators and immediate download triggering.

### Phase 5: Product Core Upgrade (The "Anti-iLovePDF" Strategy)
- [ ] Increase upload limits to 100MB per file in API validation.
- [ ] Add PDF generation parameters to backend API (margins, page size, orientation).
- [ ] Update Go Worker `pdfcpu` integration to apply margins, orientation, and specific page sizes based on payload.

### Phase 6: Advanced UI & Trust Elements
- [ ] Implement advanced drag-and-drop reordering UI in Next.js.
- [ ] Build "Delete Now" API endpoint and frontend button.
- [ ] Add live countdown timer component synced with 1-hour lifecycle rule.

### Phase 7: Client-Side WASM Engine (Privacy Hook)
- [ ] Integrate `pdf-lib` via WebAssembly for purely in-browser JPG to PDF conversion.
- [ ] Build a toggle switch in UI for "Cloud Fast" vs "Local Private" conversion modes.

### Phase 8: Programmatic SEO Architecture
- [ ] Set up Next.js dynamic catch-all routes (`[...slug]`) for SEO tool pages.
- [ ] Create a JSON dictionary of long-tail keywords (e.g., A4, margins, no-watermark) mapping to specific default tool settings.
- [ ] Implement JSON-LD `SoftwareApplication` Schema and FAQ schema for all dynamically generated routes.

### Phase 9: Cloudflare R2 Production Setup
- [ ] Remove all legacy AWS S3 nomenclature from documentation and SDK wrappers; explicitly brand as Cloudflare R2.
- [ ] Write initialization script/guide for creating R2 Bucket, generating R2 API Tokens, and applying CORS settings.
- [ ] Implement R2 24-hour object lifecycle deletion rule via API or provide explicit Cloudflare dashboard instructions.
- [ ] Validate pre-signed URLs (PUT and GET) against the specific Cloudflare R2 endpoint format (`<account_id>.r2.cloudflarestorage.com`).
