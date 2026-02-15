const express = require('express');
const router = express.Router();
const telegramBridge = require('../services/telegramBridgeService');
const whatsappBridge = require('../services/whatsappBridgeService');

// Get bridge status
router.get('/status', (req, res) => {
  res.json({
    telegram: telegramBridge.getStatus(),
    whatsapp: whatsappBridge.getStatus()
  });
});

// WhatsApp webhook endpoint
router.post('/whatsapp/webhook', async (req, res) => {
  try {
    const result = await whatsappBridge.handleIncomingMessage(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
