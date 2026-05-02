# 💊 MediSave

> **"Pay less. Stay healthy."**

[![Frontend — Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Backend — Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![ML Service — Render](https://img.shields.io/badge/ML%20Service-Render-46E3B7?logo=render)](https://render.com)
[![Database — MongoDB Atlas](https://img.shields.io/badge/DB-MongoDB%20Atlas-47A248?logo=mongodb)](https://mongodb.com/atlas)

---

## 🎯 Problem Statement

The healthcare burden in India is massive, with millions of citizens spending a significant portion of their income on essential medicines. A drug like Atorvastatin 10mg costs **₹98** under major brands but is available for just **₹8** at Jan Aushadhi stores. However, there is a severe lack of awareness and **no dedicated offline pharmacy price comparison platform** to empower users with this knowledge.

- **Vast Market:** 1.4 Billion Indians buy medicines, yet over 90% of these purchases still happen at offline, brick-and-mortar pharmacies.
- **Information Asymmetry:** Patients are heavily reliant on specific prescribed brands, often unaware of high-quality, CDSCO-approved generic alternatives that cost 50–90% less.
- **Fragmented Pricing:** Prices vary significantly between local pharmacies, national chains like Apollo/MedPlus, and online distributors. Finding the best local price is practically impossible without visiting multiple stores.

---

## 🏥 What is MediSave?

**MediSave** is an offline-pharmacy-first Progressive Web App (PWA) that democratizes access to affordable medicines by breaking down information barriers in the pharmaceutical market. By simply taking a picture of their prescription, users unlock localized, cost-effective healthcare choices.

### How it solves the problem

1. **AI-Powered Digitization** — Gemini (with GPT-4o / Groq fallback) accurately extracts medicine names and dosages from complex prescriptions.
2. **Generic Alternatives Matcher** — Instantly identifies CDSCO-approved generic equivalents and maps them to government-subsidized Jan Aushadhi stores.
3. **Hyperlocal Price Intelligence** — Compares prices across nearby offline pharmacies via OpenStreetMap Overpass API (zero cost, no API key needed).
4. **Actionable Insights** — Plots the cheapest nearby pharmacies on an interactive Leaflet map and tracks cumulative user savings over time.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📷 **Smart OCR Scanner** | Prescription scanner powered by Gemini (GPT-4o & Groq fallback) |
| 💰 **Multi-Pharmacy Comparison** | Real-time price comparison across Apollo, MedPlus, Netmeds, 1mg, Jan Aushadhi |
| 🧬 **Verified Generic Matcher** | CDSCO-approved generic database for clinical equivalency |
| 🗺️ **Jan Aushadhi Locator** | Maps 10K+ government-subsidized stores near you |
| 💬 **MediBot Safety Chatbot** | LangChain RAG-based assistant for side effects and drug interactions |
| 📊 **Savings Dashboard** | Track historical savings with animated counters and charts |
| 🔍 **Smart Medicine Search** | Real-time fuzzy search (Fuse.js) with generics and price comparison |
| 🏥 **Nearby Pharmacies** | Location-aware pharmacy discovery via OpenStreetMap Overpass API |
| 🌗 **Ink-Bloom Dark Mode** | Smooth View Transitions API theme switch with ink-bloom animation |
| ⚡ **Performance Optimized** | Virtual list, React.memo, debounced search, content-visibility CSS |

---

## 🛠 Tech Stack

### Frontend (deployed on Vercel)
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 + TanStack Start |
| Router | TanStack Router (file-based) |
| UI Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Fuzzy Search | Fuse.js |
| Virtual List | @tanstack/react-virtual |
| Data Fetching | Axios + TanStack Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

### Backend (deployed on Render)
| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ + Express |
| Database | MongoDB Atlas |
| Cache | Redis Cloud (optional) |
| Auth | JWT |
| OCR AI | Gemini Flash / GPT-4o / Groq (`llama-3.3-70b`) |
| Pharmacy Data | OpenStreetMap Overpass API (free) |
| Medicine Data | Jan Aushadhi API + OpenFDA |

### ML Service (deployed on Render)
| Layer | Technology |
|---|---|
| RAG | LangChain.js |
| Vector Store | Chroma (local) |
| Embeddings | Gemini `embedding-001` / OpenAI `text-embedding-3-small` |
| LLM (default) | Groq `llama-3.3-70b-versatile` |
| Fallback LLM | Gemini 1.5 Flash / GPT-4o |

---

## 📁 Project Structure

```
medisave/                          # Monorepo root
├── .gitignore                     # Root gitignore (node_modules, .env, lock files)
├── render.yaml                    # One-click Render deploy (backend + ML service)
├── package.json                   # Root scripts (concurrently)
│
├── frontend/                      # React PWA (TanStack Start + Vite)
│   ├── vercel.json                # Vercel SPA routing + cache headers
│   ├── src/
│   │   ├── routes/                # File-based routing (TanStack Router)
│   │   │   ├── __root.tsx         # Root layout + SEO meta + theme toggle
│   │   │   ├── index.tsx          # Home page (hero, stats, features)
│   │   │   ├── scan.tsx           # Prescription OCR scanner
│   │   │   ├── search.tsx         # Medicine search results + price bars
│   │   │   ├── medicine.$id.tsx   # Medicine detail page
│   │   │   ├── nearby.tsx         # Nearby pharmacy finder (OSM Overpass)
│   │   │   └── dashboard.tsx      # Savings dashboard
│   │   ├── components/
│   │   │   ├── medicine/          # MediCard (memo), GenericCard
│   │   │   ├── pharmacy/          # PharmacyCard
│   │   │   ├── common/            # BottomSheet, TiltCard, MagneticButton, ParticleBurst…
│   │   │   ├── layout/            # Header (animated theme toggle), BottomNav, AppLayout
│   │   │   └── ui/                # shadcn/ui primitives
│   │   ├── hooks/                 # useDebounce, useScrollPosition, useTheme
│   │   ├── lib/                   # axios (env-based baseURL)
│   │   ├── data/                  # Mock/static data
│   │   └── styles.css             # Design system + performance CSS
│   ├── public/
│   │   └── placeholder-medicine.svg
│   └── package.json
│
├── backend/                       # Node/Express REST API
│   ├── app.js                     # Express app (dynamic CORS for Vercel)
│   ├── server.js                  # Entry point
│   ├── config/                    # DB + Redis config
│   ├── routes/                    # medicine, ocr, pharmacy, chat, places, auth
│   ├── models/                    # Mongoose schemas
│   ├── middleware/                 # Auth, error handling
│   ├── services/                  # Generic matcher, Jan Aushadhi, OpenFDA
│   ├── scripts/                   # seed.js
│   └── package.json               # engines: node >=18
│
└── ml-service/                    # AI/ML Node microservice
    ├── server.js
    ├── ocr/                       # Prescription OCR (Gemini/GPT-4o/Groq)
    ├── rag/                       # LangChain RAG chatbot
    ├── generic-matcher.js
    └── package.json
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas free tier](https://mongodb.com/atlas))
- Redis (optional — only needed for session caching)

### 1. Clone the repository
```bash
git clone https://github.com/TrikamDevasi/mediSave.git
cd mediSave
```

### 2. Configure environment variables

Copy the example files and fill in your keys:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env    # if it exists
```

**`backend/.env`**
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/medisave
REDIS_URL=redis://localhost:6379          # optional

GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
FOURSQUARE_KEY=your_foursquare_key

ML_SERVICE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

JWT_SECRET=your_jwt_secret_min_32_chars
SESSION_SECRET=your_session_secret
```

**`ml-service/.env`**
```env
PORT=3000
NODE_ENV=development

GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key

LLM_PROVIDER=groq
EMBEDDING_PROVIDER=gemini

GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_MODEL=gemini-1.5-flash
OPENAI_MODEL=gpt-4o
EMBEDDING_MODEL_GEMINI=models/embedding-001
EMBEDDING_MODEL_OPENAI=text-embedding-3-small

BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000/api
VITE_ML_URL=http://localhost:3000/ml
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
```

### 3. Install & run

```bash
# Install root + all workspace dependencies
npm install

# Seed the database (optional)
cd backend && node scripts/seed.js && cd ..

# Run all three services concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| ML Service | http://localhost:3000 |

---

## 🔌 API Reference

### Backend (`/api`)
```
GET  /api/medicine/search?q=atorvastatin    # Fuzzy search medicines
GET  /api/medicine/:id                      # Medicine detail + generics
POST /api/ocr/scan                          # Scan prescription { image: base64 }
GET  /api/places/nearby?lat=&lng=&r=2000    # Nearby pharmacies (OSM Overpass)
GET  /api/pharmacy/jan-aushadhi             # Jan Aushadhi store locator
POST /api/auth/login                        # JWT login
POST /api/auth/register                     # Register
GET  /health                                # Health check (used by Render)
```

### ML Service (`/ml`)
```
POST /ml/ocr/scan        # AI prescription extraction
POST /ml/chat            # RAG chatbot (drug safety & interactions)
GET  /ml/health          # Health check (used by Render)
```

---

## 🌐 Deployment

### Architecture Overview

```
User → Vercel (Frontend SPA)
         │
         ├── VITE_API_URL ──→ Render (Backend API) ──→ MongoDB Atlas
         │                          │
         │                    FRONTEND_URL (CORS)
         │                    ML_SERVICE_URL ──→ Render (ML Service)
         │
         └── OSM Overpass API (direct from browser, no key needed)
```

### Frontend → Vercel

| Setting | Value |
|---|---|
| **Framework Preset** | Vite (or Other) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | (Leave empty — auto-detected) |
| **Install Command** | `npm install` |

**Environment Variables to set in Vercel Dashboard:**
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://medisave-anb2.onrender.com/api` |
| `VITE_ML_URL` | `https://medisave-ml.onrender.com/ml` |
| `VITE_GOOGLE_MAPS_KEY` | your Google Maps key |

> 🚀 **Note:** TanStack Start automatically handles Vercel deployment using the Build Output API. No `vercel.json` is required.


---

### Backend + ML Service → Render

**Option A — One-click via `render.yaml`** (recommended):
1. Push this repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect your GitHub repo → Render auto-reads `render.yaml` and creates both services

**Option B — Manual (per service):**

#### Backend
| Setting | Value |
|---|---|
| **Service Type** | Web Service |
| **Runtime** | Node |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Health Check Path** | `/health` |

**Environment Variables to set in Render Dashboard:**
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/medisave` |
| `JWT_SECRET` | long random string (32+ chars) |
| `SESSION_SECRET` | long random string |
| `GEMINI_API_KEY` | your key |
| `GROQ_API_KEY` | your key |
| `OPENAI_API_KEY` | your key (optional fallback) |
| `FRONTEND_URL` | `https://medi-save-opal.vercel.app` |
| `ML_SERVICE_URL` | `https://medisave-ml.onrender.com` |

#### ML Service
| Setting | Value |
|---|---|
| **Service Type** | Web Service |
| **Runtime** | Node |
| **Root Directory** | `ml-service` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Health Check Path** | `/ml/health` |

**Environment Variables:**
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `LLM_PROVIDER` | `groq` |
| `GROQ_API_KEY` | your key |
| `GEMINI_API_KEY` | your key |
| `BACKEND_URL` | `https://medisave-anb2.onrender.com` |
| `FRONTEND_URL` | `https://medi-save-opal.vercel.app` |

> ⚠️ **Free tier note:** Render free services spin down after 15 min of inactivity. First request after sleep takes ~30s. Upgrade to **Starter ($7/mo)** for always-on.

---

### Database → MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with `readWrite` on `medisave` db
3. Whitelist `0.0.0.0/0` (or Render's IP range) in Network Access
4. Copy the connection string → set as `MONGODB_URI` in Render

---

## 📱 User Flow

```
Onboarding → Home → Scan Prescription  ──→ Search Results → Medicine Detail
                 ↘ Search Directly  ──────↗                      ↓
                                                           Nearby Pharmacies (OSM)
                                                                 ↓
                                                            Dashboard (Savings)
```

---

## ⚡ Performance

| Metric | Achieved |
|---|---|
| Pharmacy list | Virtualised (`@tanstack/react-virtual`) — only ~8 DOM nodes regardless of result count |
| Search suggestions | Debounced 300ms — Fuse.js only runs after typing stops |
| MediCard re-renders | `React.memo` — skips re-render when props unchanged |
| Theme switch | View Transitions API ink-bloom (750ms, GPU-accelerated) |
| Off-screen cards | `content-visibility: auto` — browser skips paint for non-visible cards |
| iOS input zoom | `font-size: max(16px, 1em)` prevents auto-zoom |
| Touch targets | 44px minimum (WCAG 2.5.5) |

---

**Built by Trikam Devasi** 🚀