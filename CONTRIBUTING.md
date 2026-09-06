# Contributing to JPG to PDF Platform

Thank you for your interest in contributing to the **JPG to PDF Platform**! We are building an open-source, privacy-first, high-throughput alternative to ad-cluttered and predatory PDF converters.

---

## 📑 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Local Development Setup](#🛠-local-development-setup)
- [Development Workflow](#📜-development-workflow)
- [Commit Message Guidelines](#conventional-commits)
- [Opening a Pull Request](#opening-a-pull-request)

---

## Code of Conduct
This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior following the guidelines in that file.

---

## How Can I Contribute?
- **Reporting Bugs:** Check the [Issues](https://github.com/alokprashar864/jpg_to_pdf/issues) tab first. If not reported, submit a detailed bug report using our issue template.
- **Suggesting Enhancements:** We actively welcome ideas for performance, UI, and new compression profiles.
- **Code Contributions:** Look for issues tagged with `good first issue` or `help wanted`.

---

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
*This boots PostgreSQL on `5432`, Redis on `6379`, and MinIO S3 storage on `9000` / `9001`.*

### 2. Setup Backend API
```bash
cd backend-api
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
*API runs on `http://localhost:3000`.*

### 3. Setup Go Conversion Worker
```bash
cd ../worker-service
go run cmd/main.go
```
*The worker daemon listens for Redis Streams jobs.*

### 4. Setup Frontend Client
```bash
cd ../frontend
npm install
npm run dev
```
*Access the web app at `http://localhost:3001`.*

---

## 📜 Development Workflow

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/jpg_to_pdf.git
   ```
3. Create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
4. Test your changes locally to ensure no regressions occur.

---

## Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation-only changes
- `refactor:` Code changes that neither fix a bug nor add a feature
- `perf:` Performance improvements
- `test:` Adding or updating tests

*Example:* `git commit -m "feat(worker): add binary search file size target compression"`

---

## Opening a Pull Request

- Keep pull requests focused on a single concern.
- Ensure our automated CI checks pass.
- Fill out the pre-populated [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md).
- Link any related issues using `Closes #123` or `Fixes #123`.
