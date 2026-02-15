const { Telegraf } = require('telegraf');
const aiService = require('./aiService');
const personalityService = require('./personalityService');

class TelegramBridgeService {
  constructor() {
    this.bot = null;
    this.enabled = process.env.TELEGRAM_ENABLED === 'true';
    this.conversations = new Map(); // Store conversation history per chat
  }

  initialize() {
    if (!this.enabled) {
      console.log('📱 Telegram bridge disabled');
      return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured');
      return;
    }

    try {
      this.bot = new Telegraf(token);
      this.setupHandlers();
      this.bot.launch();
      console.log('✅ Telegram bridge initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Telegram bridge:', error);
    }
  }

  setupHandlers() {
    // Start command
    this.bot.start((ctx) => {
      const personality = personalityService.getPersonality();
      const greeting = personality.parsed.greeting || 'Hello! How can I help you?';
      ctx.reply(`🐝 ${greeting}\n\nI'm ${personality.parsed.name}, ${personality.parsed.role}`);
    });

    // Help command
    this.bot.help((ctx) => {
      ctx.reply(
        '🐝 *MAXIMUS AI Assistant*\n\n' +
        '*Available Commands:*\n' +
        '/start - Start conversation\n' +
        '/help - Show this help\n' +
        '/clear - Clear conversation history\n' +
        '/personality - Show current personality\n\n' +
        'Just send me a message to chat!',
        { parse_mode: 'Markdown' }
      );
    });

    // Clear command
    this.bot.command('clear', (ctx) => {
      const chatId = ctx.chat.id;
      this.conversations.delete(chatId);
      ctx.reply('✅ Conversation history cleared!');
    });

    // Personality command
    this.bot.command('personality', (ctx) => {
      const personality = personalityService.getPersonality();
      const p = personality.parsed;
      ctx.reply(
        `🐝 *Current Personality*\n\n` +
        `*Name:* ${p.name}\n` +
        `*Role:* ${p.role}\n` +
        `*Tone:* ${p.tone}\n` +
        `*Greeting:* ${p.greeting}`,
        { parse_mode: 'Markdown' }
      );
    });

    // Handle text messages
    this.bot.on('text', async (ctx) => {
      const chatId = ctx.chat.id;
      const message = ctx.message.text;

      // Skip if it's a command
      if (message.startsWith('/')) return;

      try {
        // Show typing indicator
        await ctx.sendChatAction('typing');

        // Get or create conversation history
        if (!this.conversations.has(chatId)) {
          this.conversations.set(chatId, []);
        }
        const history = this.conversations.get(chatId);

        // Get AI response
        const response = await aiService.chat(message, history);

        // Update conversation history
        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: response.response });

        // Keep only last 20 messages
        if (history.length > 20) {
          history.splice(0, history.length - 20);
        }

        // Send response
        await ctx.reply(response.response);
      } catch (error) {
        console.error('Telegram message error:', error);
        await ctx.reply('Sorry, I encountered an error. Please try again.');
      }
    });

    // Error handler
    this.bot.catch((err, ctx) => {
      console.error('Telegram bot error:', err);
    });
  }

  async stop() {
    if (this.bot) {
      await this.bot.stop();
      console.log('📱 Telegram bridge stopped');
    }
  }

  getStatus() {
    return {
      enabled: this.enabled,
      active: this.bot !== null,
      conversations: this.conversations.size
    };
  }
}

module.exports = new TelegramBridgeService();
