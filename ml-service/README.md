# MediSave ML Service

## Setup
1. cp .env.example .env
2. Add GEMINI_API_KEY, OPENAI_API_KEY
3. npm install
4. npm run dev

## Endpoints
- GET  /ml/health
- POST /ml/ocr/scan { image: base64, mimeType: "image/jpeg" }
- POST /ml/chat { message: "string", sessionId: "string" }
