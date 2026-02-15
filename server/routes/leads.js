const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const leadsFile = path.join(__dirname, '../../data/leads.json');

// Initialize leads file if it doesn't exist
if (!fs.existsSync(leadsFile)) {
  fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
}

// Get all leads
router.get('/', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read leads' });
  }
});

// Add a new lead
router.post('/', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    const newLead = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };
    leads.push(newLead);
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    res.json(newLead);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add lead' });
  }
});

// Update a lead
router.put('/:id', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    const index = leads.findIndex(l => l.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    leads[index] = { ...leads[index], ...req.body, id: req.params.id };
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
    res.json(leads[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete a lead
router.delete('/:id', (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    const filtered = leads.filter(l => l.id !== req.params.id);
    fs.writeFileSync(leadsFile, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
