const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

class PersonalityService {
  constructor() {
    this.personalityPath = path.join(__dirname, '../../PERSONALITY.md');
    this.personality = null;
    this.loadPersonality();
  }

  loadPersonality() {
    try {
      const content = fs.readFileSync(this.personalityPath, 'utf8');
      this.personality = {
        raw: content,
        html: md.render(content),
        parsed: this.parsePersonality(content)
      };
    } catch (error) {
      console.error('Error loading PERSONALITY.md:', error);
      this.personality = this.getDefaultPersonality();
    }
  }

  parsePersonality(content) {
    const lines = content.split('\n');
    const personality = {
      name: 'MAX',
      role: 'AI Assistant',
      tone: 'Professional',
      greeting: 'Hello! How can I help you?',
      traits: [],
      colors: { primary: '#FFD700', secondary: '#800080' }
    };

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('**Name:**')) {
        personality.name = line.replace('**Name:**', '').trim();
      } else if (line.startsWith('**Role:**')) {
        personality.role = line.replace('**Role:**', '').trim();
      } else if (line.startsWith('**Tone:**')) {
        personality.tone = line.replace('**Tone:**', '').trim();
      } else if (line.startsWith('## Greeting')) {
        currentSection = 'greeting';
      } else if (currentSection === 'greeting' && line.trim() && !line.startsWith('##')) {
        personality.greeting = line.trim();
        currentSection = '';
      }
    }

    return personality;
  }

  getDefaultPersonality() {
    return {
      raw: '# Default Personality\n\nMAX - AI Assistant',
      html: '<h1>Default Personality</h1><p>MAX - AI Assistant</p>',
      parsed: {
        name: 'MAX',
        role: 'AI Assistant',
        tone: 'Professional',
        greeting: 'Hello! How can I help you?',
        traits: [],
        colors: { primary: '#FFD700', secondary: '#800080' }
      }
    };
  }

  getPersonality() {
    return this.personality;
  }

  updatePersonality(newContent) {
    try {
      fs.writeFileSync(this.personalityPath, newContent, 'utf8');
      this.loadPersonality();
      return { success: true, message: 'Personality updated successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getSystemPrompt() {
    const p = this.personality.parsed;
    return `You are ${p.name}, ${p.role}. Your tone is ${p.tone}. Greeting: "${p.greeting}". Follow the personality traits defined in PERSONALITY.md.`;
  }
}

module.exports = new PersonalityService();
