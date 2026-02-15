const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');
const leadsRoutes = require('./routes/leads');
const personalityRoutes = require('./routes/personality');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/chat', chatRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🐝 MAXIMUS AI Assistant running on port ${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'ollama'}`);
});
