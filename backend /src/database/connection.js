// src/database/connection.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Looks for your cluster URI string from the updated .env file layout 
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("MONGO_URI configuration variable is missing inside the .env environment matrix.");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected Successfully to: ${conn.connection.host}`);
    
    try {
      await mongoose.connection.collection('agents').dropIndex('email_1');
      console.log('🗑️ Dropped stale unique index email_1 successfully.');
    } catch (indexError) {
      console.log('ℹ️ Stale unique index email_1 not present or already removed.');
    }
  } catch (error) {
    // Catches and logs connection variables cleanly without crashing silently
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;