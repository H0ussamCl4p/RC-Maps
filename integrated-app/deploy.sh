#!/bin/bash

echo "=========================================="
echo "  ENSAM Event - Vercel Deployment"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI is not installed"
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"
echo ""

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
vercel whoami

if [ $? -ne 0 ]; then
    echo "🔑 Please login to Vercel..."
    vercel login
fi

echo ""
echo "📦 Building project..."
echo ""

# Install dependencies
echo "[1/2] Installing frontend dependencies..."
cd frontend
npm install

echo "[2/2] Installing backend dependencies..."
cd ../backend
npm install

cd ..

echo ""
echo "🚀 Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
echo "⚠️  Don't forget to:"
echo "  1. Set up your environment variables in Vercel Dashboard"
echo "  2. Configure your database"
echo "  3. Update CORS settings"
echo ""
