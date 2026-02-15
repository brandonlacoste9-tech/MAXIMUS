const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

class PersonalityService {
  constructor() {
    this.personalityFile = process.env.PERSONALITY_FILE || path.join(__dirname, '../../PERSONALITY.md');
    this.personality = null;
    this.loadPersonality();
  }

  async loadPersonality() {
    try {
      const content = await fs.readFile(this.personalityFile, 'utf-8');
      this.personality = {
        raw: content,
        html: marked(content),
        parsed: this.parsePersonality(content)
      };
      console.log('Personality loaded successfully');
    } catch (error) {
      console.error('Failed to load personality:', error.message);
      this.personality = this.getDefaultPersonality();
    }
  }

  parsePersonality(content) {
    const parsed = {
      name: 'MAXIMUS',
      role: 'AI Assistant',
      tone: 'Professional yet friendly',
      greeting: 'Hello! I\'m MAXIMUS, your AI assistant.',
      traits: [],
      colors: {
        primary: '#FFD700',
        secondary: '#800080',
        accent: '#4B0082'
      }
    };

    // Extract name
    const nameMatch = content.match(/\*\*Name:\*\*\s*(.+)/);
    if (nameMatch) parsed.name = nameMatch[1].trim();

    // Extract role
    const roleMatch = content.match(/\*\*Role:\*\*\s*(.+)/);
    if (roleMatch) parsed.role = roleMatch[1].trim();

    // Extract greeting
    const greetingMatch = content.match(/\*\*First Contact:\*\*\s*>\s*(.+)/);
    if (greetingMatch) parsed.greeting = greetingMatch[1].trim();

    // Extract colors
    const primaryColorMatch = content.match(/Primary:\s*\w+\s*\(([#\w]+)\)/);
    if (primaryColorMatch) parsed.colors.primary = primaryColorMatch[1];

    const secondaryColorMatch = content.match(/Secondary:\s*\w+\s*\(([#\w]+)\)/);
    if (secondaryColorMatch) parsed.colors.secondary = secondaryColorMatch[1];

    return parsed;
  }

  getDefaultPersonality() {
    return {
      raw: '# MAXIMUS AI\nDefault personality',
      html: '<h1>MAXIMUS AI</h1><p>Default personality</p>',
      parsed: {
        name: 'MAXIMUS',
        role: 'AI Assistant',
        tone: 'Professional yet friendly',
        greeting: 'Hello! I\'m MAXIMUS, your AI assistant.',
        traits: [],
        colors: {
          primary: '#FFD700',
          secondary: '#800080',
          accent: '#4B0082'
        }
      }
    };
  }

  getPersonality() {
    return this.personality || this.getDefaultPersonality();
  }

  async updatePersonality(content) {
    try {
      await fs.writeFile(this.personalityFile, content, 'utf-8');
      await this.loadPersonality();
      return { success: true, message: 'Personality updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getSystemPrompt() {
    const personality = this.getPersonality();
    return `You are ${personality.parsed.name}, ${personality.parsed.role}. 
Your tone is: ${personality.parsed.tone}.
${personality.raw}

Respond according to this personality and guidelines.`;
  }
}

module.exports = new PersonalityService();
