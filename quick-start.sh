#!/bin/bash
# MAXIMUS AI Assistant - Quick Start Script

set -e

echo "🐝 MAXIMUS AI Assistant - Quick Start"
echo "====================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env file to configure your settings:"
    echo "   - Choose AI provider (ollama or deepseek)"
    echo "   - Add API keys if using DeepSeek"
    echo "   - Configure messaging bridges (optional)"
    echo ""
    read -p "Press Enter to continue after editing .env, or Ctrl+C to exit..."
fi

# Ask user which AI provider to use
echo "🤖 Select AI Provider:"
echo "1) Ollama (local, free, requires model download)"
echo "2) DeepSeek (cloud, requires API key)"
read -p "Enter your choice (1 or 2): " ai_choice

if [ "$ai_choice" = "1" ]; then
    sed -i 's/AI_PROVIDER=.*/AI_PROVIDER=ollama/' .env
    echo "✅ Configured to use Ollama"
    USING_OLLAMA=true
elif [ "$ai_choice" = "2" ]; then
    sed -i 's/AI_PROVIDER=.*/AI_PROVIDER=deepseek/' .env
    echo "✅ Configured to use DeepSeek"
    echo "⚠️  Make sure you have set DEEPSEEK_API_KEY in .env"
    USING_OLLAMA=false
else
    echo "❌ Invalid choice"
    exit 1
fi

echo ""
echo "🚀 Starting MAXIMUS AI Assistant..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Pull Ollama model if using Ollama
if [ "$USING_OLLAMA" = true ]; then
    echo ""
    echo "📥 Pulling Ollama model (this may take a few minutes)..."
    echo "   You can change the model later by editing .env"
    
    docker-compose exec -T ollama ollama pull llama2 || {
        echo "⚠️  Failed to pull model automatically."
        echo "   You can pull it manually later with:"
        echo "   docker-compose exec ollama ollama pull llama2"
    }
fi

echo ""
echo "================================"
echo "✅ MAXIMUS AI Assistant is ready!"
echo "================================"
echo ""
echo "📊 Dashboard: http://localhost:3000"
echo "🔌 API Server: http://localhost:3001"
echo ""
echo "📝 Useful commands:"
echo "   View logs:          docker-compose logs -f"
echo "   Stop services:      docker-compose down"
echo "   Restart services:   docker-compose restart"
echo "   Update:             git pull && docker-compose up -d --build"
echo ""

if [ "$USING_OLLAMA" = true ]; then
    echo "🤖 Ollama commands:"
    echo "   List models:        docker-compose exec ollama ollama list"
    echo "   Pull new model:     docker-compose exec ollama ollama pull <model-name>"
    echo "   Available models:   https://ollama.ai/library"
    echo ""
fi

echo "📖 Documentation: README.md and DEPLOYMENT.md"
echo "🐛 Issues: https://github.com/brandonlacoste9-tech/MAXIMUS/issues"
echo ""
echo "🐝 Happy chatting with MAXIMUS!"
