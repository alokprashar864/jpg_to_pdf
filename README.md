# JPG to PDF Converter Platform

An enterprise-grade, highly scalable platform for converting JPG images to PDF documents. 

Built with a modern microservices architecture designed to decouple stateful API orchestration from CPU-bound image processing tasks.

## 🏗 Architecture Overview

- **Frontend:** Next.js (React)
- **Backend API:** NestJS (Node.js) + Prisma
- **Conversion Worker:** Go + `govips` + `pdfcpu`
- **Database:** PostgreSQL
- **Message Broker:** Redis Streams
- **Storage:** MinIO / AWS S3 (Cloud-Agnostic)

*For detailed architectural decisions, API contracts, and the job state machine, please refer to the `.planning/` directory.*

## 🚀 Quick Start (Local Development)

### 1. Start Local Infrastructure
The local environment uses Docker Compose to spin up PostgreSQL, Redis, and MinIO. It automatically initializes the `conversions` MinIO bucket with proper CORS and ILM lifecycle rules.

```bash
docker-compose up -d
```

### 2. Setup Backend API
Navigate to the `backend-api` service, copy the `.env.example`, and start the NestJS server.

```bash
cp .env.example .env
cd backend-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### 3. Setup Worker Service
Navigate to the `worker-service` directory, build, and run the Go daemon:
```bash
cd worker-service
go run cmd/main.go
```

### 4. Setup Frontend
Navigate to the `frontend` directory, install dependencies, and start the Next.js server:
```bash
cd frontend
npm install
npm run dev
```

## ☁️ Production Deployment (Cloudflare R2)

To launch this application in production with zero-egress fees, bypass AWS S3 entirely and use **Cloudflare R2**. Our architecture seamlessly supports the S3 API.

### 1. Provision an R2 Bucket
1. Log into your Cloudflare Dashboard and navigate to **R2**.
2. Click **Create bucket**, name it `conversions`, and choose your region (or leave as auto).
3. Under the bucket settings, navigate to **CORS Policy** and allow `PUT` and `GET` requests from your production frontend domain.
4. Under **Object Lifecycle**, set a rule to automatically expire objects after 1 day to save storage costs.

### 2. Generate R2 Credentials
1. Go back to the main R2 dashboard overview.
2. Click **Manage R2 API Tokens** -> **Create API token**.
3. Grant **Object Read & Write** permissions. Specifying the `conversions` bucket restricts access safely.
4. Copy the **Access Key ID**, **Secret Access Key**, and the S3 endpoint URL (which looks like `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`).

### 3. Update Environment Variables
In your production environment (e.g., Vercel, Railway, or VPS), set the following variables for both the **Backend API** and the **Worker Service**:

```env
S3_ENDPOINT="https://<YOUR_CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com"
AWS_ACCESS_KEY_ID="<YOUR_R2_ACCESS_KEY>"
AWS_SECRET_ACCESS_KEY="<YOUR_R2_SECRET_KEY>"
AWS_REGION="auto"
```

The system will now securely generate presigned URLs pointing directly to Cloudflare's edge network, completely eliminating bandwidth costs for file uploads and downloads.

## 📄 Documentation

All critical project documentation and requirements are stored natively in the repository under `.planning/`.
