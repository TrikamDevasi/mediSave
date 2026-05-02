require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    process.env.BACKEND_URL || 'http://localhost:5000',
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));

app.use('/ml/ocr', require('./ocr/ocr.routes'));
app.use('/ml/chat', require('./rag/chat.routes'));
app.get('/ml/health', (req, res) => {
  res.json({ status: 'ok', service: 'medisave-ml', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

async function startML() {
  const { getVectorStore } = require('./rag/vectorStore');
  getVectorStore()
    .then(() => console.log('✅ Vector store ready'))
    .catch(err => console.warn('⚠️ Vector store init failed (non-fatal):', err.message));

  app.listen(PORT, () => {
    console.log(`🤖 ML Service running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/ml/health`);
  });
}

startML();

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});
