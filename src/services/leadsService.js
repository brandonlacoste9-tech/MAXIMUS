const fs = require('fs').promises;
const path = require('path');

class LeadsService {
  constructor() {
    this.leadsFile = path.join(__dirname, '../../data/leads.json');
    this.leads = [];
    this.loadLeads();
  }

  async loadLeads() {
    try {
      const data = await fs.readFile(this.leadsFile, 'utf-8');
      this.leads = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      this.leads = [];
      await this.saveLeads();
    }
  }

  async saveLeads() {
    try {
      await fs.mkdir(path.dirname(this.leadsFile), { recursive: true });
      await fs.writeFile(this.leadsFile, JSON.stringify(this.leads, null, 2));
    } catch (error) {
      console.error('Failed to save leads:', error.message);
    }
  }

  async getLeads(filters = {}) {
    let filtered = [...this.leads];

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    if (filters.source) {
      filtered = filtered.filter(lead => lead.source === filters.source);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getLead(id) {
    return this.leads.find(lead => lead.id === id);
  }

  async createLead(leadData) {
    const lead = {
      id: Date.now().toString(),
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: leadData.status || 'new'
    };

    this.leads.push(lead);
    await this.saveLeads();
    return lead;
  }

  async updateLead(id, updates) {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index === -1) return null;

    this.leads[index] = {
      ...this.leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.saveLeads();
    return this.leads[index];
  }

  async deleteLead(id) {
    const index = this.leads.findIndex(lead => lead.id === id);
    if (index === -1) return false;

    this.leads.splice(index, 1);
    await this.saveLeads();
    return true;
  }

  getStats() {
    const total = this.leads.length;
    const byStatus = this.leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const bySource = this.leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    return { total, byStatus, bySource };
  }
}

module.exports = new LeadsService();
