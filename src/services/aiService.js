const axios = require('axios');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'ollama';
  }

  async chat(message, context = []) {
    if (this.provider === 'ollama') {
      return this.chatWithOllama(message, context);
    } else if (this.provider === 'deepseek') {
      return this.chatWithDeepSeek(message, context);
    }
    throw new Error(`Unsupported AI provider: ${this.provider}`);
  }

  async chatWithOllama(message, context) {
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama2';

    try {
      const response = await axios.post(`${ollamaHost}/api/chat`, {
        model: model,
        messages: [...context, { role: 'user', content: message }],
        stream: false
      });

      return {
        response: response.data.message.content,
        model: model,
        provider: 'ollama'
      };
    } catch (error) {
      console.error('Ollama API error:', error.message);
      throw new Error(`Failed to communicate with Ollama: ${error.message}`);
    }
  }

  async chatWithDeepSeek(message, context) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: model,
          messages: [...context, { role: 'user', content: message }]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        response: response.data.choices[0].message.content,
        model: model,
        provider: 'deepseek'
      };
    } catch (error) {
      console.error('DeepSeek API error:', error.message);
      throw new Error(`Failed to communicate with DeepSeek: ${error.message}`);
    }
  }

  async getModelStatus() {
    try {
      if (this.provider === 'ollama') {
        const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
        const response = await axios.get(`${ollamaHost}/api/tags`);
        return {
          provider: 'ollama',
          status: 'connected',
          models: response.data.models || []
        };
      } else if (this.provider === 'deepseek') {
        return {
          provider: 'deepseek',
          status: process.env.DEEPSEEK_API_KEY ? 'configured' : 'not configured',
          model: process.env.DEEPSEEK_MODEL || 'deepseek-chat'
        };
      }
    } catch (error) {
      return {
        provider: this.provider,
        status: 'error',
        error: error.message
      };
    }
  }
}

module.exports = new AIService();
