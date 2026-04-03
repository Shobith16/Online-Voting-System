# 🗳️ Online Voting System — Project Analysis

## 📋 Project Summary

A full-stack **Online Voting System** built with **React.js** (frontend) and **Express.js + MongoDB** (backend). The application features a **Premium Neumorphic Dark Mode** UI, atomic server-side voting logic, and role-based access control (RBAC). It includes a secure voter registration, authentication, password recovery flow, and a comprehensive admin dashboard for real-time election management.

---

## 🏗️ Tech Stack

| Layer        | Technology                                               |
| ------------ | -------------------------------------------------------- |
| **Frontend** | React 18, React Router v6, Axios, Chart.js, Framer Motion |
| **Backend**  | Node.js, Express.js 4.x, Express Validator               |
| **Database** | MongoDB (via Mongoose 8.x)                               |
| **Auth**     | bcryptjs (hashing) + JWT (jsonwebtoken)                  |
| **UI/UX**    | Neumorphic Dark Mode (Vanilla CSS), Lucide Icons         |
| **Testing**  | Jest, Supertest, mongodb-memory-server                   |

---

## 📁 Project Structure

```
Online-Voting-System/
├── backend/
│   ├── app.js                  # Express server & all API routes
│   ├── middleware/
│   │   └── auth.js             # JWT verifyToken & verifyAdmin middleware
│   ├── models/
│   │   ├── user.js             # User/Voter schema (includes isAdmin flag)
│   │   ├── candidates.js       # Candidate schema
│   │   └── FinishedVotinglist.js  # Persistent Voted-user tracking
│   ├── tests/
│   │   └── auth.test.js        # Comprehensive security & auth test suite
│   ├── package.json
│   └── .env                    # PORT, MONGODB_URL, JWT_SECRET
│
├── frontend/
│   ├── src/
│   │   ├── App.js              # Root component with Protected & Admin routes
│   │   ├── api/
│   │   │   └── axios.js        # Centralized Axios with Bearer token handling
│   │   ├── layouts/
│   │   │   └── Layout.jsx      # Global shell for navigation and content
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Responsive nav with dynamic Admin links
│   │   │   └── Popup.jsx       # Custom animated confirmation & alert modals
│   │   ├── pages/              # User-facing screens
│   │   │   ├── Home.jsx        # Neumorphic voting grid
│   │   │   ├── Login.jsx       # Secure login with Admin redirection
│   │   │   ├── SignUp.jsx      # Voter registration ( cascading districts )
│   │   │   ├── About.jsx       # Platform info
│   │   │   ├── ForgotPassword.jsx # Secure password recovery screen
│   │   │   └── ProtectedRoute.jsx # Auth guard for user routes
│   │   ├── pages/admin/        # Administrative screens (AdminRoute protected)
│   │   │   ├── Admin.jsx       # Admin layout with unified sidebar
│   │   │   ├── Overview.jsx    # Candidate management (CRUD)
│   │   │   ├── AddC.jsx        # Candidate registration form
│   │   │   ├── Result.jsx      # Real-time results viz (Bar & Pie charts)
│   │   │   ├── Reele.jsx       # Reset election (Danger Zone)
│   │   │   └── AdminRoute.jsx  # Admin-only route guard
│   │   ├── styles/             # Modularized theme & component CSS (Global Neumorphic)
│   └── package.json
```

---

## 🔌 API Endpoints (v2.0)

| Method   | Endpoint                  | Auth      | Description                                     |
| -------- | ------------------------- | --------- | ----------------------------------------------- |
| `POST`   | `/signup`                 | Public    | Validated voter registration (Age 18+ check)    |
| `POST`   | `/login`                  | Public    | Returns JWT + isAdmin + v_id                    |
| `POST`   | `/reset-password`         | Public    | Secure recovery via v_id + phone verification   |
| `GET`    | `/candidates`             | Public    | Fetch all active candidates                     |
| `POST`   | `/candidates/:id/vote`    | 🔒 JWT    | **Atomic** vote increment ($inc)                |
| `POST`   | `/checkuser`              | 🔒 JWT    | Verification for already-voted voters           |
| `POST`   | `/finishedvotinglist`     | 🔒 JWT    | Mark voter as "Completed" in DB                 |
| `POST`   | `/candidates`             | 🛡️ Admin  | Add new candidate                               |
| `PUT`    | `/candidates/:id`         | 🛡️ Admin  | Update candidate profile (locked vote counts)   |
| `DELETE` | `/candidate_del/:id`      | 🛡️ Admin  | Remove a candidate                              |
| `DELETE` | `/clearVoters`            | 🛡️ Admin  | Full election reset (clear votes/logs)          |

---

## 🔑 Core Features & Architectural Improvements

### 🛡️ Security First
- **Atomic Voting**: Switched from client-side PUT to server-side `POST /vote` using `$inc`. This prevents race conditions and value manipulation.
- **Role-Based Access (RBAC)**: Implemented `isAdmin` flag in user schema and `verifyAdmin` middleware to protect management APIs.
- **Route Guards**: `ProtectedRoute` and `AdminRoute` on frontend ensure users only see authorized screens.
- **Input Validation**: `express-validator` applied across all critical registration/login/admin routes.

### 🎨 Premium UI/UX (Phase 2)
- **Neumorphic Design System**: Global dark-mode aesthetic utilizing off-white text and soft shadows on #1a1a1e background.
- **Custom Popups**: Replaced native `alert()` with a bespoke, animated `Popup` system using `framer-motion` for confirmations and results.
- **Real-time Analytics**: Admin dashboard features high-contrast Bar and Pie charts for live vote tracking.

---

## 🔄 Application Data Flow

1. **Auth**: JWT is stored in `localStorage` alongside `adminToken` if applicable. 
2. **Voting**: Clicking 'Cast Vote' triggers a **Custom Modal Confirmation**. On confirm, `POST /vote` increments counts and `POST /finishedvotinglist` logs the user's ID to prevent repeat votes.
3. **Admin**: Dashboards utilize protected Axios instances to perform CRUD on the candidate collection and election resets.

---

## 🚀 Setup & Execution

### Backend
1. Create `.env`: `PORT`, `MONGODB_URL`, `JWT_SECRET`.
2. `npm install` and `node app.js`.
3. `npm test` to run the 7+ security-focused unit tests.

### Frontend
1. `npm install` modules.
2. `npm start` (Runs on port 3000).

---

## ⚠️ Status & Future Improvements

| Area               | Improvement / Status                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Auth**           | ✅ JWT implemented for Users and Admins.                                            |
| **Voting**         | ✅ Atomic server-side increments.                                                   |
| **UI**             | ✅ Phase 2 Premium Redesign Complete (Neumorphism / Dark Mode).                     |
| **Scalability**    | ✅ FinishedVotinglist prevents double-voting; atomic increment prevents data loss.   |
| **Data Flow**      | ⚙️ Suggest moving hardcoded taluk/district JSON to a database collection.            |
| **Session**        | ⚙️ Consider using HttpOnly cookies for storing tokens for enhanced security.         |

---

> **Generated on:** April 2, 2026 | **Last updated:** Phase 2 Completion (Neumorphism + Admin Access + Password Reset)
