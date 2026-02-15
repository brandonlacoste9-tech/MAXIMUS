const express = require('express');
const router = express.Router();

// In-memory metrics storage (would be replaced with a proper DB in production)
let metrics = {
  totalChats: 0,
  totalMessages: 0,
  uptime: Date.now(),
  leadsGenerated: 0,
  messagesPerDay: {},
  popularTopics: {}
};

// Get all metrics
router.get('/', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - metrics.uptime) / 1000);
  res.json({
    ...metrics,
    uptimeSeconds,
    uptimeFormatted: formatUptime(uptimeSeconds)
  });
});

// Update metrics (internal use)
router.post('/increment', (req, res) => {
  const { metric, value = 1 } = req.body;
  if (metrics[metric] !== undefined) {
    metrics[metric] += value;
  }
  res.json({ success: true, metrics });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

// Export metrics object for use in other modules
module.exports = router;
module.exports.metrics = metrics;
