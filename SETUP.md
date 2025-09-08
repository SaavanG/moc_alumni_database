# Setup Instructions for Trinity MOC Alumni Database

## Prerequisites Installation

### 1. Install Node.js and npm

#### Option A: Using Homebrew (Recommended for macOS)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (this will also install npm)
brew install node
```

#### Option B: Direct Download
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for macOS
3. Run the installer

#### Option C: Using Node Version Manager (nvm)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.zshrc

# Install Node.js
nvm install --lts
nvm use --lts
```

### 2. Verify Installation
```bash
node --version
npm --version
```

## Application Setup

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
cd ..
```

### 2. Start the Application

#### Option A: Start both servers together
```bash
npm run dev
```

#### Option B: Start servers separately
```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend server
cd client
npm start
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

2. **Permission denied errors**
   ```bash
   # Fix npm permissions
   sudo chown -R $USER /usr/local/lib/node_modules
   ```

3. **Node modules not found**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Database Issues
- The SQLite database will be created automatically when you first start the server
- If you encounter database errors, delete the `server/database.sqlite` file and restart the server

## Development Commands

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Build for production
npm run build

# Start only backend
npm run server

# Start only frontend
npm run client
```

## Next Steps

1. **Change Default Admin Password**: After first login, consider implementing a password change feature
2. **Add Sample Data**: Use the admin panel to add some sample alumni data
3. **Customize Styling**: Modify the Tailwind CSS classes in the components
4. **Deploy**: When ready, deploy to a hosting service like Heroku, Vercel, or AWS

## Support

If you encounter any issues during setup, please:
1. Check that Node.js and npm are properly installed
2. Ensure all dependencies are installed
3. Check the console for error messages
4. Contact the development team for assistance 