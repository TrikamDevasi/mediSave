# 💊 MediSave

> **"Pay less. Stay healthy."**  




## 🎯 Problem Statement
The healthcare burden in India is massive, with millions of citizens spending a significant portion of their income on essential medicines. A drug like Atorvastatin 10mg costs **₹98** under major brands but is available for just **₹8** at Jan Aushadhi stores. However, there is a severe lack of awareness and **no dedicated offline pharmacy price comparison platform** to empower users with this knowledge.
- **Vast Market:** 1.4 Billion Indians buy medicines, yet over 90% of these purchases still happen at offline, brick-and-mortar pharmacies.
- **Information Asymmetry:** Patients are heavily reliant on specific prescribed brands, often unaware of high-quality, CDSCO-approved generic alternatives that cost 50-90% less.
- **Fragmented Pricing:** Prices vary significantly between local pharmacies, national chains like Apollo/MedPlus, and online distributors. Finding the best local price is practically impossible without visiting multiple stores.

## 🏥 Proposed Solution (What is MediSave?)
**MediSave** is an offline-pharmacy-first Progressive Web App (PWA) designed to democratize access to affordable medicines by breaking down information barriers in the pharmaceutical market. By simply taking a picture of their prescription, users can unlock localized, cost-effective healthcare choices.

### How it solves the problem:
1. **AI-Powered Digitization:** AI accurately extracts medicine names and dosages directly from complex prescriptions, eliminating the need to manually decipher handwriting.
2. **Generic Alternatives Matcher:** It instantly identifies CDSCO-approved generic equivalents and maps them to government-subsidized Jan Aushadhi stores, unlocking massive savings (up to 92%).
3. **Hyperlocal Price Intelligence:** Unlike online-only pharmacies (e.g., 1mg, Truemeds), MediSave compares prices across nearby offline pharmacies (within a 1km radius), ensuring patients get immediate relief at the best price locally.
4. **Actionable Insights:** It plots the cheapest nearby pharmacies and tracks cumulative user savings over time.

## ✨ Key Features
- 📷 **Smart OCR Scanner:** Powered by Gemini (with GPT-4o fallback) to digitize prescriptions effortlessly.
- 💰 **Multi-Pharmacy Comparison:** Real-time localized comparison between major chains and local neighborhood stores.
- 🧬 **Verified Generic Matcher:** CDSCO-approved generic database integration to ensure clinical equivalency and safety.
- 🗺️ **Jan Aushadhi Locator:** Locates and maps out to the 10K+ government-subsidized medical stores around you.
- 💬 **Safety & Interactions Chatbot:** LangChain RAG-based assistant providing instant safety information, side effects, and interactions.
- 📊 **Savings Dashboard:** Track your historical savings and set proactive price drop alerts.

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