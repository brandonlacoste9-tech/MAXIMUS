import React, { useState } from 'react';
import './App.css';
import HealthTiles from './components/HealthTiles';
import MetricsDisplay from './components/MetricsDisplay';
import LeadsTable from './components/LeadsTable';
import PersonalityEditor from './components/PersonalityEditor';
import ChatInterface from './components/ChatInterface';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🐝 MAXIMUS AI Assistant</h1>
          <p className="tagline">Your Intelligent Hive Mind</p>
        </div>
      </header>
      
      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'chat' ? 'active' : ''} 
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={activeTab === 'leads' ? 'active' : ''} 
          onClick={() => setActiveTab('leads')}
        >
          Leads
        </button>
        <button 
          className={activeTab === 'personality' ? 'active' : ''} 
          onClick={() => setActiveTab('personality')}
        >
          Personality
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            <HealthTiles />
            <MetricsDisplay />
          </div>
        )}
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'leads' && <LeadsTable />}
        {activeTab === 'personality' && <PersonalityEditor />}
      </main>

      <footer className="App-footer">
        <p>MAXIMUS AI Assistant v1.0.0 | Self-Hosted BYOK AI</p>
      </footer>
    </div>
  );
}

export default App;
