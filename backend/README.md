# 🎵 Bookletify Backend
## 📖 Description

A Node.js + TypeScript API that handles user authentication (JWT + bcrypt) and fetches album information from the Discogs API.
The database uses MongoDB Atlas.

## 🚀 Installation
git clone <repo-url>
cd backend
npm install

## Create an .env file in backend/:

```ini
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/bookletify
JWT_SECRET=yourSecretKey
DISCOGS_API_URL=https://api.discogs.com/database/search

DISCOGS_TOKEN=yourDiscogsToken
```


## Start the server:
```bash
npm run dev
```

## 🧩 Endpoints

### 🔐 Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "Shahryar", "email": "shah@example.com", "password": "secret123"}'
```

### 🔐 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "shah@example.com", "password": "secret123"}'
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


## ✅ Features

- JWT-based authentication
- Secure password hashing with bcrypt
- MongoDB integration via Mongoose
- Discogs API integration
- Input validation with express-validator
- Consistent error messages

## 🧪 Testing
All endpoints can be tested with cURL, Postman, or Insomnia.

## 📂 Structure
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

## 👨‍💻 Author
Shahryar Sabouri  
FOS24 @ Chas Academy