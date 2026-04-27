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

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
