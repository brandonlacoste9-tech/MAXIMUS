import React, { useState, useEffect } from 'react';
import './MessagingBridges.css';

const MessagingBridges = () => {
  const [bridgeStatus, setBridgeStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBridgeStatus();
    const interval = setInterval(fetchBridgeStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBridgeStatus = async () => {
    try {
      const response = await fetch('/api/bridges/status');
      const data = await response.json();
      setBridgeStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch bridge status:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="card">Loading bridge status...</div>;
  }

  if (!bridgeStatus) {
    return <div className="card">Failed to load bridge status</div>;
  }

  const getStatusIcon = (bridge) => {
    if (!bridge.enabled) return '⚪';
    if (bridge.active || bridge.configured) return '🟢';
    return '🔴';
  };

  const getStatusText = (bridge) => {
    if (!bridge.enabled) return 'Disabled';
    if (bridge.active || bridge.configured) return 'Active';
    return 'Error';
  };

  return (
    <div className="messaging-bridges-container">
      <h2>Messaging Bridges</h2>
      <div className="bridges-grid">
        <div className="bridge-card telegram">
          <div className="bridge-header">
            <span className="bridge-logo">✈️</span>
            <h3>Telegram</h3>
          </div>
          <div className="bridge-status">
            <span className="status-icon">{getStatusIcon(bridgeStatus.telegram)}</span>
            <span className="status-text">{getStatusText(bridgeStatus.telegram)}</span>
          </div>
          <div className="bridge-stats">
            <div className="stat">
              <span className="stat-label">Status:</span>
              <span className="stat-value">
                {bridgeStatus.telegram.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {bridgeStatus.telegram.active && (
              <div className="stat">
                <span className="stat-label">Conversations:</span>
                <span className="stat-value">{bridgeStatus.telegram.conversations || 0}</span>
              </div>
            )}
          </div>
          {!bridgeStatus.telegram.enabled && (
            <div className="bridge-help">
              Enable in .env: TELEGRAM_ENABLED=true
            </div>
          )}
        </div>

        <div className="bridge-card whatsapp">
          <div className="bridge-header">
            <span className="bridge-logo">💬</span>
            <h3>WhatsApp</h3>
          </div>
          <div className="bridge-status">
            <span className="status-icon">{getStatusIcon(bridgeStatus.whatsapp)}</span>
            <span className="status-text">{getStatusText(bridgeStatus.whatsapp)}</span>
          </div>
          <div className="bridge-stats">
            <div className="stat">
              <span className="stat-label">Status:</span>
              <span className="stat-value">
                {bridgeStatus.whatsapp.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            {bridgeStatus.whatsapp.configured && (
              <div className="stat">
                <span className="stat-label">Conversations:</span>
                <span className="stat-value">{bridgeStatus.whatsapp.conversations || 0}</span>
              </div>
            )}
          </div>
          {!bridgeStatus.whatsapp.enabled && (
            <div className="bridge-help">
              Enable in .env: WHATSAPP_ENABLED=true
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingBridges;
