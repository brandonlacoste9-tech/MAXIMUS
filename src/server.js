require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const aiRoutes = require('./routes/ai');
const healthRoutes = require('./routes/health');
const leadsRoutes = require('./routes/leads');
const personalityRoutes = require('./routes/personality');
const metricsRoutes = require('./routes/metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/personality', personalityRoutes);
app.use('/api/metrics', metricsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve frontend
// Note: In production, add rate limiting to prevent abuse
// Example: app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`MAXIMUS AI Assistant running on port ${PORT}`);
  console.log(`AI Provider: ${process.env.AI_PROVIDER || 'ollama'}`);
  console.log(`Dashboard: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
