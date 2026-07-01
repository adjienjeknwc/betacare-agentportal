const app = require('../backend/src/app');
const connectDB = require('../backend/src/database/connection');

// Connect to DB (Vercel serverless environment maintains connection pools)
let cachedDbConnection = null;
const connect = async () => {
  if (cachedDbConnection) return cachedDbConnection;
  cachedDbConnection = await connectDB();
  return cachedDbConnection;
};

module.exports = async (req, res) => {
  try {
    await connect();
  } catch (err) {
    console.error("Serverless DB connection error:", err.message);
  }
  return app(req, res);
};
