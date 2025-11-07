# 🎵 Bookletify Frontend

## Table of Contents
- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [PWA Support](#pwa-support)
- [Folder Structure](#folder-structure)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

## 📖 Overview
Bookletify is a music discovery and review platform where users can:
- Search albums via the Discogs API
- Log in / register
- Save favorites
- Write reviews
- Access personal profile
- Use an admin dashboard to manage users & roles

**Live app:**
👉 https://bookletify.netlify.app

---

## 🧰 Tech Stack

|  Layer   | Technology |
|----------|------------|
| Framework | React (TS) |
|    UI     | CSS Modules |
|    HTTP   |    Axios    |
|    Auth   | JWT + Axios |
| PWA | Vite Plugin PWA + Workbox |
| Routing | React Router DOM |
| Deployment | Netlify |

---

## Features
- 🔐 Authentication (Login & Register)
- 👤 User Profile & Favorites
- 💬 Write / Delete Reviews
- 🌐 Discogs Album Search Integration
- 🛠 Admin Panel (role changes, user mgmt)
- 📱 Fully responsive UI
- 📦 PWA support (Installable app, offline fallback)
- 🧠 Context API auth management
- ✨ Clean modular file structure

---

## 🚀 Installation
```bash
git clone https://github.com/Shah-Sabouri/bookletify
cd frontend
npm install
```

---

## 🌍 Environment Variables
Create .env in /frontend:
```bash
VITE_API_URL=https://bookletify-api.onrender.com/api
```

---

## ▶️ Running the App
### Development:
```bash
npm run dev
```
### Build:
```bash
npm run build
```
### Preview build:
```bash
npm run preview
```

---

## 📱 PWA Support
Bookletify can be **installed on mobile & desktop**.

✅ Service worker
✅ Offline caching for visited pages
✅ Add-to-Home-Screen prompt
✅ iOS install hint fallback

Build with:
```js
VitePWA({
  registerType: "autoUpdate"
})
```

## Folder Structure
```bash
src/
├── components/
├── context/
├── pages/
├── services/
├── hooks/
├── styles/
└── main.tsx
```

---

## 🔮 Future Enhancements
- Edit review UX
- Spotify/Web music preview integration
- Full offline “read-only mode”
- Admin: moderation queue for reviews
- React Query for data caching/scalability

---

## 👤 Author
**Shahryar Sabouri**
FOS24 @ Chas Academy