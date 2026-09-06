# 🚀 Open-Source Transformation Blueprint

> **Mission:** Transform this platform from a private repository into a flourishing, production-grade, community-driven open-source project. This guide outlines the legal setup, repo governance, issue/PR management, automated CI/CD guardrails, developer experience, and go-to-market distribution strategy.

---

## 📑 Table of Contents
- [Phase 1: Legal Framework & Community Governance](#phase-1-legal-framework--community-governance)
  - [Repository Tree Architecture](#repository-tree-architecture)
  - [License Selection Matrix](#license-selection-matrix)
  - [Governance Documents](#governance-documents)
- [Phase 2: Templates & Workflows for Contributors](#phase-2-templates--workflows-for-contributors)
  - [1. CONTRIBUTING.md Specification](#1-contributingmd-specification)
  - [2. Pull Request Template (`.github/PULL_REQUEST_TEMPLATE.md`)](#2-pull-request-template-githubpull_request_templatemd)
  - [3. Interactive Issue Forms (`.github/ISSUE_TEMPLATE/`)](#3-interactive-issue-forms-githubissue_template)
- [Phase 3: Community Agile & Task Management](#phase-3-community-agile--task-management)
  - [GitHub Project Board (Kanban Workflow)](#github-project-board-kanban-workflow)
  - [Milestone Architecture](#milestone-architecture)
  - [Standardized Label Taxonomy](#standardized-label-taxonomy)
- [Phase 4: Tooling, Automation & CI/CD Guardrails](#phase-4-tooling-automation--cicd-guardrails)
  - [Continuous Integration Pipeline](#continuous-integration-pipeline)
  - [Automated Dependency & Quality Tooling](#automated-dependency--quality-tooling)
  - [Production Observability & Monitoring](#production-observability--monitoring)
- [Phase 5: Go-to-Market (GTM) & Distribution Strategy](#phase-5-go-to-market-gtm--distribution-strategy)
  - [Reddit Strategy (The Builder/Engineer Narrative)](#reddit-strategy-the-builderengineer-narrative)
  - [Product Hunt Launch Playbook](#product-hunt-launch-playbook)
  - [Hacker News Show HN Blueprint](#hacker-news-show-hn-blueprint)

---

## Phase 1: Legal Framework & Community Governance

Transforming into an open-source project shifts our priority from *"code that just runs on our machines"* to *"a codebase that anyone in the world can understand, test, run locally in 5 minutes, and contribute to without breaking master."*

### Repository Tree Architecture

To establish industry-standard repo hygiene, the repository must conform to the following hierarchy:

```
/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml          # Interactive Bug Report Form
│   │   └── feature_request.yml     # Interactive Feature Request Form
│   ├── workflows/
│   │   ├── ci-backend.yml          # NestJS lint, test, prisma validate
│   │   ├── ci-worker.yml           # Go fmt, test, govips compile
│   │   └── ci-frontend.yml         # Next.js build, lint, typecheck
│   ├── PULL_REQUEST_TEMPLATE.md    # Universal PR checklist
│   └── dependabot.yml              # Automated security dependency updates
├── LICENSE                         # Permissive or Copyleft license file
├── README.md                       # Public storefront, badges, quick start
├── CONTRIBUTING.md                  # Comprehensive local onboarding & guidelines
├── CODE_OF_CONDUCT.md               # Contributor Covenant standard v2.1
├── SECURITY.md                      # Vulnerability reporting & disclosure
├── MILESTONE.md                     # Roadmap and milestone tracking
└── OPEN_SOURCE.md                   # This master blueprint
```

### License Selection Matrix

| License | Best Used For | Commercial Impact | Recommendation |
|:---|:---|:---|:---|
| **MIT** | Maximum adoption, package ecosystem, minimal friction | Anyone can fork, modify, rebrand, and run a closed-source commercial competitor without sharing changes. | ✅ **Recommended for client libraries (`@jpgtopdf/core`)** |
| **Apache 2.0** | Permissive with patent and trademark indemnity | Similar to MIT, but provides clear protection against patent infringement by contributors. | Excellent middle ground |
| **AGPL-3.0** | Safeguarding self-hostable SaaS platforms | If an enterprise or competitor hosts our code as a cloud service over the network, **they must open-source their modified backend.** | 🛡️ **Recommended for the core Web Platform & Go Worker** |

### Governance Documents

1. **`CODE_OF_CONDUCT.md`**: Adopts the [Contributor Covenant v2.1](https://www.contributor-covenant.org/), establishing clear guidelines for inclusive, constructive interaction.
2. **`SECURITY.md`**: Outlines private vulnerability disclosures (e.g., security email or GitHub Security Advisories) to prevent zero-day vulnerabilities from being opened as public issues.

---

## Phase 2: Templates & Workflows for Contributors

### 1. CONTRIBUTING.md Specification

A great `CONTRIBUTING.md` minimizes repetitive questions and ensures PRs pass automated checks on the first run.

```markdown
# Contributing to the Platform

Thank you for helping build an open-source, privacy-first PDF utility!

## 🛠 Local Development Setup

### Prerequisites
- **Docker & Docker Compose** (v24.x+)
- **Node.js** (v20.x+) & npm
- **Go** (v1.21+)

### 1. Boot Local Infrastructure
```bash
cp .env.example .env
docker compose up -d
```
*Spins up PostgreSQL on 5432, Redis on 6379, and MinIO S3 on 9000/9001.*

### 2. Setup Backend API
```bash
cd backend-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

### 3. Setup Go Worker
```bash
cd ../worker-service
go run cmd/main.go
```

### 4. Setup Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```

## 📜 Development Workflow
1. Fork the repo and create your feature branch: `git checkout -b feat/your-feature-name`.
2. Follow conventional commit syntax: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
3. Verify all tests pass locally before pushing.
4. Keep PRs atomic — focus on a single feature or bugfix per PR.
```

---

### 2. Pull Request Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## 📌 Description
<!-- Brief summary of what this pull request introduces or resolves -->

## 🔗 Related Issue
<!-- Closes #(issue_number) -->

## 🧪 Areas Affected
- [ ] Frontend (Next.js / Tailwind CSS)
- [ ] Backend API (NestJS / Prisma)
- [ ] Conversion Worker (Go / pdfcpu / govips)
- [ ] Infrastructure (Docker / Redis / MinIO / R2)
- [ ] Documentation / CI

## 📋 Pre-Merge Checklist
- [ ] My code adheres to the project's formatting and style rules.
- [ ] I have verified this change locally with `docker compose up`.
- [ ] All unit, integration, and typecheck tests pass.
- [ ] I have documented new environment variables or architectural changes.
- [ ] (If UI change) I have included before/after screenshots or GIFs.
```

---

### 3. Interactive Issue Forms (`.github/ISSUE_TEMPLATE/`)

GitHub YAML forms force contributors to provide necessary reproduction details upfront, eliminating vague tickets.

#### `.github/ISSUE_TEMPLATE/bug_report.yml`
```yaml
name: 🐛 Bug Report
description: Report an unexpected bug, rendering error, or failure
title: "[BUG]: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to report this issue!
  - type: textarea
    id: description
    attributes:
      label: Bug Description
      description: A clear, concise description of what went wrong.
    validations:
      required: true
  - type: dropdown
    id: component
    attributes:
      label: Affected Component
      options:
        - "Frontend (Next.js / UI)"
        - "Backend API (NestJS)"
        - "Worker Daemon (Go / pdfcpu)"
        - "Storage (MinIO / Cloudflare R2)"
        - "Local Docker Infrastructure"
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: |
        1. Go to '...'
        2. Upload 'X' files of size 'Y'
        3. Click 'Convert'
        4. See error
    validations:
      required: true
  - type: textarea
    id: environment
    attributes:
      label: Environment & Browser
      description: Operating System, Node version, Browser version, etc.
```

---

## Phase 3: Community Agile & Task Management

To maintain momentum with internal collaborators and external open-source contributors, project work must be orchestrated in public via GitHub Projects.

### GitHub Project Board (Kanban Workflow)

Link a GitHub Project to the repository with the following five-column flow:

```
[ 📋 Triage / Backlog ] ──> [ 🎯 Ready for Dev ] ──> [ 🚧 In Progress ] ──> [ 👀 Review / QA ] ──> [ 🚀 Done ]
```

1. **📋 Triage / Backlog:** Newly filed community issues needing maintainer validation.
2. **🎯 Ready for Dev:** Groomed tasks with complete specifications, technical hints, and estimations.
3. **🚧 In Progress:** Actively assigned to a team member or community contributor.
4. **👀 Review / QA:** PR is open, CI has turned green, awaiting peer code review.
5. **🚀 Done:** Merged into `main` and verified in staging or production.

### Milestone Architecture

- **`v0.1.0` - Alpha Engine (Completed):** Local Docker orchestration, NestJS presigned URLs, Go worker processing via Redis Streams.
- **`v0.2.0` - Security & Guardrails:** File header magic byte validation, decompression bomb safeguards, basic CI setup.
- **`v0.3.0` - Client-Side Privacy Mode:** In-browser WebAssembly conversion (`pdf-lib`) for files $<50\text{ MB}$.
- **`v1.0.0` - Public Production Ready:** Cloudflare R2 zero-egress migration, Vercel deployment, public release notes.
- **`v1.1.0` - Economic Moat & Rate Limiting:** Sliding-window Redis rate-limiters and bot mitigations.

### Standardized Label Taxonomy

| Label | Color | Purpose |
|:---|:---:|:---|
| `good first issue` | `#7057ff` | Beginner-friendly tasks (e.g., CSS polish, doc typo, helper utility). |
| `help wanted` | `#008672` | Complex challenges welcoming domain expert input (e.g., libvips SIMD optimization). |
| `area/frontend` | `#1d76db` | Next.js, React components, Tailwind styling, WASM canvas. |
| `area/backend` | `#e11d48` | NestJS, Prisma, PostgreSQL schema, SSE streaming. |
| `area/worker` | `#00add8` | Go routines, `pdfcpu`, `govips`, memory buffers. |
| `security` | `#b60205` | High-priority vulnerability reports or security hardening. |

---

## Phase 4: Tooling, Automation & CI/CD Guardrails

Automated guardrails protect the codebase from regressions and relieve maintainers from manual code-checking fatigue.

### Continuous Integration Pipeline

```
                  [ Contributor pushes PR ]
                              │
                              ▼
               [ GitHub Actions CI Pipeline ]
               ├── 1. Lint & Format Check (Prettier, ESLint, golangci-lint)
               ├── 2. Prisma Schema Validation (npx prisma validate)
               ├── 3. Go Compile & Unit Tests (go test -v ./...)
               └── 4. Docker Build Dry-Run (Verifies Dockerfile integrity)
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
               [ 🟢 Passes ]       [ 🔴 Fails ]
                    │                   │
         [ Ready for Peer Review ]   [ Block Merge ]
```

### Automated Dependency & Quality Tooling

1. **Dependabot (`.github/dependabot.yml`):**
   - Automatically monitors `package.json` and `go.mod`.
   - Opens weekly pull requests for out-of-date or vulnerable dependencies.
2. **Pre-commit Hooks (`husky` + `lint-staged`):**
   - Automatically formats staged files (`prettier --write`, `gofmt -w`) before commit submission.
3. **Go Linter (`golangci-lint`):**
   - Runs dead code, race condition (`-race`), and errcheck checks on worker PRs.

### Production Observability & Monitoring

- **Crash Reporting:** Integrate **Sentry** (Free Developer Tier) for real-time frontend exceptions and Go worker panics with complete stack traces.
- **Uptime Monitoring:** Configure **Better Stack** or **Uptime Kuma** to ping `/api/health` every 60 seconds with instant Discord/Slack webhooks on downtime.

---

## Phase 5: Go-to-Market (GTM) & Distribution Strategy

Open-source launches thrive when positioned as technical solutions built by passionate developers—not corporate advertisements.

### Reddit Strategy (The Builder/Engineer Narrative)

Target high-intent, technical subreddits with authentic engineering narratives:

#### 1. **`r/selfhosted`**
- **Angle:** *Self-Hosting & Docker Simplicity*
- **Post Title:** *"I got sick of ad-infested PDF converters with 25MB limits, so I built a lightweight, self-hostable JPG to PDF suite with Docker Compose, NestJS, and Go."*
- **Content:** Detail how simple it is to run `docker compose up`, mention the zero-tracking guarantee, and outline how MinIO handles local storage.

#### 2. **`r/opensource` & `r/privacy`**
- **Angle:** *Zero-Data Retention & Client-Side Privacy*
- **Post Title:** *"Why most 'free' PDF converters are privacy nightmares — and how we built a zero-upload client-side conversion engine."*
- **Content:** Share the network tab breakdown comparing competitors (uploading files to opaque servers) vs our in-browser WASM compilation.

#### 3. **`r/webdev` & `r/golang`**
- **Angle:** *Architecture & Performance*
- **Post Title:** *"How we decoupled Next.js from a Go image worker via Redis Streams to convert high-res photos without running out of memory."*
- **Content:** Deep technical discussion of memory allocation, streaming large buffers, and using `pdfcpu` vs ImageMagick.

---

### Product Hunt Launch Playbook

- **Product Name:** JPG to PDF (Open-Source Edition)
- **Tagline:** *The open-source, privacy-first alternative to ad-cluttered PDF converters.*
- **Thumbnail / Hero Assets:** High-contrast GIFs demonstrating instantaneous drag-and-drop, page reordering, and PDF generation with zero watermarks.
- **Maker's First Comment Template:**
  > *"Hey everyone! 👋 We built this because we were tired of tools like iLovePDF slapping paywalls on basic tasks, limiting free files to 25MB, or putting watermarks on resumes and legal scans.*
  > 
  > *Our platform is 100% open source, privacy-first (with in-browser conversion for confidential docs), and completely free of ads or tracking. You can use our web version or spin it up on your own server in 2 minutes with Docker.*
  > 
  > *We’d love to hear your feedback on our conversion speed and what formats we should support next!"*

---

### Hacker News Show HN Blueprint

- **Title:** `Show HN: An open-source, privacy-first JPG to PDF converter with client-side WASM`
- **Post Body:** Keep it straightforward, factual, and devoid of marketing buzzwords. Share the GitHub repository, explain the dual-engine architecture (WASM for small files, Go worker for batches), link to the live demo, and invite feedback on the architecture decisions.

---

<div align="center">
  <sub>Open source is about people, clear communication, and empowering contributors. Let's build together!</sub>
</div>
