import React, { useState, useEffect, useRef } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPersonality();
    // Add welcome message
    setMessages([{
      role: 'assistant',
      content: 'Welcome! I\'m MAX, your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchPersonality = async () => {
    try {
      const response = await fetch('/api/personality');
      const data = await response.json();
      setPersonality(data.parsed);
    } catch (error) {
      console.error('Failed to fetch personality:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory
        })
      });

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        provider: data.provider,
        model: data.model
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all chat history?')) {
      setMessages([{
        role: 'assistant',
        content: personality?.greeting || 'How can I help you today?',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  return (
    <div className="chat-interface-container">
      <div className="chat-header">
        <div className="chat-title">
          <h2>💬 Chat with {personality?.name || 'MAX'}</h2>
          <p className="chat-subtitle">{personality?.role || 'AI Assistant'}</p>
        </div>
        <button className="btn btn-secondary" onClick={handleClearChat}>
          Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🐝'}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
              <div className="message-meta">
                {new Date(msg.timestamp).toLocaleTimeString()}
                {msg.provider && ` • ${msg.provider}/${msg.model}`}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🐝</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
          className="chat-input"
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !inputMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
