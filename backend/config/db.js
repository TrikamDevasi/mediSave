const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log('Retrying in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  console.error('MongoDB connection failed after 3 retries');
  process.exit(1);
};

module.exports = connectDB;
