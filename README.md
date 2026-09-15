# ANIL MURTI ART — Production-Grade MERN System + Admin Portal

> **Official Full-Stack Web Platform for Anil Murti Art (Jaipur, Rajasthan)**  
> Master sculptors of handcrafted sacred marble murtis, Hindu deity idols, and royal bespoke sculptures.

---

## 🏛️ System Architecture

```
                       ┌─────────────────────────┐
                       │   MongoDB Database      │
                       │   (Mongoose Atlas)      │
                       └────────────▲────────────┘
                                    │
                                    │
                       ┌────────────┴────────────┐
                       │   Node.js + Express API │
                       │   (Port: 5000)          │
                       │   Cloudinary SDK        │
                       └────────────▲────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
          ┌──────────┴──────────┐       ┌──────────┴──────────┐
          │   Public Frontend   │       │     Admin Portal    │
          │   React + Vite      │       │     React + Vite    │
          │   (Port: 5173)      │       │     (Port: 5174)    │
          └─────────────────────┘       └─────────────────────┘
```

---

## 🚀 Port & Applications Mapping

| Application | Technology Stack | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | Node.js, Express, MongoDB Mongoose, JWT, Cloudinary | `http://localhost:5000` | Centralized data, authentication, upload, search & business logic |
| **Public Frontend** | React, Vite, React Router, React Icons, PWA | `http://localhost:5173` | Luxury marble showroom, dynamic collections, WhatsApp conversion |
| **Admin Portal** | React, Vite, React Router, React Icons, PWA | `http://localhost:5174` | Executive catalog control, image uploads, inquiries pipeline & stats |

---

## 🔐 Default Administrator Login

- **Login URL:** `http://localhost:5174/login`
- **Email:** `admin@anilmurtiart.com`
- **Password:** `Admin@12345`

---

## 📦 Project Directory Structure

```
anilmurtiart/
├── package.json              # Root script orchestration (runs all 3 on separate ports)
├── README.md                 # Complete system documentation
│
├── backend/                  # Production Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # Database (db.js) & Cloudinary (cloudinary.js)
│   │   ├── controllers/      # Auth, Categories, Collections, Enquiries, Reviews, Upload
│   │   ├── middleware/       # JWT Auth, Multer, RateLimiter, ErrorHandler
│   │   ├── models/           # User, Category, Collection, Enquiry, Review
│   │   ├── routes/           # RESTful route definitions
│   │   ├── utils/            # ApiResponse, Slugify, SeedAdmin
│   │   ├── app.js            # Express app setup & CORS
│   │   └── server.js         # Server bootstrap
│   ├── .env                  # Pre-configured environment variables
│   └── package.json
│
├── frontend/                 # Public Digital Showroom
│   ├── src/
│   │   ├── api/              # Centralized API service layer (apiClient, collectionApi, etc.)
│   │   ├── assets/brand/     # Official Anil Murti Art logo & brand identity
│   │   ├── components/       # Header, Footer, MobileNav, CollectionCard, Modals, Lightbox
│   │   ├── pages/            # Home, Collections, CollectionDetails, About, Contact
│   │   ├── routes/           # App routing
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css         # Luxury marble design tokens & typography
│   ├── public/               # PWA icons, manifest.json
│   ├── vite.config.js        # Port 5173 + Proxy
│   └── package.json
│
└── adminpanel/               # Executive Admin Dashboard
    ├── src/
    │   ├── api/              # Centralized admin API service & token interceptors
    │   ├── assets/brand/     # Official brand logo
    │   ├── context/          # AuthContext (JWT session management)
    │   ├── components/       # AdminLayout, ProtectedRoute, ConfirmModal
    │   ├── pages/            # Login, Dashboard, Collections (List/Form), Categories, Enquiries, Profile
    │   ├── routes/           # Admin routing
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css         # Admin styling
    ├── public/               # PWA manifest
    ├── vite.config.js        # Port 5174 + Proxy
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
Run from the root directory:
```bash
npm run install:all
```
*(or run `npm install` inside `backend`, `frontend`, and `adminpanel` individually)*

### 2. Start All 3 Services Concurrently
```bash
npm run dev
```
This concurrently starts:
- `backend` on `http://localhost:5000`
- `frontend` on `http://localhost:5173`
- `adminpanel` on `http://localhost:5174`

### 3. Or Start Individually in 3 Separate Terminal Windows
- **Terminal 1 (Backend):**
  ```bash
  cd backend && npm run dev
  ```
- **Terminal 2 (Frontend):**
  ```bash
  cd frontend && npm run dev
  ```
- **Terminal 3 (Admin Panel):**
  ```bash
  cd adminpanel && npm run dev
  ```

---

## 🛠️ Environment Configuration (.env)

The `backend/.env` file is pre-configured with the required MongoDB Atlas cluster and Cloudinary credentials:

```env
PORT=5000
MONGODB_URI=mongodb+srv://Archinova_87:Realme14PRO%2B%2B@cluster0.qdqujbw.mongodb.net/anilmurtiarts?retryWrites=true&w=majority
JWT_SECRET=gaUR4v3st4t3_sup3r_s3cur3_k3y_2026
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=dhnkbbidv
CLOUDINARY_API_KEY=831413759898431
CLOUDINARY_API_SECRET=dL9cU9R1bKjkgx3Low_LOWvMhAY
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

---

## 💎 Key Production Features

1. **Brand Identity & Multimodal Logo:**
   - Official Anil Murti Art logo seamlessly integrated across Frontend (Desktop navbar, Mobile top bar, Footer, Favicon, PWA) and Admin Panel (Login screen, Sidebar branding, Header).
2. **Dynamic Data Flow & Initial Empty State:**
   - The database starts clean. No hardcoded mock products.
   - Frontend gracefully displays tailored empty states if no live artworks exist yet.
3. **Cloudinary Asset Pipeline:**
   - Admin uploads images directly through backend streaming to Cloudinary (`/api/upload`).
   - Image reordering, primary selection, and automated Cloudinary deletion on artwork removal.
4. **Visibility & Featured Controls:**
   - `isLive = false`: Completely hides the artwork from all public API queries and showroom pages.
   - `isFeatured = true`: Dynamically promotes the artwork to the homepage Featured Masterpieces section.
5. **Interactive WhatsApp Conversion:**
   - Clicking "I'm Interested" captures the lead into MongoDB and opens WhatsApp with pre-filled idol specifications (Name, Material, Height, Finish).
6. **Executive Admin Dashboard:**
   - Real-time clickable KPI stat cards linking directly to pre-filtered collection or inquiry views.
   - Status pipeline management: `New` ➔ `Contacted` ➔ `In Progress` ➔ `Converted` ➔ `Closed`.
7. **Mobile-First PWA:**
   - Mobile bottom navigation bar on frontend.
   - Installable progressive web app manifests on both frontend and admin panel.
