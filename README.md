# MAXIMUS AI Assistant

**floguru – MAXIMUS AI Assistant**  
Self-hosted BYOK (Bring Your Own Key) AI assistant replicating MAX (the Beekeeper). One-click install (Docker-Compose/Helm), gold-purple dashboard (health tiles, metrics, leads table, personality editor, Telegram/WhatsApp bridges). Supports Ollama (local) or DeepSeek (cloud) models. Easy `PERSONALITY.md` customization for tone, greeting, and branding.

![MAXIMUS Dashboard](https://img.shields.io/badge/Status-Active-gold?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-purple?style=for-the-badge)

## ✨ Features

- 🎨 **Beautiful Gold-Purple Dashboard** - Elegant UI with health tiles, metrics, and leads management
- 🤖 **Dual AI Provider Support** - Use Ollama (local) or DeepSeek (cloud)
- 💬 **Interactive Chat Interface** - Real-time conversations with your AI assistant
- 📊 **Performance Metrics** - Track messages, uptime, and leads
- 🎭 **Personality Editor** - Easy customization via `PERSONALITY.md`
- 📱 **Messaging Bridges** - Telegram and WhatsApp integration support
- 🐳 **One-Click Deploy** - Docker Compose or Kubernetes Helm chart
- 🔒 **Self-Hosted** - Full control over your data and infrastructure

## 🚀 Quick Start

### Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/brandonlacoste9-tech/MAXIMUS.git
   cd MAXIMUS
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the dashboard**
   - Open http://localhost:3000 in your browser
   - The API runs on http://localhost:3001

### Kubernetes with Helm

1. **Install with Helm**
   ```bash
   helm install maximus ./helm/maximus
   ```

2. **Customize values**
   ```bash
   helm install maximus ./helm/maximus -f custom-values.yaml
   ```

3. **Access the service**
   ```bash
   kubectl port-forward svc/maximus 3000:80
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AI_PROVIDER` | AI provider to use (`ollama` or `deepseek`) | `ollama` |
| `PORT` | Server port | `3001` |
| `OLLAMA_HOST` | Ollama server URL | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model name | `llama2` |
| `DEEPSEEK_API_KEY` | DeepSeek API key | - |
| `DEEPSEEK_MODEL` | DeepSeek model name | `deepseek-chat` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | - |
| `TELEGRAM_ENABLED` | Enable Telegram bridge | `false` |
| `WHATSAPP_ENABLED` | Enable WhatsApp bridge | `false` |

### Personality Customization

Edit `PERSONALITY.md` to customize your AI assistant:

```markdown
## Identity
**Name:** MAX
**Role:** The Beekeeper - Your intelligent AI assistant
**Tone:** Professional, friendly, and helpful

## Greeting
Welcome! I'm MAX, your AI assistant. How can I help you today?

## Branding
- **Primary Color:** Gold (#FFD700)
- **Secondary Color:** Purple (#800080)
```

Changes take effect immediately through the Personality Editor in the dashboard.

## 🏗️ Architecture

```
MAXIMUS/
├── server/              # Node.js Express backend
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   └── index.js        # Server entry point
├── client/             # React frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   └── App.js      # Main application
│   └── build/          # Production build
├── helm/               # Kubernetes Helm chart
├── docker-compose.yml  # Docker Compose config
├── Dockerfile          # Container image
└── PERSONALITY.md      # AI personality config
```

## 📊 Dashboard Features

### Health Tiles
Monitor system status in real-time:
- Overall system health
- API server status
- AI service connectivity
- Telegram/WhatsApp bridge status

### Metrics Display
Track key performance indicators:
- Total messages processed
- Leads generated
- System uptime
- Daily message count

### Leads Management
Complete CRM functionality:
- Add/edit/delete leads
- Status tracking (New, Contacted, Qualified, Converted, Lost)
- Contact information management
- Notes and timestamps

### Chat Interface
Interactive AI conversations:
- Real-time messaging
- Conversation history
- Provider/model information
- Beautiful gold-purple theme

### Personality Editor
Customize AI behavior:
- Edit PERSONALITY.md directly
- Live preview of changes
- Save and reload instantly
- Markdown support

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)
- Ollama (optional, for local AI)

### Local Development

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Start backend**
   ```bash
   npm run dev
   ```

3. **Start frontend** (in another terminal)
   ```bash
   npm run client
   ```

4. **Build for production**
   ```bash
   npm run client:build
   npm start
   ```

## 🤝 AI Provider Setup

### Ollama (Local)

1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama2`
3. Set `AI_PROVIDER=ollama` in `.env`

### DeepSeek (Cloud)

1. Get API key from https://deepseek.com
2. Set `AI_PROVIDER=deepseek` in `.env`
3. Set `DEEPSEEK_API_KEY=your-key` in `.env`

## 📱 Messaging Bridges

### Telegram Bridge
1. Create a bot with [@BotFather](https://t.me/botfather)
2. Set `TELEGRAM_BOT_TOKEN` in `.env`
3. Set `TELEGRAM_ENABLED=true`

### WhatsApp Bridge
1. Configure WhatsApp Business API
2. Set credentials in `.env`
3. Set `WHATSAPP_ENABLED=true`

## 🎨 Theming

The dashboard uses a beautiful gold-purple color scheme:
- **Gold (#FFD700)**: Primary color, highlights, buttons
- **Purple (#800080)**: Secondary color, backgrounds
- **Dark Purple (#4B0082)**: Accents and gradients

Customize colors in `client/src/App.css` CSS variables.

## 📝 API Documentation

### Endpoints

- `GET /api/health` - System health check
- `GET /api/metrics` - Performance metrics
- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/personality` - Get personality config
- `PUT /api/personality` - Update personality
- `POST /api/chat` - Send chat message
- `GET /api/chat/models` - List available models

## 🐛 Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check `OLLAMA_HOST` in `.env`
- Verify model is pulled: `ollama list`

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear React cache: `cd client && rm -rf node_modules build`

### Docker Issues
- Rebuild containers: `docker-compose up --build`
- Check logs: `docker-compose logs -f`

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Inspired by MAX (the Beekeeper)
- Built with React, Node.js, Express
- AI powered by Ollama and DeepSeek
- Deployed with Docker and Kubernetes

---

**Made with 🐝 by the MAXIMUS Team** 
