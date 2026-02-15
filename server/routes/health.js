const express = require('express');
const router = express.Router();
const axios = require('axios');

// Health check endpoint
router.get('/', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'up',
      ollama: 'unknown',
      telegram: process.env.TELEGRAM_ENABLED === 'true' ? 'configured' : 'disabled',
      whatsapp: process.env.WHATSAPP_ENABLED === 'true' ? 'configured' : 'disabled'
    }
  };

  // Check Ollama if it's the selected provider
  if (process.env.AI_PROVIDER === 'ollama') {
    try {
      const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
      await axios.get(`${ollamaHost}/api/tags`, { timeout: 2000 });
      health.services.ollama = 'up';
    } catch (error) {
      health.services.ollama = 'down';
      health.status = 'degraded';
    }
  }

  res.json(health);
});

module.exports = router;
