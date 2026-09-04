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
