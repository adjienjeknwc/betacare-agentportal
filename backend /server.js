// server.js
require('dotenv').config();
const http = require('http');
const app = require('./src/app');

// FIXED: Removed the conflicting double declaration bug that crashes Node.js instantly.
// Point this to your standard database connection configuration file path.

const connectDB = require('./src/database/connection');
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize MongoDB Handshake Loop cleanly before spinning up the network port listener
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 AGENT PORTAL Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database boot framework crashed server initialization:', error.message);
    process.exit(1);
  });