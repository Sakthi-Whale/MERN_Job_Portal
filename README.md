# MERN Stack Job Portal

A full-stack job portal built with **MongoDB, Express, React (TypeScript), and Node.js** — created as a hands-on learning project to practice REST API design, JWT authentication, role-based authorization, Mongoose data modeling, and connecting a React frontend to a Node/Express backend.

This is a **learning/practice project**, not a production-ready application, and it contains **no AI or machine learning functionality**.

---

## Table of Contents

- [Overview](#overview)
- [Project Purpose](#project-purpose)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Backend Implementation](#backend-implementation)
- [Frontend Implementation](#frontend-implementation)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [How the Application Works](#how-the-application-works)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Known Issues / Learning Notes](#known-issues--learning-notes)
- [Learning Objectives](#learning-objectives)
- [Future Improvements](#future-improvements)
- [Disclaimer](#disclaimer)
- [Author](#author)

---

## Overview

The app supports two roles — **User** (job seeker) and **Admin** (job poster) — each seeing a different set of views and actions:

- Users can register, log in, browse job postings, apply to jobs, and track their own applications.
- Admins can log in, create/edit/delete job postings, and view the list of applicants for any job.

The backend exposes a REST API secured with JWT; the React frontend consumes it through Axios and decodes the JWT client-side to drive role-based UI.

## Project Purpose

Built to practice:

- Structuring a REST API with Express (routes → middleware → controllers → models)
- JWT-based authentication and role-based (admin) authorization
- MongoDB schema design with Mongoose, including references and `populate()`
- Connecting a React + TypeScript frontend to a Node/Express backend with Axios
- Basic full-stack app state management, conditional rendering, and form handling

## Features

**Implemented:**

- User registration with email uniqueness check and bcrypt password hashing
- User login issuing a signed JWT (2-hour expiry)
- JWT-based route protection (`authMiddleware`)
- Admin-only route protection (`adminMiddleware`)
- Owner-or-admin authorization for updating/deleting a user account
- Admin-only listing of all users (paginated, first 10, passwords excluded)
- Admin-only promotion of a user to the `admin` role
- Public job listing
- Admin-only job creation, editing, and deletion
- Logged-in users applying to a job (duplicate applications blocked)
- Logged-in users viewing their own applications, with job details populated
- Admins viewing the list of applicants for a specific job, with applicant name/email populated
- Role-based UI (different views/actions for admin vs. user)

**Not implemented** (see [Future Improvements](#future-improvements) — do not confuse with the list above):

- AI/ML features of any kind (no recommendation engine, no AI matching)
- Search, filtering, or pagination controls in the UI
- Password reset / email notifications
- Application status updates from the UI
- Automated tests

## Technology Stack

**Frontend**
- React 19 + TypeScript
- Vite (dev server + build tool)
- Axios — HTTP client
- `jwt-decode` — decodes the JWT client-side to read the user's role
- Plain CSS (`index.css`, `style.css`)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose 9
- `jsonwebtoken` — JWT signing/verification
- `bcrypt` — password hashing
- `dotenv` — loads environment variables from `.env`

**Database**
- MongoDB (local or Atlas), accessed via Mongoose

**Authentication**
- JSON Web Tokens (JWT), Bearer-token scheme

**Development Tools**
- TypeScript compiler (`tsc`)
- Vite dev server with request proxying to the backend

## Project Architecture

Every protected request flows through the same layered pipeline:

```
Request
  → Express Route
  → authMiddleware        (verifies JWT, attaches req.user)
  → adminMiddleware        (only on admin-only routes, checks req.user.role)
  → Controller              (business logic)
  → Mongoose Model
  → MongoDB
  → JSON Response
```

Public routes (register, login, list jobs) skip the middleware and go straight from route to controller.

## Project Structure

```text
MERN-stack-AI_Job_Stack/
│
├── Backend/
│   ├── config/
│   │   └── db.js                     # Mongoose connection setup
│   ├── controllers/
│   │   ├── usercontroller.js         # register, login, getUsers, updateUser, deleteUser, promoteUser
│   │   ├── jobController.js          # getJobs, addJob, updateJob, deleteJob
│   │   └── applicationController.js  # applyForJob, getMyApplications, getApplicationsForJob
│   ├── middlewares/
│   │   ├── authMiddleware.js         # verifies JWT, attaches req.user
│   │   └── adminMiddleware.js        # blocks non-admins on admin-only routes
│   ├── models/
│   │   ├── User.js                   # name, email, password (hashed), role
│   │   ├── Job.js                    # title, company
│   │   └── Application.js            # job ref, user ref, status
│   ├── routes/
│   │   ├── userRoutes.js             # mounted at /users
│   │   ├── jobroutes.js              # mounted at /api/jobs
│   │   └── applicationRoutes.js      # mounted at /api/applications
│   ├── server.js                     # app entry point, mounts routes, starts server
│   ├── package.json
│   └── .env                          # not committed (see .gitignore)
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── JobForm.tsx           # admin: create a job
    │   │   ├── JobList.tsx           # renders a JobCard per job
    │   │   ├── JobCard.tsx           # single job; inline edit/delete/apply
    │   │   ├── MyApplications.tsx    # user: jobs they've applied to
    │   │   └── AdminApplications.tsx # admin: applicants for a specific job
    │   ├── services/
    │   │   └── jobService.ts         # all Axios calls (jobs + applications)
    │   ├── types.ts                  # Job, Application, JobApplication interfaces
    │   ├── App.tsx                   # owns app state, routing between views
    │   ├── main.tsx                  # React root render
    │   ├── index.css / style.css
    │   └── vite-env.d.ts
    ├── job.ts                        # early practice snippet — not imported by the app
    ├── script.js                     # early vanilla-JS practice snippet — not imported by the app
    ├── vite.config.ts                # dev proxy: /api and /users → localhost:3000
    └── package.json
```

> `Frontend/job.ts` (a plain-TS `Job` type with extra fields) and `Frontend/script.js` (a vanilla-JS DOM version of "add job to a list") predate the React app, are not imported anywhere, and play no part in the running application. They're kept only as a learning trail.

---

## Authentication & Authorization

**Authentication** confirms *who* the requester is. **Authorization** confirms *what* an authenticated requester is allowed to do. **Admin authorization** is a specific case of authorization: it checks whether the authenticated user additionally holds the `admin` role.

### Login flow (`usercontroller.js` → `loginUser`)

1. `POST /users/login` receives `email` and `password`.
2. The user is looked up with `User.findOne({ email })`; if not found, `400 "User not found"`.
3. The submitted password is compared to the stored hash with `bcrypt.compare()`; if it doesn't match, `400 "Invalid Password"`.
4. A JWT payload is built: `{ id: user._id, email: user.email, role: user.role }`.
5. The token is signed with `jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })`.
6. The response returns `{ success, message, token }`. The frontend stores this token in `localStorage`.

### Token verification (`authMiddleware.js`)

1. Reads `req.headers.authorization`. If missing, returns `401 "Token Missing"`.
2. Splits the header on the space to extract the token from the `Bearer <token>` format.
3. Calls `jwt.verify(token, process.env.JWT_SECRET)` inside a `try/catch`.
4. On success, the decoded payload (`{ id, email, role }`) is attached to `req.user`, and `next()` passes control to the next middleware/controller.
5. On failure:
   - If `error.name === "TokenExpiredError"` → `401 "Token Expired"`.
   - Any other verification failure (bad signature, malformed token) → `401 "Invalid Token"`.

### Admin authorization (`adminMiddleware.js`)

Runs **after** `authMiddleware`, so `req.user` is already populated:

```js
if (req.user.role !== "admin") {
  return res.status(403).json({ success: false, message: "Access Denied" });
}
next();
```

Middleware order on admin-only routes is always:

```
authMiddleware → adminMiddleware → controller
```

Authentication is checked first because authorization is meaningless without a verified identity — `adminMiddleware` reads `req.user.role`, which only exists once `authMiddleware` has verified the token and attached the payload. Checking admin status before verifying the token would mean trusting an unverified/forgeable claim.

### Ownership-based authorization

Update/delete of a **user account** isn't gated by `adminMiddleware` at the route level. Instead, `usercontroller.js` checks inside `updateUser` and `deleteUser`:

```js
if (req.user.role !== "admin" && req.user.id !== userId) {
  return res.status(403).json({ success: false, message: "Access Denied" });
}
```

This lets a normal user manage their own account while still allowing an admin to manage any account, without needing two separate routes.

### Client-side role handling

The frontend never calls a "get current user" endpoint. Instead, `App.tsx` decodes the stored JWT with `jwt-decode` (`jwtDecode<JwtPayload>(token)`) to read `role` and drive which UI is shown. This is convenience-only, not a security boundary — every actual authorization decision is enforced server-side by the middleware/controllers above.

---

## Backend Implementation

| File | Responsibility |
|---|---|
| `server.js` | Loads `.env`, creates the Express app, mounts `/users`, `/api/jobs`, `/api/applications`, defines `GET /` and `GET /about` health-check routes, calls `connectDB()`, then starts `app.listen()` only after the DB connection succeeds. |
| `config/db.js` | Connects to MongoDB via `mongoose.connect(process.env.MONGO_URI)`; logs success or exits the process (`process.exit(1)`) on failure. |
| `models/User.js` | Mongoose schema: `name` (required), `email` (required, unique), `password` (required, hashed), `role` (default `"user"`), plus `timestamps`. |
| `models/Job.js` | Mongoose schema: `title` (required), `company` (required), plus `timestamps`. No other fields exist on this model. |
| `models/Application.js` | Mongoose schema: `job` (ObjectId ref → `Job`, required), `user` (ObjectId ref → `User`, required), `status` (default `"Applied"`), plus `timestamps`. |
| `middlewares/authMiddleware.js` | Verifies the JWT and attaches `req.user` (see [Authentication & Authorization](#authentication--authorization)). |
| `middlewares/adminMiddleware.js` | Blocks any request where `req.user.role !== "admin"`. |
| `controllers/usercontroller.js` | `registerUser`, `loginUser`, `getUsers` (paginated, admin-only), `updateUser` (owner/admin), `deleteUser` (owner/admin), `promoteUser` (admin-only, sets `role: "admin"`). |
| `controllers/jobController.js` | `getJobs`, `addJob`, `updateJob`, `deleteJob` — plain CRUD over the `Job` model. |
| `controllers/applicationController.js` | `applyForJob` (blocks duplicate applications per user/job pair), `getMyApplications` (populates `job`), `getApplicationsForJob` (populates `user`'s `name`/`email`). |
| `routes/userRoutes.js` | Defines `/users/*`, wiring each route to its middleware and controller function. |
| `routes/jobroutes.js` | Defines `/api/jobs/*`. |
| `routes/applicationRoutes.js` | Defines `/api/applications/*`; the admin-only applicant-list route uses an inline `(req, res, next)` check for `req.user.role !== "admin"` rather than importing `adminMiddleware`. |

### Job Management

| Operation | Method & Route | Middleware | Controller | Mongoose method | Body/Params | Response |
|---|---|---|---|---|---|---|
| Get jobs | `GET /api/jobs` | — (public) | `getJobs` | `Job.find()` | — | `[{ id, title, company }, ...]` |
| Add job | `POST /api/jobs` | `authMiddleware`, `adminMiddleware` | `addJob` | `Job.create({ title, company })` | Body: `{ title, company }` | `{ id, title, company }`, `201` |
| Update job | `PUT /api/jobs/:id` | `authMiddleware`, `adminMiddleware` | `updateJob` | `Job.findByIdAndUpdate(id, { title, company }, { new: true, runValidators: true })` | Params: `id`; Body: `{ title, company }` | `{ id, title, company }`, or `404` if not found |
| Delete job | `DELETE /api/jobs/:id` | `authMiddleware`, `adminMiddleware` | `deleteJob` | `Job.findByIdAndDelete(id)` | Params: `id` | `{ message: "Job deleted successfully" }`, or `404` |

All four handlers wrap their logic in `try/catch` and return `500` with a generic message on unexpected errors.

### Application System

- **Model**: `Application` references `Job` (`job`) and `User` (`user`), both required, plus a `status` field defaulting to `"Applied"`.
- **Apply** (`POST /api/applications/:jobId/apply`, `authMiddleware`): validates `jobId` as a Mongo `ObjectId`, checks for an existing `Application` with the same `job`/`user` pair (`400` if found), then `Application.create({ job: jobId, user: userId })`. The authenticated user's id comes from `req.user.id` (the JWT payload) — never from the request body.
- **My applications** (`GET /api/applications/my-applications`, `authMiddleware`): `Application.find({ user: userId }).populate("job")` — returns the current user's applications with full job details attached.
- **Applicants for a job** (`GET /api/applications/:jobId/applications`, `authMiddleware` + inline admin check): `Application.find({ job: jobId }).populate("user", "name email")` — returns everyone who applied, with only the applicant's name and email populated (password is never selected).
- There is no application **update** or **delete** endpoint — `status` is set once at creation and never changed by any route.

---

## Frontend Implementation

| File | Responsibility |
|---|---|
| `main.tsx` | Creates the React root and renders `<App />` inside `<StrictMode>`. |
| `App.tsx` | Owns all top-level state: the JWT (`useState`, initialized from `localStorage`), decoded `role`, the job list, the current user's applications, the admin's currently-viewed applicant list, and which view is showing. Contains all `useEffect` data-loading hooks and all the handler functions (`handleAddJob`, `handleDeleteJob`, `handleUpdateJob`, `handleApplyJob`, `handleViewApplications`, `handleLogin`, `handleLogout`) that call into `jobService.ts` and update state from the response. |
| `Login.tsx` | Controlled form (`email`, `password` via `useState`) that `POST`s to `/users/login` with Axios, stores the returned token in `localStorage`, and calls `onLogin(token)` to notify `App.tsx`. Shows an error message on failure. |
| `Register.tsx` | Controlled form (`name`, `email`, `password`) that `POST`s to `/users/register`, shows a success or error message, and clears the fields on success. |
| `JobForm.tsx` (admin) | Controlled form for `title`/`company`. On submit, builds a `Job` object (including a client-generated `crypto.randomUUID()` as a placeholder id — this id is discarded once the real backend-generated `id` comes back in the API response) and calls the `onAddJob` prop passed down from `App.tsx`. |
| `JobList.tsx` | Pure presentational component: maps `jobs` to a `JobCard` per job, passing through all the action callbacks and the current `role`. |
| `JobCard.tsx` | Displays one job. Holds local `isEditing`/`title`/`company` state for inline editing. Shows an **Apply** button when `role === "user"`, and **Edit / Delete / View Applications** buttons when `role === "admin"`. |
| `MyApplications.tsx` | Renders the current user's applications, filtering out any whose `job` is `null` (i.e. the job was later deleted by an admin). |
| `AdminApplications.tsx` | Renders the applicant list (`name`, `email`) for whichever job the admin is currently viewing. |
| `jobService.ts` | Centralizes every Axios call: `addJob`, `getJobs`, `updateJob`, `deleteJob`, `applyForJob`, `getMyApplications`, `getApplicationsForJob`. Each protected call reads the JWT (either from `localStorage` directly, or as a passed-in `token` argument) and sends it as `Authorization: Bearer <token>`. |
| `types.ts` | Shared TypeScript interfaces: `Job` (`id`, `title`, `company`), `Application` (for the user's own view — `job` is a full `Job` object), `JobApplication` (for the admin's view — `user` is `{ name, email }`). |

### Behavior notes

- **Unauthenticated** users see a Login/Register toggle (`showRegister` state).
- **Authenticated** users see a header, and:
  - **Admins**: the job-post form (`JobForm`), plus Edit/Delete/View Applicants on each job card.
  - **Regular users**: an Apply button on each job card, plus a "My Applications" nav button.
- The JWT lives in `localStorage` (persists across tabs/sessions). `sessionStorage` separately persists *which view is open* (`showApplications`, `adminApplicationsJobId`) so a page refresh doesn't reset the current screen.
- Applying to a job immediately re-fetches "my applications" (`getMyApplications`) so the new application appears without a manual refresh.
- Role is decoded from the JWT on mount and on login via `jwt-decode`; there's no separate `/me` endpoint.
- Errors from Axios calls are caught, logged to the console, and surfaced to the user via a single `error` state string rendered in the UI.
- On job-application/view-application failures, `App.tsx` further branches on `error.response?.status` (`401` → "session expired", `403` → "no permission") to show a more specific message.
- Vite's dev server proxies `/api/*` and `/users/*` to `http://localhost:3000`, so the frontend can call relative paths without hitting CORS during development.

---

## Database Design

- **MongoDB** is used as the datastore, accessed exclusively through **Mongoose** ODM.
- **Connection**: `config/db.js` calls `mongoose.connect(process.env.MONGO_URI)` once, at server startup, before `app.listen()` runs.
- **Environment variable**: `MONGO_URI`.

### Models

**User**
```
name:     String, required
email:    String, required, unique
password: String, required (bcrypt hash, cost factor 10)
role:     String, default "user"
timestamps: true
```

**Job**
```
title:   String, required
company: String, required
timestamps: true
```

**Application**
```
job:    ObjectId → ref "Job", required
user:   ObjectId → ref "User", required
status: String, default "Applied"
timestamps: true
```

### Mongoose methods used in the project

`find()`, `findOne()`, `findById()`, `create()`, `findByIdAndUpdate()`, `findByIdAndDelete()`, `populate()`, `.select("-password")`, `.skip()` / `.limit()` (for user pagination), plus `mongoose.Types.ObjectId.isValid()` for input validation before database calls.

---

## API Documentation

### `/users`

| Method | Endpoint | Auth | Admin | Purpose | Request Body/Params | Response |
|---|---|---|---|---|---|---|
| POST | `/users/register` | No | No | Create a new account (role defaults to `user`) | Body: `{ name, email, password }` | `201` `{ success, message, user: { id, name, email, role } }` |
| POST | `/users/login` | No | No | Authenticate and receive a JWT | Body: `{ email, password }` | `200` `{ success, message, token }` |
| GET | `/users/` | Yes | Yes | List users, first 10, passwords excluded | — | `200` `{ success, users: [...] }` |
| PUT | `/users/:id` | Yes | Owner or Admin | Update name/email/password | Params: `id`; Body: any of `{ name, email, password }` | `200` `{ success, message, user }` |
| PUT | `/users/promote/:id` | Yes | Yes | Promote a user to `admin` | Params: `id` | `200` `{ success, message, user }` |
| DELETE | `/users/:id` | Yes | Owner or Admin | Delete a user account | Params: `id` | `200` `{ success, message }` |

### `/api/jobs`

| Method | Endpoint | Auth | Admin | Purpose | Request Body/Params | Response |
|---|---|---|---|---|---|---|
| GET | `/api/jobs` | No | No | List all job postings | — | `200` `[{ id, title, company }]` |
| POST | `/api/jobs` | Yes | Yes | Create a job posting | Body: `{ title, company }` | `201` `{ id, title, company }` |
| PUT | `/api/jobs/:id` | Yes | Yes | Edit a job posting | Params: `id`; Body: `{ title, company }` | `200` `{ id, title, company }`, or `404` |
| DELETE | `/api/jobs/:id` | Yes | Yes | Delete a job posting | Params: `id` | `200` `{ message }`, or `404` |

### `/api/applications`

| Method | Endpoint | Auth | Admin | Purpose | Request Body/Params | Response |
|---|---|---|---|---|---|---|
| POST | `/api/applications/:jobId/apply` | Yes | No | Apply to a job (blocks duplicates) | Params: `jobId` | `201` `{ success, message, application }`, or `400` if already applied |
| GET | `/api/applications/my-applications` | Yes | No | List the current user's applications, with job populated | — | `200` `{ success, applications }` |
| GET | `/api/applications/:jobId/applications` | Yes | Yes | List applicants for a job, with `name`/`email` populated | Params: `jobId` | `200` `{ success, applications }` |

---

## Environment Variables

Set these in a `.env` file inside `Backend/` (this file is listed in `.gitignore` and must never be committed):

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string used by `config/db.js` |
| `JWT_SECRET` | Secret key used to sign and verify JWTs |

Example `.env`:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm
- A running MongoDB instance (local or Atlas)

### Backend Setup

```bash
cd Backend
npm install
```

Create `Backend/.env` as shown in [Environment Variables](#environment-variables).

### Frontend Setup

```bash
cd Frontend
npm install
```

---

## Running the Project

**Start the backend:**
```bash
cd Backend
npm start
```
Runs on `http://localhost:<PORT>` (e.g. `http://localhost:3000`).

**Start the frontend dev server:**
```bash
cd Frontend
npm run dev
```
Runs at the Vite dev URL (default `http://localhost:5173`), with `/api/*` and `/users/*` requests proxied to the backend automatically — no CORS setup needed in development.

**Build the frontend for production:**
```bash
cd Frontend
npm run build
```

---

## How the Application Works

1. A new user registers (`Register.tsx` → `POST /users/register`) or logs in (`Login.tsx` → `POST /users/login`).
2. On login, the JWT is stored in `localStorage` and decoded client-side to read the role.
3. `App.tsx` fetches the job list (`GET /api/jobs`) once a token is present.
4. **Users** see an Apply button per job; applying calls `POST /api/applications/:jobId/apply` and refreshes "My Applications".
5. **Admins** see a job-creation form and Edit/Delete/View Applicants controls; each action calls the corresponding `/api/jobs` or `/api/applications` endpoint.
6. Every protected request sends the stored JWT as `Authorization: Bearer <token>`; the backend verifies it (`authMiddleware`) and, where required, checks the role (`adminMiddleware` or an ownership check in the controller) before touching the database.

---

## Error Handling

- Every controller function wraps its database logic in `try/catch` and returns a JSON error body with an appropriate HTTP status on failure (`400`, `401`, `403`, `404`, or `500`).
- `authMiddleware` distinguishes three failure modes: missing token (`401 "Token Missing"`), expired token (`401 "Token Expired"`, detected via `error.name === "TokenExpiredError"`), and any other invalid/malformed token (`401 "Invalid Token"`).
- `adminMiddleware` and the inline admin check in `applicationRoutes.js` return `403` when the authenticated user's role isn't `admin`.
- Invalid MongoDB ObjectIds (in `updateUser`, `deleteUser`, `applyForJob`, `getApplicationsForJob`) are validated with `mongoose.Types.ObjectId.isValid()` and rejected with `400` before any database call, avoiding an unhandled Mongoose `CastError`.
- Unexpected server/database errors are logged with `console.error(...)` on the backend and returned to the client as a generic `500 "Internal Server Error"`, so internal details are never leaked in the response.
- On the frontend, every Axios call site catches errors, logs them to the console, and sets a single `error` string in state that's rendered to the user; on job-application/view-application failures, `App.tsx` further branches on `error.response?.status` (`401` → "session expired", `403` → "no permission") to show a more specific message.

---

## Security Considerations

Implemented:
- Passwords are hashed with `bcrypt` (cost factor 10) before storage — never stored or returned in plaintext.
- JWTs are signed with a secret read from `process.env.JWT_SECRET`, never hard-coded.
- JWTs expire after 2 hours (`expiresIn: "2h"`).
- Protected routes require a valid `Authorization: Bearer <token>` header, verified server-side.
- Admin-only routes are additionally gated by role checks (`adminMiddleware` or an inline equivalent).
- Ownership checks in `usercontroller.js` prevent a non-admin user from modifying or deleting another user's account.
- Password fields are explicitly excluded from user-listing and populate responses via `.select("-password")`.
- `.env` (containing `MONGO_URI` and `JWT_SECRET`) is listed in `.gitignore` and excluded from version control.

Not implemented (see [Future Improvements](#future-improvements)):
- Rate limiting, brute-force protection, CSRF protection, refresh tokens, or advanced input validation beyond basic presence checks.

---

## Known Issues / Learning Notes

- **Route ↔ controller filename casing mismatch:** `routes/userRoutes.js` imports `../controllers/userController` (capital "C"), but the actual file is `controllers/usercontroller.js` (lowercase "c"). Similarly, `routes/jobroutes.js` imports `../controllers/jobcontroller` (lowercase "c"), but the actual file is `controllers/jobController.js` (capital "C"). This resolves fine on case-insensitive filesystems (Windows/macOS default) but **throws `MODULE_NOT_FOUND` on case-sensitive filesystems** (Linux, most CI/CD and hosting platforms). Fix: rename the files or correct the import paths so they match exactly.
- **`Job` model is intentionally minimal** — only `title` and `company`. Fields seen in the unused `Frontend/job.ts` practice file (`location`, `description`, `status`, `salary`) were never carried over into the real schema.
- **User pagination is hardcoded** to the first 10 results (`.skip(0).limit(10)`) with no query parameters yet to move to the next page.
- **No refresh-token flow** — once the 2-hour JWT expires, the user must log in again.
- **No application status updates from the UI** — `status` defaults to `"Applied"` and is never changed by any current route.

---

## Learning Objectives

This project was built to understand, hands-on:

- MERN-stack architecture and how the pieces communicate
- Designing REST APIs with Express (routers, controllers, middleware)
- Middleware chaining and execution order
- JWT-based authentication (signing, verifying, expiry)
- Role-based/admin authorization
- MongoDB schema design with Mongoose, including references and `populate()`
- React function components, hooks (`useState`, `useEffect`), and props-based data flow
- Connecting a TypeScript React frontend to a Node/Express backend via Axios
- Basic CRUD operations end-to-end, frontend to database and back

## Future Improvements

These are **not implemented** — listed only as possible next steps:

- Add `location`, `description`, and `salary` to the `Job` model and surface them in the UI
- Add real pagination controls (page/limit query params) for job and user listings
- Add search/filtering for job listings
- Add application status updates (e.g. admin marking an application "Reviewed" / "Rejected")
- Add password reset and email notifications
- Fix the route/controller filename casing mismatch (see [Known Issues](#known-issues--learning-notes))
- Add form-level validation feedback (most errors currently surface as a single generic string)
- Add automated tests (`npm test` is currently a placeholder in `Backend/package.json`)
- Harden for production deployment (rate limiting, refresh tokens, stricter input validation, CORS configuration for a real deployed frontend origin)

## Disclaimer

This is a **learning/practice project** built to understand MERN-stack fundamentals. It is **not** production-ready, has not undergone a security audit, and should not be deployed as-is with real user data.

## Author

**Sakthivel**
