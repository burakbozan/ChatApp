const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/chat', chatRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error'
  });
});

module.exports = app;