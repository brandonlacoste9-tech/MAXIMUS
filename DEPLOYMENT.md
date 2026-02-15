# Deployment Guide

This guide covers different deployment options for MAXIMUS AI Assistant.

## Table of Contents

1. [Docker Compose Deployment](#docker-compose-deployment)
2. [Kubernetes Helm Deployment](#kubernetes-helm-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Configuration](#configuration)

## Docker Compose Deployment

The easiest way to deploy MAXIMUS is using Docker Compose.

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Steps

1. **Clone the repository:**
```bash
git clone https://github.com/brandonlacoste9-tech/MAXIMUS.git
cd MAXIMUS
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your settings
nano .env
```

3. **Start services:**
```bash
docker-compose up -d
```

4. **Verify deployment:**
```bash
docker-compose ps
docker-compose logs -f maximus
```

5. **Access dashboard:**
Open http://localhost:3000 in your browser

### Using DeepSeek Instead of Ollama

Edit `.env`:
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_api_key_here
```

Then restart:
```bash
docker-compose restart maximus
```

## Kubernetes Helm Deployment

For production Kubernetes deployments.

### Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- kubectl configured

### Quick Start

1. **Install with default values:**
```bash
helm install maximus ./helm/maximus
```

2. **Check status:**
```bash
kubectl get pods -l app.kubernetes.io/name=maximus
kubectl get svc maximus
```

3. **Access dashboard:**
```bash
kubectl port-forward svc/maximus 3000:3000
```

### Custom Configuration

Create a `values-custom.yaml`:
```yaml
replicaCount: 2

env:
  aiProvider: "deepseek"
  telegramEnabled: true

ingress:
  enabled: true
  hosts:
    - host: maximus.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 1000m
    memory: 1Gi
```

Install with custom values:
```bash
helm install maximus ./helm/maximus -f values-custom.yaml
```

### Upgrading

```bash
helm upgrade maximus ./helm/maximus
```

### Uninstalling

```bash
helm uninstall maximus
```

## Manual Deployment

For development or custom setups.

### Prerequisites

- Node.js 18+
- npm 9+
- (Optional) Ollama for local AI

### Steps

1. **Clone and install:**
```bash
git clone https://github.com/brandonlacoste9-tech/MAXIMUS.git
cd MAXIMUS
npm install
```

2. **Configure:**
```bash
cp .env.example .env
nano .env
```

3. **Start application:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `AI_PROVIDER` | AI provider (ollama/deepseek) | ollama |
| `OLLAMA_HOST` | Ollama server URL | http://localhost:11434 |
| `OLLAMA_MODEL` | Ollama model name | llama2 |
| `DEEPSEEK_API_KEY` | DeepSeek API key | - |
| `DEEPSEEK_MODEL` | DeepSeek model name | deepseek-chat |
| `TELEGRAM_ENABLED` | Enable Telegram bridge | false |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | - |
| `WHATSAPP_ENABLED` | Enable WhatsApp bridge | false |
| `WHATSAPP_PHONE_NUMBER` | WhatsApp phone number | - |

### Ollama Setup

If using Ollama locally:

1. **Install Ollama:**
```bash
curl https://ollama.ai/install.sh | sh
```

2. **Pull a model:**
```bash
ollama pull llama2
# or
ollama pull codellama
ollama pull mistral
```

3. **Start Ollama:**
```bash
ollama serve
```

4. **Configure MAXIMUS:**
```env
AI_PROVIDER=ollama
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
```

### DeepSeek Setup

1. **Get API key:**
Visit https://platform.deepseek.com/ and create an account

2. **Configure MAXIMUS:**
```env
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

## Monitoring

### Health Checks

```bash
# Basic health
curl http://localhost:3000/health

# Detailed health
curl http://localhost:3000/api/health
```

### Logs

Docker Compose:
```bash
docker-compose logs -f maximus
```

Kubernetes:
```bash
kubectl logs -f deployment/maximus
```

### Metrics

```bash
curl http://localhost:3000/api/metrics
```

## Troubleshooting

### Server won't start

1. Check if port 3000 is available:
```bash
lsof -i :3000
```

2. Check logs for errors

3. Verify environment configuration

### Ollama connection fails

1. Verify Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

2. Check firewall rules

3. Verify OLLAMA_HOST in .env

### DeepSeek API errors

1. Verify API key is correct
2. Check API quota/limits
3. Verify internet connectivity

## Production Considerations

### Security

- Use HTTPS in production
- Set strong secrets for authentication
- Keep API keys secure
- Regular security updates

### Performance

- Use production-grade database for leads
- Enable caching
- Configure proper resource limits
- Monitor performance metrics

### Backup

- Backup `data/` directory regularly
- Backup PERSONALITY.md
- Backup environment configuration

### Scaling

For Kubernetes:
```bash
kubectl scale deployment maximus --replicas=3
```

Or enable auto-scaling in Helm values:
```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```
