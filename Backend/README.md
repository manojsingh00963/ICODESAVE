# ⚙️ ICODESAVE - Backend API

The Node.js Express backend powering the ICODESAVE code snippet vault.

---

## 📦 Tech Stack
- **Express.js** 4.x
- **Mongoose / MongoDB** 8.x
- **JSON Web Token (jsonwebtoken)** 9.x
- **bcryptjs** 3.x
- **express-validator** 7.x
- **CORS** & **Dotenv**

---

## 🚀 Environment Variables (`.env`)

Create a `.env` file in the `Backend/` directory:

```env
# MongoDB Connection URI
MONGO_URI=mongodb://127.0.0.1:27017/icodesave

# Server Port
PORT=5000

# JWT Secret Key
JWT_SECRET=your_jwt_secret_here

# Allowed Client Origin
CLIENT_URL=http://localhost:5173
```

---

## 🏃 Running the Server

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Start in production mode
npm start
```

---

## 📡 Endpoints Summary

- `GET /health`: Health check and uptime
- `GET /`: API status and registered endpoints
- `POST /api/auth/createUser`: Register user `{ name, email, password, role }`
- `POST /api/auth/login`: Login user `{ email, password }`
- `GET /api/auth/getuser`: Fetch user profile (Requires `authToken` header)
- `PUT /api/auth/updateuser`: Update user profile `{ name, role, bio, avatar }`
- `GET /api/notes/fetchnotes`: Fetch user's snippets
- `GET /api/notes/getnote/:id`: Fetch single snippet by ID (public/shareable)
- `POST /api/notes/addnote`: Create snippet `{ title, content, tag, language }`
- `PUT /api/notes/updatenote/:id`: Update snippet by ID
- `DELETE /api/notes/deletenote/:id`: Delete snippet by ID
- `POST /api/feedback/submit`: Submit feedback `{ rating, feedback }`
- `GET /api/feedback`: Fetch feedback list