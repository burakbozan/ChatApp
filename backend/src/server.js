require('dotenv').config();
const { createServer } = require('node:http');
const app = require('./app');
const connectDatabase = require('./services/databaseService');
const initializeSocket = require('./services/socketService');

const port = Number(process.env.PORT) || 4000;
const server = createServer(app);
app.set('io', initializeSocket(server));

connectDatabase()
  .then(() => {
    server.listen(port, () => {
      console.log(`ChatApp API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  });