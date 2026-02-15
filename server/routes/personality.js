const express = require('express');
const router = express.Router();
const personalityService = require('../services/personalityService');

// Get current personality
router.get('/', (req, res) => {
  const personality = personalityService.getPersonality();
  res.json(personality);
});

// Update personality
router.put('/', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  const result = personalityService.updatePersonality(content);
  if (result.success) {
    res.json({ 
      success: true, 
      message: result.message,
      personality: personalityService.getPersonality()
    });
  } else {
    res.status(500).json({ error: result.message });
  }
});

module.exports = router;
