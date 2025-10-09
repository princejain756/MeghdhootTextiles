#!/bin/bash

echo "🚀 Starting complete deployment process..."

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed."
    exit 1
fi

# Build and deploy
echo "🏗️  Building and deploying..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Complete deployment successful!"
    echo "🌐 Website is live at: https://meghdoottextiles.com"
else
    echo "❌ Deployment failed."
    exit 1
fi
