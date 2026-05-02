const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const medicineRoutes = require('./routes/medicine');
const ocrRoutes = require('./routes/ocr');
const pharmacyRoutes = require('./routes/pharmacy');
const chatRoutes = require('./routes/chat');
const placesRoutes = require('./routes/places');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());

// Dynamic CORS — allows localhost (dev), Vercel previews, and production FRONTEND_URL
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const productionFrontend = process.env.FRONTEND_URL;
    const isAllowedStatic = ALLOWED_ORIGINS.includes(origin);
    const isVercel = origin.endsWith('.vercel.app');
    const isRender = origin.endsWith('.onrender.com');
    const isProduction = productionFrontend && origin === productionFrontend;

    if (isAllowedStatic || isVercel || isRender || isProduction) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    service: 'medisave-backend',
    mongodb: mongoStatus,
    timestamp: new Date()
  });
});

app.use('/api/medicine', medicineRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
