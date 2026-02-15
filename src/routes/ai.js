const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const personalityService = require('../services/personalityService');
const metricsService = require('../services/metricsService');

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    metricsService.incrementChatMessages();

    // Add system prompt from personality
    const systemPrompt = personalityService.getSystemPrompt();
    const fullContext = [
      { role: 'system', content: systemPrompt },
      ...context
    ];

    const response = await aiService.chat(message, fullContext);
    res.json(response);
  } catch (error) {
    metricsService.incrementErrors();
    res.status(500).json({ error: error.message });
  }
});

// Get model status
router.get('/status', async (req, res) => {
  try {
    const status = await aiService.getModelStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
