const express = require('express');
const router = express.Router();
const personalityService = require('../services/personalityService');

// Get personality
router.get('/', (req, res) => {
  try {
    const personality = personalityService.getPersonality();
    res.json(personality);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update personality
router.put('/', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await personalityService.updatePersonality(content);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
