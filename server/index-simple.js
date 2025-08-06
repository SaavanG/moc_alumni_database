const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for testing deployment)
let alumni = [
  {
    id: 1,
    full_name: "John Smith",
    email: "john.smith@email.com",
    year_graduated: 2020,
    current_college: "MIT",
    college_major: "Computer Science",
    second_major: "Mathematics",
    profession: "Software Engineer",
    linkedin_url: "https://linkedin.com/in/johnsmith",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    full_name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    year_graduated: 2019,
    current_college: "Stanford University",
    college_major: "Business Administration",
    profession: "Product Manager",
    linkedin_url: "https://linkedin.com/in/sarahjohnson",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    full_name: "Mike Chen",
    email: "mike.chen@email.com",
    year_graduated: 2021,
    current_college: "UC Berkeley",
    college_major: "Electrical Engineering",
    profession: "Hardware Engineer",
    linkedin_url: "https://linkedin.com/in/mikechen",
    created_at: new Date().toISOString()
  }
];

let admins = [
  {
    id: 1,
    username: 'admin',
    password_hash: bcrypt.hashSync('admin123', 10)
  }
];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'MOC Alumni Database API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = admins.find(a => a.username === username);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: admin.id, username: admin.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all alumni
app.get('/api/alumni', (req, res) => {
  try {
    res.json({
      alumni: alumni,
      count: alumni.length
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add alumni
app.post('/api/alumni', authenticateToken, (req, res) => {
  try {
    const { full_name, email, year_graduated, current_college, college_major } = req.body;
    
    if (!full_name || !email || !year_graduated || !current_college || !college_major) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAlumni = {
      id: alumni.length + 1,
      full_name,
      email,
      year_graduated: parseInt(year_graduated),
      current_college,
      college_major,
      second_major: req.body.second_major || null,
      profession: req.body.profession || null,
      linkedin_url: req.body.linkedin_url || null,
      created_at: new Date().toISOString()
    };

    alumni.push(newAlumni);
    
    res.status(201).json({
      message: 'Alumni added successfully',
      alumni: newAlumni
    });
  } catch (error) {
    console.error('Add alumni error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete alumni
app.delete('/api/alumni/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const index = alumni.findIndex(a => a.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    
    alumni.splice(index, 1);
    res.json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    console.error('Delete alumni error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get filter options
app.get('/api/filters', (req, res) => {
  try {
    // Extract unique values from alumni data for filters
    const years = [...new Set(alumni.map(a => a.year_graduated))].sort((a, b) => b - a);
    const colleges = [...new Set(alumni.map(a => a.current_college))].sort();
    const majors = [...new Set(alumni.map(a => a.college_major))].sort();

    res.json({
      years,
      colleges,
      majors
    });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Default admin: username=admin, password=admin123`);
});