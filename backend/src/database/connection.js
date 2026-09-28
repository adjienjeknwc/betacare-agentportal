const mongoose = require('mongoose');

// Disable buffering so failed DB connections immediately fallback instead of freezing for 10s
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.warn("MONGO_URI configuration variable is missing. Operating in resilient offline fallback mode.");
      return null;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected Successfully to: ${conn.connection.host}`);
    
    try {
      await mongoose.connection.collection('agents').dropIndex('email_1');
      console.log('🗑️ Dropped stale unique index email_1 successfully.');
    } catch (indexError) {
      // index not present or already removed
    }
    return conn;
  } catch (error) {
    console.warn(`⚠️ Warning: MongoDB connection bypassed (${error.message}). Operating in resilient fallback mode.`);
    return null;
  }
};

module.exports = connectDB;