# CareerConnect - Frontend Application

CareerConnect is a modern, highly interactive job portal designed to bridge the gap between premium tech talent and innovative companies. The frontend is built as a highly performant Single Page Application (SPA), featuring a sleek dark-themed UI, soft glassmorphism aesthetics, and a focus on UX inspired by platforms like Otta, Wellfound, and LinkedIn.

## 🌟 Comprehensive Feature Set

### 1. Modern Tech Aesthetics & UX
- **Design System:** Built exclusively with a custom dark-theme (`bg-mine-shaft`) with vibrant accents (`bright-sun`). Uses glassmorphism (`backdrop-blur`) extensively for cards and overlays.
- **Fully Responsive:** Adapts seamlessly from desktop to mobile screens (`sm-mx`, `md-mx` custom Tailwind breakpoints). Includes a bottom navigation bar (`BottomNav`) tailored for mobile users.
- **Animations:** Employs Framer Motion for smooth page transitions and AOS (Animate on Scroll) for scroll-triggered micro-interactions.

### 2. Intelligent AI Capabilities (Powered by Groq API)
- **AI Match Score:** On job description pages, applicants can click "Check My Match" to generate a real-time percentage score, strengths, and weaknesses comparing their profile to the job description using advanced AI algorithms.
- **Resume Parsing:** Users can upload a PDF resume in their Profile section. The frontend sends this to the backend where AI extracts their skills, experiences, and summary, auto-filling the profile fields instantly.

### 3. Role-Based Interfaces (Seekers vs. Employers)
- **Applicant Experience:** 
  - **Find Jobs:** A 3-Pane split-screen view. Sticky left filtering sidebar, a scrollable list of modern job cards in the center, and instantly loaded full job details in a sticky right pane.
  - **Job History:** Track applied, saved, and offered jobs.
  - **Dynamic Profile:** Complete with an interactive "Profile Strength" ring progress chart. Add certifications, skills, and experiences easily.
- **Employer Experience:**
  - **Post a Job:** Form to draft detailed job descriptions with Rich Text editing (Tiptap). 
  - **Find Talent:** Browse through candidate profiles, filter by skills, and initiate connections.
  - **Applicant Tracking:** View who applied to a specific job post, check their AI match score, and update their application status (e.g., Offered, Rejected, Interviewing).

### 4. Interactive & Real-time Features
- **Real-time Messaging:** An integrated chat interface allowing recruiters and applicants to communicate seamlessly. Features include auto-scrolling to the latest message, message timestamps, active chat highlighting, and a responsive mobile single-view layout.
- **Notifications:** Custom toast notifications (`NotificationService`) alert users of successful job posts, OTP triggers, and profile updates.

## 🛠️ Technology Stack

- **Framework:** React 18 (Bootstrapped with CRA/Vite)
- **State Management:** Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
- **Styling:** Tailwind CSS + PostCSS
- **Component Library:** Mantine UI (`@mantine/core`, `@mantine/dates`, `@mantine/hooks`)
- **Routing:** React Router v6 (`react-router-dom`)
- **API Communication:** Axios (with Interceptors for JWT Injection)
- **Animations:** Framer Motion & AOS (Animate on Scroll)
- **Icons:** Tabler Icons (`@tabler/icons-react`)
- **Rich Text Editor:** Tiptap

---

## 🔗 Backend Integration & Architecture

While the frontend operates independently, it communicates continuously with the Spring Boot backend via REST APIs.

### How the Frontend Communicates with the Backend
1. **Axios Services (`src/Services/`):** All HTTP requests are abstracted into specialized services (e.g., `JobService.tsx`, `UserService.tsx`, `ChatService.tsx`).
2. **JWT Authentication Flow:**
   - **Login/Signup:** Upon sending an OTP and verifying it, the backend returns a JSON Web Token (JWT).
   - **Interceptor:** An Axios Interceptor automatically reads this token from LocalStorage and attaches it as a `Bearer` token in the `Authorization` header of every subsequent authenticated request.
3. **CORS:** The backend is configured to accept Cross-Origin Resource Sharing from the frontend's specific development or production port.

---

## 🏗️ State Management Architecture

The application uses **Redux Toolkit** for centralized, predictable global state, housed in `src/Slices/`. 

- **`UserSlice.tsx`:** Manages authentication state, user roles, and login tokens.
- **`ProfileSlice.tsx`:** Holds the loaded user profile data (skills, experience, saved jobs, certifications) fetching from MongoDB on app initialization.
- **`FilterSlice.tsx`:** Manages the complex filtering state of the Job Search and Talent Search pages, decoupling the sidebar UI from the data rendering logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Setup

1. **Clone & Navigate:**
   ```bash
   git clone <repository-url>
   cd frontend
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Create a `.env` file in the root if you need to override the default API endpoint. By default, Axios is configured to point to `http://localhost:8080`.
4. **Run the Development Server:**
   ```bash
   npm run start
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```text
/src
 ├── /Components       # Reusable modular UI components (Header, Footer, JobCard)
 │    ├── /FindJobs    # 3-pane layout components
 │    ├── /Profile     # Profile sections (Skills, Experience, Uploads)
 │    └── /Messages    # Chat layouts and message bubbles
 ├── /Pages            # Top-level route components mapping to screens (HomePage, MessagesPage)
 ├── /Services         # Axios API communication layers (UserService, AiService)
 ├── /Slices           # Redux slices for global state management
 ├── /Data             # Static configurations, constants, and mock data
 └── /App.tsx          # Main entry point with Route definitions
```

## 📦 Build for Production

To create an optimized, minified production build:
```bash
npm run build
```
The output will be placed in the `build/` folder. This contains static HTML, CSS, and JS files ready to be deployed to static hosting services like Vercel, Netlify, or an AWS S3 bucket.
