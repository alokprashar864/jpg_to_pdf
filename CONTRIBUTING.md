# 🤝 Contributing to JPG to PDF Platform

Thank you for your interest in contributing to the **JPG to PDF Platform**! We are building an enterprise-grade, privacy-first, and high-throughput alternative to ad-cluttered and predatory PDF converters. 

Whether you're fixing a typo in documentation, squashing a race condition in the Go worker daemon, optimizing canvas memory in Next.js, or implementing binary search compression, your contributions are welcome and deeply valued.

---

## 📑 Table of Contents
- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Finding an Issue](#finding-an-issue)
  - [Suggesting Features](#suggesting-features)
  - [Reporting Bugs](#reporting-bugs)
- [🛠 Local Development Environment](#-local-development-environment)
  - [Prerequisites](#prerequisites)
  - [1. Booting Local Infrastructure (Docker)](#1-booting-local-infrastructure-docker)
  - [2. Backend API Gateway (NestJS + Prisma)](#2-backend-api-gateway-nestjs--prisma)
  - [3. Conversion Worker Daemon (Go)](#3-conversion-worker-daemon-go)
  - [4. Frontend Web Client (Next.js)](#4-frontend-web-client-nextjs)
- [🧪 Running Tests & Quality Checks](#-running-tests--quality-checks)
- [📜 Git & Contribution Workflow](#-git--contribution-workflow)
  - [Branch Naming Convention](#branch-naming-convention)
  - [Conventional Commit Standards](#conventional-commit-standards)
  - [Pull Request Lifecycle](#pull-request-lifecycle)
- [📐 Code Architecture & Style Guides](#-code-architecture--style-guides)
  - [TypeScript & Frontend (Next.js)](#typescript--frontend-nextjs)
  - [Go Worker Service](#go-worker-service)
  - [Backend API & Database (NestJS + Prisma)](#backend-api--database-nestjs--prisma)
- [❓ Getting Help & Community](#-getting-help--community)

---

## 🤍 Code of Conduct

All contributors, maintainers, and community members are expected to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) (adapted from Contributor Covenant v2.1). Please treat everyone with empathy, respect, and constructive professionalism.

---

## 🧭 How Can I Contribute?

### Finding an Issue
If you are new to the codebase, check out:
- **[`good first issue`](https://github.com/alokprashar864/jpg_to_pdf/labels/good%20first%20issue)**: Beginner-friendly issues (UI tweaks, documentation updates, helper functions).
- **[`help wanted`](https://github.com/alokprashar864/jpg_to_pdf/labels/help%20wanted)**: High-impact features or technical challenges open for community collaboration.

> 💡 **Tip:** Before writing code, please comment on an open issue to express your interest so other contributors don't duplicate your work. If an issue doesn't exist for what you want to build, open an issue first!

### Suggesting Features
Have an idea for a compression preset, UI improvement, or distribution channel? Please open a **Feature Request** using our [Issue Form](https://github.com/alokprashar864/jpg_to_pdf/issues/new?template=feature_request.yml) to discuss technical viability with maintainers.

### Reporting Bugs
If you encounter unexpected errors or conversion failures:
1. Search [existing issues](https://github.com/alokprashar864/jpg_to_pdf/issues) to avoid duplicates.
2. Open a **Bug Report** using our [Bug Report Form](https://github.com/alokprashar864/jpg_to_pdf/issues/new?template=bug_report.yml). Include browser details, steps to reproduce, and console or worker log outputs.

---

## 🛠 Local Development Environment

Our repository is organized as a lightweight, clean monorepo:
- `frontend/`: Next.js 14, React, Tailwind CSS, WebAssembly canvas engine.
- `backend-api/`: NestJS, Prisma ORM, PostgreSQL, Redis Streams orchestrator.
- `worker-service/`: Go daemon utilizing `pdfcpu` and `govips` for parallel compilation.

### Prerequisites
Ensure your local machine has the following installed:
- **Docker & Docker Compose** (v24.x or later)
- **Node.js** (v20.x or later) and `npm`
- **Go** (v1.21 or later)
- **Git**

---

### 1. Booting Local Infrastructure (Docker)
We use Docker Compose to spin up local instances of PostgreSQL, Redis, and MinIO (an S3-compatible local bucket pre-configured with lifecycle rules and CORS policies):

```bash
# 1. Clone repository and copy environment defaults
git clone https://github.com/alokprashar864/jpg_to_pdf.git
cd jpg_to_pdf
cp .env.example .env

# 2. Start PostgreSQL, Redis, and MinIO S3
docker compose up -d
```

Verify that all three containers are healthy:
```bash
docker compose ps
```
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`
- **MinIO S3 API:** `localhost:9000`
- **MinIO Web Console:** `http://localhost:9001` (User: `admin`, Password: `admin123`)

---

### 2. Backend API Gateway (NestJS + Prisma)
The API gateway manages presigned upload URLs, database records, and enqueues jobs to Redis Streams.

```bash
cd backend-api
npm install

# Push database schema to PostgreSQL
npx prisma generate
npx prisma db push

# Start development server with hot-reload
npm run start:dev
```
*The API gateway will be active on `http://localhost:3000`.*

---

### 3. Conversion Worker Daemon (Go)
The Go worker consumes conversion jobs from Redis Streams, streams images from MinIO/R2, and compiles lossless PDFs using native goroutines.

```bash
cd ../worker-service

# Download Go module dependencies
go mod download

# Run the worker daemon
go run cmd/main.go
```
*You will see: `[Worker] Connected to Redis Streams. Listening for conversion jobs...`*

---

### 4. Frontend Web Client (Next.js)
The frontend provides the glassmorphic drag-and-drop UI, margin/orientation controls, real-time SSE progress tracking, and the in-browser WASM engine.

```bash
cd ../frontend
npm install

# Start Next.js development server
npm run dev
```
*Open your browser to `http://localhost:3001` (or your assigned Next.js dev port).*

---

## 🧪 Running Tests & Quality Checks

All contributions must pass automated tests and format checks before being merged. Run the following checks locally:

### Frontend
```bash
cd frontend
npm run lint          # Run ESLint
npm run build         # Test Next.js production build dry-run
npm test              # Run component tests
```

### Backend API
```bash
cd backend-api
npx prisma validate   # Validate database schema
npm run lint          # Run ESLint
npm test              # Run unit & integration tests
```

### Worker Service (Go)
```bash
cd worker-service
gofmt -l .            # Ensure code formatting complies with gofmt
go vet ./...          # Run static code analysis
go test -v ./...      # Run test suite
```

---

## 📜 Git & Contribution Workflow

```
[ Fork Repo ] ──> [ Create Branch ] ──> [ Write Code & Test ] ──> [ Conventional Commit ] ──> [ Open PR ]
```

### Branch Naming Convention
Keep branch names short, descriptive, and prefixed with the issue category:
- `feat/target-file-size-compression`
- `fix/safari-canvas-memory-leak`
- `docs/troubleshooting-cors`
- `refactor/worker-buffer-pool`

### Conventional Commit Standards
We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This allows automated changelog generation for releases:

```
<type>(<scope>): <short description>
```

| Type | Purpose | Example |
|:---|:---|:---|
| `feat` | Adding a new capability or user-facing feature | `feat(ui): add visual image reordering drag handle` |
| `fix` | Resolving a bug or error | `fix(worker): handle corrupt JPEG EXIF orientation` |
| `perf` | Performance improvement or memory optimization | `perf(wasm): reuse canvas context to prevent garbage collection spikes` |
| `docs` | Documentation updates or tutorials | `docs(readme): add troubleshooting steps for local docker setup` |
| `refactor` | Code restructuring without feature or bug changes | `refactor(api): extract presigned URL generator into dedicated service` |
| `test` | Adding or updating unit/integration tests | `test(worker): add test cases for multi-page A4 compilation` |

---

### Pull Request Lifecycle

1. **Rebase on `main`:** Before opening your PR, ensure your branch is up-to-date with upstream:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. **Open PR:** Submit your PR against the `main` branch.
3. **Fill Out the Checklist:** The pre-populated [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md) will appear. Check off all boxes that apply.
4. **Attach Visuals:** For UI/frontend changes, always include a screenshot or animated GIF of the change in action.
5. **CI Automation:** Automated GitHub Actions workflows will run linting, schema validation, and unit tests. If any check fails, click **Details** to review logs and push fixes.
6. **Code Review:** A maintainer will review your code. Address any requested changes promptly. Once approved, your PR will be squash-merged into `main`!

---

## 📐 Code Architecture & Style Guides

### TypeScript & Frontend (Next.js)
- Use standard functional React components with TypeScript interfaces.
- Avoid bulky external dependencies if native browser Canvas or CSS can accomplish the task.
- Keep components responsive and mobile-friendly with Tailwind CSS utilities.

### Go Worker Service
- Standard Go formatting (`gofmt`) is strictly enforced in CI.
- Always handle errors explicitly. Avoid swallowing errors or leaving blank `_` returns.
- Ensure goroutines are bounded with memory contexts and timeouts to prevent runaway goroutine leaks.

### Backend API & Database (NestJS + Prisma)
- Follow NestJS dependency injection and module patterns.
- Never write raw unescaped SQL queries; use Prisma Client methods to maintain safety against SQL injection.
- When modifying database tables, create clean migrations via `npx prisma migrate dev`.

---

## ❓ Getting Help & Community

Stuck or have questions about architecture decisions?
- **GitHub Discussions:** Join our open-source discussion forums to brainstorm ideas.
- **Issue Comments:** Ask questions directly on the issue you are working on.

Thank you for helping make the web cleaner, faster, and privacy-respecting! 🚀
