# Orbit Frontend

The web client for **Orbit** — a multi-tenant SaaS workspace for projects, tasks, teams, billing, and platform administration.

This app is a **React + TypeScript + Vite** single-page application. It talks to the Orbit NestJS backend over REST (`/api/v1`) and Socket.IO for realtime updates.

| Live Demo URL       |                                |
| ------------------- | ------------------------------ |
| **Local URL**       | `http://localhost:5173`        |
| **API expected at** | `http://localhost:5000/api/v1` |
| **Package manager** | npm                            |
| **Node**            | 20+ (LTS recommended)          |

---

## Table of contents

1. [What is this?](#what-is-this)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Quick start](#quick-start)
6. [Environment variables](#environment-variables)
7. [npm scripts](#npm-scripts)
8. [Project structure](#project-structure)
9. [How the app is wired](#how-the-app-is-wired)
10. [Routing map](#routing-map)
11. [Auth, session & security on the client](#auth-session--security-on-the-client)
12. [Adding a new feature (checklist)](#adding-a-new-feature-checklist)
13. [UI conventions](#ui-conventions)
14. [Realtime](#realtime)
15. [Troubleshooting](#troubleshooting)
16. [Related docs](#related-docs)

---

## What is this?

Orbit Frontend is everything the browser renders for Orbit:

| Area                        | Who uses it                           | What it is                                                            |
| --------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| **Marketing / public site** | Guests                                | Home, about, contact, help, legal pages                               |
| **Auth**                    | Guests → users                        | Login, register, OTP, OAuth, invite accept, 2FA, password reset       |
| **Onboarding**              | New org owners                        | Choose plan, Stripe checkout return, subscription-pending gate        |
| **Workspace**               | Org owners, admins, managers, members | Projects, tasks, boards, teams, calendar, reports, billing, settings  |
| **Platform admin**          | Platform admins                       | Orgs, users, subscriptions, leads, activity review, branding/settings |

If the **backend** is the brain and database, this **frontend** is the product UI.

---

## Features

### Public & marketing

- Landing / home experience
- Contact form (leads)
- Help, about, terms, privacy

### Authentication

- Email + password login / register
- Email OTP verification
- Forgot / reset password
- Google & GitHub OAuth
- Accept team invite
- Personal 2FA (TOTP)
- Remember-me sessions
- Silent access-token refresh on 401

### Workspace (organization app)

- Role-aware dashboard
- Projects (create, detail, board, theme, GitHub sync, discussion)
- Tasks & My Tasks
- Boards (Kanban)
- Teams & invites
- Calendar events
- Reports
- Billing (plans, invoices, customer portal)
- Org settings & usage
- Profile (name, avatar, email change, password, connected accounts)
- Activity logs
- App UI themes + per-project themes
- Realtime presence, comments, notifications

### Platform admin console (`/admin/*`)

- Platform dashboard & system health
- Organizations, users, subscriptions
- Leads inbox
- Activity & activity review
- Platform settings (branding, email, billing labels)
- Admin profile

---

## Tech stack

| Layer                | Choice                 |
| -------------------- | ---------------------- |
| UI library           | React 19               |
| Language             | TypeScript             |
| Bundler / Dev server | Vite 8                 |
| Routing              | React Router 7         |
| Server state         | TanStack React Query 5 |
| HTTP                 | Axios                  |
| UI components        | Ant Design 6           |
| Styling              | Tailwind CSS 4         |
| Charts               | Recharts               |
| Realtime             | Socket.IO client       |
| SEO meta             | react-helmet-async     |
| Tests                | Vitest                 |
| Lint                 | ESLint                 |

---

## Prerequisites

1. **Node.js** 20+ and **npm**
2. Orbit **backend** running and healthy (`http://localhost:5000/api/v1/health`)
3. Backend CORS must allow the frontend origin (usually `http://localhost:5173`)

```bash
node -v
npm -v
```

---

## Quick start

```bash
# From repo root
cd frontend

# Install dependencies
npm install

# Env is already set for local dev in .env.development
# VITE_API_URL=http://localhost:5000/api/v1

# Start Vite
npm run dev
```

Open the URL Vite prints (default **[http://localhost:5173](http://localhost:5173)**).

> Backend must be up first. Without the API, auth and almost all screens will fail.

---

## Environment variables

Vite only exposes variables prefixed with `VITE_`.

Create / edit `.env.development` (local) or production env at build time:

| Variable          | Required | Example                        | Purpose                                                                     |
| ----------------- | -------- | ------------------------------ | --------------------------------------------------------------------------- |
| `VITE_API_URL`    | Yes      | `http://localhost:5000/api/v1` | Axios base URL for all REST calls                                           |
| `VITE_APP_URL`    | No       | `http://localhost:5173`        | Public app origin (links / SEO helpers)                                     |
| `VITE_SOCKET_URL` | No       | `http://localhost:5000`        | Socket.IO origin. If omitted, derived from `VITE_API_URL` (strip `/api/v1`) |

**Backend must align with the frontend:**

```env
# backend .env (example)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=5000
```

Mismatched CORS / OAuth callback URLs are the #1 local setup failure.

---

## npm scripts

| Command           | What it does                             |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start Vite with HMR                      |
| `npm run build`   | Typecheck (`tsc -b`) + production bundle |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | Run ESLint                               |
| `npm test`        | Run Vitest once                          |

---

## Project structure

```
frontend/
├── public/                 # Static public assets
├── src/
│   ├── main.tsx            # React DOM entry
│   ├── app.tsx             # Providers + all route trees
│   ├── index.css           # Global + Tailwind styles
│   │
│   ├── api-services/       # One Axios module per domain (auth, projects, billing, …)
│   ├── hooks/              # React Query hooks + small UI hooks
│   ├── pages/              # Route-level screens
│   │   ├── admin/          # /admin/*
│   │   ├── workspace/      # /dashboard, /projects, …
│   │   └── *.tsx           # Public, auth, onboarding pages
│   ├── component/          # UI building blocks
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── workspace/
│   │   ├── common/
│   │   ├── home/
│   │   ├── seo/
│   │   └── ui/             # Shared primitives (table, empty state, typography)
│   ├── layout/             # Shells: public / auth / workspace / admin
│   ├── router/             # Path constants + guards + redirects
│   │   └── guards/         # RequireAuth, RequireGuest, role/plan gates, …
│   ├── context/            # App user session, UI theme, profile providers
│   ├── config/             # Axios client, React Query client, socket
│   ├── types/              # Shared TypeScript types + mappers
│   ├── data/               # Static catalogs, nav items, labels
│   ├── lib/                # Pure helpers (auth session, permissions, toasts, URLs, …)
│   ├── columns/            # Ant Design table column factories
│   └── assets/             # Images / icons
├── .env.development
├── package.json
├── vite.config.ts
└── frontend.md             # Extra long-form guide (EN + Roman Urdu)
```

### Mental model (data flow)

```
Page / Component
    → hook (React Query)          e.g. useProjects()
        → api-service             e.g. listProjects()
            → Axios client        VITE_API_URL + API_ROUTES
                → Nest backend
        ← cached data / error
    → UI (loading · error · empty · data)
```

**Rule of thumb when adding APIs:**

1. Add path in `src/router/api-routes.ts`
2. Add function in `src/api-services/<domain>.service.ts`
3. Add hook in `src/hooks/`
4. Consume hook in page/component
5. Always handle loading, error, and empty states

---

## How the app is wired

`src/app.tsx` is the root. It wraps:

1. **QueryClientProvider** — server state / caching
2. **AppProvider** — auth user, bootstrap `/auth/me`, session helpers
3. **AppUiThemeProvider** — app-wide UI theme
4. **BrowserRouter** — all route groups below

Route groups (high level):

| Guard / layout                                                | Audience                                              |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| `RequirePlatformAdmin` + `AdminLayout`                        | Platform admins → `/admin/*`                          |
| `RequireWorkspaceUser` + `WorkspaceLayout` + role/plan guards | Org users → workspace routes                          |
| `RequireGuest` + `AuthLayout`                                 | Logged-out auth pages                                 |
| `RequireAuth`                                                 | Auth-required non-workspace pages (choose-plan, etc.) |
| Public `Layout` + plan redirect                               | Marketing pages                                       |

---

## Routing map

Route constants live in:

- `src/router/public-routes.ts`
- `src/router/auth-routes.ts`
- `src/router/workspace-routes.ts`
- `src/router/admin-routes.ts`
- `src/router/api-routes.ts` (backend paths, not UI pages)

### Public

| Path                | Page    |
| ------------------- | ------- |
| `/`                 | Home    |
| `/about`            | About   |
| `/contact`          | Contact |
| `/help`             | Help    |
| `/terms-of-service` | Terms   |
| `/privacy-policy`   | Privacy |

### Auth (guest)

| Path                    | Page                |
| ----------------------- | ------------------- |
| `/login`                | Login               |
| `/register`             | Register            |
| `/verify-otp`           | OTP verify          |
| `/forgot-password`      | Forgot password     |
| `/reset-password`       | Reset password      |
| `/accept-invite`        | Accept invite       |
| `/two-factor`           | 2FA challenge       |
| `/auth/google/callback` | Google OAuth return |
| `/auth/github/callback` | GitHub OAuth return |

### Onboarding (authenticated)

| Path                   | Page                             |
| ---------------------- | -------------------------------- |
| `/choose-plan`         | Pick subscription plan           |
| `/choose-plan/success` | Checkout success                 |
| `/choose-plan/cancel`  | Checkout cancel                  |
| `/workspace-pending`   | Org awaiting active subscription |

### Workspace

| Path                         | Page                  |
| ---------------------------- | --------------------- |
| `/dashboard`                 | Dashboard             |
| `/projects`                  | Projects list         |
| `/projects/new`              | Create project        |
| `/projects/:projectId`       | Project detail        |
| `/projects/:projectId/board` | Project board         |
| `/projects/:projectId/edit`  | Edit project          |
| `/projects/:projectId/theme` | Project theme         |
| `/boards`                    | Boards hub            |
| `/tasks`                     | Tasks                 |
| `/tasks/new`                 | Create task           |
| `/tasks/:taskId`             | Task detail           |
| `/tasks/:taskId/edit`        | Edit task             |
| `/my-tasks`                  | Member personal tasks |
| `/teams`                     | Teams                 |
| `/calendar`                  | Calendar              |
| `/reports`                   | Reports               |
| `/billing`                   | Billing               |
| `/settings`                  | Org settings          |
| `/profile`                   | User profile          |
| `/activity-logs`             | Activity logs         |

### Admin

| Path                     | Page              |
| ------------------------ | ----------------- |
| `/admin/dashboard`       | Admin home        |
| `/admin/organizations`   | Orgs              |
| `/admin/subscriptions`   | Subscriptions     |
| `/admin/users`           | Users             |
| `/admin/leads`           | Leads inbox       |
| `/admin/activity`        | Activity          |
| `/admin/activity-review` | Activity review   |
| `/admin/settings`        | Platform settings |
| `/admin/profile`         | Admin profile     |

### Route guards (access control)

Located in `src/router/guards/`:

| Guard                          | Job                                             |
| ------------------------------ | ----------------------------------------------- |
| `RequireAuth`                  | Must be logged in                               |
| `RequireGuest`                 | Logged-in users leave login/register            |
| `RequirePlatformAdmin`         | Platform admin only                             |
| `RequireWorkspaceUser`         | Org workspace user (not forced into admin)      |
| `RequireWorkspaceRouteAccess`  | Role + plan feature checks                      |
| `RequireMemberRouteAccess`     | Member route allowlist                          |
| `RequirePlanSelectionRedirect` | Send users to choose-plan / pending when needed |

### Roles (product behavior)

| Role                | Typical access                                                   |
| ------------------- | ---------------------------------------------------------------- |
| **Owner**           | Org, billing, settings; by design does **not** create/edit tasks |
| **Admin / Manager** | Projects + task delivery                                         |
| **Member**          | My Tasks, boards, limited project access                         |
| **Platform admin**  | Full `/admin/`\* console                                         |

Permissions live in `src/lib/workspace-permissions.ts`.

---

## Auth, session & security on the client

### Tokens & user storage

- Access + refresh tokens stored in cookies (`src/lib/cookies.ts`)
- User snapshot stored as `orbit:user` (localStorage when Remember me, else sessionStorage)
- Session expiry keys enforce remember vs short session TTL

Helpers: `src/lib/auth-session.ts`

### Axios client (`src/config/client.ts`)

- Base URL = `VITE_API_URL`
- Sends `Authorization: Bearer <accessToken>` when `requireAuth` is set
- `withCredentials: true` for cookies
- On **401**: attempts `/auth/refresh`, retries the request, or clears session

### Post-login redirect

Logic such as `getPostAuthRedirectPath` sends users to:

1. Platform admin → `/admin/dashboard`
2. Needs plan → `/choose-plan`
3. Org awaiting subscription → `/workspace-pending`
4. Otherwise workspace home (`/dashboard`, or `/my-tasks` for members)

### OAuth

Browser navigates to:

- `{VITE_API_URL}/auth/google`
- `{VITE_API_URL}/auth/github`

Callback pages bootstrap the session from query tokens + `/auth/me`.

### Uploaded assets (avatars, branding, attachments)

Backend returns paths like `/api/v1/uploads/...`.
Always resolve them with `resolveTaskAttachmentUrl()` in `src/lib/task-attachments.ts` before putting them in `<img>` / Avatars — do **not** concatenate `VITE_API_URL` again on top of a path that already includes `/api/v1`.

---

## Adding a new feature (checklist)

1. **Page** — create under `src/pages/...`
2. **Route constant** — add to the correct `*-routes.ts`
3. **Mount** — ensure `app.tsx` / route list includes it under the right layout + guard
4. **Nav** — add item in `src/data/admin-nav-items.ts` or workspace nav data if needed
5. **API** — `api-routes.ts` → `api-services/` → `hooks/`
6. **UI states** — loading, error, empty (never leave blank lists)
7. **Permissions** — verify Owner / Admin / Manager / Member (and plan feature flags)
8. **Types** — extend `src/types/` if the payload is shared

Admin pages are lazy-loaded from `src/pages/admin/<name>.tsx` based on the `/admin/<name>` path.
Workspace pages are lazy-loaded from `src/pages/workspace/`.

---

## UI conventions

| Concern              | Prefer                                                             |
| -------------------- | ------------------------------------------------------------------ |
| Empty lists / cards  | `EmptyStatePanel` (`component/ui/empty-state-panel.tsx`)           |
| Tables               | Shared `component/ui/table` with `emptyTitle` / `emptyDescription` |
| API errors / success | `showApiErrorToast` / `showApiSuccessToast` (`lib/api-error.ts`)   |
| Typography           | `component/ui/typography`                                          |
| Page SEO             | `component/seo/page-seo`                                           |
| Loading gates        | `QueryPageGuard` + skeletons where used                            |

Always show a clear empty message when an API returns `[]`. Do not leave empty cards silent.

**Themes**

- App-wide UI theme via theme context
- Per-project theme at `/projects/:id/theme`

---

## Realtime

Config: `src/config/socket.ts`

- Connects to `{SOCKET_URL}/realtime`
- Auth via access token
- Used for presence, project comments, and notifications

Workspace layout wraps `WorkspaceRealtimeProvider` so live features work while you are inside the workspace shell.

---

## Troubleshooting

| Symptom                        | Likely cause                          | Fix                                                                                                             |
| ------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Network / CORS errors          | Backend down or origin not allowed    | Start backend; set `CORS_ORIGIN` to include `http://localhost:5173`                                             |
| Infinite login / 401 loop      | Bad `VITE_API_URL` or refresh failing | Check env, cookies, backend JWT secrets                                                                         |
| Blank lists                    | Empty UI not wired                    | Use `EmptyStatePanel` / table empty props                                                                       |
| OAuth fails after redirect     | Callback / FE URL mismatch            | Align Google/GitHub console + backend `FRONTEND_URL`                                                            |
| Avatar / branding image broken | Double `/api/v1` in URL               | Use `resolveTaskAttachmentUrl`                                                                                  |
| Socket not connecting          | Wrong socket origin                   | Set `VITE_SOCKET_URL` or fix `VITE_API_URL` derivation                                                          |
| Wrong post-login screen        | Plan / subscription / role flags      | Check `/auth/me` fields: `requiresPlanSelection`, `organizationAwaitingSubscription`, `isPlatformAdmin`, `role` |

---

## Related docs

| Doc                 | Location                                         | Contents                                  |
| ------------------- | ------------------------------------------------ | ----------------------------------------- |
| This README         | `frontend/README.md`                             | Overview + day-1 setup (you are here)     |
| Deep frontend guide | `[frontend.md](./frontend.md)`                   | Longer walkthrough (English + Roman Urdu) |
| Backend             | `../backend/README.md` + `../backend/backend.md` | API / Nest server                         |
| Manual test cases   | `../test-cases/`                                 | Auth, billing, permissions, etc.          |

---

## License / notes

This package is part of the private Orbit monorepo (`"private": true` in `package.json`). Coordinate with the team before publishing or changing public env / OAuth redirects.

---

**Happy building.** Start the API, run `npm run dev`, open `http://localhost:5173`, and explore `/login` → workspace or `/admin`.
