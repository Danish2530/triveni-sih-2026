# TRIVENI (Jan-Samadhan Platform)
> **"From Community Problems to Real Solutions"**
> *Prototype built for Smart India Hackathon (SIH) 2026 — Problem Statement 26043*

---

## 🌟 Overview

**Triveni** is an end-to-end multi-stakeholder platform connecting **citizens, communities, universities, students, faculty, industry/startups, and government departments** to transform real-world societal problems into practical, field-deployed engineering solutions.

### Core Workflow Pipeline
```text
Citizen submits societal problem
        ↓
AI-style problem analysis (Category, Priority, Skills, Keywords)
        ↓
Duplicate challenge detection
        ↓
University matching algorithm (Match Score Fit)
        ↓
University accepts challenge & spawns project
        ↓
Faculty mentor & student team assigned
        ↓
Industry partners co-fund & provide hardware/mentorship
        ↓
Milestone tracking & interactive R&D Kanban board
        ↓
Field solution deployed in village/community
        ↓
Government monitors district impact & Recharts analytics
```

---

## 🛠️ Mandatory Tech Stack

### Frontend
- **Framework**: React.js 19 with Vite 8
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 (Vanilla CSS + custom glassmorphism & dark themes)
- **HTTP Client**: Axios (with JWT Interceptors)
- **Analytics & Data Vis**: Recharts
- **Iconography**: Lucide React
- **File Extensions**: Strictly JavaScript `.jsx` for all React components/pages (No TypeScript / `.tsx`)

### Backend
- **Runtime**: Node.js v22
- **Framework**: Express.js v4
- **Database**: MongoDB with Mongoose ODM (Connects to standard MongoDB instance / Atlas via `MONGO_URI`, with automatic `mongodb-memory-server` fallback for local dev/testing)
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs password hashing
- **Architecture**: Clean modular controller-service-route-model architecture

---

## 🔑 Demo Account Credentials

Password for all pre-seeded demo accounts: `password123`

| Role | Email | Name / Organization | Primary Portal |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@demo.com` | Ramesh Mahto (Dumka Gram Panchayat) | Report & track societal challenges |
| **University** | `university@demo.com` | BIT Mesra Innovation Cell | Accept challenges & spawn R&D projects |
| **Industry** | `industry@demo.com` | Tata Steel CSR & Tech | Partner with projects (Hardware/Funding) |
| **Government** | `government@demo.com` | Jharkhand State Innovation Council | Recharts analytics & Social Impact audit |
| **Faculty** | `faculty@demo.com` | Dr. Raj Sharma (Professor, CSE) | Mentor academic project teams |
| **Student** | `student@demo.com` | Rahul Kumar (B.Tech CSE) | Execute technical R&D milestones |
| **Admin** | `admin@demo.com` | SIH Platform Moderator | Validation & system oversight |

*Note: On the Login screen, click any of the 1-Click Fast Demo Buttons to instantly sign in as that role.*

---

## 🚀 Quick Setup & Startup Instructions

### 1. Prerequisites
- Node.js (v18+)
- NPM (v9+)
- Local MongoDB running on `mongodb://127.0.0.1:27017` OR MongoDB Atlas URI in `.env`

### 2. Installation
```bash
# Clone/Navigate to workspace
cd d:\Triveni

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Seed Database with Jharkhand Demo Data
```bash
cd d:\Triveni\server
node seed.js
```
*Output will confirm: `✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!`*

### 4. Run the Full-Stack Application

**Option A: Running Server & Client separately**
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm start

# Terminal 2: Frontend Client (Port 3000)
cd client
npm run dev
```

**Option B: Running both concurrently from Root**
```bash
# Root directory
npm run dev
```

- **Frontend Application**: `http://localhost:3000` (or `http://localhost:5173`)
- **Backend REST API**: `http://localhost:5000/api`
- **Health Check API**: `http://localhost:5000/api/health`

---

## 🧪 17-Step Demonstration Flow

To demonstrate the full innovation cycle during SIH judging:

1. **Login as Citizen**: Click `Citizen` 1-Click demo login (`citizen@demo.com`).
2. **Report Problem**: Go to `Report Problem` form (`/citizen/submit-problem`).
3. **Fill Challenge Specs**: Enter title *"Drinking water shortage in a village in Dumka"*, description, location.
4. **Run AI Analysis**: Click `[ Analyze Problem with AI ]` — see real-time categorization (`Water Management`), priority (`HIGH`), required skills (`IoT`, `Civil Engineering`), and estimated impact (`1,200 villagers`).
5. **Check Duplicate Warning**: If similar text exists, view the duplicate detection banner.
6. **Submit Challenge**: Click `[ Submit Challenge ]`.
7. **University Match**: View problem details — see top matched universities (*BIT Mesra 92%*, *NIT Jamshedpur 87%*).
8. **Login as University**: Switch user -> Click `University` demo login (`university@demo.com`).
9. **Inspect Challenge**: Go to `Available Challenges` -> click *"Drinking water shortage in Dumka village"*.
10. **Accept Challenge**: Click `[ Accept Challenge & Create Project ]`.
11. **Spawn R&D Project**: Fill form *"Smart Water Monitoring System (Dumka)"*, assign faculty mentor & student team -> Click `Spawn Project`.
12. **Manage Milestones & Kanban**: Update milestones and move task cards on the interactive Kanban board (`TODO`, `IN PROGRESS`, `TESTING`, `COMPLETED`).
13. **Login as Industry**: Switch user -> Click `Industry` demo login (`industry@demo.com`).
14. **Discover Project**: Go to `Explore Projects` -> click `[ Partner With Project ]` on *"Smart Water Monitoring System"*.
15. **Offer Support**: Select `Hardware` + `Funding` + `Mentorship`, enter message -> Click `[ Send Partnership Request ]`.
16. **University Accepts Partner**: Switch back to University -> Open project -> Click `[ Accept Partner ]` on Tata Steel's proposal. Watch progress bar increase!
17. **Login as Government**: Switch user -> Click `Government` demo login (`government@demo.com`). Explore Recharts domain breakdown, district heatmap, status funnel, and social impact metrics (*12,450 People Benefited, 18 Villages Covered, ₹14.8 Lakhs Savings*).

---

## 📁 Folder Structure

```text
Triveni/
├── client/                     # Vite + React Frontend (.jsx only)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProblemCard.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT Auth & Demo account handler
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── SubmitProblem.jsx
│   │   │   ├── ProblemDetails.jsx
│   │   │   ├── MyProblems.jsx
│   │   │   ├── UniversityDashboard.jsx
│   │   │   ├── UniversityChallenges.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── IndustryDashboard.jsx
│   │   │   ├── IndustryProjects.jsx
│   │   │   ├── GovernmentDashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios client with interceptors
│   │   ├── App.jsx             # React Router v6 setup
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind CSS & custom glassmorphism
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js               # MongoDB connection + fallback
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   ├── universityController.js
│   │   ├── projectController.js
│   │   ├── industryController.js
│   │   ├── governmentController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Problem.js
│   │   ├── University.js
│   │   ├── Project.js
│   │   ├── Industry.js
│   │   ├── Partnership.js
│   │   ├── Notification.js
│   │   └── Milestone.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── universityRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── industryRoutes.js
│   │   ├── governmentRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── aiService.js        # Rule-based AI analyzer
│   │   ├── matchingService.js  # University match scoring algorithm
│   │   └── duplicateService.js # Keyword similarity duplicate detector
│   ├── seed.js                 # Seed database script
│   ├── server.js               # Main Express app entry point
│   └── package.json
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

## 📡 REST API Summary

- **`POST /api/auth/register`** — Register new user
- **`POST /api/auth/login`** — Login user & return JWT token
- **`GET /api/auth/me`** — Get current user profile
- **`POST /api/problems`** — Submit new problem challenge (triggers AI & duplicate check)
- **`GET /api/problems`** — Get all problems (filterable by category, district, status)
- **`GET /api/problems/:id`** — Get problem details & AI match scores
- **`POST /api/problems/analyze`** — Run standalone AI classification
- **`POST /api/universities/challenges/:id/accept`** — Accept challenge as University
- **`POST /api/projects`** — Create R&D project with faculty/students/milestones
- **`GET /api/projects/:id`** — Get project details, milestones & Kanban board
- **`PUT /api/projects/:id/milestones/:mId`** — Toggle milestone status
- **`POST /api/projects/:id/partner`** — Submit industry partnership request
- **`PUT /api/industry/partnerships/:id/status`** — Accept/reject industry partnership
- **`GET /api/dashboard/government`** — Get government dashboard & Recharts analytics
- **`GET /api/notifications`** — Fetch role-specific notifications

---

## 📄 License & Credits
Developed for **Smart India Hackathon (SIH) 2026 — Problem Statement 26043**.
