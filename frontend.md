# Orbit Frontend Guide

This document has **two versions**:

1. [English](#english-version)
2. [Roman English (Roman Urdu)](#roman-english-version)

---

# English Version

## 1. What is the Orbit frontend?

Orbit frontend is a **React + TypeScript + Vite** SPA for the Orbit SaaS product.

It covers:

- Public marketing pages (home, about, contact, help, legal)
- Auth flows (login, register, OTP, OAuth, reset password, invites, 2FA)
- Workspace app (dashboard, projects, tasks, boards, teams, calendar, billing, settings)
- Platform admin console (orgs, users, subscriptions, activity, leads, settings)

Folder: `orbit/frontend`

### Tech stack

| Piece | Library |
|---|---|
| UI framework | React 19 |
| Language | TypeScript |
| Bundler/dev server | Vite |
| Routing | React Router |
| Server state | TanStack React Query |
| HTTP | Axios |
| UI kit | Ant Design |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Realtime | Socket.IO client |

Default local FE URL is usually **`http://localhost:5173`** (Vite default).  
API expected at **`http://localhost:5000/api/v1`**.

---

## 2. Prerequisites

1. **Node.js** LTS (20+ recommended)
2. **npm**
3. Backend already runnable (see [`backend.md`](./backend.md))

Check:

```bash
node -v
npm -v
```

---

## 3. Step-by-step setup

### Step 1 — Open frontend folder

```bash
cd orbit/frontend
```

### Step 2 — Install packages

```bash
npm install
```

### Step 3 — Configure env

Local file: `.env.development`

Minimum required:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Optional:

```env
VITE_APP_URL=http://localhost:5173
VITE_SOCKET_URL=http://localhost:5000
```

If `VITE_SOCKET_URL` is missing, socket URL is derived from `VITE_API_URL` (origin without `/api/v1`).

### Step 4 — Make sure backend is up

Backend health should return OK:

```bash
curl http://localhost:5000/api/v1/health
```

### Step 5 — Start frontend

```bash
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

---

## 4. Important npm scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite development server + HMR |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |

---

## 5. Folder structure (explained)

```
frontend/src/
  main.tsx              → React DOM entry
  app.tsx               → routes + providers wiring
  index.css             → global/Tailwind styles

  api-services/         → Axios API wrappers (one domain per file)
  hooks/                → React Query hooks + UI hooks
  pages/                → route-level screens
  component/            → reusable UI pieces (admin/workspace/auth/common)
  layout/               → public / auth / workspace / admin shells
  router/               → route constants + guards
  context/              → app user/session + UI theme
  config/               → axios client, query client, socket
  types/                → shared TS types + mappers
  data/                 → static catalogs, labels, helpers
  lib/                  → pure utilities (permissions, filters, toast, etc.)
  columns/              → Ant Design table column factories
  assets/               → images/icons
```

**Data flow (standard pattern)**

1. Page/component calls a **hook** (`useProjects`, `useAdminUsers`, …)
2. Hook calls an **api-service** function
3. Service uses **Axios client** + `API_ROUTES`
4. React Query caches/refetches the result
5. UI renders loading / error / data / empty states

---

## 6. Routing map (what opens where)

Routes are wired in `src/app.tsx`.

### Public pages

- `/` home
- `/about`, `/contact`, `/help`
- `/terms-of-service`, `/privacy-policy`

### Auth / guest pages

- `/login`, `/register`
- `/verify-otp`, `/forgot-password`, `/reset-password`
- `/accept-invite`, `/two-factor`
- `/auth/github/callback`, `/auth/google/callback`

### Onboarding (authenticated)

- `/choose-plan` (+ checkout success/cancel)
- `/workspace-pending`

### Workspace app

- `/dashboard`
- `/projects`, `/projects/new`, `/projects/:id`, board/edit/theme
- `/tasks`, `/tasks/new`, `/tasks/:id`
- `/my-tasks` (members)
- `/boards`, `/teams`, `/calendar`, `/reports`
- `/billing`, `/settings`, `/profile`, `/activity-logs`

### Admin console

- `/admin/dashboard`
- `/admin/organizations`
- `/admin/subscriptions`
- `/admin/users`
- `/admin/leads`
- `/admin/activity`, `/admin/activity-review`
- `/admin/settings`, `/admin/profile`

---

## 7. Route guards (access control)

Guards live in `src/router/guards/`.

| Guard | Meaning |
|---|---|
| `RequireAuth` | Must be logged in |
| `RequireGuest` | Logged-in users redirected away from login/register |
| `RequirePlatformAdmin` | Platform admin only |
| `RequireWorkspaceUser` | Normal org user (not forced to admin) |
| `RequireWorkspaceRouteAccess` | Role permission + plan feature checks |
| `RequireMemberRouteAccess` | Member allowlist for specific routes |
| `RequirePlanSelectionRedirect` | Push users to choose-plan / pending pages when needed |

### Role behavior (product rules)

- **Owner**: manages org/billing/settings; cannot create/edit tasks (by design)
- **Admin / Manager**: projects + tasks delivery
- **Member**: my-tasks, boards, limited project access
- **Platform admin**: `/admin/*` console

Permissions source of truth: `src/lib/workspace-permissions.ts`

---

## 8. Auth & session (frontend side)

### Tokens

- Access + refresh cookies (see `src/lib/cookies.ts`)
- User object persisted in storage (`orbit:user`)
- Remember-me changes session lifetime

### Axios client (`src/config/client.ts`)

- Base URL = `VITE_API_URL`
- Sends `Authorization: Bearer ...` when needed
- On **401**, tries `/auth/refresh`, then retries request
- `withCredentials: true`

### After login redirect logic

`getPostAuthRedirectPath`:

1. Platform admin → `/admin/dashboard`
2. Needs plan → `/choose-plan`
3. Awaiting org subscription → `/workspace-pending`
4. Else workspace home (`/dashboard` or `/my-tasks` for members)

### OAuth

Login/register buttons redirect browser to:

- `{VITE_API_URL}/auth/google`
- `{VITE_API_URL}/auth/github`

Callback pages read tokens from query and bootstrap user via `/auth/me`.

---

## 9. API layer convention

Central paths: `src/router/api-routes.ts`

Example pattern:

```ts
// api-services/project.service.ts
const listProjects = async (...) => {
  const response = await ApiService.get(API_ROUTES.PROJECTS.LIST, { requireAuth: true });
  return normalize...
};
```

Then hook:

```ts
// hooks/use-workspace-projects.ts
useQuery({ queryKey: [...], queryFn: listProjects })
```

When adding a new API:

1. Add path constant in `api-routes.ts`
2. Add service function in `api-services/`
3. Add React Query hook in `hooks/`
4. Consume in page/component
5. Handle loading / error / empty UI

---

## 10. UI patterns you should follow

### Loading / error / empty

- List pages often use `QueryPageGuard` + skeletons
- Shared table empty UI: `component/ui/table.tsx` + `TableEmpty`
- Non-table empty panels: `component/ui/empty-state-panel.tsx`

Always show an empty message when API returns `[]`. Do not leave blank cards.

### Tables

Prefer `component/ui/table` over raw Ant Design `Table`, so empty states stay consistent (`emptyTitle`, `emptyDescription`).

### Toasts / errors

Use helpers from `src/lib/api-error.ts` (`showApiErrorToast`, `showApiSuccessToast`).

### Themes

- App UI theme: `app-ui-themes` + theme context
- Per-project theme: local catalog + `/projects/:id/my-theme`

---

## 11. Realtime (Socket.IO)

Config: `src/config/socket.ts`

- Connects to `{SOCKET_URL}/realtime`
- Auth: access token
- Used for presence + project comment events + notifications

Workspace layout wraps realtime provider so team online status and live comments work.

---

## 12. Major screens / features

### Workspace

| Screen | What it does |
|---|---|
| Dashboard | Stats, activity feed, charts |
| Projects | Grid/list, create/edit, detail, GitHub, discussion |
| Boards | Kanban by project |
| Tasks / My Tasks | Delivery lists and personal assignments |
| Teams | Members, invites, roles |
| Calendar | Events CRUD |
| Reports | Task summaries |
| Billing | Plans, invoices, portal |
| Settings | Org general/members/security/notifications/usage |

### Admin

| Screen | What it does |
|---|---|
| Dashboard | Platform overview + health |
| Organizations / Users / Subscriptions | CRUD + stats |
| Leads | Contact form inbox |
| Activity / Review | Flag/resolve events |
| Settings | Branding, email SMTP, billing labels |

---

## 13. How to add a new frontend page (step-by-step)

1. Create page in `src/pages/...`
2. Add route constant in the right router file:
   - `public-routes.ts` / `auth-routes.ts` / `workspace-routes.ts` / `admin-routes.ts`
3. Ensure `app.tsx` (or route list factory) mounts it under correct layout + guard
4. Add nav item if needed (`data/admin-nav-items.ts` or workspace nav data)
5. Wire API service + hook
6. Implement loading, error, empty states
7. Verify role access manually for owner/admin/manager/member

Admin pages use lazy imports based on path file names (`pages/admin/<name>.tsx`).

---

## 14. Environment & CORS checklist

Frontend:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Backend must allow FE origin:

```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
PORT=5000
```

If these mismatch, you get CORS or OAuth callback failures.

---

## 15. Common problems & fixes

| Problem | Cause | Fix |
|---|---|---|
| Network/CORS errors | Backend down or origin not allowed | Start backend, fix `CORS_ORIGIN` |
| Infinite login/401 loop | Refresh failing / wrong API URL | Check `VITE_API_URL`, cookies, backend JWT secrets |
| Blank lists | Empty state missing (older screens) | Use `EmptyStatePanel` / table empty props |
| OAuth returns then fails | Wrong callback URL / FE origin | Align Google/GitHub callback with backend env |
| Socket not connecting | Wrong socket URL / no token | Check `VITE_SOCKET_URL`, login state |
| Role cannot open page | Permission/plan gate | Check `workspace-permissions` + plan feature flags |

---

## 16. Recommended local run order

1. Redis (if backend queues enabled)
2. Backend: `cd backend && npm run dev`
3. Confirm API health OK
4. Frontend: `cd frontend && npm run dev`
5. Open `http://localhost:5173`

---

## 17. Build for production

```bash
cd frontend
npm run build
npm run preview
```

Set production `VITE_API_URL` to your deployed API (`https://api.example.com/api/v1`).

---

# Roman English Version

## 1. Orbit frontend kya hai?

Orbit frontend **React + TypeScript + Vite** pe bani SPA hai.

Isme milta hai:

- Public marketing pages
- Auth flows (login/register/OTP/OAuth/2FA)
- Workspace app (projects, tasks, boards, teams, calendar, billing)
- Platform admin console (orgs, users, subs, activity, leads)

Folder: `orbit/frontend`

### Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Ant Design + Tailwind
- Recharts
- Socket.IO client

Local FE aksar: `http://localhost:5173`  
API: `http://localhost:5000/api/v1`

---

## 2. Pehle requirements

1. Node.js LTS
2. npm
3. Backend chalne layak hona chahiye ([`backend.md`](./backend.md))

```bash
node -v
npm -v
```

---

## 3. Setup step-by-step

### Step 1 — Frontend folder

```bash
cd orbit/frontend
```

### Step 2 — Install

```bash
npm install
```

### Step 3 — Env set karo

File: `.env.development`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Optional:

```env
VITE_APP_URL=http://localhost:5173
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4 — Backend health check

```bash
curl http://localhost:5000/api/v1/health
```

### Step 5 — Frontend start

```bash
npm run dev
```

Browser mein Vite URL open karo.

---

## 4. Important commands

| Command | Kaam |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run preview` | Build preview |
| `npm run lint` | Lint |
| `npm test` | Tests |

---

## 5. Folder structure samjho

```
src/
  api-services/   → backend API calls
  hooks/          → React Query hooks
  pages/          → screens
  component/      → reusable components
  layout/         → page shells
  router/         → routes + guards
  context/        → user/session/theme
  config/         → axios/query/socket
  types/ + data/ + lib/
```

Standard flow:

**UI → hook → api-service → Axios → backend**

---

## 6. Routes ka map

Public: `/`, `/about`, `/contact`, `/help`, legal pages  
Auth: `/login`, `/register`, OTP, reset, invite, 2FA, OAuth callbacks  
Onboarding: `/choose-plan`, `/workspace-pending`  
Workspace: dashboard/projects/tasks/boards/teams/calendar/billing/settings  
Admin: `/admin/dashboard`, orgs, users, subs, **leads**, activity, settings

Wiring `src/app.tsx` mein hoti hai.

---

## 7. Guards (access control)

- `RequireAuth` → login zaroori
- `RequireGuest` → logged-in ko login page se hatao
- `RequirePlatformAdmin` → sirf platform admin
- `RequireWorkspaceUser` → normal workspace user
- `RequireWorkspaceRouteAccess` → role + plan features
- `RequireMemberRouteAccess` → member-specific routes
- `RequirePlanSelectionRedirect` → plan/pending pe bhejo

Roles:

- Owner → billing/settings (task create/edit nahi)
- Admin/Manager → projects/tasks
- Member → my-tasks/boards
- Platform admin → `/admin/*`

Permissions file: `src/lib/workspace-permissions.ts`

---

## 8. Auth frontend pe kaise kaam karta hai?

1. Login/register se tokens milte hain (cookies)
2. User storage mein save hota hai
3. Axios har request pe Bearer token bhejta hai
4. 401 aaye to refresh try hota hai
5. Fail ho to logout / login pe redirect

OAuth:

- Browser `{VITE_API_URL}/auth/google` ya `/auth/github` pe jata hai
- Callback page tokens pick karke `/auth/me` se user lata hai

---

## 9. API layer convention

1. Path add karo: `router/api-routes.ts`
2. Service banao: `api-services/...`
3. Hook banao: `hooks/...`
4. Page mein use karo
5. Loading/error/empty handle karo

Always `API_ROUTES` use karo, hardcoded URLs avoid karo.

---

## 10. UI patterns (zaroori)

- Tables: `component/ui/table` + `emptyTitle` / `emptyDescription`
- Lists/cards empty: `EmptyStatePanel`
- Errors: `showApiErrorToast`
- Skeletons + `QueryPageGuard` for page load states

Empty data pe blank card mat chhoro.

---

## 11. Realtime

`config/socket.ts`:

- `/realtime` namespace
- token se auth
- presence, comments, notifications ke liye

---

## 12. Key features short list

Workspace:

- Projects/tasks/boards
- Teams invites
- Calendar
- Billing + invoices
- Settings + profile
- AI helpers (drafts, ask, WBS)

Admin:

- Dashboard + system health
- Orgs/users/subscriptions
- Leads inbox
- Activity review
- Platform settings (branding/email/billing)

---

## 13. Nayi page kaise add karein? (step-by-step)

1. `pages/...` mein screen banao
2. Router constants update karo
3. Correct layout + guard ke neeche mount karo
4. Sidebar/nav link add karo (zarurat ho)
5. API service + hook connect karo
6. Empty/loading/error states do
7. Owner/admin/manager/member roles se test karo

Admin lazy route ke liye file name path se match hona chahiye  
(example: `/admin/leads` → `pages/admin/leads.tsx`).

---

## 14. Env / CORS checklist

Frontend:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Backend:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

Mismatch = CORS / OAuth issues.

---

## 15. Common problems

| Masla | Wajah | Fix |
|---|---|---|
| CORS / network | Backend band ya origin allow nahi | Backend start + CORS fix |
| Login loop | Refresh fail / galat API URL | `VITE_API_URL` + JWT check |
| Lists blank | Empty UI missing | `EmptyStatePanel`/table empty use karo |
| OAuth fail | Callback mismatch | Backend OAuth URLs align karo |
| Socket fail | URL/token issue | socket env + login check |
| Page blocked | Role/plan permission | permissions + plan flags check |

---

## 16. Local run order (best)

1. Redis (agar backend queues on hain)
2. Backend start
3. Health OK
4. Frontend start
5. Browser: `http://localhost:5173`

---

## 17. Production build

```bash
cd frontend
npm run build
npm run preview
```

Production mein `VITE_API_URL` deployed API pe set karo.

---

## Related docs

- Backend guide: [`backend.md`](./backend.md)
