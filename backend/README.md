# 🎵 Bookletify Backend

## Table of Contents
- [Description](#description)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Running the server](#running-the-server)
- [Endpoints](#endpoints)
- [Features](#features)
- [Folder structure](#folder-structure)
- [Future improvements](#future-improvements)
- [Author](#author)

---

## 📖 Description

This is the backend API for Bookletify, a music discovery and album review platform.
Built with Node.js + TypeScript, this service handles:
- Authentication (JWT + bcrypt)
- Role-based access (User/Admin)
- Favorites & reviews
- Discogs API integration
- MongoDB storage via Mongoose

The API is deployed on **Render**: [https://bookletify-api.onrender.com](https://bookletify-api.onrender.com)

---

## 🧰 Tech Stack

|   Area   | Technology |
|----------|------------|
| Runtime  |  Node.js.  |
| Language | TypeScript |
| Framework| Express.js |
| Database |  MongoDB   |
|   Auth   | JWT + bcrypt |
| External API | Express.js |
| Deployment | Render |

---

## 🚀 Installation

```bash
git clone <repo-url>
cd backend
npm install
```

---

## 🔑 Environment Variables

```ini
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/bookletify
JWT_SECRET=yourSecretKey

DISCOGS_API_URL=https://api.discogs.com/database/search
DISCOGS_TOKEN=yourDiscogsToken
```

---

## ▶️ Running the Server
### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

---

## 📡 Endpoints (cURL Examples)

👉 [View full Test Suite Documentation](./src/tests/README.md)

### 🔐 Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "secret123"}'
```

### 🔐 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "secret123"}'
```

### 👤 Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

### 🎧 Fetch albums from Discogs
```bash
curl "http://localhost:3000/api/discogs?artist=2pac"
```

### ⭐ Add Favorite
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"albumId":"123","title":"All Eyez On Me","artist":"2Pac"}'
```

### ❌ Remove Favorite
```bash
curl -X DELETE http://localhost:3000/api/favorites/123 \
  -H "Authorization: Bearer <TOKEN>"
```

### ✍️ Add Review
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"albumId":"123","rating":5,"text":"Classic album"}'
```

### ❌ Delete Review
```bash
curl -X DELETE http://localhost:3000/api/reviews/<REVIEW_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### 🛠️ Admin — Update User Role
```bash
curl -X PUT http://localhost:3000/api/admin/users/<USER_ID>/role \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

---

## ✅ Features

- JWT authentication & role-based access
- Secure password hashing with bcrypt
- Mongoose models & input validation
- Discogs API integration (album data)
- Centralized error handling
- Modular & scalable architechture

---

## 📂 Folder Structure
```css
src/  
├── controllers/  
├── middleware/  
├── models/  
├── routes/  
├── services/  
├── utils/  
└── server.ts  
```

---

## 🔮 Future Improvements
- Review editing with history tracking
- Admin review moderation
- Enhanced error handling feedback for offline PWA mode
- Optional use of React Query / Redux on frontend for scaling
- Language options (other than English)

## 👨‍💻 Author
**Shahryar Sabouri**
FOS24 @ Chas Academy