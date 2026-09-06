# 🛡️ Security Policy & Responsible Disclosure

> **Commitment:** The security of our users' files, confidential scans, and personal data is our highest priority. Because this platform processes personal documents, contracts, and identification records, we maintain rigorous security standards across client-side sandbox execution, cloud worker queues, and ephemeral object storage.

---

## 📑 Table of Contents
- [Supported Versions](#supported-versions)
- [Security Architecture & Threat Model](#security-architecture--threat-model)
  - [1. In-Browser WASM Isolation (Zero-Knowledge)](#1-in-browser-wasm-isolation-zero-knowledge)
  - [2. Ephemeral Storage & Retention Policy](#2-ephemeral-storage--retention-policy)
  - [3. Presigned Storage URL Scoping](#3-presigned-storage-url-scoping)
  - [4. Denial of Service & Decompression Bomb Defenses](#4-denial-of-service--decompression-bomb-defenses)
- [Reporting a Security Vulnerability](#reporting-a-security-vulnerability)
- [Response Timelines & SLAs](#response-timelines--slas)
- [Security Bounty & Contributor Recognition](#security-bounty--contributor-recognition)
- [Out-of-Scope Vulnerabilities](#out-of-scope-vulnerabilities)

---

## Supported Versions

We provide active security patches, dependency vulnerability scans, and hotfixes for the following release branches:

| Major / Minor Version | Release Status | Security Maintenance |
|:---|:---:|:---:|
| **`1.x.x` (Current Production)** | 🟢 Active | **Full Support** (High/Critical within 48h) |
| **`0.x.x` (Alpha / Pre-release)** | 🔴 Deprecated | **End of Life** (Upgrade to 1.x immediately) |

---

## Security Architecture & Threat Model

Our codebase implements defense-in-depth across the full lifecycle of an image conversion:

### 1. In-Browser WASM Isolation (Zero-Knowledge)
When users operate in **Local Privacy Mode**, image files are read, transcoded, and assembled into a PDF using client-side WebAssembly (`pdf-lib` / HTML Canvas). No binary payloads or metadata traverse the network. All buffers are held temporarily in browser memory and garbage-collected upon tab teardown.

### 2. Ephemeral Storage & Retention Policy
For heavy cloud batch conversions:
- **Zero Indefinite Retention:** Files uploaded to our Cloudflare R2 bucket are governed by strict Object Lifecycle Management (ILM) rules set to permanently expire and purge within **24 hours**.
- **Instant Manual Purge:** The API exposes an explicit `DELETE /api/jobs/:id` trigger enabling users to purge source images and output PDFs immediately upon download.
- **Serverless Isolation:** Worker processes do not retain persistent local file buffers after a conversion job resolves.

### 3. Presigned Storage URL Scoping
Direct client-to-storage transfers bypass the API layer to eliminate man-in-the-middle risks:
- Presigned `PUT` upload URLs are issued with a maximum **15-minute Time-To-Live (TTL)**.
- Each presigned URL strictly enforces `Content-Length` caps (maximum 100 MB per object) and explicit MIME type boundaries (`image/jpeg`, `image/png`).
- Presigned `GET` download URLs are single-job scoped and expire automatically.

### 4. Denial of Service & Decompression Bomb Defenses
To prevent "zip bombs" and maliciously crafted image headers (pixel bombs designed to trigger server Out-Of-Memory panics):
- Pre-allocation checks validate dimension headers before decompression.
- Goroutines in the Go worker execute within isolated memory budgets with hard execution timeouts (maximum 120 seconds per conversion pipeline).
- Upstash Redis enforces IP-based sliding-window rate limiters to prevent bot abuse.

---

## Reporting a Security Vulnerability

We request that researchers adhere to **Responsible Disclosure** guidelines. **Under no circumstances should security vulnerabilities be reported via public GitHub issues, discussions, or social media.**

### How to Submit a Vulnerability
1. **GitHub Private Security Advisory (Recommended):**  
   Submit a private report via **[GitHub Security Advisories](https://github.com/alokprashar864/jpg_to_pdf/security/advisories/new)**. This creates a confidential, encrypted workspace for discussion between you and our core maintainers.
2. **Alternative Contact:**  
   If you cannot access GitHub Advisories, contact the lead maintainer directly via email at `security@alokprashar.com` (or the email linked to this repository profile) with the subject line:  
   `[SECURITY VULNERABILITY] - <Component Affected>`.

### Required Details in Your Report
To help us triage and verify your finding rapidly, please include:
- **Summary:** A clear description of the potential vulnerability and its real-world exploit scenario.
- **Affected Component:** (e.g., `frontend/`, `backend-api/`, `worker-service/`, Cloudflare R2 CORS/Bucket policies, Upstash Redis queue).
- **Proof of Concept (PoC):** Step-by-step instructions, sample image payloads, or script/curl commands to reproduce the issue.
- **Impact Assessment:** Explanation of what an attacker could achieve (e.g., unauthorized document access, remote code execution, DoS via memory starvation).
- **Mitigation Suggestions:** Any potential code patches, configuration tweaks, or architectural fixes you recommend.

---

## Response Timelines & SLAs

We treat security findings with extreme urgency:

| Phase | Target SLA | Actions Taken |
|:---|:---:|:---|
| **Initial Acknowledgment** | **< 24 Hours** | A maintainer reviews your submission and confirms receipt. |
| **Triage & Validation** | **< 48 Hours** | The vulnerability is verified in a staging environment. Severity is categorized via CVSS v3.1. |
| **Patch Development** | **< 5 Business Days** | A patch is drafted, tested in a private branch, and validated against regressions. |
| **Public Disclosure** | **Coordinated** | Patch is deployed to production. A CVE is requested if applicable, and a security advisory is released with credit. |

---

## Security Bounty & Contributor Recognition

While we are an independent open-source project and currently do not operate a funded cash bounty program, we are deeply grateful to security researchers who help protect our users:

- **Public Hall of Fame:** With your permission, your name/handle and research will be prominently featured in our `RELEASE_NOTES.md` and repository Hall of Fame.
- **Coordinated Disclosure:** We work collaboratively with researchers on mutually agreed timelines before any public disclosure.

---

## Out-of-Scope Vulnerabilities

The following are generally treated as low-priority or out-of-scope unless they lead to direct privilege escalation or data compromise:

- Vulnerabilities in third-party hosted services (Cloudflare, Neon, Upstash, Vercel, Render) outside our repository configuration.
- Missing HTTP security headers on public marketing pages that do not handle user sessions or sensitive state.
- Theoretical self-XSS without a demonstrable social-engineering or multi-user attack path.
- Reports from automated scanners without manual verification or a working Proof-of-Concept.

---

<div align="center">
  <sub>Thank you for keeping our users safe and maintaining the highest standard of open-source security!</sub>
</div>
