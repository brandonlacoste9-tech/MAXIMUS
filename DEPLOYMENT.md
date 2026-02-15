# MAXIMUS AI Assistant - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Compose Deployment](#docker-compose-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Production Considerations](#production-considerations)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### For Docker Compose
- Docker 20.10+
- Docker Compose 1.29+
- 4GB RAM minimum
- 10GB disk space

### For Kubernetes
- Kubernetes 1.20+
- Helm 3.0+
- kubectl configured
- Persistent volume support
- 4GB RAM per pod minimum

## Docker Compose Deployment

### Quick Start

1. **Clone and configure**
   ```bash
   git clone https://github.com/brandonlacoste9-tech/MAXIMUS.git
   cd MAXIMUS
   cp .env.example .env
   ```

2. **Edit .env file**
   ```bash
   nano .env
   # Configure your settings (AI provider, API keys, etc.)
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Check status**
   ```bash
   docker-compose ps
   docker-compose logs -f maximus
   ```

5. **Access the dashboard**
   - Open http://localhost:3000
   - API available at http://localhost:3001

### Using Ollama (Local AI)

1. **Pull a model**
   ```bash
   docker-compose exec ollama ollama pull llama2
   # Or: ollama pull mistral, ollama pull codellama, etc.
   ```

2. **Verify model**
   ```bash
   docker-compose exec ollama ollama list
   ```

3. **Update .env**
   ```env
   AI_PROVIDER=ollama
   OLLAMA_HOST=http://ollama:11434
   OLLAMA_MODEL=llama2
   ```

### Using DeepSeek (Cloud AI)

1. **Get API key**
   - Sign up at https://deepseek.com
   - Generate API key

2. **Update .env**
   ```env
   AI_PROVIDER=deepseek
   DEEPSEEK_API_KEY=your-api-key-here
   DEEPSEEK_MODEL=deepseek-chat
   ```

3. **Restart services**
   ```bash
   docker-compose restart maximus
   ```

## Kubernetes Deployment

### Using Helm

1. **Install with default values**
   ```bash
   helm install maximus ./helm/maximus
   ```

2. **Install with custom values**
   ```bash
   helm install maximus ./helm/maximus \
     --set env.AI_PROVIDER=ollama \
     --set env.OLLAMA_MODEL=llama2 \
     --set persistence.enabled=true
   ```

3. **Create custom values file**
   ```yaml
   # custom-values.yaml
   replicaCount: 2
   
   env:
     AI_PROVIDER: "deepseek"
     DEEPSEEK_API_KEY: "your-key-here"
   
   ingress:
     enabled: true
     hosts:
       - host: maximus.yourdomain.com
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

4. **Install with custom values**
   ```bash
   helm install maximus ./helm/maximus -f custom-values.yaml
   ```

5. **Access the service**
   ```bash
   # Port forward for testing
   kubectl port-forward svc/maximus 3000:80
   
   # Or set up ingress for production
   ```

### Manual Kubernetes Deployment

1. **Create namespace**
   ```bash
   kubectl create namespace maximus
   ```

2. **Create ConfigMap**
   ```bash
   kubectl create configmap maximus-config \
     --from-literal=AI_PROVIDER=ollama \
     --from-literal=PORT=3001 \
     -n maximus
   ```

3. **Create Secret**
   ```bash
   kubectl create secret generic maximus-secrets \
     --from-literal=DEEPSEEK_API_KEY=your-key \
     --from-literal=TELEGRAM_BOT_TOKEN=your-token \
     -n maximus
   ```

4. **Apply manifests**
   ```bash
   kubectl apply -f helm/maximus/templates/ -n maximus
   ```

## Production Considerations

### Security

1. **Use secrets management**
   - Never commit API keys to git
   - Use Kubernetes secrets or external secret managers
   - Rotate keys regularly

2. **Network security**
   ```yaml
   # Enable HTTPS
   ingress:
     enabled: true
     tls:
       - secretName: maximus-tls
         hosts:
           - maximus.yourdomain.com
   ```

3. **Authentication**
   - Add authentication middleware
   - Use API keys for endpoints
   - Implement rate limiting

### Scaling

1. **Horizontal scaling**
   ```bash
   # Docker Compose
   docker-compose up -d --scale maximus=3
   
   # Kubernetes
   kubectl scale deployment maximus --replicas=3
   ```

2. **Resource allocation**
   ```yaml
   resources:
     limits:
       cpu: "2"
       memory: "4Gi"
     requests:
       cpu: "1"
       memory: "2Gi"
   ```

### Monitoring

1. **Health checks**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Logs**
   ```bash
   # Docker
   docker-compose logs -f maximus
   
   # Kubernetes
   kubectl logs -f deployment/maximus
   ```

3. **Metrics**
   - Access /api/metrics endpoint
   - Integrate with Prometheus/Grafana
   - Set up alerts for critical metrics

### Backup

1. **Data backup**
   ```bash
   # Backup data directory
   docker cp maximus-ai:/app/data ./backup/data-$(date +%Y%m%d)
   
   # Backup personality
   docker cp maximus-ai:/app/PERSONALITY.md ./backup/
   ```

2. **Automated backups**
   ```bash
   # Add to crontab
   0 2 * * * /path/to/backup-script.sh
   ```

## Troubleshooting

### Container Issues

**Problem:** Container won't start
```bash
# Check logs
docker-compose logs maximus

# Common issues:
# - Port already in use
# - Missing environment variables
# - Insufficient resources
```

**Solution:**
```bash
# Change ports in docker-compose.yml
# Verify .env file
# Increase Docker resources
```

### Ollama Connection

**Problem:** Can't connect to Ollama
```bash
# Verify Ollama is running
docker-compose ps ollama

# Check network
docker-compose exec maximus ping ollama

# Verify model is available
docker-compose exec ollama ollama list
```

**Solution:**
```bash
# Restart services
docker-compose restart

# Pull model if missing
docker-compose exec ollama ollama pull llama2
```

### DeepSeek API Errors

**Problem:** API authentication failed
- Verify API key in .env
- Check API key validity
- Ensure sufficient credits

### Memory Issues

**Problem:** Out of memory errors
```bash
# Check resource usage
docker stats

# For Kubernetes
kubectl top pods
```

**Solution:**
- Increase Docker memory limit
- Scale down model size
- Add more replicas with smaller resources

### Database/Storage

**Problem:** Lost data after restart
```bash
# Ensure volumes are mounted
docker-compose down
docker-compose up -d

# Check volume mounts
docker inspect maximus-ai
```

**Solution:**
- Verify volume configuration in docker-compose.yml
- Use named volumes for persistence
- Regular backups

## Support

For issues and questions:
- GitHub Issues: https://github.com/brandonlacoste9-tech/MAXIMUS/issues
- Documentation: https://github.com/brandonlacoste9-tech/MAXIMUS/wiki

## Updates

**Updating MAXIMUS:**
```bash
# Docker Compose
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Kubernetes
helm upgrade maximus ./helm/maximus
```
