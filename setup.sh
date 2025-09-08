#!/bin/bash

echo "🚀 Setting up Trinity MOC Alumni Database..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "📖 See SETUP.md for installation instructions."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    echo "📖 See SETUP.md for installation instructions."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd server
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

echo "✅ All dependencies installed successfully!"
echo ""
echo "🎉 Setup complete! You can now start the application:"
echo "   npm run dev"
echo ""
echo "📋 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🌐 The application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000" 