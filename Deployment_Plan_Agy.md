# Deployment Plan — Cloudflare R2 + Production

## 🛠 Manual Steps: Cloudflare R2 + Production Deployment

### Part 1 — Cloudflare R2 Setup

**Step 1: Create an R2 Bucket**
1. Log into [dash.cloudflare.com](https://dash.cloudflare.com) → go to **R2 Object Storage**
2. Click **Create bucket**, name it exactly **`conversions`**
3. Region: leave as **Automatic**

**Step 2: Configure CORS on the Bucket**
1. Open the bucket → **Settings** → **CORS Policy**
2. Add this JSON:
```json
[
  {
    "AllowedOrigins": ["https://your-production-domain.com"],
    "AllowedMethods": ["GET", "PUT", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

**Step 3: Set a Lifecycle Rule (Auto-delete after 1 day)**
1. In the bucket → **Settings** → **Object Lifecycle Rules**
2. Click **Add rule** → Expiration after **1 day**
3. Apply to all objects (prefix: empty)

**Step 4: Generate API Credentials**
1. Go back to **R2 overview page** → click **Manage R2 API Tokens**
2. Click **Create API token**
3. Set **Permissions** → `Object Read & Write`
4. Scope: restrict to bucket `conversions` for safety
5. **Copy and save** (you only see these once):
   - Access Key ID
   - Secret Access Key
   - Your account S3 endpoint: `https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com`

---

### Part 2 — Deploy Infrastructure (Postgres + Redis)

Since R2 replaces MinIO, you still need managed Postgres and Redis. Two easiest options:

| Service | Provider |
|---------|----------|
| PostgreSQL | [Neon.tech](https://neon.tech) (free tier) or [Railway](https://railway.app) |
| Redis | [Upstash](https://upstash.com) (free tier) or Railway |

Create accounts on either and grab the connection strings.

---

### Part 3 — Deploy the Backend API (NestJS)

**Recommended platform: [Railway](https://railway.app) or any VPS with Docker**

Set these **environment variables** on your host:
```env
DATABASE_URL=postgresql://<USER>:<PASS>@<HOST>:5432/jpg2pdf
REDIS_URL=redis://<USER>:<PASS>@<HOST>:6379

S3_ENDPOINT=https://<YOUR_CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<R2_SECRET_KEY>
AWS_REGION=auto
S3_BUCKET_NAME=conversions

API_PORT=3000
```

Then run database migrations on first deploy:
```bash
npx prisma db push
```

---

### Part 4 — Deploy the Worker Service (Go)

The Go worker needs the same S3 and Redis variables. Deploy it as a **separate service** alongside the API (Railway, Fly.io, or a VPS):
```env
REDIS_URL=redis://<USER>:<PASS>@<HOST>:6379
S3_ENDPOINT=https://<YOUR_CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
AWS_ACCESS_KEY_ID=<R2_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<R2_SECRET_KEY>
AWS_REGION=auto
S3_BUCKET_NAME=conversions
```

Build and run:
```bash
cd worker-service
docker build -t worker-service .
docker run --env-file .env worker-service
```

---

### Part 5 — Deploy the Frontend (Next.js)

**Recommended platform: [Vercel](https://vercel.com)** (built for Next.js)

1. Push your repo to GitHub
2. Import project on Vercel
3. Set this environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```
4. Deploy

---

### Part 6 — Point Your Domain (Optional)

- On Cloudflare, create a **CNAME** record pointing `api.yourdomain.com` to your backend host
- Point `yourdomain.com` to Vercel's nameservers

---

### Quick Checklist

- [ ] R2 bucket `conversions` created with CORS + lifecycle rule
- [ ] R2 API token generated — keys saved
- [ ] Managed Postgres provisioned — `DATABASE_URL` ready
- [ ] Managed Redis provisioned — `REDIS_URL` ready
- [ ] Backend API deployed with all env vars set
- [ ] `npx prisma db push` run on first deploy
- [ ] Worker Service deployed with same S3 + Redis env vars
- [ ] Frontend deployed on Vercel with `NEXT_PUBLIC_API_URL` set
