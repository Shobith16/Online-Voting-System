# 🗳️ Online Voting System — Project Analysis

## 📋 Project Summary

A full-stack **Online Voting System** built with **React.js** (frontend) and **Express.js + MongoDB** (backend). The application allows voters to register, authenticate, and cast votes for candidates in their locality (filtered by Taluk). An admin dashboard provides candidate management, election results visualization (pie charts), and re-election controls.

---

## 🏗️ Tech Stack

| Layer        | Technology                                               |
| ------------ | -------------------------------------------------------- |
| **Frontend** | React 18, React Router v6, Axios, Chart.js, CSS          |
| **Backend**  | Node.js, Express.js 4.x                                  |
| **Database** | MongoDB (via Mongoose 8.x)                               |
| **Auth**     | bcryptjs (password hashing) + JWT (jsonwebtoken)         |
| **Testing**  | Jest, Supertest, mongodb-memory-server                   |
| **Other**    | dotenv, body-parser, CORS, react-chartjs-2               |

---

## 📁 Project Structure

```
Online-Voting-System/
├── backend/
│   ├── app.js                  # Express server & all API routes (exports app)
│   ├── db.js                   # Standalone DB connection (unused by app.js)
│   ├── middleware/
│   │   └── auth.js             # JWT verifyToken middleware
│   ├── models/
│   │   ├── user.js             # Voter/User schema
│   │   ├── candidates.js       # Candidate schema
│   │   └── FinishedVotinglist.js  # Voted-user tracking schema
│   ├── tests/
│   │   └── auth.test.js        # Jest unit tests (3 auth tests)
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── public/                 # Static assets (index.html, favicon, etc.)
│   ├── src/
│   │   ├── App.js              # Root component with React Router
│   │   ├── index.js            # Entry point
│   │   ├── api/
│   │   │   └── axios.js        # Centralized Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Home.jsx        # Voting page (filtered by Taluk)
│   │   │   ├── Login.jsx       # User login (stores JWT token)
│   │   │   ├── SignUp.jsx      # User registration with cascading State/District/Taluk
│   │   │   ├── Admin.jsx       # Admin layout with sidebar navigation
│   │   │   ├── Overview.jsx    # Admin: candidate table (CRUD)
│   │   │   ├── AddC.jsx        # Admin: add new candidate form
│   │   │   ├── Result.jsx      # Admin: election results pie chart
│   │   │   ├── Reele.jsx       # Admin: re-election (reset all votes)
│   │   │   ├── Layout.jsx      # Public page layout wrapper
│   │   │   ├── Header.jsx      # Header component
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Footer.jsx      # Footer component
│   │   │   └── About.jsx       # About page
│   │   ├── styles/             # Component-specific CSS files (11 files)
│   │   ├── json/
│   │   │   └── district.json   # District list for result filtering
│   │   └── assets/
│   │       └── logo.png        # Party logo placeholder
│   └── package.json
│
└── README.md                   # Setup instructions
```

---

## 🗄️ Database Schema (MongoDB / Mongoose)

### `voters` Collection (User Model)

| Field      | Type   | Description                   |
| ---------- | ------ | ----------------------------- |
| `username` | String | Voter's full name             |
| `age`      | Number | Voter's age                   |
| `v_id`     | String | Unique Voter ID               |
| `phone`    | Number | Phone number                  |
| `State`    | String | State of residence            |
| `District` | String | District of residence         |
| `Taluk`    | String | Taluk of residence            |
| `password` | String | Hashed password (bcryptjs)    |

### `candidates` Collection (Candidate Model)

| Field       | Type   | Description                  |
| ----------- | ------ | ---------------------------- |
| `Candidate` | String | Candidate's name             |
| `Age`       | Number | Candidate's age              |
| `Party`     | String | Political party name         |
| `State`     | String | State constituency           |
| `District`  | String | District constituency        |
| `Taluk`     | String | Taluk constituency           |
| `Vote`      | Number | Current vote count           |

### `vid_lists` Collection (Finished Voting List)

| Field  | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| `v_id` | String | Voter ID of users who have already voted |

---

## 🔌 API Endpoints

| Method   | Endpoint                 | Auth     | Description                                    |
| -------- | ------------------------ | -------- | ---------------------------------------------- |
| `POST`   | `/signup`                | Public   | Register a new voter (password hashed with bcrypt) |
| `POST`   | `/login`                 | Public   | Authenticate voter, returns JWT token + Voter ID |
| `POST`   | `/checkuser`             | 🔒 JWT   | Check if a voter has already voted             |
| `POST`   | `/finishedvotinglist`    | 🔒 JWT   | Mark a voter as having completed voting        |
| `GET`    | `/candidates_details`    | Public   | Fetch all candidates                           |
| `GET`    | `/user`                  | Public   | Fetch all registered voters                    |
| `POST`   | `/candidates`            | Public   | Add a new candidate (admin)                    |
| `PUT`    | `/candidates/:id`        | 🔒 JWT   | Update candidate details / cast vote           |
| `DELETE` | `/candidate_del/:id`     | Public   | Delete a candidate (admin)                     |
| `DELETE` | `/clearVoters`           | Public   | Reset all votes & clear voter list (re-election) |

---

## 🖥️ Frontend Routes

| Route             | Component(s)           | Access  | Description                        |
| ----------------- | ---------------------- | ------- | ---------------------------------- |
| `/`               | `Layout` → `Home`      | Voter   | Main voting page                   |
| `/about`          | `Layout` → `About`     | Public  | About the platform                 |
| `/login`          | `Login`                | Public  | User login form                    |
| `/signup`         | `SignUp`                | Public  | User registration form             |
| `/Admin`          | `Admin` → `Overview`   | Admin   | Candidate overview table (CRUD)    |
| `/Addcandidate`   | `Admin` → `AddC`       | Admin   | Add new candidate form             |
| `/result`         | `Admin` → `Result`     | Admin   | Election results (pie chart)       |
| `/reele`          | `Admin` → `Reele`      | Admin   | Re-election / reset votes          |

---

## 🔑 Core Features

### Voter Side
- **Registration** — Cascading dropdowns for State → District → Taluk (Karnataka & Tamil Nadu with full taluk data)
- **Login** — Username/password authentication with bcrypt; returns JWT token (1-day expiry)
- **JWT-Protected Voting** — Token sent via `Authorization: Bearer` header on all voting actions
- **Vote Prevention** — Checks `vid_lists` collection before allowing a vote; prevents double voting
- **Location-Based Filtering** — Voters only see candidates matching their Taluk

### Admin Side
- **Candidate Overview** — Tabular view of all candidates with inline edit and delete functionality
- **Add Candidate** — Form with validation to register new candidates
- **Election Results** — Pie chart (Chart.js) filtered by district, showing vote distribution
- **Re-Election** — One-click reset: clears all voter records and resets all candidate vote counts to 0
- **Sidebar Navigation** — Collapsible sidebar for admin panel navigation

---

## 🔄 Application Data Flow

```
┌──────────────┐     POST /signup      ┌──────────────┐     MongoDB
│              │ ──────────────────────►│              │ ──────────────►  voters
│   SignUp     │                        │              │
│   Component  │     POST /login       │   Express    │
│              │ ──────────────────────►│   Server     │ ◄──────────────  voters
└──────────────┘                        │   (app.js)   │
                                        │              │
┌──────────────┐  POST /checkuser      │              │ ──────────────►  vid_lists
│   Login      │ ──────────────────────►│              │
│   Component  │                        │              │
└──────────────┘                        │              │
                                        │              │
┌──────────────┐  GET /candidates      │              │ ◄──────────────  candidates
│   Home       │ ──────────────────────►│              │
│  (Voting)    │  PUT /candidates/:id  │              │ ──────────────►  candidates
│              │ ──────────────────────►│              │
│              │  POST /finishedvoting │              │ ──────────────►  vid_lists
│              │ ──────────────────────►│              │
└──────────────┘                        │              │
                                        │              │
┌──────────────┐  CRUD /candidates     │              │ ◄─────────────►  candidates
│   Admin      │ ──────────────────────►│              │
│   Panel      │  DELETE /clearVoters  │              │ ──────────────►  vid_lists
│              │ ──────────────────────►│              │                  candidates
└──────────────┘                        └──────────────┘
```

---

## 🚀 How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally)

### Backend
```bash
cd backend
# Create a .env file with:
#   PORT=5000
#   MONGODB_URL=mongodb://localhost:27017/Voting_System
#   JWT_SECRET=your-secret-key-here
npm install
node app.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and the backend API on `http://localhost:5000`.

### Run Tests
```bash
cd backend
npm test
```

---

## ⚠️ Known Limitations & Areas for Improvement

| Area                  | Issue / Improvement                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| ~~Authentication~~    | ✅ Resolved — JWT tokens now used for voter authentication (1-day expiry)                              |
| **Admin Auth**        | Admin routes (`/Admin`, `/Addcandidate`, etc.) have no authentication or role-based access control      |
| **API Security**      | No input sanitization or rate limiting on endpoints                                                      |
| ~~Hardcoded URLs~~    | ✅ Resolved — Frontend uses centralized Axios instance (`src/api/axios.js`) with `baseURL`             |
| **Duplicate DB Setup**| `db.js` exists but is unused; `app.js` handles its own MongoDB connection                              |
| ~~Error Handling~~    | ✅ Resolved — Null check added for `userdata` before `bcrypt.compare` in login                         |
| **State Data**        | State/District/Taluk data is hardcoded in `SignUp.jsx` — should be moved to DB or config               |
| **Duplicate Voters**  | Signup checks for duplicate `v_id` but login uses `username` — inconsistent identity handling           |
| **Scalability**       | Vote counting is done client-side then sent via PUT — vulnerable to manipulation                        |
| ~~Testing~~           | ✅ Resolved — 3 Jest unit tests with supertest + mongodb-memory-server                                 |
| **Responsive Design** | Limited responsive CSS — may need improvement for mobile devices                                        |

---

## 🧩 Dependencies

### Backend (`backend/package.json`)
| Package      | Version | Purpose                          |
| ------------ | ------- | -------------------------------- |
| express      | ^4.19.2 | Web framework                    |
| mongoose     | ^8.3.0  | MongoDB ODM                      |
| bcryptjs     | ^2.4.3  | Password hashing                 |
| bcrypt       | ^5.1.1  | Password hashing (native)        |
| jsonwebtoken | ^9.x    | JWT token generation/verification |
| cors         | ^2.8.5  | Cross-origin resource sharing    |
| body-parser  | ^1.20.2 | Request body parsing             |
| dotenv       | ^16.4.5 | Environment variable management  |
| mongodb      | ^6.5.0  | MongoDB driver                   |

### Backend Dev Dependencies
| Package                | Version | Purpose                          |
| ---------------------- | ------- | -------------------------------- |
| jest                   | ^29.x  | Test runner                      |
| supertest              | ^7.x   | HTTP assertions for Express      |
| mongodb-memory-server  | ^10.x  | In-memory MongoDB for tests      |

### Frontend (`frontend/package.json`)
| Package              | Version  | Purpose                         |
| -------------------- | -------- | ------------------------------- |
| react                | ^18.2.0  | UI library                      |
| react-dom            | ^18.2.0  | React DOM rendering             |
| react-router-dom     | ^6.22.3  | Client-side routing             |
| axios                | ^1.6.8   | HTTP client                     |
| chart.js             | ^4.4.2   | Chart library                   |
| react-chartjs-2      | ^5.2.0   | React wrapper for Chart.js      |
| react-force-graph-2d | ^1.25.4  | 2D force graph (unused)         |
| react-scripts        | ^5.0.1   | CRA build tooling               |

---

> **Generated on:** March 30, 2026 | **Last updated:** March 30, 2026 (JWT Auth + Jest Tests)
