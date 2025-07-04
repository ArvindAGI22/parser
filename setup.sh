#!/bin/bash

echo "🎯 Setting up Technical Recruiter Evaluation Tool..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install chromium

# Create .env.local file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔐 Creating .env.local file..."
    cat > .env.local << EOL
# Add your Groq API key here
# Get it from: https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here
EOL
    echo "⚠️  Please add your Groq API key to .env.local"
else
    echo "✅ .env.local already exists"
fi

echo "🚀 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your Groq API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "�� Happy recruiting!" 