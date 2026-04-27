require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./config/db');
const { redisClient } = require('./config/redis');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
  process.exit(1);
});
