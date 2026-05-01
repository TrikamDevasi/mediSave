# MediSave Backend

## Setup
1. cp .env.example .env
2. Add MONGODB_URI, REDIS_URL, GEMINI_API_KEY, OPENAI_API_KEY
3. npm install
4. npm run seed
5. npm run dev

## API Endpoints
- GET  /health
- GET  /api/medicine/search?q=atorvastatin
- GET  /api/medicine/:id
- GET  /api/medicine/:id/alternatives
- POST /api/ocr/scan { image: base64, mimeType: "image/jpeg" }
- GET  /api/pharmacy/nearby?lat=23.02&lng=72.57&radius=1000
- GET  /api/pharmacy/janaushadhi?lat=23.02&lng=72.57
- POST /api/chat { message: "Is metformin safe?", sessionId: "abc" }
