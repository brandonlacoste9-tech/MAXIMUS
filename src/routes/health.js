const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const os = require('os');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const aiStatus = await aiService.getModelStatus();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: { status: 'healthy' },
        ai: { 
          status: aiStatus.status === 'connected' || aiStatus.status === 'configured' ? 'healthy' : 'degraded',
          provider: aiStatus.provider
        }
      },
      system: {
        uptime: process.uptime(),
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal
        },
        cpu: os.loadavg()[0]
      }
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;
