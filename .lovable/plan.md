# Ozituma coherent platform frontend

## Goal
Evolve the existing Ozituma learning app into one polished student–teacher platform without rebuilding working learning, dictionary, keyboard, Ndebe, account, or staff features.

## What stays
- The existing visual identity, typography, colour tokens, learner shell, lesson flow, Practise separation, keyboard themes, dictionary, account settings, content review workflow, and media-rich teacher cards.
- Existing real data connections remain the source of truth. Fictional teacher content stays visibly labelled and is used only as an owner preview.
- All learner-visible Igbo and Ndebe safeguards remain unchanged.

## Delivery plan

### 1. Design foundation and navigation
- Consolidate repeated controls, status badges, fields, section headers, skeletons, empty states, alerts, dialogs, and responsive page shells into reusable patterns.
- Rework navigation so learner, teacher, and staff destinations remain clear on desktop and mobile without crowding the current eight-item bar.
- Preserve the current app-first home screen; do not replace it with a generic marketing page.

### 2. Student and teacher dashboards
- Make the signed-in learner home prioritize the next lesson, teacher, assignment, progress, and recommended next learning action.
- Replace the teacher sample dashboard’s dense card grid with a focused agenda, students requiring attention, preparation tasks, and backend-supplied earnings summary.
- Keep unavailable data as loading, empty, or integration-pending states rather than invented production values.

### 3. Teacher discovery and profiles
- Refine filters around subject, level, price, rating, experience, teaching style, and backend-provided availability.
- Strengthen the teacher profile with biography, qualifications, levels, languages, reviews, video, and a persistent booking action.
- Keep all current real teacher queries and approval rules intact.

### 4. Booking and calendar
- Build a guided booking flow: lesson type → duration → date → available time → review → payment handoff → confirmation.
- Build distinct teacher and student calendar views with accessible states for available, selected, booked, unavailable, past, current, and pending.
- Consume only DSH-provided availability, booking, cancellation, and payment state.

### 5. Messaging and classroom
- Build responsive conversation list/detail experiences with attachment, sending, sent, failed, unread, and optional typing states.
- Build a provider-independent classroom shell with video stage, compact controls, connection quality, and panels for chat, materials, whiteboard, AI assistance, and lesson information.
- Design mobile classroom behaviour as dedicated panel flows rather than a compressed desktop layout.

### 6. Teaching and learning workflows
- Add quick post-lesson notes and homework authoring for teachers.
- Add learner and teacher assignment views, submissions, due states, and completion summaries.
- Add focused progress views for skills, lessons, learning time, vocabulary, achievements, improvement areas, and upcoming goals using backend-provided metrics.

### 7. Earnings and administration
- Build teacher earnings summary, balances, withdrawals, and transaction history around DSH financial contracts.
- Expand the staff interface with coherent navigation and resource-specific tables, filters, detail views, and confirmations for the backend resources DSH exposes.

### 8. Quality pass
- Add meaningful skeleton, empty, error, success, offline, and unstable-connection states to each major flow.
- Verify keyboard navigation, labels, focus treatment, contrast, touch targets, reduced motion, and screen-reader semantics.
- Validate key student and teacher journeys at desktop, tablet, and mobile widths.

## Technical boundary
- Use the current TanStack file-route and Lovable Cloud architecture; add shareable routes where a screen needs its own URL.
- Do not introduce a second backend, fake production state, client-side permissions, payment calculations, availability rules, earnings logic, or vendor-specific video coupling.
- Record missing DSH capabilities as typed frontend contracts and integration blockers; connect them when the corresponding functions and data are available.
- Remove or quarantine preview-only interactions from production flows as real endpoints become available.

## First implementation milestone
Complete phases 1–4 first: design foundation, navigation, student/teacher dashboards, teacher discovery/profile refinement, and booking/calendar UI. This creates a coherent core journey before messaging and classroom work.