import React, { useState, useEffect } from 'react';
import './MetricsDisplay.css';

const MetricsDisplay = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading metrics...</div>;
  }

  if (!metrics) {
    return <div className="card">Failed to load metrics</div>;
  }

  return (
    <div className="metrics-container">
      <h2>Performance Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-label">Total Messages</div>
          <div className="metric-value">{metrics.totalMessages || 0}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-label">Leads Generated</div>
          <div className="metric-value">{metrics.leadsGenerated || 0}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-label">System Uptime</div>
          <div className="metric-value small">{metrics.uptimeFormatted || '0d 0h 0m'}</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-label">Messages Today</div>
          <div className="metric-value">
            {metrics.messagesPerDay?.[new Date().toISOString().split('T')[0]] || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDisplay;
