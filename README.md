# 🎓 Smart Campus - College Management Platform

A production-ready, full-stack college management software designed for students, faculty members, event coordinators, and administrators. Built as a unified platform to replace scattered announcements, spreadsheets, and manual WhatsApp groups.

Developed for **DevFusion 4.O: The Developers Hackathon** under **Problem Statement 1**.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Node.js, Express.js, Mongoose, JWT (JSON Web Tokens), Cookie-Parser
- **Database**: MongoDB Atlas / local MongoDB
- **Styling & Icons**: Tailwind CSS, Lucide React

---

## 🔑 Test Credentials (Pre-seeded)

Ensure you run the database seeder script to populate these credentials. If MongoDB is offline, the backend automatically falls back to these mock profiles in **Offline Demo Mode**.

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `admin123` | Full access, manage users, placements drives, demographics |
| **Faculty** | `faculty@gmail.com` | `faculty123` | Create assignments, grade solutions, mark class attendance rosters |
| **Coordinator** | `coordinator@gmail.com` | `coordinator123` | Create campus events, manage seats, guest speakers roster |
| **Student** | `student@gmail.com` | `student123` | View attendance metrics, register events, submit homework files |

---

## 📦 Folder Structure

```
smart-campus/
├── backend/
│   ├── config/             # Database & environment configurations
│   ├── controllers/        # Express request handlers & business logic
│   ├── middleware/         # Auth, permission, & CORS middlewares
│   ├── models/             # Mongoose schemas (User, Assignment, Attendance, etc.)
│   ├── routes/             # REST API endpoint definitions
│   └── utils/              # Database seeder scripts
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── app/            # Next.js pages (landing page, login, dashboards)
│   │   └── lib/            # Central API fetch helpers
└── docs/                   # Hackathon submission documentation
```

---

## ⚙️ Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Instance (local service running on `localhost:27017` or MongoDB Atlas URI)

### Step 1: Clone & Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and set your credentials (defaults connect locally):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/smart-campus
   JWT_SECRET=smartcampus_secret_key_2026_dharaneesh
   CLIENT_URL=http://localhost:3000
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### Step 2: Seed the Database
Seed mock data (users, events, placements) to populate charts and logins:
```bash
node utils/seed.js
```

### Step 3: Run Servers
1. Start Express API (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```
2. In a new terminal, navigate to the frontend and run Next.js (runs on `http://localhost:3000`):
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📑 Hackathon Deliverables

All required diagrams and documentation are available inside the `/docs` directory:
- [Architecture & Workflow Diagram](./docs/architecture_diagram.md)
- [Database ER Schema](./docs/database_schema.md)
- [REST API Endpoint Documentation](./docs/api_documentation.md)
- [Software LICENSE](./LICENSE)
