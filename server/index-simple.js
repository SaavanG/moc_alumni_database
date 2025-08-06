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
let pendingSubmissions = [];

// Initialize alumni with any environment variable data
let alumni = [];

// Load any persistent alumni from environment variables
function loadPersistentAlumni() {
  try {
    if (process.env.ALUMNI_DATA) {
      const persistentAlumni = JSON.parse(process.env.ALUMNI_DATA);
      if (Array.isArray(persistentAlumni)) {
        alumni = [...persistentAlumni];
        console.log(`Loaded ${alumni.length} persistent alumni records`);
      }
    }
  } catch (error) {
    console.log('No persistent alumni data found or error parsing:', error.message);
  }
}

// Load persistent data on startup
loadPersistentAlumni();

let admins = [
  {
    id: 1,
    username: 'admin',
    password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'MOC_Admin_2024!', 10)
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

// Update alumni
app.put('/api/alumni/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, year_graduated, current_college, college_major, second_major, profession, linkedin_url } = req.body;
    
    if (!full_name || !email || !year_graduated || !current_college || !college_major) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alumniIndex = alumni.findIndex(a => a.id === parseInt(id));
    
    if (alumniIndex === -1) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Check if email already exists in other alumni records
    const emailExists = alumni.some(a => a.id !== parseInt(id) && a.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      return res.status(400).json({ error: 'This email address is already in use by another alumni' });
    }

    // Update the alumni record
    alumni[alumniIndex] = {
      ...alumni[alumniIndex],
      full_name,
      email,
      year_graduated: parseInt(year_graduated),
      current_college,
      college_major,
      second_major: second_major || null,
      profession: profession || null,
      linkedin_url: linkedin_url || null,
      updated_at: new Date().toISOString()
    };

    res.json({
      message: 'Alumni updated successfully',
      alumni: alumni[alumniIndex]
    });
  } catch (error) {
    console.error('Update alumni error:', error);
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

// Submit alumni information for approval
app.post('/api/submit-alumni', async (req, res) => {
  try {
    const { full_name, email, year_graduated, current_college, college_major, second_major, profession, linkedin_url } = req.body;
    
    if (!full_name || !email || !year_graduated || !current_college || !college_major) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists in approved alumni or pending submissions
    const emailExists = alumni.some(a => a.email.toLowerCase() === email.toLowerCase()) ||
                       pendingSubmissions.some(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      return res.status(400).json({ error: 'This email address has already been submitted' });
    }

    const newSubmission = {
      id: pendingSubmissions.length + 1000, // Different ID range to avoid conflicts
      full_name,
      email,
      year_graduated: parseInt(year_graduated),
      current_college,
      college_major,
      second_major: second_major || null,
      profession: profession || null,
      linkedin_url: linkedin_url || null,
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };

    pendingSubmissions.push(newSubmission);
    
    res.status(201).json({
      message: 'Submission received successfully. It will be reviewed by an admin.',
      submission_id: newSubmission.id
    });
  } catch (error) {
    console.error('Submit alumni error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending submissions (admin only)
app.get('/api/pending-submissions', authenticateToken, (req, res) => {
  try {
    res.json({
      submissions: pendingSubmissions,
      count: pendingSubmissions.length
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve submission (admin only)
app.post('/api/approve-submission/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const submissionIndex = pendingSubmissions.findIndex(s => s.id === parseInt(id));
    
    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const submission = pendingSubmissions[submissionIndex];
    
    // Create new alumni entry from submission
    const newAlumni = {
      id: alumni.length + 1,
      full_name: submission.full_name,
      email: submission.email,
      year_graduated: submission.year_graduated,
      current_college: submission.current_college,
      college_major: submission.college_major,
      second_major: submission.second_major,
      profession: submission.profession,
      linkedin_url: submission.linkedin_url,
      created_at: new Date().toISOString()
    };

    alumni.push(newAlumni);
    
    // Remove from pending submissions
    pendingSubmissions.splice(submissionIndex, 1);
    
    res.json({ 
      message: 'Submission approved and added to alumni directory',
      alumni: newAlumni 
    });
  } catch (error) {
    console.error('Approve submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject submission (admin only)
app.delete('/api/reject-submission/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const submissionIndex = pendingSubmissions.findIndex(s => s.id === parseInt(id));
    
    if (submissionIndex === -1) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    pendingSubmissions.splice(submissionIndex, 1);
    
    res.json({ message: 'Submission rejected and removed' });
  } catch (error) {
    console.error('Reject submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export current alumni data (admin only) - for backup purposes
app.get('/api/export-alumni', authenticateToken, (req, res) => {
  try {
    res.json({
      message: 'Current alumni data',
      count: alumni.length,
      data: alumni,
      envVariable: JSON.stringify(alumni)
    });
  } catch (error) {
    console.error('Export alumni error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change admin password
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Find the admin user
    const admin = admins.find(a => a.id === req.user.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in memory
    admin.password_hash = newPasswordHash;

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Default admin: username=admin, password=admin123`);
});