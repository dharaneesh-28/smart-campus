const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.error('⚠️ Make sure local MongoDB is running, or specify a valid MONGO_URI in backend/.env');
    console.warn('⚠️ Starting in OFFLINE DEMO MODE (JavaScript mock fallbacks activated).');
  }
};

module.exports = connectDB;
