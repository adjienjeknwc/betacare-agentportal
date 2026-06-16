const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connects to the URI specified in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit the process with failure if it cannot connect
    process.exit(1);
  }
};

module.exports = connectDB;