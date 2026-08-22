# SUBMISSION.md — Ajaia Docs Project Submission

## 📌 Project Summary

- **Project Name**: Ajaia Docs
- **Repository URL**: [https://github.com/faizkhatri196/ajaia-project](https://github.com/faizkhatri196/ajaia-project)
- **Frontend Vercel Deployment**: [https://ajaia-project-five.vercel.app](https://ajaia-project-five.vercel.app)
- **Backend Render API**: [https://ajaia-project.onrender.com](https://ajaia-project.onrender.com)
- **Walkthrough Recording**: [ajaia_auth_upgrade_demo_1787415309736.webp](file:///C:/Users/Infinity/.gemini/antigravity-ide/brain/ed4ef895-b236-4071-b4e6-eb2309233a4c/ajaia_auth_upgrade_demo_1787415309736.webp)

---

## 👥 Demo Accounts

The application includes seeded demo accounts with single-click login chips on the sign-in screen:

| Name | Email | Password | Role / Purpose |
| :--- | :--- | :--- | :--- |
| **Alex** | `alex@ajaia.demo` | `demo123` | Document Owner & Creator |
| **Sarah** | `sarah@ajaia.demo` | `demo123` | Shared Editor |
| **John** | `john@ajaia.demo` | `demo123` | Unauthorized User (Test 403) |

---

## ✅ Core Functionality Breakdown

- [x] **Lightweight Authentication**: JWT-based session tokens with `bcryptjs` password hashing and HttpOnly cookies.
- [x] **Dashboard UI**: Modern SaaS interface separating owned vs shared documents with search filtering.
- [x] **Document Creation**: Instant MongoDB creation with default titles and initial empty content.
- [x] **TipTap Rich Text Editing**: Full support for Bold, Italic, Underline, Heading 1, Heading 2, Paragraph, Bullet list, Numbered list, Undo, and Redo.
- [x] **Editable Titles**: Rename document titles directly in the editor header with immediate persistence.
- [x] **Autosave & Persistence**: Debounced autosave with real-time status badge (`Saved ✓`, `Saving...`, `Save failed`) plus explicit manual Save button.
- [x] **Document Sharing**: Document owners can grant `EDITOR` access to other registered team members.
- [x] **Backend Authorization**: Backend checks access rights on every document route, enforcing `403 Forbidden` for unauthorized requests.
- [x] **File Import (.txt / .md)**: Import plain text or Markdown files (up to 5MB) into editable documents.
- [x] **Automated Integration Testing**: 7 passing tests in Vitest + Supertest covering creation, sharing, 403 access control, and logout.
- [x] **Browser E2E Session Verified**: Full end-to-end multi-user journey verified and recorded in browser session.
- [x] **Responsive SaaS Design**: Accessible typography, dark mode theme, subtle borders, and smooth hover/focus states.

---

## ⚠️ Known Limitations (Scope Decisions)

1. **No Real-Time Collaboration**: Updates persist via HTTP debounced autosave. Real-time cursor syncing was intentionally excluded to ensure 100% persistence reliability within the project timebox.
2. **TXT / Markdown Import Only**: Import pipeline accepts `.txt` and `.md` files up to 5MB. Binary formats (`.pdf`, `.docx`) are explicitly rejected with user-friendly error messages.
3. **Lightweight Auth**: Uses seeded accounts and JWT session tokens without email verification or OAuth.

---

## 🔮 Next 2–4 Hours Roadmap

If given an additional 2–4 hours, the next features to implement would be:
1. **Simple Version History**: Document snapshot revision logs saved on explicit save events.
2. **Document Comments**: In-line text highlighting with comment threads.
3. **Granular Permissions**: Add `VIEWER` (read-only) permission option in the Share modal.
