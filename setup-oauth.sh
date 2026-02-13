#!/bin/bash

# ChatGPT OAuth Setup Script
# This script installs dependencies and sets up the OAuth service

set -e

echo "========================================="
echo "  ChatGPT OAuth Setup (using pi-ai)"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install OAuth service dependencies
echo "📦 Installing OAuth service dependencies..."
cd servers/oauth-service
npm install
echo "✅ OAuth service dependencies installed"
echo ""

cd ../..

# Build Docker image
echo "🐳 Building Docker image..."
docker-compose build
echo "✅ Docker image built"
echo ""

echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "To start the application:"
echo "  docker-compose up"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:5000"
echo ""
echo "To test ChatGPT OAuth:"
echo "  1. Go to Settings"
echo "  2. Select 'ChatGPT' as LLM"
echo "  3. Click 'Login with ChatGPT'"
echo "  4. Complete authentication in the browser"
echo ""
echo "For more information, see:"
echo "  - PIAPI_DOCKER_SETUP.md"
echo "  - OAUTH_FINAL_SOLUTION.md"
echo ""
