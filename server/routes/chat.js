const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { metrics } = require('./metrics');

// Chat with AI
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.chat(message, conversationHistory);
    
    // Update metrics
    metrics.totalMessages += 1;
    const today = new Date().toISOString().split('T')[0];
    metrics.messagesPerDay[today] = (metrics.messagesPerDay[today] || 0) + 1;

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process chat message',
      response: 'I apologize, but I encountered an error. Please try again.'
    });
  }
});

// Get available models
router.get('/models', async (req, res) => {
  try {
    const models = await aiService.getAvailableModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get models' });
  }
});

module.exports = router;
