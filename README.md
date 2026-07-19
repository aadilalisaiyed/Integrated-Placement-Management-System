# 🎓 Integrated Placement Management System 🚀

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2019-blue?style=for-the-badge&logo=vite)](https://vite.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/Security-JSON%20Web%20Tokens-black?style=for-the-badge&logo=json-web-tokens)](https://jwt.io/)

A complete, high-performance, and fully responsive **Placement Management Portal** built to streamline college placement operations, job drives, application tracking, and placement analytics.

---

## 🌟 Key Features

### 👨‍💼 1. Admin & Coordinator Panel
*   📊 **Analytics Dashboard**: Instant snapshot of key metrics including **Total Students**, **Total Placed**, **Placement Percentage**, **Average CTC Offered**, and **Branch-wise Statistics**.
*   🏢 **Company Management**: Full CRUD capabilities for managing recruitment drives. Add companies, set CTC, define eligible branches, specify drive dates, and post portal application links.
*   📋 **Application Tracking**: A unified hub to view all incoming job applications. Filter applications by branch, recruitment status, or company, and view student profiles dynamically.
*   🚦 **One-Click Recruitment Workflows**: 
    *   Marking an application as **Selected** automatically tags the student as *Placed*, updates their alumni history, and changes all other pending applications for that student to *Rejected*.
    *   Reverting/changing a selection automatically rolls back placement status, updates active applications, and deletes related alumni records.
*   🪵 **Audit Logging**: Comprehensive system logging tracking all action types (`CREATE`, `UPDATE`, `DELETE`, `STATUS_CHANGE`) tied to the corresponding user for security and transparency.

### 🎓 2. Student Panel
*   💼 **Job Boards**: View active and upcoming campus drives tailored specifically to branch and CGPA requirements.
*   📝 **Dynamic Application System**: Easily apply to companies with automatic verification checks.
*   📈 **Personal Tracking**: Keep track of application progress (e.g., *Pending*, *Selected*, or *Rejected*) directly on a personalized student dashboard.

---

## 🛠️ Tech Stack

*   **Frontend**: React (v19), React Router DOM (v7), Vite (HMR), Axios
*   **Styling**: Tailwind CSS v4 + Autoprefixer
*   **Backend**: Node.js, Express (v5)
*   **Database**: PostgreSQL (`pg` pool)
*   **Authentication & Hashing**: JSON Web Tokens (JWT) + BCrypt (10 rounds salt)
*   **Hosting**: Configurations ready for Vercel (Frontend) and PostgreSQL hosting (Render/Supabase/Aiven)

---

## 📂 Project Structure

```text
placement_portal/
├── backend/
│   ├── controllers/      # Route request handler logic
│   ├── middleware/       # JWT Auth & role checks
│   ├── routes/           # REST endpoints
│   ├── db.js             # PostgreSQL connection pool configuration
│   ├── server.js         # Express main application setup
│   └── .env              # Backend environment configuration
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── api/          # Axios instance & API client logic
    │   ├── components/   # Layout, Sidebar, TopBar, ProtectRoute, badges
    │   ├── pages/        # Dashboard, Apply, Companies, Students, Applications
    │   ├── App.jsx       # Route registration
    │   └── main.jsx      # Vite entrypoint
    ├── tailwind.config.js
    └── vercel.json       # Frontend deployment settings

## ⚙️ Installation & Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/placement_portal.git
cd placement_portal
```

### 2️⃣ Configure & Run Backend

Navigate to the `backend/` directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` root directory:


Start the Express development server:

```bash
npm run dev
```

### 3️⃣ Configure & Run Frontend

Open a new terminal and navigate to the `frontend/` directory:

```bash
cd frontend
npm install
```

Set up environment variables inside `.env.development` or `.env.production`:

Start the Vite React development server:

```bash
npm run dev
```

---

## 🌐 Production & Hosting Notes

- **Frontend:** Configured for serverless platforms like **Vercel** or **Netlify** with Single Page Application (SPA) routing redirect configurations (`vercel.json` included).
- **Backend:** Deploys seamlessly to platforms like **Render**, **Heroku**, or **Railway**.
- **Database:** Fully compatible with cloud SQL solutions such as **Supabase**, **Aiven**, or **AWS RDS**. Make sure to enable **SSL connections** if your provider requires it.

---

## 🔒 Security & Best Practices

- 🔐 **Hashed Passwords:** Never stores plain-text passwords; utilizes **bcrypt** salt hashing.
- 🎟️ **Stateless Sessions:** **JWT tokens** securely verify client claims.
- 🛡️ **Role Verification:** Middleware automatically checks roles on protected API routes.
- 🔄 **Transaction Safety:** Complex status transitions inside database triggers employ SQL `BEGIN`, `COMMIT`, and `ROLLBACK` mechanisms to prevent partial updates.
















