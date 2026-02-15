const axios = require('axios');
const aiService = require('./aiService');
const personalityService = require('./personalityService');

class WhatsAppBridgeService {
  constructor() {
    this.enabled = process.env.WHATSAPP_ENABLED === 'true';
    this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER;
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/v1';
    this.conversations = new Map();
  }

  initialize() {
    if (!this.enabled) {
      console.log('📱 WhatsApp bridge disabled');
      return;
    }

    if (!this.phoneNumber || !this.apiKey) {
      console.error('❌ WhatsApp credentials not configured');
      return;
    }

    console.log('✅ WhatsApp bridge initialized');
    // Note: Actual WhatsApp integration would require webhook setup
    // This is a placeholder for the integration structure
  }

  async handleIncomingMessage(data) {
    try {
      const { from, message } = data;

      // Get or create conversation history
      if (!this.conversations.has(from)) {
        this.conversations.set(from, []);
      }
      const history = this.conversations.get(from);

      // Handle commands
      if (message.startsWith('/')) {
        return await this.handleCommand(from, message);
      }

      // Get AI response
      const response = await aiService.chat(message, history);

      // Update conversation history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: response.response });

      // Keep only last 20 messages
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      // Send response via WhatsApp API
      await this.sendMessage(from, response.response);

      return { success: true };
    } catch (error) {
      console.error('WhatsApp message error:', error);
      return { success: false, error: error.message };
    }
  }

  async handleCommand(from, command) {
    const personality = personalityService.getPersonality();
    
    switch (command.toLowerCase()) {
      case '/start':
      case '/help':
        await this.sendMessage(
          from,
          `🐝 *MAXIMUS AI Assistant*\n\n` +
          `I'm ${personality.parsed.name}, ${personality.parsed.role}\n\n` +
          `*Available Commands:*\n` +
          `/start - Start conversation\n` +
          `/help - Show this help\n` +
          `/clear - Clear conversation history\n\n` +
          `Just send me a message to chat!`
        );
        break;

      case '/clear':
        this.conversations.delete(from);
        await this.sendMessage(from, '✅ Conversation history cleared!');
        break;

      default:
        await this.sendMessage(from, 'Unknown command. Type /help for available commands.');
    }

    return { success: true };
  }

  async sendMessage(to, message) {
    if (!this.enabled) {
      throw new Error('WhatsApp bridge not enabled');
    }

    try {
      // This is a placeholder for actual WhatsApp API integration
      // Different providers have different APIs (Twilio, WhatsApp Business, etc.)
      const response = await axios.post(
        `${this.apiUrl}/messages`,
        {
          to: to,
          from: this.phoneNumber,
          message: message
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error.message);
      throw error;
    }
  }

  getStatus() {
    return {
      enabled: this.enabled,
      configured: !!(this.phoneNumber && this.apiKey),
      conversations: this.conversations.size
    };
  }
}

module.exports = new WhatsAppBridgeService();
