#!/bin/bash

# Stripe Checkout POC Setup Script
# This script helps you get started quickly

set -e  # Exit on error

echo "╔════════════════════════════════════════╗"
echo "║   Stripe Checkout POC Setup Wizard     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping environment setup."
else
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Stripe API keys"
    echo "   Get them from: https://dashboard.stripe.com/test/apikeys"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         Setup Complete! 🎉             ║"
echo "╠════════════════════════════════════════╣"
echo "║                                        ║"
echo "║  Next Steps:                           ║"
echo "║                                        ║"
echo "║  1. Edit .env with your Stripe keys    ║"
echo "║     vim .env                           ║"
echo "║                                        ║"
echo "║  2. Start the backend (Terminal 1):    ║"
echo "║     npm run server:dev                 ║"
echo "║                                        ║"
echo "║  3. Start the frontend (Terminal 2):   ║"
echo "║     npm run dev                        ║"
echo "║                                        ║"
echo "║  4. Open browser:                      ║"
echo "║     http://localhost:5175              ║"
echo "║                                        ║"
echo "║  5. Test with card:                    ║"
echo "║     4242 4242 4242 4242                ║"
echo "║                                        ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo ""
