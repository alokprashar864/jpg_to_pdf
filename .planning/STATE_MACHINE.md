# Job State Machine & Lifecycle Transitions

```text
[INIT]
│
▼
[CREATED] ──(Presigned URLs generated; awaiting client S3 upload)
│
├─► [EXPIRED] (Client failed to complete upload within 15 minutes)
│
▼ (Client calls /start + NestJS executes HeadObject check)
[QUEUED] ──(Task pushed to Redis Stream: conversions:jobs)
│
▼ (Go worker claims via XREADGROUP)
[PROCESSING] ──(Header sniffing -> govips decode -> pdfcpu merge)
│
├─► [FAILED] (Decompression bomb detected / corrupt magic-bytes / OOM)
│
▼ (PDF successfully written to S3)
[COMPLETED] ──(SSE pushes download URL; S3 lifecycle begins 24h countdown)
```

### State Definitions & Failure Semantics
| State | Trigger | Retry Policy | Timeout |
| :--- | :--- | :--- | :--- |
| `CREATED` | `POST /conversions` | None | 15 minutes |
| `QUEUED` | `POST /conversions/{id}/start` | Max 2 redeliveries via `XAUTOCLAIM` | 5 minutes in PEL |
| `PROCESSING`| Go Worker `XREADGROUP` | 0 retries if exit code is OOM (137) | 120 seconds |
| `COMPLETED` | PDF PUT to S3 verified | Terminal state | Auto-delete after 24h |
| `FAILED` | Validation / Decode error | Terminal state | Logged with failure code |
