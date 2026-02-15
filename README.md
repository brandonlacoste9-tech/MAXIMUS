# 🤖 MAXIMUS AI Assistant

**floguru – MAXIMUS AI Assistant** is a self-hosted BYOK (Bring Your Own Keys) AI assistant that replicates MAX (the Beekeeper). It features one-click installation via Docker Compose or Helm, a stunning gold-purple dashboard with health monitoring, metrics tracking, lead management, personality customization, and communication bridges for Telegram and WhatsApp.

## ✨ Features

- 🎨 **Beautiful Gold-Purple Dashboard** - Intuitive UI with health tiles, real-time metrics, and responsive design
- 🤖 **Flexible AI Models** - Support for both Ollama (local) and DeepSeek (cloud) models
- 📊 **Health Monitoring** - Real-time system health checks and status indicators
- 📈 **Metrics Tracking** - Monitor requests, chat messages, leads, and uptime
- 👥 **Lead Management** - Full CRUD operations for managing leads with status tracking
- ✨ **Personality Editor** - Customize AI behavior, tone, and branding via `PERSONALITY.md`
- 📱 **Telegram Bridge** - Integrate with Telegram bots for messaging
- 💬 **WhatsApp Bridge** - Connect with WhatsApp for communication
- 🐳 **One-Click Deploy** - Easy deployment with Docker Compose or Kubernetes Helm charts

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose (for Docker deployment)
- Kubernetes cluster and Helm (for Kubernetes deployment)
- Node.js 18+ (for local development)

### Docker Compose Deployment (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/brandonlacoste9-tech/MAXIMUS.git
cd MAXIMUS
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

3. **Start the services:**
```bash
docker-compose up -d
```

4. **Access the dashboard:**
Open your browser to `http://localhost:3000`

That's it! 🎉 MAXIMUS is now running with Ollama locally.

### Helm Deployment (Kubernetes)

1. **Install with Helm:**
```bash
helm install maximus ./helm/maximus
```

2. **Customize values:**
```bash
helm install maximus ./helm/maximus \
  --set env.aiProvider=deepseek \
  --set env.telegramEnabled=true
```

3. **Access the dashboard:**
```bash
kubectl port-forward svc/maximus 3000:3000
```

Open your browser to `http://localhost:3000`

## 📋 Configuration

### AI Provider Configuration

#### Using Ollama (Local)
```env
AI_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
```

#### Using DeepSeek (Cloud)
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

### Bridge Configuration

#### Telegram
```env
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

#### WhatsApp
```env
WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER=your_phone_number
```

## 🎨 Personality Customization

MAXIMUS personality can be fully customized by editing the `PERSONALITY.md` file. The personality system includes:

- **Identity** - Name, role, and version
- **Tone & Style** - Communication style and approach
- **Greeting Messages** - Custom messages for first-time and returning users
- **Personality Traits** - Define core characteristics
- **Branding** - Customize colors and tagline
- **Response Guidelines** - Set rules for how the AI responds

Example customization:
```markdown
## Identity
**Name:** MyBot
**Role:** Customer Support Assistant

## Tone & Style
- Friendly and casual
- Quick response time
- Emoji usage encouraged
```

The personality editor is available directly in the dashboard for real-time updates!

## 📊 Dashboard Features

### Health Tiles
Monitor the status of:
- API Server
- AI Model Connection
- Telegram Bridge
- WhatsApp Bridge

### Metrics
Track key performance indicators:
- Total API Requests
- Chat Messages Processed
- Leads Created
- System Uptime

### Lead Management
- Add, edit, and delete leads
- Filter by status and source
- Track lead lifecycle from new to converted
- Export lead data

### Chat Interface
- Real-time chat with MAXIMUS
- Context-aware conversations
- Message history
- Personality-driven responses

## 🛠️ Development

### Local Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment:**
```bash
cp .env.example .env
```

3. **Start development server:**
```bash
npm run dev
```

### Project Structure
```
MAXIMUS/
├── src/
│   ├── server.js              # Main server
│   ├── services/              # Business logic
│   │   ├── aiService.js       # AI model integration
│   │   ├── personalityService.js  # Personality management
│   │   ├── leadsService.js    # Lead management
│   │   ├── metricsService.js  # Metrics tracking
│   │   ├── telegramBridge.js  # Telegram integration
│   │   └── whatsappBridge.js  # WhatsApp integration
│   └── routes/                # API endpoints
├── public/                    # Frontend dashboard
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── helm/                      # Kubernetes Helm charts
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Container image
├── PERSONALITY.md             # AI personality config
└── package.json               # Dependencies
```

## 🔌 API Endpoints

### AI Chat
```
POST /api/ai/chat
Body: { "message": "Hello", "context": [] }
```

### Health Check
```
GET /api/health
```

### Leads Management
```
GET    /api/leads          # List all leads
POST   /api/leads          # Create lead
GET    /api/leads/:id      # Get lead
PUT    /api/leads/:id      # Update lead
DELETE /api/leads/:id      # Delete lead
GET    /api/leads/stats    # Get statistics
```

### Personality
```
GET /api/personality        # Get personality
PUT /api/personality        # Update personality
```

### Metrics
```
GET  /api/metrics          # Get metrics
POST /api/metrics/reset    # Reset metrics
```

## 🔒 Security

- Environment variables for sensitive data
- No hardcoded credentials
- API authentication ready (extend as needed)
- Docker security best practices
- Health check endpoints for monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Advanced analytics and reporting
- [ ] Multi-user support with authentication
- [ ] Advanced Telegram bot features
- [ ] WhatsApp Web integration
- [ ] Email notifications
- [ ] Webhook support
- [ ] Plugin system
- [ ] Advanced AI model fine-tuning
- [ ] Mobile app

## 💬 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ by the MAXIMUS Team** | Gold & Purple Theme 💛💜
