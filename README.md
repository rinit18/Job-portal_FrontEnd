# CareerConnect Frontend Architecture

CareerConnect is a modern, highly interactive job portal designed to connect premium tech talent with innovative companies. The frontend is built as a highly performant Single Page Application (SPA) focusing on a clean, developer-friendly UI inspired by platforms like Otta, Wellfound, and LinkedIn.

## 🌟 Comprehensive Feature Set

- **Modern Tech Aesthetics:** A visually striking UI featuring a dark-themed, soft glassmorphism design, beautiful gradients, and high-contrast readable typography.
- **AI-Powered Search:** Users can search for jobs using natural language queries (e.g., *"Remote React jobs paying over 15LPA"*). The frontend sends this to the backend which parses it into strict filters.
- **3-Pane Split-Screen View:** A seamless, LinkedIn-style browsing experience. The `/find-jobs` page utilizes a sticky left filtering sidebar, a scrollable list of modern job cards in the center, and instantly loads full job details in a massive sticky right pane without ever reloading the page.
- **Interactive Dashboards:** Comprehensive dashboards for both Seekers (Profiles, Saved Jobs, Applied Jobs) and Employers (Company Profiles, Post a Job, Applicant Tracking).
- **Real-time Messaging:** An integrated chat interface allowing recruiters and applicants to communicate seamlessly, featuring auto-scrolling, unread counts, and message timestamps.

## 🛠️ Technology Stack

- **Framework:** React 18
- **State Management:** Redux Toolkit (`react-redux`, `@reduxjs/toolkit`)
- **Styling:** Tailwind CSS + PostCSS
- **Component Library:** Mantine UI (`@mantine/core`, `@mantine/hooks`)
- **Routing:** React Router v6 (`react-router-dom`)
- **API Communication:** Axios
- **Animations:** Framer Motion & AOS (Animate on Scroll)
- **Icons:** Tabler Icons (`@tabler/icons-react`)
- **Text Editor:** Tiptap (for rich text job descriptions and messaging)

---

## 🔗 Backend Integration & Database Connectivity

While the frontend does not connect to the database directly, it relies heavily on the Spring Boot backend to retrieve and persist data to MongoDB.

### How the Frontend Communicates with the Backend
1. **Axios Services (`src/Services/`):**
   All API calls are centralized in service files (e.g., `JobService.tsx`, `UserService.tsx`). We use `axios` to make HTTP requests to the backend REST API.
2. **Base URL Configuration:**
   The backend URL is configured globally. In development, it connects to `http://localhost:8080`.
3. **JWT Authentication Flow:**
   - When a user logs in via OTP, the backend returns a JWT (JSON Web Token).
   - The frontend stores this token in local storage or state.
   - An Axios **Interceptor** is configured to automatically attach this token as a `Bearer` token in the `Authorization` header of every subsequent request. This proves to the backend that the user is authenticated.
4. **CORS (Cross-Origin Resource Sharing):**
   Because the frontend (port 3000) and backend (port 8080) run on different ports locally, the backend is configured to accept requests from the frontend's origin, allowing seamless data flow.

---

## 🏗️ State Management Architecture

The application uses **Redux Toolkit** for global state management, housed in `src/Slices/`. This ensures that data like the user's profile or active filters are accessible from any component without prop-drilling.

- **`UserSlice.tsx`:** Manages the authentication state (logged in vs logged out, user roles).
- **`ProfileSlice.tsx`:** Holds the loaded user profile data (skills, experience, saved jobs) fetched from MongoDB.
- **`FilterSlice.tsx`:** Manages the complex state of the Job Search page. When a user interacts with the `FilterSidebar`, it updates this slice. The main `Jobs` component listens to this slice and filters the job array accordingly.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install all dependencies defined in `package.json`:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 📂 Project Structure

- **`/src/Components`:** Modular, reusable UI components.
  - `FindJobs/`: Contains `SearchBar`, `FilterSidebar`, `JobCard`, and `Jobs` (the 3-pane layout).
  - `LandingPage/`: Components specific to the homepage like `DreamJob` (Hero section).
  - `Header.tsx` & `Footer.tsx`: Global navigation components.
- **`/src/Pages`:** Top-level route components mapping to individual screens (e.g., `HomePage.tsx`, `FindJobsPage.tsx`). These are wrapped in Framer Motion for page transitions.
- **`/src/Services`:** The API communication layers.
- **`/src/Slices`:** Redux slices for global state management.
- **`/src/Data`:** Mock data and static configuration files used before the backend is fully connected or for UI testing.

## 📦 Build for Production

To create an optimized, minified production build:
```bash
npm run build
```
The output will be placed in the `build/` folder. This folder contains static HTML, CSS, and JS files ready to be deployed to static hosting services like Vercel, Netlify, or an AWS S3 bucket.
