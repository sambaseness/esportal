# 📋 Project Prerequisites: Polytech Portal (PP)

This document outlines the foundational requirements and design specifications for the **Polytech Portal (PP)**, a student-centric academic operating system.

---

## 1️⃣ Problem Definition

### Clear Problem Statement
Students at the **École Supérieure Polytechnique (ESP)**, particularly in the **Département Génie Informatique (DGI)**, struggle with a fragmented academic experience. They must juggle institutional rigidity (fixed timetables, formal announcements) and personal productivity (notes, tasks, focus) across multiple disconnected platforms like WhatsApp, Google Classroom, and physical notebooks.

### For Who?
Specifically designed for ESP-DGI students (e.g., DUT 1 TR) who need a unified interface to manage their academic life.

### Why does it matter?
Fragmented information leads to cognitive overload, missed deadlines, and "context-switching" fatigue. Without a centralized "Single Source of Truth," students spend more time searching for information than actually studying.

### What happens if it’s not solved?
Students continue to rely on chaotic WhatsApp groups for critical announcements, lose track of subject-specific materials, and fail to align their personal schedules with institutional constraints.

---

## 2️⃣ Vision & Goals

### Product Vision
To create a "Personal Academic Operating System" that replaces the browser's default start page, providing instant access to every tool, schedule, and note a student needs, while respecting the hierarchy of institutional requirements.

### Success Metrics
- **Time Saved**: Reduction in time spent navigating to academic platforms (Huawei, OpenClassrooms, etc.).
- **User Adoption**: Percentage of DGI students using the portal as their primary browser start page.
- **Academic Performance**: Improved tracking of tasks and deadlines linked to specific subjects.
- **Centralization**: 100% of official announcements reaching students through the portal instead of fragmented social media.

---

## 3️⃣ Stakeholders

- **Students (Primary Users)**: Expect a fast, reliable, and intuitive interface to manage their daily academic life.
- **Admins (Samba Sene / Department Staff)**: Expect a secure way to broadcast announcements and manage user access.
- **Developers**: Expect a clean, modular codebase (React/Supabase) that is easy to maintain and scale.
- **ESP Institution**: Indirectly benefits from better-organized and more informed students.

---

## 4️⃣ Requirements

### A) Functional Requirements
- **Authentication**: Secure login/signup via Supabase Auth with profile creation.
- **Home (Start Page)**: Search bar and categorized "App Groups" (Communication, Dev Tools, OS, etc.).
- **Dashboard**:
    - **Overview**: Summary of upcoming tasks and current status.
    - **Schedule/Timetable**: Dual-view system with a dedicated **Exams** module.
    - **Subjects**: Academic containers for materials (CM/TD/TP), notes, and tasks.
    - **Notes Engine**: Full CRUD with rich text support and cloud synchronization.
    - **Focus Lab**: Integrated Pomodoro timer, stopwatch, and world clock.
    - **Announcements**: Admin-only broadcast system with "convert to task" capability.
- **Admin Panel**: User management, announcement publishing, and **Feature Toggles** (Dashboard access, Signup lock, Page visibility).
- **Profile Management**: Customization of avatar, name, and academic role.

### B) Non-Functional Requirements
- **Performance**: Initial load time < 2s; UI interactions < 100ms.
- **Security**: Row Level Security (RLS) on all database tables; JWT-based authentication.
- **Offline Capability**: PWA support for accessing notes and timetables without internet.
- **UI/UX**: Dark Glassmorphism aesthetic; responsive design for mobile and desktop.
- **Scalability**: Architecture must support adding new subjects and departments easily.

---

## 5️⃣ User Analysis

### Target Audience
- **Age**: 18–25 years old.
- **Technical Level**: High (Computer Science students).
- **Devices**: Primarily Laptops (as a start page) and Smartphones (PWA).
- **Internet Quality**: Variable (Dakar, Senegal); requires robust offline caching.

### User Personas
1. **The Organized Student**: Uses the portal to sync every TD/TP deadline with their personal Pomodoro sessions.
2. **The "Just-in-Time" Student**: Relies on the Home Page apps to quickly jump into Huawei Talent or Google Classroom 2 minutes before class.

---

## 6️⃣ Use Cases

1. **User Registers**: Creates an account, sets "DUT 1 TR" as classroom, and lands on the Home Page.
2. **User Checks Timetable**: Toggles the dashboard to see if the 13:00 "Algorithmique" class is still on.
3. **User Adds Note**: During a lecture, opens the Subject Detail for "Networking" and adds a rich-text note.
4. **Admin Posts Announcement**: Publishes a notice about an exam change; all students see it in real-time.

---

## 7️⃣ User Stories

- *As a student, I want my institutional timetable to automatically shift my personal tasks, so that I don't overbook myself.*
- *As a student, I want to access my course materials (PDFs) offline, so that I can study during power outages or internet cuts.*
- *As an admin, I want to ban disruptive users, so that the academic environment remains professional.*

---

## 8️⃣ Scope Definition

### ✅ INCLUDED
- Full Auth & Profile System.
- Home Start Page with customizable App Groups.
- Academic Dashboard (Timetable, Subjects, Notes, Focus Lab).
- Admin Announcement System.
- PWA / Offline Support.

### ❌ NOT INCLUDED (v1)
- Real-time peer-to-peer chat (Forum).
- Automatic grade synchronization with ESP official portals.
- Multi-department support (Initially hardcoded for DGI).

---

## 9️⃣ System Architecture

### Architecture Type
**Client-Server (Serverless Backend)**
- **Frontend**: React 19 SPA (Single Page Application).
- **Backend**: Supabase (BaaS) providing Auth, PostgreSQL, and Storage.
- **Communication**: Real-time subscriptions for announcements.

---

## 🔟 Technology Stack Decision

- **Frontend**: React 19 + TypeScript (Type safety and modern hooks).
- **Styling**: Tailwind CSS (Rapid UI development with utility classes).
- **Backend/Database**: Supabase / PostgreSQL (Relational data with built-in Auth and RLS).
- **Icons**: Material Symbols (Standardized academic/tech iconography).
- **Hosting**: Vercel or custom VPS (Optimized for React/Vite).

---

## 1️⃣1️⃣ Data Design

### Database Schema (Supabase)
- **profiles**: `id, full_name, role (user/admin), avatar_url, status, metadata (JSONB)`.
- **announcements**: `id, title, content, category, priority, author_id`.
- **notes**: `id, user_id, title, content, tags[], pinned`.
- **app_config**: `id, config (JSONB)` for global feature toggles.

---

## 1️⃣2️⃣ API Design

Using Supabase Client SDK:
- `GET /profiles`: Fetch user data.
- `POST /announcements`: (Admin only) Create new broadcast.
- `GET /notes?user_id=eq.uuid`: Fetch personal notes.
- `SUBSCRIBE announcements`: Real-time listener for new posts.

---

## 1️⃣3️⃣ Security Planning

- **Authentication**: Supabase Auth (Email/Password).
- **Authorization**: Row Level Security (RLS) ensures users only see their own notes/materials.
- **Admin Roles**: Specific policies allow only `role = 'admin'` to write to the `announcements` table.
- **Data Integrity**: PostgreSQL constraints on roles and status fields.

---

## 1️⃣4️⃣ UI/UX Design

- **Layout**: Split between a "Clean Home" (Start Page) and a "Dense Dashboard" (Management).
- **Design System**: 
    - **Colors**: Slate-950 (Background), Indigo-500 (Primary Accent).
    - **Glassmorphism**: `backdrop-blur-md` with subtle white borders.
    - **Typography**: Inter (Sans-serif) for maximum legibility.

---

## 1️⃣5️⃣ State Management Design

- **Global State**: React Context/State in `App.tsx` for session and navigation.
- **Server State**: Supabase real-time sync for announcements.
- **Local State**: Component-level state for UI toggles (sidebar, modals).

---

## 1️⃣6️⃣ Offline Strategy

- **Service Workers**: Caching of static assets (JS/CSS/Images).
- **LocalStorage**: Caching of user preferences and temporary note drafts.
- **Supabase Offline**: Potential use of local caching for database queries.

---

## 1️⃣7️⃣ Performance Planning

- **Image Optimization**: Using Cloudinary or optimized assets for subject banners.
- **Code Splitting**: Lazy loading dashboard sub-pages.
- **Tailwind JIT**: Minimal CSS bundle size.

---

## 1️⃣8️⃣ Logging & Monitoring

- **Admin Audit Logs**: `admin_logs` table tracks every administrative action (Ban, Kick, Post).
- **Supabase Logs**: Built-in monitoring for API request frequency and errors.

---

## 1️⃣9️⃣ Testing Strategy

- **Manual Testing**: Verifying responsive layouts on Chrome, Safari, and Mobile.
- **Unit Testing**: Logic for timetable priority shifts (e.g., class vs. personal task).
- **Integration Testing**: Auth flow and Supabase RLS verification.

---

## 2️⃣0️⃣ Version Control Strategy

- **Git**: Main branch for production; feature branches for new modules (e.g., `feature/focus-lab`).
- **Commits**: Conventional commits (e.g., `feat: add subject detail tabs`).

---

## 2️⃣1️⃣ Project Management Plan

- **Phase 1**: Core Auth & Home Page (Completed).
- **Phase 2**: Dashboard & Timetable Engine (Completed).
- **Phase 3**: Subjects & Materials Integration (Completed).
- **Phase 4**: Admin Panel, Feature Toggles & Cloud Persistence (Completed).
- **Phase 5**: PWA Optimization & Final Polish (In Progress).

---

## 2️⃣2️⃣ Legal & Compliance

- **Privacy**: User data is private; notes are encrypted at rest via Supabase.
- **Terms**: Strictly for academic use within the ESP-DGI context.

---

## 2️⃣3️⃣ Risk Analysis

- **Risk**: Supabase service interruption.
- **Mitigation**: Implement local caching for critical timetable data.
- **Risk**: Low student adoption.
- **Mitigation**: Ensure the Home Page is more useful than the default Chrome "New Tab" page.

---

## 2️⃣4️⃣ Deployment Strategy

- **Environment**: Production deployment at `pp.bluedish.tech`.
- **CI/CD**: Automatic deployment on push to `main` branch.

---

## 2️⃣5️⃣ Maintenance Plan

- **Updates**: Bi-annual updates to subjects and timetables based on the ESP academic calendar.
- **Backups**: Daily automated backups via Supabase.
