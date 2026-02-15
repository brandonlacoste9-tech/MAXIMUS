const express = require('express');
const router = express.Router();
const metricsService = require('../services/metricsService');

// Get metrics
router.get('/', (req, res) => {
  try {
    const metrics = metricsService.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset metrics
router.post('/reset', (req, res) => {
  try {
    metricsService.reset();
    res.json({ message: 'Metrics reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
