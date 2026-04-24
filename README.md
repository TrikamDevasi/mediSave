# mediSave

# 💊 MediSave

> **"Pay less. Stay healthy."**  




## 🎯 Problem
Same Atorvastatin 10mg: **₹8** (Jan Aushadhi) vs **₹98** (branded). No offline pharmacy price comparison app exists.

**ITCH Score: 91/100** | **1.4B Indians** buy medicines | **90% offline purchases**

## 🏥 What is MediSave?
**Offline-pharmacy-first PWA** (unlike 1mg/Truemeds):
1. Scan prescription → AI extracts medicines
2. Compare nearby pharmacies + online prices
3. Find 50-92% cheaper generics + Jan Aushadhi stores
4. Track savings + price alerts

## ✨ Key Features
- 📷 **OCR Scanner** (Gemini → GPT-4o fallback)
- 💰 **Multi-pharmacy comparison** (Apollo, MedPlus, 1km radius)
- 🧬 **Generic matcher** (CDSCO-approved)
- 🗺️ **10K+ Jan Aushadhi locator**
- 💬 **Safety chatbot** (LangChain RAG)
- 📊 **Savings dashboard** + alerts

## 🛠 Tech Stack
```
Frontend: React + Vite + Tailwind + PWA
Backend: Node/Express + MongoDB + Redis
AI/ML: Gemini OCR + LangChain RAG
APIs: Google Maps, Jan Aushadhi, OpenFDA
Deploy: Vercel + Render
```

## 📁 Simplified 3-Folder Structure
```
medisave/
├── frontend/                 # React PWA (Vite)
│   ├── public/              # manifest.json, sw.js, icons
│   ├── src/
│   │   ├── components/      # MediCard, SearchBar, MapView
│   │   ├── pages/           # Home, Results, Scanner, Dashboard
│   │   ├── hooks/           # useOCR, useMedicineSearch
│   │   ├── store/           # Zustand slices
│   │   └── utils/           # formatPrice, distance
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node/Express API
│   ├── routes/              # medicine.js, ocr.js, pharmacy.js
│   ├── controllers/         # medicine.controller.js
│   ├── models/              # Medicine.js, Pharmacy.js
│   ├── services/
│   │   ├── ai/             # gemini.js, ocr.orchestrator.js
│   │   ├── data/           # janAushadhi.js, openFDA.js
│   │   └── domain/         # genericMatcher.js
│   ├── middleware/          # auth.js, cache.js
│   ├── config/             # db.js, redis.js
│   ├── app.js
│   └── server.js
│
└── ml-service/              # AI/ML Microservice
    ├── ocr/
    │   ├── gemini.js
    │   ├── openai.js
    │   └── tesseract.js
    ├── rag/
    │   ├── langchain.chain.js
    │   └── vectorStore.js
    ├── generic-matcher.js
    └── server.js            # Express microservice
```

## 🚀 Getting Started (Simplified)
```bash
git clone https://github.com/TrikamDevasi/medisave.git
cd medisave

# Install all
npm install

# Seed data
npm run seed

# Run servers
npm run dev:frontend  # localhost:5173
npm run dev:backend   # localhost:5000
npm run dev:ml        # localhost:3000
```

## 🔌 Key APIs
```
GET  /api/medicine/search?q=atorvastatin
POST /api/ocr/scan          # {image: base64}
GET  /api/pharmacy/nearby
POST /ml/ocr/scan           # ML service endpoint
```

## 🌐 Deployment
- **Frontend:** Vercel (`frontend/`)
- **Backend:** Render (`backend/`)  
- **ML Service:** Render (`ml-service/`)
- **DB:** MongoDB Atlas + Redis Cloud

## 📱 User Flow
```
Home → Scan/Search → Results → Detail → Map → Dashboard
```

**Built by Trikam Devasi** 