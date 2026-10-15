# 🚀 ICODESAVE - Modern Cloud Code Snippet Vault

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)

**ICODESAVE** is a modern, full-stack cloud code snippet manager designed for developers and programmers. Easily archive, organize, search, share, print, and download code snippets across languages with a clean, high-performance developer UI.

---

## ✨ Features

- **⚡ Fast Code Snippet Vault**: Create, save, and manage code snippets with instant cloud sync.
- **🏷️ Language & Tag Categorization**: Support for multiple languages (`JavaScript`, `TypeScript`, `Python`, `HTML/CSS`, `JSON`, `SQL`, `C++`, `Java`, `Go`, `Rust`, `Bash`, `Markdown`) and flexible tagging.
- **🔍 Multi-Field Search & Filtering**: Real-time search across titles, tags, and code content, plus tag filter pills and sorting (Newest, Oldest, Alphabetical).
- **📝 Real-time Line Numbering**: Synchronized editor and viewer line counts.
- **🔗 Shareable Snippet Links**: Share individual snippet permalinks (`/view/:id`) with one-click URL copying.
- **💾 Export & Print**: Download source code files directly with proper language extensions (`.js`, `.py`, `.ts`, etc.) or generate print-friendly code sheets.
- **🔒 Secure Authentication**: Protected routes with JWT tokens, password hashing with `bcryptjs`, and seamless session recovery.
- **👤 Profile Management & Cloud Feedback**: Edit developer profiles, view saved metrics, and submit user ratings and feedback.
- **💎 Glassmorphism UI**: Beautiful midnight dark theme with subtle ambient glowing gradients, animated cursors, and responsive mobile drawers.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`noteSlice`, `confirmSlice`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System
- **Routing**: [React Router DOM v6](https://reactrouter.com/) (Data APIs & Protected Routes)
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security & Validation**: [JSON Web Token (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [express-validator](https://express-validator.github.io/docs/)
- **CORS**: Configurable cross-origin middleware supporting local and cloud origins

---

## 📁 Repository Structure

```plaintext
ICODESAVE/
├── Backend/                   # Node.js Express API Server
│   ├── middleware/            # JWT authentication middleware (fetchuser.js)
│   ├── models/                # Mongoose models (User, Note, Feedback)
│   ├── routes/                # REST API routes (auth, notes, feedback)
│   ├── db.js                  # MongoDB database connection
│   ├── server.js              # Express app entrypoint & configuration
│   ├── .env                   # Backend environment configuration
│   └── package.json           # Backend dependencies and scripts
├── src/                       # Frontend React Application
│   ├── assets/                # Visual assets and icons
│   ├── components/            # UI components (Home, Paste, ViewPaste, Navbar, Profile, etc.)
│   ├── redux/                 # Redux Toolkit store and slices (noteSlice, confirmSlice)
│   ├── routes/                # ProtectedRoute and navigation guards
│   ├── utils/                 # Axios client with interceptors (axiosinstance.js)
│   ├── App.jsx                # Layout shell, ambient glows & toasts
│   ├── index.css              # Typography, scrollbars & glassmorphism utilities
│   └── main.jsx               # App entrypoint and RouterProvider
├── public/                    # Static public assets
├── vite.config.js             # Vite configuration with chunk splitting & dev proxy
├── package.json               # Frontend dependencies and scripts
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/manojsingh00963/ICODESAVE.git
cd ICODESAVE
```

### 2. Configure Backend
```bash
cd Backend
npm install
```

Create or verify `Backend/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/icodesave
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```
The backend API will run on `http://localhost:5000`.

### 3. Configure Frontend
Open a new terminal window in the root directory:
```bash
npm install
```

Create or verify `.env` in the root:
```env
# Optional: Set remote API URL if deployed, or leave empty to use Vite's built-in /api proxy
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```
The application will open on `http://localhost:5173`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/createUser` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | ❌ No |
| `GET` | `/api/auth/getuser` | Fetch current logged-in user profile | ✅ Yes |
| `PUT` | `/api/auth/updateuser` | Update profile (name, role, bio, avatar) | ✅ Yes |

### Snippets / Notes (`/api/notes`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notes/fetchnotes` | Get all snippets for the logged-in user | ✅ Yes |
| `GET` | `/api/notes/getnote/:id` | Get single snippet by ID (public/shareable) | ❌ No / Optional |
| `POST` | `/api/notes/addnote` | Create a new code snippet | ✅ Yes |
| `PUT` | `/api/notes/updatenote/:id` | Update an existing code snippet | ✅ Yes |
| `DELETE` | `/api/notes/deletenote/:id`| Delete an existing code snippet | ✅ Yes |

### Feedback & Health
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback/submit` | Submit rating & feedback | ✅ Yes |
| `GET` | `/api/feedback` | Retrieve latest public feedbacks | ❌ No |
| `GET` | `/health` | Server health check & uptime status | ❌ No |

---

## 🧪 Quality & Production Checks

- **Linting**:
  ```bash
  npm run lint
  ```
  *Passed with 0 errors and 0 warnings.*

- **Production Build**:
  ```bash
  npm run build
  ```
  *Optimized chunks with manual vendor, Redux, and motion code splitting.*

---

## 👨‍💻 Author

- **Manoj Singh** - [manojsingh00963](https://github.com/manojsingh00963)
