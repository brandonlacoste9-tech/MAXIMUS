class MetricsService {
  constructor() {
    this.metrics = {
      requests: 0,
      chatMessages: 0,
      leadsCreated: 0,
      uptime: Date.now(),
      errors: 0
    };
  }

  incrementRequests() {
    this.metrics.requests++;
  }

  incrementChatMessages() {
    this.metrics.chatMessages++;
  }

  incrementLeadsCreated() {
    this.metrics.leadsCreated++;
  }

  incrementErrors() {
    this.metrics.errors++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      uptimeSeconds: Math.floor((Date.now() - this.metrics.uptime) / 1000)
    };
  }

  reset() {
    this.metrics = {
      requests: 0,
      chatMessages: 0,
      leadsCreated: 0,
      uptime: Date.now(),
      errors: 0
    };
  }
}

module.exports = new MetricsService();
