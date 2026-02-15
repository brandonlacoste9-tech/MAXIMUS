const axios = require('axios');
const personalityService = require('./personalityService');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
  }

  async chat(message, conversationHistory = []) {
    const systemPrompt = personalityService.getSystemPrompt();
    
    if (this.provider === 'ollama') {
      return this.chatWithOllama(message, conversationHistory, systemPrompt);
    } else if (this.provider === 'deepseek') {
      return this.chatWithDeepSeek(message, conversationHistory, systemPrompt);
    } else {
      throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  async chatWithOllama(message, conversationHistory, systemPrompt) {
    try {
      const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
      const model = process.env.OLLAMA_MODEL || 'llama2';

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await axios.post(`${ollamaHost}/api/chat`, {
        model: model,
        messages: messages,
        stream: false
      });

      return {
        success: true,
        response: response.data.message.content,
        provider: 'ollama',
        model: model
      };
    } catch (error) {
      console.error('Ollama API error:', error.message);
      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I encountered an error connecting to the AI service.'
      };
    }
  }

  async chatWithDeepSeek(message, conversationHistory, systemPrompt) {
    try {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY not configured');
      }

      const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: model,
        messages: messages
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        response: response.data.choices[0].message.content,
        provider: 'deepseek',
        model: model
      };
    } catch (error) {
      console.error('DeepSeek API error:', error.message);
      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I encountered an error connecting to the AI service.'
      };
    }
  }

  async getAvailableModels() {
    if (this.provider === 'ollama') {
      try {
        const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
        const response = await axios.get(`${ollamaHost}/api/tags`);
        return response.data.models || [];
      } catch (error) {
        return [];
      }
    }
    return [];
  }
}

module.exports = new AIService();
