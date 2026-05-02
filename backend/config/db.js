const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async (retries = 3) => {
  const uri = process.env.MONGODB_URI;

  // ── Guard: catch missing env var BEFORE attempting connection ──────────
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.error('   → In production (Render): add MONGODB_URI in Dashboard → Environment');
    console.error('   → In development: add MONGODB_URI=mongodb://127.0.0.1:27017/medisave to backend/.env');
    process.exit(1);
  }

  if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ MONGODB_URI points to localhost — this will never work on Render.');
      console.error('   → Set MONGODB_URI to your MongoDB Atlas connection string.');
      process.exit(1);
    }
  }

  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,  // fail fast instead of hanging
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        const delay = (i + 1) * 3000; // backoff: 3s, 6s
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('❌ MongoDB failed to connect after all retries. Check your MONGODB_URI and Atlas network access (allow 0.0.0.0/0).');
  process.exit(1);
};

module.exports = connectDB;

