#!/bin/bash

# MAXIMUS AI Assistant Startup Script

echo "🤖 MAXIMUS AI Assistant - Starting up..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please configure it before running."
    exit 1
fi

# Source environment
source .env

echo "Configuration:"
echo "  AI Provider: $AI_PROVIDER"
echo "  Port: $PORT"
echo ""

# Check if running in Docker
if [ -f /.dockerenv ]; then
    echo "🐳 Running in Docker container"
else
    echo "💻 Running locally"
    
    # Check if node_modules exists
    if [ ! -d node_modules ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
fi

echo ""
echo "🚀 Starting MAXIMUS AI Assistant..."
echo "   Dashboard will be available at: http://localhost:$PORT"
echo ""

# Start the application
npm start
