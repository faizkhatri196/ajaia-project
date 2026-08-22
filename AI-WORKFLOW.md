# AI-WORKFLOW.md — AI-Assisted Development Log

This document transparently records how AI capabilities were utilized during the design, implementation, testing, and verification of **Ajaia Docs**.

---

## 🤖 AI Tools Utilized

- **Primary Assistant**: Antigravity AI Agent powered by Google Gemini.
- **Workflow Pattern**: Iterative Pair Programming (Plan $\rightarrow$ Backend $\rightarrow$ Frontend $\rightarrow$ Test $\rightarrow$ Document).

---

## ⚡ What AI Accelerated

1. **Boilerplate & Architecture Scaffolding**: Rapidly created standardized project directory structure (`frontend/` and `backend/`).
2. **Schema & Middleware Generation**: Drafted Mongoose models (`User`, `Document`, `Share`) with proper indexing and compound unique constraints.
3. **TipTap Integration**: Accelerated creation of the custom compact toolbar (`TipTapEditor.jsx`) mapping Lucide icons to TipTap formatting commands.
4. **Tailwind SaaS Aesthetics**: Designed consistent dark slate color palette, subtle borders, responsive sidebar, and modal UI components.
5. **Integration Test Suite**: Generated Vitest & Supertest API tests for multi-user authorization flows (`sharing.test.js`).

---

## 💡 Code & Design Ideas Originating from AI

- **MongoMemoryServer Fallback**: Recommended introducing an automatic `mongodb-memory-server` fallback in `db.js`. If no `MONGODB_URI` environment variable is defined, the app seamlessly boots an in-memory database so reviewers can run `npm test` or `npm start` out-of-the-box.
- **One-Click Demo Account Chips**: Suggested adding interactive demo account chips (`Alex`, `Sarah`, `John`) directly on the login screen to allow single-click login switching during testing.

---

## ✏️ Refinements & Modifications to AI Proposals

- **Multer File Size Limits**: Restricted upload file size to 5MB and enforced strict `.txt` / `.md` extension filtering.
- **TipTap Content Syncing**: Refined `useEffect` content synchronization to avoid re-rendering loops when typing rapidly.
- **403 Forbidden Error Card**: Replaced plain alert dialogs with a dedicated full-page access denial card featuring a clear "Back to Dashboard" call to action.

---

## ❌ Rejected AI Proposals

- **Real-Time WebSocket Engine**: Rejected initial AI suggestion to incorporate socket.io / Yjs real-time collaborative cursors. Within a 4–6 hour scope, introducing WebSocket state sync introduces edge-case failure modes. Simple, solid HTTP debounced autosave was chosen to guarantee 100% persistence reliability.

---

## 🧪 Verification & Testing Methodology

- **Automated Verification**: Ran `npm test` inside `backend/` using Vitest + Supertest, achieving 100% pass rate across 6 test suites:
  - Owner document creation (`201 Created`).
  - Document sharing with target user (`200 OK`).
  - Shared user document reading and editing (`200 OK`).
  - Unauthorized user access restriction (`403 Forbidden`).
  - Unsupported file type rejection (`400 Bad Request`).
  - `.txt` / `.md` file import conversion (`201 Created`).
- **Manual End-to-End Validation**:
  - Logged in as Alex $\rightarrow$ Created document $\rightarrow$ Renamed title $\rightarrow$ Saved $\rightarrow$ Refreshed $\rightarrow$ Verified title and content persisted.
  - Shared document with Sarah $\rightarrow$ Logged out $\rightarrow$ Logged in as Sarah $\rightarrow$ Located document under "Shared with me" $\rightarrow$ Made edits $\rightarrow$ Re-opened as Alex $\rightarrow$ Verified edits persisted.
  - Logged in as John $\rightarrow$ Attempted manual URL access to Alex's document ID $\rightarrow$ Verified `403 Forbidden` error screen appeared.
- **Build Verification**: Verified Vite frontend production build (`npm run build`).
