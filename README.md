# Meridian LMS

A frontend-only learning management system demo: a Coursera-inspired course marketplace, a learner app with an interactive course player, and an admin console. It runs entirely in the browser with React, Vite and Tailwind CSS. All data is fictional seed data persisted to LocalStorage.

> **Demo only.** There is no backend, database, real authentication, payments or email. Courses, providers, instructors, learners, reviews and metrics are fictional and illustrative.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run lint     # ESLint (flat config, React Hooks + React Refresh rules)
```

Requires Node 20+.

## Demo accounts

| Role    | Email                       | Password      |
|---------|-----------------------------|---------------|
| Admin   | `admin@meridianlms.demo`    | `Admin123!`   |
| Learner | `learner@meridianlms.demo`  | `Learner123!` |

The sign-in page has a role selector and quick-fill buttons. "Join for Free" creates an additional **local** demo learner profile. Its password is stored unencrypted in LocalStorage, so do not reuse a real password. "Forgot password" explains that no email is sent.

## What's included

**Meridian (MEQMP) training catalogue**: the catalogue contains only the 26 trainings published at [meqmp.com](https://meqmp.com/trainings/). It is organised into five tracks that mirror the reference site: *Internal Auditor*, *Lead Auditor*, *Leadership & Management*, *Safety & Environment* and *Exam Preparation*.
- **ISO auditor courses:** ISO 9001, 14001, 45001, 27001, 50001 and 41001 at both Internal Auditor and Lead Auditor level, plus ISO 22000 Internal Auditor and ISO 31000 Lead Auditor. All are generated from one ISO 19011-based curriculum template in `src/data/meqmpCourses.js`.
- **Leadership and management:** Lean Six Sigma Green Belt and Black Belt, ARAMCO Schedule Q, Business Continuity Management (ISO 22301), Train the Trainer and 5S.
- **Safety and exam preparation:** OSHA, Fire Safety & Fire Fighting, First Aid/CPR/AED and Defensive Driving, plus PMP® and PMI-RMP® exam preparation.
- **Learning content:** 4 quizzes, 10 assignments, 6 career paths and 6 fictional trainers.

Company facts are taken from the reference site and collected in `src/data/companyInfo.js`: founded 2005, services, certifications, industries, offices, phone and email. The wording is original and was not copied verbatim. Testimonials, trainers, learners, ratings and learner counts are fictional. Course outlines were written for this demo, and the app issues no accreditation or certification. You can replace any homepage text in **Admin → Homepage content**.

**MEQMP pages**: *Services* (advisory, training, compliance, sustainability and wellbeing services, a four-step process, standards and industries) and *Verify certificate* (looks up a Meridian certificate reference and links to the official MEQMP verification page).

**Sign-in experience**: a redesigned sign-in and registration screen. It has an animated brand panel with rotating highlights and a sliding learner/admin switch that fills in the demo credentials. Fields have icons, a password reveal and animated inline errors, and the form shakes when sign-in fails. Registration adds a live password-strength meter. Signing in, registering and signing out each play a full-screen branded transition (`src/components/auth/AuthTransitionOverlay.jsx`).

**Confirmations and notifications**: a custom confirmation dialog (`ConfirmContext`) with *danger*, *warning*, *logout* and *success* tones. It is used when signing out and for admin deletes of courses, modules and lessons, quizzes, reviews, discussion threads and replies, and announcements. Categories and trainers use a dedicated delete dialog that also handles reassigning their courses. Results show as glass toasts with a countdown bar and an exit animation.

**Meri, the site assistant**: a floating chatbot (bottom right) that answers questions about courses, ISO/HSE training, career paths, enrolment, pricing, certificates, progress, demo accounts, privacy, the company and contact details. It searches the live catalogue and links to matching courses. It is **rule-based** (`src/components/chat/knowledgeBase.js`), with no AI model or server, and the conversation is kept in `sessionStorage`.

**Motion and polish**: scroll-reveal animations, animated counters, marquees, page-enter transitions, card hover effects (lift, gradient glow border, image zoom, slide-in actions), a scroll-aware navbar with a top info bar and an animated Explore mega-menu, a redesigned footer (call-to-action band, newsletter demo, locations, ticker), and a back-to-top button with a scroll-progress ring. All motion respects `prefers-reduced-motion` and the in-app *Reduce motion* setting.

**Public site**: home (hero, categories, featured courses, career paths, trending and recently added carousels, programs, instructors, testimonials, FAQ), course catalogue (search, seven filter groups, active filter chips, six sort orders, grid/list views, pagination, mobile filter drawer, all synced to the URL), course detail (curriculum with previews, reviews, related courses, enrolment panel), instructors, career paths with a roadmap and completion checklist, learning programs, Services, For Business, About, Contact, Verify certificate, Help, Terms, Privacy, shareable certificate page and a 404 page.

**Learner app** (`/learn/*`): dashboard (gradient welcome banner with streak, animated stat counters, continue learning, weekly activity chart, goal ring, deadlines, achievements, notifications, recommendations, new-learner empty state), My Learning (In Progress / Completed / Not Started / Archived with search, filter and sort), Saved courses, Learning paths progress, Certificates (preview, print/save as PDF, share link), Achievements, Notifications (read/unread, dismiss, clear), Profile (avatar upload preview, interests, language, weekly goal) and Settings (notification preferences, reduced motion, reset demo data).

**Course player** (`/learn/course/:courseId/:lessonId`): a custom HTML5 video player (play/pause, seek, volume, speed, captions, fullscreen, keyboard shortcuts, error state), article and reading renderers, quizzes (navigator grid, optional client-side timer, submit confirmation, scoring, explanations, retakes, attempt history), assignments (validation, simulated attachments, grade and feedback, resubmission), generated downloadable resources, notes, bookmarks, a simulated discussion board, module and course progress, resume-last-lesson and a completion state.

**Admin console** (`/admin/*`): dashboard (gradient overview banner, animated KPIs and charts), course management (search, filters, sort, pagination, duplicate, publish/unpublish, archive, delete with cascade), a multi-section course editor with a curriculum builder (modules and lessons with reordering, validation, draft/publish, preview, unsaved-change warning), categories (icons, order, homepage feature, delete with reassignment), instructors, learners plus learner detail, enrollments, quizzes (question editor, pass threshold, timer), assignments and submission grading, review moderation, discussion moderation, announcements (audience, scheduling metadata, preview, in-app delivery), analytics (date, category and course filters), homepage content, platform settings (name, brand colours applied live, page sizes) and activity logs.

## Architecture

```
src/
  components/   common (Modal, DataTable, Tabs, Dropdown, Pagination, Markdown…), layout, navigation,
                courses, learning (VideoPlayer, QuizRunner, AssignmentPanel…), forms, charts
  context/      DataContext (all collections + actions), AuthContext, ToastContext, ConfirmContext
  data/         centralized seed data (courses, categories, instructors, users, quizzes, assignments,
                career paths, homepage content) and seed.js which assembles the full dataset
  hooks/        useDocumentTitle, useTableState, useShareCertificate, utilities
  layouts/      PublicLayout, AuthLayout, LearnerLayout, AdminLayout
  pages/        public, auth, learner, admin, errors (each page is lazy-loaded)
  routes/       AppRoutes, guards (RequireRole / GuestOnly)
  services/     storage (namespaced LocalStorage), mockAuthService
  utils/        query (search/filter/sort/paginate), learning (progress, stats, certificates),
                analytics, format, ids
```

- **Single source of truth**: `DataContext` holds every collection and exposes domain actions such as `enroll`, `setLessonComplete`, `recordQuizAttempt`, `createCourse` and `deleteCourse`. Records reference each other by stable IDs.
- **Derived values**: course progress, completion status, certificates, streaks, achievements and analytics are all *computed* from enrolments and activity records, never stored separately. Progress is clamped to 100% and counts only required lessons (resource lessons are optional).
- **Seeding** is deterministic (seeded PRNG) and runs once. Dates are relative to the first run and then persisted, so nothing is regenerated on render.

### Brand

Colours are Tailwind v4 theme tokens in `src/styles/globals.css` (`--color-primary #2C5F6F`, `--color-deep #093F50`, `--color-info #429BB7`, `--color-accent #F78D00`, …). Admin Settings can override the primary and accent colours at runtime.

**Logo:** the official Meridian Quality Management Professionals logo is in `src/assets/logos/`. There are three transparent PNGs made from the supplied artwork: full colour (`meridian-logo.png`), a white-text variant for dark backgrounds (`meridian-logo-light.png`) and the globe mark (`meridian-mark.png`, also used for `public/favicon.png`). `BrandLogo` keeps each image's natural aspect ratio.

Chart colours (`src/components/charts/chartTheme.js`) use a fixed categorical order that was validated for colour-vision-deficiency separation and 3:1 contrast. Every chart card has an accessible table view.

## LocalStorage keys and reset

All keys are namespaced under `meridian.v1`:

| Key | Contents |
|-----|----------|
| `meridian.v1.meta` | `{ version, seededAt }` — schema version and seed timestamp |
| `meridian.v1.session` | Demo session `{ userId, role, remember }`. Uses `localStorage` with "Remember me", otherwise `sessionStorage` |
| `meridian.v1.ui` | Per-device UI prefs (admin sidebar collapsed, reduced motion) |
| `meridian.v1.data.<collection>` | One key per collection: `courses`, `categories`, `instructors`, `users`, `careerPaths`, `quizzes`, `assignments`, `enrollments`, `quizAttempts`, `submissions`, `reviews`, `announcements`, `notifications`, `discussions`, `activityLogs`, `learningActivity`, `saved`, `notes`, `bookmarks`, `settings`, `content` |

Behaviour:

- On first load (or when `DATA_VERSION` changes; it is currently `5`, bumped when the catalogue was limited to MEQMP trainings) every collection is seeded. After that, stored data is always read first and **never overwritten by seed data** on reload.
- Each collection is validated when read. A missing or corrupt collection falls back to its seed on its own, without touching the others.
- Only collections that changed are written back. Changes made in another tab are synced through the `storage` event.
- **Reset demo data** (learner Settings or admin Platform settings) asks for confirmation, then restores every collection from seed. The current session is kept.
- **Sign out** clears only the session. Learning progress stays in the browser.

## Frontend-only limitations

- Route guards (`RequireRole`) are a UX convenience, **not a security boundary**. Any user can edit LocalStorage. A real product must enforce access on a server.
- Passwords are compared in plain text in the browser; there is no hashing, token or server session.
- LocalStorage is per-browser, unencrypted and size-limited (about 5 MB). Data doesn't sync across devices, and clearing site data resets everything.
- Quiz timers run client-side and can be bypassed. Assignment attachments record only file names; nothing is uploaded.
- Announcements, contact and business forms, and password reset never send email. "Scheduled" announcements are metadata only.
- Certificates are demo documents and are not verifiable credentials. Shared certificate links only resolve in the browser that holds the data.
- Ratings, review counts, learner counts and instructor statistics are illustrative. Admin metrics are computed from the local sample records.
- Media: thumbnails and portraits load from the Unsplash CDN, and video lessons use a short CC0 sample clip from MDN, so an internet connection is needed. Broken images fall back to branded artwork, and the player shows an explicit "video unavailable" state.
- Real-time features (discussion updates, notifications) are simulated locally.

## Deployment

`npm run build` outputs a static SPA in `dist/`. SPA fallbacks are included for Netlify (`public/_redirects`) and Vercel (`vercel.json`). For other hosts, rewrite unknown paths to `/index.html`.
