require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/database/connection');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});