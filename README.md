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

### 3. Worker Service (Coming Soon)
*(The Go worker daemon is currently being developed under Phase 3).*

### 4. Frontend (Coming Soon)
*(The Next.js client is currently being developed under Phase 4).*

## 📄 Documentation

All critical project documentation and requirements are stored natively in the repository under `.planning/`.
