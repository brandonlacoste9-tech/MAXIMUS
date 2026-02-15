const express = require('express');
const router = express.Router();
const leadsService = require('../services/leadsService');
const metricsService = require('../services/metricsService');

// Get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await leadsService.getLeads(req.query);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead stats
router.get('/stats', (req, res) => {
  try {
    const stats = leadsService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
router.get('/:id', async (req, res) => {
  try {
    const lead = await leadsService.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lead
router.post('/', async (req, res) => {
  try {
    const lead = await leadsService.createLead(req.body);
    metricsService.incrementLeadsCreated();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead
router.put('/:id', async (req, res) => {
  try {
    const lead = await leadsService.updateLead(req.params.id, req.body);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const success = await leadsService.deleteLead(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
