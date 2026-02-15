const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { apiLimiter, chatLimiter, writeLimiter } = require('./middleware/rateLimiter');
const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');
const leadsRoutes = require('./routes/leads');
const personalityRoutes = require('./routes/personality');
const chatRoutes = require('./routes/chat');
const bridgesRoutes = require('./routes/bridges');

// Initialize messaging bridges
const telegramBridge = require('./services/telegramBridgeService');
const whatsappBridge = require('./services/whatsappBridgeService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// API Routes with specific rate limiters
app.use('/api/health', healthRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/leads', writeLimiter, leadsRoutes);
app.use('/api/personality', writeLimiter, personalityRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/bridges', bridgesRoutes);

// Serve static files from React build (with rate limiting)
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve React app for all other routes (with rate limiting)
app.get('*', apiLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Initialize messaging bridges
telegramBridge.initialize();
whatsappBridge.initialize();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await telegramBridge.stop();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🐝 MAXIMUS AI Assistant running on port ${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'ollama'}`);
  console.log(`Telegram: ${process.env.TELEGRAM_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
  console.log(`WhatsApp: ${process.env.WHATSAPP_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
});
