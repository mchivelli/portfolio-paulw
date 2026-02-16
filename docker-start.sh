#!/bin/bash

# Docker Quick Start Script for Portfolio Application

set -e

echo "🐳 Starting Portfolio Application with Docker..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.docker.example..."
    cp .env.docker.example .env
    echo ""
    echo "⚠️  Please edit .env file with your actual credentials before continuing!"
    echo "Required variables:"
    echo "  - GITHUB_USERNAME"
    echo "  - CLICKUP_API_KEY"
    echo "  - MAILGUN_API_KEY"
    echo "  - MAILGUN_DOMAIN"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/api/health"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
