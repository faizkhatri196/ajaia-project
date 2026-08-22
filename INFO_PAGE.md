# Ajaia Docs — System Info & Deployment Reference

This document provides a comprehensive reference of all system specifications, live deployment URLs, demo credentials, database schemas, core capabilities, and test results for **Ajaia Docs**.

---

## 📌 Live Production & Repository URLs

- **Vercel Frontend Application**: [https://ajaia-project-five.vercel.app](https://ajaia-project-five.vercel.app)
- **Vercel Info Page**: [https://ajaia-project-five.vercel.app/info](https://ajaia-project-five.vercel.app/info)
- **Render Backend REST API**: [https://ajaia-docs-api.onrender.com](https://ajaia-docs-api.onrender.com)
- **GitHub Source Repository**: [https://github.com/faizkhatri196/ajaia-project](https://github.com/faizkhatri196/ajaia-project)

---

## 👥 Seeded Demo User Accounts

The database seeder automatically ensures that three demo accounts are available on server startup:

| Name | Email Address | Password | Role & Test Purpose |
| :--- | :--- | :--- | :--- |
| **Alex** | `alex@ajaia.demo` | `demo123` | Document Owner & Creator |
| **Sarah** | `sarah@ajaia.demo` | `demo123` | Shared Editor |
| **John** | `john@ajaia.demo` | `demo123` | Unauthorized User (Tests HTTP 403 Forbidden) |

---

## 🛠️ Full-Stack Technology Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, TipTap Rich Text Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`), Lucide React Icons, React Router v6, Axios with credentials.
- **Backend**: Node.js, Express.js, MongoDB Atlas (with in-memory `mongodb-memory-server` fallback for local dev/testing), Multer (file upload), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Cookie Parser (`cookie-parser`), Dotenv.
- **Testing**: Vitest + Supertest integration test suite (7/7 tests passing).

---

## 📊 Database Collections & Schemas

### 1. User (`User`)
- `_id`: ObjectId
- `name`: String (Trimmed)
- `email`: String (Unique, Lowercase)
- `passwordHash`: String (10-round bcrypt hash)
- `createdAt`, `updatedAt`: Date

### 2. Document (`Document`)
- `_id`: ObjectId
- `title`: String (Default: "Untitled document")
- `content`: String (HTML markup from TipTap)
- `owner`: ObjectId (Ref `User`, Indexed)
- `createdAt`, `updatedAt`: Date

### 3. Share (`Share`)
- `_id`: ObjectId
- `document`: ObjectId (Ref `Document`)
- `user`: ObjectId (Ref `User`)
- `permission`: String (Enum: `['EDITOR']`)
- `createdAt`, `updatedAt`: Date
- *Index*: Compound unique on `{ document: 1, user: 1 }`

---

## 🔒 Security & Access Control Features

- **HttpOnly Cookies**: Session tokens issued as signed `HttpOnly` cookies (`ajaia_token`) with `sameSite` and `secure` configurations for cross-domain production security.
- **Bearer Token Fallback**: Axios client automatically attaches `Authorization: Bearer <token>` fallback headers if third-party cookies are restricted by browser settings.
- **Backend Authorization Middleware (`verifyDocAccess`)**: Enforces document access rights on every API endpoint. If an unauthorized user attempts to read, update, share, or delete another user's document without permission, the backend returns **HTTP 403 Forbidden**.

---

## 📄 Supported Import Formats

- `.txt` (Plain text files)
- `.md` (Markdown files)
- **Maximum File Size**: 5 MB

Unsupported formats (e.g. `.pdf`, `.docx`) are rejected with user-friendly error messages.

---

## 🧪 Automated Integration Test Results

Executed `npx vitest run --pool=forks` inside `backend/`:
```
 ✓ tests/sharing.test.js (7 tests)
   ✓ 1. Valid login sets HttpOnly cookie & returns safe user
   ✓ 2. Invalid password returns 401 generic error
   ✓ 3. Protected API without authentication returns 401 Unauthorized
   ✓ 4. Owner creates document & shares with Sarah
   ✓ 5. Owner & Sarah access document (200 OK)
   ✓ 6. John requests Alex document without permission (403 Forbidden)
   ✓ 7. Logout API clears authentication cookie (200 OK)

 Test Files  1 passed (1)
      Tests  7 passed (7)
```
