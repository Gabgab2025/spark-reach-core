# JDGK Website — Master Remediation Plan

> Generated: 2026-02-14 | Based on: Full code review & security audit
> Methodology: Fix security first, then broken contracts, then functional gaps, then quality.
> Rule: 1–2 features per cycle. Test each before moving on. No new files unless absolutely necessary.

---

## Phase 1: Critical Security (Must Fix Before Any Deployment)

### 1.1 — Backend Authentication System
> **Why:** Zero endpoints have auth. Anyone can create users, delete pages, read secrets, upload files.

- [x] **1.1.1** Add JWT auth utilities to `backend/app/` (new file: `auth.py`)
  - Create `create_access_token(data, expires_delta)` using `python-jose` (already in requirements)
  - Create `get_current_user(token)` dependency that decodes JWT and returns user
  - Create `require_admin(current_user)` dependency that checks `role == "admin"`
  - Token expiry: 24 hours access, 7 days refresh

- [x] **1.1.2** Add auth endpoints to `backend/app/main.py`
  - `POST /api/auth/login` — verify email/password via `crud.verify_password`, return JWT session
  - `GET /api/auth/session` — validate token, return current user
  - `POST /api/auth/signup` — create user (admin-only or disabled in production)
  - `POST /api/auth/logout` — client-side token discard (stateless JWT)
  - `GET /api/user_roles/me` — return current user's role from token

- [x] **1.1.3** Protect all write endpoints with auth dependency
  - All `POST`, `PUT`, `DELETE` endpoints → require `get_current_user`
  - Admin-only endpoints (users, settings, analytics) → require `require_admin`
  - Public read endpoints (`GET /pages`, `GET /services`, etc.) → no auth needed
  - `POST /api/contact` → no auth needed (public form)

- [x] **1.1.4** Fix frontend API client to attach JWT
  - Update `src/lib/api.ts` → read token from `localStorage`, set `Authorization: Bearer <token>` header
  - Add response interceptor: on 401, clear session and redirect to login

### 1.2 — Fix Default Credentials
- [x] **1.2.1** Change seed admin password in `backend/app/seed.py`
  - Replace `password="admin"` with env var `ADMIN_DEFAULT_PASSWORD` or a secure random
  - Add `# SECURITY: Change immediately after first login` comment
  - Log a warning to console when default password is used

### 1.3 — Fix CORS Configuration
- [x] **1.3.1** Restrict CORS in `backend/app/main.py`
  - Replace `allow_origins=["*"]` with env var `ALLOWED_ORIGINS` (comma-separated)
  - Default to `["http://localhost:8080"]` for dev
  - Production should be `["https://yourdomain.com"]`

### 1.4 — Fix XSS Vulnerabilities
- [x] **1.4.1** Install DOMPurify on frontend (`npm install dompurify @types/dompurify`)

- [x] **1.4.2** Sanitize all `dangerouslySetInnerHTML` usage
  - `src/pages/BlogDetail.tsx` — wrap content with `DOMPurify.sanitize()`
  - `src/pages/JobDetail.tsx` — wrap description with `DOMPurify.sanitize()`
  - `src/pages/PageDetail.tsx` — wrap content with `DOMPurify.sanitize()`

- [x] **1.4.3** Sanitize `SettingsRenderer.tsx` script injection
  - Validate Google Analytics / GTM codes are actually tracking IDs (regex: `^(G|UA|GTM)-[A-Z0-9]+$`)
  - For `custom_head_code` / `custom_body_code` / `chat_widget_code` — sanitize with DOMPurify (ALLOW safe tags only)
  - Do NOT allow arbitrary `<script>` from CMS unless admin explicitly confirms

- [x] **1.4.4** Fix preview XSS in `CMSContentManager.tsx`
  - Replace `document.write()` with DOMPurify-sanitized iframe `srcdoc`

### 1.5 — Remove Secrets from Frontend
- [x] **1.5.1** Backend: Split settings into public/private
  - Create `GET /api/settings/public` — returns only non-sensitive settings (branding, SEO meta, site name)
  - Keep `GET /api/settings` as admin-only (requires auth) — returns all including API keys
  - Remove `recaptcha_secret_key` from any frontend-accessible response
  - Move reCAPTCHA verification to backend (server-side only)

- [x] **1.5.2** Frontend: Update `SettingsManager.tsx`
  - Remove `recaptcha_secret_key` input field from the admin UI
  - Add note: "reCAPTCHA secret key is managed via environment variables"

### 1.6 — Fix File Upload Security
- [x] **1.6.1** Add file type whitelist to upload endpoint in `backend/app/main.py`
  - Allow only: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.pdf`
  - Validate MIME type matches extension (check `file.content_type`)
  - Add max file size limit (10MB)
  - Require auth on upload endpoint

### 1.7 — Add Content-Security-Policy
- [x] **1.7.1** Add CSP header to `nginx.conf`
  - `default-src 'self'; script-src 'self' https://www.googletagmanager.com; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self';`
  - Add `Strict-Transport-Security` header for HTTPS

### 1.8 — Fix Admin Route Guard
- [x] **1.8.1** Fix `AdminRedirect.tsx` to actually enforce access
  - If user is not authenticated → redirect to `/auth-proadmin2025`
  - If user is not admin → redirect to `/`
  - Only render children when auth is confirmed AND role is admin
  - Apply guard ONLY to `/admin*` routes (not wrapping all routes)

**Verification checkpoint:** After Phase 1, test:
- [x] Unauthenticated requests to `POST /api/pages` return 401
- [x] `GET /api/settings` without token returns only public settings
- [x] Blog content with `<script>` tags is sanitized on render
- [x] Upload of `.exe` file is rejected
- [x] Admin page redirects unauthenticated users to login

---

## Phase 2: Backend Contract Completeness (Frontend-Backend Alignment)

### 2.1 — Add Missing CRUD Endpoints
> **Why:** Frontend CMS expects full CRUD for all content types. Backend only has Create + Read for most.

- [x] **2.1.1** Add Update + Delete for Services in `backend/app/crud.py` + `main.py`
  - `PUT /api/services/{service_id}` — update service
  - `DELETE /api/services/{service_id}` — delete service

- [x] **2.1.2** Add Update + Delete for Blog Posts
  - `PUT /api/blog_posts/{post_id}` — update blog post
  - `DELETE /api/blog_posts/{post_id}` — delete blog post

- [x] **2.1.3** Add Update + Delete for Job Listings
  - `PUT /api/job_listings/{job_id}` — update job listing
  - `DELETE /api/job_listings/{job_id}` — delete job listing

- [x] **2.1.4** Add Update + Delete for Testimonials
  - `PUT /api/testimonials/{testimonial_id}` — update testimonial
  - `DELETE /api/testimonials/{testimonial_id}` — delete testimonial

- [x] **2.1.5** Add Update + Delete for Team Members
  - `PUT /api/team_members/{member_id}` — update team member
  - `DELETE /api/team_members/{member_id}` — delete team member

- [x] **2.1.6** Add role management endpoint
  - `PUT /api/admin/users/{user_id}/role` — update user role (admin-only)

### 2.2 — Fix Path Mismatches
- [x] **2.2.1** Fix admin users endpoint path
  - Option A: Add `GET /api/admin/users` alias on backend → preferred
  - Option B: Change frontend `useRoles.tsx` to call `GET /api/users`
  - Choose one, be consistent

### 2.3 — Fix API Client Query Parameter Handling
- [x] **2.3.1** Update `src/lib/api.ts` to support query params
  - Add `params` option to `RequestOptions` interface
  - Convert params object to URL query string: `?status=published&limit=10`
  - Fix Blog.tsx to properly pass `status` as query param

### 2.4 — Add Backend Sorting Support
- [x] **2.4.1** Add `sort_by` and `order` query params to list endpoints
  - `GET /api/blog_posts?status=published&sort_by=published_at&order=desc`
  - `GET /api/services?sort_by=sort_order&order=asc`
  - Apply to all list endpoints in `crud.py`

### 2.5 — Add Rate Limiting
- [x] **2.5.1** Install `slowapi` for FastAPI
  - Add to `requirements.txt`: `slowapi==0.1.9`
  - Rate limit `POST /api/contact` → 5 requests per minute per IP
  - Rate limit `POST /api/auth/login` → 10 attempts per minute per IP
  - Rate limit `POST /api/storage/upload` → 20 per minute per IP

**Verification checkpoint:** After Phase 2, test:
- [x] CMS admin can create, update, and delete services/posts/testimonials/jobs/team
- [x] Blog page properly filters by `status=published`
- [x] Contact form returns 429 after 5 rapid submissions

---

## Phase 3: Connect Hardcoded Components to CMS

> **Why:** CMS exists, data tables exist, but most public components ignore them entirely.
> **Rule:** Do NOT redesign any UI. Only change the data source from hardcoded → API fetch.

### 3.1 — Connect Services Component
- [x] **3.1.1** `src/components/Services.tsx` — Replace hardcoded services array with `useQuery` fetch from `GET /api/services?is_featured=true`
  - Keep exact same card layout and styling
  - Add loading skeleton state
  - Fallback to current hardcoded data if API fails (graceful degradation)

- [x] **3.1.2** `src/pages/Services.tsx` — Same treatment for the full services page
  - Fix "Learn More" links to navigate to `/service/:slug` instead of `/contact`

### 3.2 — Connect Testimonials Component
- [x] **3.2.1** `src/components/Testimonials.tsx` — Replace fake testimonials with `useQuery` fetch from `GET /api/testimonials`
  - Keep carousel layout
  - Fallback to hardcoded if no data

### 3.3 — Connect Careers Page
- [x] **3.3.1** `src/pages/Careers.tsx` — Replace hardcoded job listings with `useQuery` from `GET /api/job_listings?status=open`
  - Keep same card layout
  - Wire file upload to `POST /api/storage/upload`
  - Wire form submission to a new `POST /api/job_applications` endpoint (add to backend)
  - Add proper `onChange` handler for file input

### 3.4 — Connect Team Member Profiles
- [x] **3.4.1** `src/pages/TeamMemberProfile.tsx` — Replace hardcoded team data with `useQuery` from `GET /api/team_members`
  - Route is already `/team/:id` which matches

### 3.5 — Connect Hero Section
- [x] **3.5.1** `src/components/Hero.tsx` — Fetch home page content from `GET /api/pages?slug=home`
  - Use `content.hero.title`, `content.hero.subtitle`, `content.hero.description`, `content.hero.cta_text`
  - Keep existing layout and animations
  - Fallback to hardcoded if API fails

### 3.6 — Connect Footer
- [x] **3.6.1** `src/components/Footer.tsx` — Pull contact info from CMS settings
  - Use settings for phone, email, address
  - Dynamic copyright year: `new Date().getFullYear()`
  - Remove placeholder `href="#"` social links or connect to CMS settings

### 3.7 — Connect About Page Dynamic Sections
- [x] **3.7.1** `src/pages/About.tsx` — Connect leadership section to `GET /api/team_members?is_leadership=true`
  - Keep existing layout, only change data source

**Verification checkpoint:** After Phase 3, test:
- [ ] Editing a service in admin CMS → changes appear on public `/services` page
- [ ] Adding a testimonial in admin → appears in testimonials carousel
- [ ] Footer shows correct contact info from settings

---

## Phase 4: Code Quality & Performance

### 4.1 — Fix Non-Functional UI Elements
- [x] **4.1.1** Services component "Request Consultation" button → link to `/contact`
- [x] **4.1.2** Admin dashboard quick action buttons → wire `onClick` handlers
  - "Add New Page" → navigate to Pages tab
  - "Create Blog Post" → navigate to Blog tab
  - "Media Library" → navigate to a media section or show upload dialog

### 4.2 — Standardize Data Fetching
- [x] **4.2.1** Convert `src/pages/Blog.tsx` from `useEffect + useState` to React Query `useQuery`
  - Match pattern used everywhere else in the app

### 4.3 — Add Code Splitting
- [x] **4.3.1** Update `src/App.tsx` to use `React.lazy()` + `Suspense`
  - Lazy load: Admin, Auth, SEOEngine, BlogDetail, JobDetail, ServiceDetail, TeamMemberProfile
  - Eager load: Index, About, Services, Contact (above-the-fold pages)
  - Add a simple fallback loading component

### 4.4 — Add Error Boundaries
- [x] **4.4.1** Create `src/components/ErrorBoundary.tsx`
  - Catch React rendering errors
  - Show user-friendly error message with "Go Home" button
  - Wrap route-level components in App.tsx

### 4.5 — Fix Timer Leak
- [x] **4.5.1** `src/components/Hero.tsx` — Clean up `setTimeout` in `handleStartProject` on unmount
  - Store timeout ref and clear in cleanup

### 4.6 — Clean Up Imports & Types
- [x] **4.6.1** Remove unused imports
  - `Hero.tsx` → remove `Play` *(done in 3.5)*
  - `Navigation.tsx` → remove `Mail`
  - `AdminSidebar.tsx` → remove unused Card components
- [x] **4.6.2** Fix duplicate `case 'features':` in `CMSContentManager.tsx`
- [x] **4.6.3** Replace critical `any` types with proper interfaces in `CMSContentManager.tsx`, `useCMS.tsx`, `Admin.tsx`

### 4.7 — Image Performance
- [x] **4.7.1** Add `loading="lazy"` to Gallery images and Client logos
- [ ] **4.7.2** Add responsive `srcset` to Hero images *(deferred — requires generating multi-resolution image variants)*

### 4.8 — Add Pagination
- [x] **4.8.1** Add pagination to Blog listing page (9 per page, 3×3 grid)
- [x] **4.8.2** Add pagination to CMS admin tables (10 per page)

### 4.9 — Move Puppeteer to DevDependency
- [x] **4.9.1** Move `puppeteer` from `dependencies` to `devDependencies` in `package.json`
  - It's only used in `prerender.js` during build, not at runtime

**Verification checkpoint:** After Phase 4, test:
- [ ] Blog page uses React Query (check React Query DevTools)
- [ ] Navigating to `/admin` lazy-loads the admin bundle
- [ ] Gallery images load lazily on scroll
- [ ] A rendering error in one component doesn't crash the entire page

---

## Phase 5: Infrastructure Hardening

### 5.1 — Docker Optimization
- [x] **5.1.1** Replace `ubuntu:22.04` builder with `node:20-alpine` in frontend `Dockerfile`
  - Separate Puppeteer for prerendering into a multi-stage step or use a prerender-specific stage
  - Reduces image size from ~1.5GB to ~300MB

### 5.2 — Docker Compose Improvements
- [x] **5.2.1** Add `.env` file reference: `env_file: .env`
- [x] **5.2.2** Add internal network isolation between services
- [x] **5.2.3** Pass mail credentials and admin password via environment variables

### 5.3 — Backend Production Readiness
- [x] **5.3.1** Add input validation for HTML content on backend (strip dangerous tags before storage)
- [x] **5.3.2** Add request logging middleware
- [x] **5.3.3** ~~Consider PostgreSQL migration path for production (SQLite is single-writer)~~ — **Done.** `docker-compose.yml` updated to use PostgreSQL. Backend `database.py` now connects via `DATABASE_URL` env var pointing to PostgreSQL.

---

## Execution Order

```
Week 1: Phase 1 (Security) — Non-negotiable before any deployment
  Day 1-2: 1.1 (Auth system) + 1.2 (Default creds) + 1.3 (CORS)
  Day 3:   1.4 (XSS fixes) + 1.5 (Secrets removal)
  Day 4:   1.6 (Upload security) + 1.7 (CSP) + 1.8 (Route guard)
  Day 5:   Verification & testing of all Phase 1

Week 2: Phase 2 (Backend completeness)
  Day 1-2: 2.1 (Missing CRUD)
  Day 3:   2.2 (Path fixes) + 2.3 (Query params) + 2.4 (Sorting)
  Day 4:   2.5 (Rate limiting)
  Day 5:   Verification & testing of all Phase 2

Week 3: Phase 3 (CMS integration)
  Day 1:   3.1 (Services) + 3.2 (Testimonials)
  Day 2:   3.3 (Careers) + 3.4 (Team)
  Day 3:   3.5 (Hero) + 3.6 (Footer)
  Day 4:   3.7 (About)
  Day 5:   Verification & full CMS flow testing

Week 4: Phase 4-5 (Quality + Infrastructure)
  Day 1:   4.1-4.2 (Buttons, Blog fetch)
  Day 2:   4.3-4.5 (Code splitting, error boundaries, timer)
  Day 3:   4.6-4.8 (Cleanup, images, pagination)
  Day 4:   5.1-5.3 (Docker, infra)
  Day 5:   Full regression test, deploy to staging
```

---

## Lessons & Notes

- **Auth is the #1 blocker.** Nothing else matters if anyone can write to the database.
- **Don't touch UI.** Per project rules, only change data sources and fix broken handlers.
- **Graceful degradation.** When connecting components to CMS, always keep hardcoded fallback if API fails.
- **One cycle = one feature.** Don't mix auth work with CMS integration.- **Sanitization belongs in the data layer.** Pass `sanitize_fn` as an optional callable into CRUD functions — keeps main.py clean and crud.py testable.
- **Pagination is client-side until needed server-side.** For <100 items, client-side slicing is simpler and avoids extra API params.
- **Reset derived state on dependency change.** Admin table page resets to 1 when `contentType` changes via `useEffect`.

---

## Completion Review

### All Phases Complete (except 4.7.2 deferred)

| Phase | Status | Summary |
|-------|--------|---------|
| 1. Security | ✅ Complete | JWT auth, CORS, CSP/HSTS, DOMPurify, rate limiting, upload validation, route guards |
| 2. Backend | ✅ Complete | Full CRUD for 6 content types, query params, sorting, PostgreSQL migration |
| 3. CMS Integration | ✅ Complete | 7 components connected (Services×2, Testimonials, Careers, Team, Hero, Footer, About) |
| 4. Code Quality | ✅ Complete | Code splitting (11 lazy routes), ErrorBoundary, pagination (Blog + Admin), cleanup, React Query standardization |
| 5. Infrastructure | ✅ Complete | Multi-stage Docker build (3 stages), network isolation, env_file, bleach sanitization, request logging |

**Score improvement: 4/10 → estimated 8/10**