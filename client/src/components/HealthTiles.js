import React, { useState, useEffect } from 'react';
import './HealthTiles.css';

const HealthTiles = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch health:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading health status...</div>;
  }

  if (!health) {
    return <div className="card">Failed to load health status</div>;
  }

  const getStatusClass = (status) => {
    if (status === 'up' || status === 'healthy') return 'status-up';
    if (status === 'down') return 'status-down';
    return 'status-unknown';
  };

  return (
    <div className="health-tiles-container">
      <h2>System Health</h2>
      <div className="health-grid">
        <div className="health-tile">
          <div className="tile-header">
            <span className={`status-indicator ${getStatusClass(health.status)}`}></span>
            <h3>Overall Status</h3>
          </div>
          <div className="tile-value">{health.status.toUpperCase()}</div>
        </div>

        <div className="health-tile">
          <div className="tile-header">
            <span className={`status-indicator ${getStatusClass(health.services?.api)}`}></span>
            <h3>API Server</h3>
          </div>
          <div className="tile-value">{health.services?.api || 'unknown'}</div>
        </div>

        <div className="health-tile">
          <div className="tile-header">
            <span className={`status-indicator ${getStatusClass(health.services?.ollama)}`}></span>
            <h3>AI Service (Ollama)</h3>
          </div>
          <div className="tile-value">{health.services?.ollama || 'unknown'}</div>
        </div>

        <div className="health-tile">
          <div className="tile-header">
            <span className={`status-indicator ${getStatusClass(health.services?.telegram)}`}></span>
            <h3>Telegram Bridge</h3>
          </div>
          <div className="tile-value">{health.services?.telegram || 'disabled'}</div>
        </div>

        <div className="health-tile">
          <div className="tile-header">
            <span className={`status-indicator ${getStatusClass(health.services?.whatsapp)}`}></span>
            <h3>WhatsApp Bridge</h3>
          </div>
          <div className="tile-value">{health.services?.whatsapp || 'disabled'}</div>
        </div>
      </div>
      <div className="last-updated">
        Last updated: {new Date(health.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default HealthTiles;
