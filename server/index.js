const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create alumni table
  db.run(`CREATE TABLE IF NOT EXISTS alumni (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    year_graduated INTEGER NOT NULL,
    current_college TEXT NOT NULL,
    college_major TEXT NOT NULL,
    second_major TEXT,
    profession TEXT,
    linkedin_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create admin table
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating admin table:', err);
    } else {
      // Create default admin if table is empty
      db.get("SELECT COUNT(*) as count FROM admins", (err, row) => {
        if (err) {
          console.error('Error checking admin count:', err);
        } else if (row.count === 0) {
          const defaultPassword = 'admin123'; // Change this in production
          bcrypt.hash(defaultPassword, 10, (err, hash) => {
            if (err) {
              console.error('Error hashing password:', err);
            } else {
              db.run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", 
                ['admin', hash], (err) => {
                if (err) {
                  console.error('Error creating default admin:', err);
                } else {
                  console.log('Default admin created: username=admin, password=admin123');
                }
              });
            }
          });
        }
      });
    }
  });
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Admin login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, admin.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token, username: admin.username });
    });
  });
});

// Get all alumni (public)
app.get('/api/alumni', (req, res) => {
  const { search, year, college, major, sortBy = 'full_name', sortOrder = 'ASC' } = req.query;
  
  let query = "SELECT * FROM alumni WHERE 1=1";
  let params = [];

  if (search) {
    query += " AND (full_name LIKE ? OR email LIKE ? OR current_college LIKE ? OR college_major LIKE ?)";
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (year) {
    query += " AND year_graduated = ?";
    params.push(year);
  }

  if (college) {
    query += " AND current_college LIKE ?";
    params.push(`%${college}%`);
  }

  if (major) {
    query += " AND college_major LIKE ?";
    params.push(`%${major}%`);
  }

  query += ` ORDER BY ${sortBy} ${sortOrder}`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get unique values for filters
app.get('/api/filters', (req, res) => {
  db.all("SELECT DISTINCT year_graduated FROM alumni ORDER BY year_graduated DESC", (err, years) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    db.all("SELECT DISTINCT current_college FROM alumni ORDER BY current_college", (err, colleges) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      db.all("SELECT DISTINCT college_major FROM alumni ORDER BY college_major", (err, majors) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({
          years: years.map(row => row.year_graduated),
          colleges: colleges.map(row => row.current_college),
          majors: majors.map(row => row.college_major)
        });
      });
    });
  });
});

// Add new alumni (admin only)
app.post('/api/alumni', authenticateToken, (req, res) => {
  const { full_name, email, year_graduated, current_college, college_major, second_major, profession, linkedin_url } = req.body;

  if (!full_name || !email || !year_graduated || !current_college || !college_major) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    "INSERT INTO alumni (full_name, email, year_graduated, current_college, college_major, second_major, profession, linkedin_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [full_name, email, year_graduated, current_college, college_major, second_major || null, profession || null, linkedin_url || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Alumni added successfully' });
    }
  );
});

// Update alumni (admin only)
app.put('/api/alumni/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { full_name, email, year_graduated, current_college, college_major, second_major, profession, linkedin_url } = req.body;

  if (!full_name || !email || !year_graduated || !current_college || !college_major) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    "UPDATE alumni SET full_name = ?, email = ?, year_graduated = ?, current_college = ?, college_major = ?, second_major = ?, profession = ?, linkedin_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [full_name, email, year_graduated, current_college, college_major, second_major || null, profession || null, linkedin_url || null, id],
    function(err) {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Alumni not found' });
      }
      res.json({ message: 'Alumni updated successfully' });
    }
  );
});

// Delete alumni (admin only)
app.delete('/api/alumni/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM alumni WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json({ message: 'Alumni deleted successfully' });
  });
});

// Get single alumni (public)
app.get('/api/alumni/:id', (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM alumni WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Alumni not found' });
    }
    res.json(row);
  });
});

// Change password (admin only)
app.post('/api/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  // Get the current admin user
  db.get("SELECT * FROM admins WHERE id = ?", [req.user.id], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    bcrypt.compare(currentPassword, admin.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing password' });
        }

        // Update the password
        db.run("UPDATE admins SET password_hash = ? WHERE id = ?", [hash, req.user.id], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({ message: 'Password changed successfully' });
        });
      });
    });
  });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 