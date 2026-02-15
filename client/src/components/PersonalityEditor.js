import React, { useState, useEffect } from 'react';
import './PersonalityEditor.css';

const PersonalityEditor = () => {
  const [personality, setPersonality] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPersonality();
  }, []);

  const fetchPersonality = async () => {
    try {
      const response = await fetch('/api/personality');
      const data = await response.json();
      setPersonality(data);
      setEditedContent(data.raw);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch personality:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/personality', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Personality saved successfully! Changes will take effect immediately.');
        setPersonality(data.personality);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (error) {
      setMessage('Failed to save personality: ' + error.message);
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset to current saved personality?')) {
      setEditedContent(personality.raw);
      setMessage('');
    }
  };

  if (loading) {
    return <div className="card">Loading personality configuration...</div>;
  }

  return (
    <div className="personality-editor-container">
      <h2>Personality Configuration</h2>
      
      <div className="editor-info">
        <p>
          Edit the PERSONALITY.md file to customize MAX's behavior, tone, and branding.
          Changes take effect immediately after saving.
        </p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="personality-preview">
        <h3>Current Personality</h3>
        <div className="preview-grid">
          <div className="preview-item">
            <strong>Name:</strong> {personality?.parsed?.name || 'N/A'}
          </div>
          <div className="preview-item">
            <strong>Role:</strong> {personality?.parsed?.role || 'N/A'}
          </div>
          <div className="preview-item">
            <strong>Tone:</strong> {personality?.parsed?.tone || 'N/A'}
          </div>
          <div className="preview-item full-width">
            <strong>Greeting:</strong> {personality?.parsed?.greeting || 'N/A'}
          </div>
        </div>
      </div>

      <div className="editor-section">
        <h3>Edit PERSONALITY.md</h3>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="personality-textarea"
          rows="20"
        />
      </div>

      <div className="editor-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={handleReset}
          disabled={saving}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PersonalityEditor;
