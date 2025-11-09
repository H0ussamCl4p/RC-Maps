import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ensam-event-secret-2025';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Admin rate limiting (more permissive for admin operations)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500 // limit each IP to 500 requests per windowMs for admin routes
});
app.use('/api/admin/', adminLimiter);

// Strict rate limiting for voting
const voteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // 5 votes per minute
});
app.use('/api/vote/', voteLimiter);

// Resolve absolute path for the SQLite DB to avoid working-directory issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'event.db');

// Database setup
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    console.log('🗄️ Using DB file:', DB_PATH);
    // Improve reliability: enforce foreign keys and better journaling
    db.run('PRAGMA foreign_keys = ON');
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA busy_timeout = 5000');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Clubs table
    db.run(`CREATE TABLE IF NOT EXISTS clubs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      logo TEXT,
      vote_count INTEGER DEFAULT 0,
      stand_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Students table
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class TEXT,
      ticket_code TEXT UNIQUE NOT NULL,
      qr_code TEXT,
      has_voted INTEGER DEFAULT 0,
      voted_for INTEGER,
      voted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (voted_for) REFERENCES clubs(id)
    )`);

    // Admins table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Votes table
    db.run(`CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      club_id INTEGER NOT NULL,
      voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (club_id) REFERENCES clubs(id)
    )`);

    // Stands configuration table
    db.run(`CREATE TABLE IF NOT EXISTS stands_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_key TEXT UNIQUE NOT NULL,
      config_value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, () => {
      // Initialize default stands configuration
      const defaultStands = JSON.stringify([
        { id: 1, name: 'S1', position: [-4.5, 0, -3.5], color: '#ef4444', available: true, sizeMeters: [36, 36] },
        { id: 2, name: 'S2', position: [-1.5, 0, -3.5], color: '#3b82f6', available: true, sizeMeters: [36, 36] },
        { id: 3, name: 'S3', position: [1.5, 0, -3.5], color: '#06b6d4', available: true, sizeMeters: [36, 36] },
        { id: 4, name: 'S4', position: [4.5, 0, -3.5], color: '#f59e0b', available: true, sizeMeters: [36, 36] },
        { id: 5, name: 'S5', position: [4.5, 0, -1.17], color: '#06b6d4', available: true, sizeMeters: [36, 36] },
        { id: 6, name: 'S6', position: [4.5, 0, 1.17], color: '#f97316', available: true, sizeMeters: [36, 36] },
        { id: 7, name: 'S7', position: [4.5, 0, 3.5], color: '#f59e0b', available: true, sizeMeters: [36, 36] },
        { id: 8, name: 'S8', position: [2.25, 0, 3.5], color: '#ec4899', available: true, sizeMeters: [36, 36] },
        { id: 9, name: 'S9', position: [0, 0, 3.5], color: '#8b5cf6', available: true, sizeMeters: [36, 36] },
        { id: 10, name: 'S10', position: [-2.25, 0, 3.5], color: '#ec4899', available: true, sizeMeters: [36, 36] },
        { id: 11, name: 'S11', position: [-4.5, 0, 3.5], color: '#ef4444', available: true, sizeMeters: [36, 36] },
        { id: 12, name: 'S12', position: [-4.5, 0, 1.17], color: '#14b8a6', available: true, sizeMeters: [36, 36] },
        { id: 13, name: 'S13', position: [-4.5, 0, -1.17], color: '#a855f7', available: true, sizeMeters: [36, 36] }
      ]);
      
      db.run(`INSERT OR IGNORE INTO stands_config (config_key, config_value) VALUES ('stands_layout', ?)`, [defaultStands]);
    });

    console.log('✅ Database tables initialized');
  });
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    console.log('Token verified for user:', user.username, 'role:', user.role);
    next();
  });
}

// ============= PUBLIC ROUTES =============

// Get stands configuration
app.get('/api/stands', (req, res) => {
  db.get('SELECT config_value FROM stands_config WHERE config_key = ?', ['stands_layout'], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.json([]);
    }
    
    const stands = JSON.parse(row.config_value);
    
    // Get club assignments
    db.all('SELECT id, name, stand_id FROM clubs WHERE stand_id IS NOT NULL', (err, clubs) => {
      if (err) {
        return res.json(stands);
      }
      
      // Map clubs to stands
      const clubMap = {};
      clubs.forEach(club => {
        clubMap[club.stand_id] = { id: club.id, name: club.name };
      });
      
      // Add club info to stands
      const standsWithClubs = stands.map(stand => ({
        ...stand,
        club: clubMap[stand.id] || null
      }));
      
      res.json(standsWithClubs);
    });
  });
});

// Get all clubs
app.get('/api/clubs', (req, res) => {
  db.all('SELECT * FROM clubs ORDER BY name', (err, clubs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(clubs);
  });
});

// Get results
app.get('/api/results', (req, res) => {
  db.all(
    'SELECT id, name, description, logo, vote_count FROM clubs ORDER BY vote_count DESC, name',
    (err, clubs) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      db.get('SELECT COUNT(*) as total FROM students WHERE has_voted = 1', (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const totalVotes = result.total;
        const results = clubs.map(club => ({
          ...club,
          percentage: totalVotes > 0 ? ((club.vote_count / totalVotes) * 100).toFixed(1) : 0
        }));

        res.json({ clubs: results, totalVotes });
      });
    }
  );
});

// ============= VOTING ROUTES =============

// Verify ticket code
app.post('/api/vote/verify', (req, res) => {
  const { ticketCode } = req.body;

  if (!ticketCode) {
    return res.status(400).json({ error: 'Ticket code is required' });
  }

  db.get(
    'SELECT id, name, class, has_voted, voted_for FROM students WHERE ticket_code = ?',
    [ticketCode.trim().toUpperCase()],
    (err, student) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!student) {
        return res.status(404).json({ error: 'Invalid ticket code' });
      }
      if (student.has_voted) {
        return res.status(403).json({ error: 'This ticket has already been used to vote' });
      }
      res.json({ valid: true, student });
    }
  );
});

// Submit vote
app.post('/api/vote/submit', (req, res) => {
  const { ticketCode, clubId } = req.body;
  const ipAddress = req.ip;

  if (!ticketCode || !clubId) {
    return res.status(400).json({ error: 'Ticket code and club ID are required' });
  }

  // Verify ticket
  db.get(
    'SELECT id, has_voted FROM students WHERE ticket_code = ?',
    [ticketCode.trim().toUpperCase()],
    (err, student) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!student) {
        return res.status(404).json({ error: 'Invalid ticket code' });
      }
      if (student.has_voted) {
        return res.status(403).json({ error: 'This ticket has already been used' });
      }

      // Update student record
      db.run(
        'UPDATE students SET has_voted = 1, voted_for = ?, voted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [clubId, student.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to record vote' });
          }

          // Increment club vote count
          db.run('UPDATE clubs SET vote_count = vote_count + 1 WHERE id = ?', [clubId], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update vote count' });
            }

            // Record in votes table
            db.run(
              'INSERT INTO votes (student_id, club_id, ip_address) VALUES (?, ?, ?)',
              [student.id, clubId, ipAddress],
              (err) => {
                if (err) {
                  console.error('Failed to record vote detail:', err);
                }
                res.json({ success: true, message: 'Vote recorded successfully' });
              }
            );
          });
        }
      );
    }
  );
});

// ============= ADMIN ROUTES =============

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, username: admin.username, role: admin.role });
  });
});

// Get all clubs (Admin)
app.get('/api/admin/clubs', authenticateToken, (req, res) => {
  db.all('SELECT * FROM clubs ORDER BY name', (err, clubs) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(clubs);
  });
});

// Add club
app.post('/api/admin/clubs', authenticateToken, (req, res) => {
  const { name, description, logo } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Club name is required' });
  }

  db.run(
    'INSERT INTO clubs (name, description, logo) VALUES (?, ?, ?)',
    [name, description, logo || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add club' });
      }
      res.json({ id: this.lastID, name, description, logo, vote_count: 0 });
    }
  );
});

// Bulk add clubs
app.post('/api/admin/clubs/bulk', authenticateToken, (req, res) => {
  const { clubs } = req.body;

  if (!clubs || !Array.isArray(clubs) || clubs.length === 0) {
    return res.status(400).json({ error: 'Clubs array is required' });
  }

  let successCount = 0;
  let errorCount = 0;

  // Process each club
  const processClub = (index) => {
    if (index >= clubs.length) {
      // All clubs processed
      res.json({ 
        success: true, 
        count: successCount, 
        errors: errorCount,
        message: `Successfully added ${successCount} clubs${errorCount > 0 ? `, ${errorCount} failed` : ''}`
      });
      return;
    }

    const club = clubs[index];
    const { name, description, logo } = club;

    if (!name) {
      errorCount++;
      processClub(index + 1);
      return;
    }

    db.run(
      'INSERT INTO clubs (name, description, logo) VALUES (?, ?, ?)',
      [name, description || null, logo || null],
      function(err) {
        if (err) {
          console.error('Error adding club:', name, err);
          errorCount++;
        } else {
          successCount++;
        }
        processClub(index + 1);
      }
    );
  };

  processClub(0);
});

// Delete all clubs - MUST come before /:id route to avoid Express matching "all" as an ID
app.delete('/api/admin/clubs/all', authenticateToken, async (req, res) => {
  console.log('=== DELETE /api/admin/clubs/all endpoint called ===');
  console.log('User role:', req.user ? req.user.role : 'undefined');

  if (req.user.role !== 'superadmin') {
    console.log('Access denied: user is not superadmin');
    return res.status(403).json({ error: 'Only superadmin can delete all clubs' });
  }

  console.log('Starting deletion of all clubs...');

  try {
    console.log('About to unassign stands...');
    // Unassign all stands first
    const standsUpdated = await new Promise((resolve, reject) => {
      console.log('Running UPDATE clubs SET stand_id = NULL...');
      db.run('UPDATE clubs SET stand_id = NULL', function(err) {
        console.log('Stands update callback called, err:', err, 'changes:', this.changes);
        if (err) {
          console.error('Error unassigning stands:', err);
          reject(err);
          return;
        }
        console.log('Stands unassigned successfully, updated', this.changes, 'clubs');
        resolve(this.changes);
      });
    });
    console.log('Stands promise resolved with:', standsUpdated);

    console.log('About to delete clubs...');
    // Then delete all clubs
    const clubsDeleted = await new Promise((resolve, reject) => {
      console.log('Running DELETE FROM clubs...');
      db.run('DELETE FROM clubs', function(err) {
        console.log('Clubs delete callback called, err:', err, 'changes:', this.changes);
        if (err) {
          console.error('Error deleting clubs:', err);
          reject(err);
          return;
        }
        console.log('Clubs deleted successfully, deleted', this.changes, 'clubs');
        resolve(this.changes);
      });
    });
    console.log('Clubs promise resolved with:', clubsDeleted);

    console.log('=== DELETE CLUBS OPERATION COMPLETED ===');
    console.log('Sending success response...');
    res.json({
      success: true,
      message: 'All clubs have been deleted successfully',
      deleted: { clubs: clubsDeleted, standsUpdated: standsUpdated }
    });
    console.log('Response sent');

  } catch (error) {
    console.error('Error in delete all clubs:', error);
    res.status(500).json({ error: 'Failed to delete all clubs' });
  }
});

// Delete single club - MUST come after /all route to avoid matching "all" as an ID
app.delete('/api/admin/clubs/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM clubs WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete club' });
    }
    res.json({ success: true });
  });
});

// Assign stand to club
app.put('/api/admin/clubs/:id/stand', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { stand_id } = req.body;

  console.log('Assign stand request:', { club_id: id, stand_id, body: req.body });

  // If unassigning (stand_id is null), just set this club's stand_id to null
  if (stand_id === null || stand_id === undefined) {
    db.run('UPDATE clubs SET stand_id = NULL WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error unassigning stand from club:', err);
        return res.status(500).json({ error: 'Failed to unassign stand from club' });
      }
      console.log('Stand unassigned successfully:', { club_id: id });
      res.json({ success: true, message: 'Stand unassigned successfully' });
    });
    return;
  }

  // First, unassign this stand from any other club
  db.run('UPDATE clubs SET stand_id = NULL WHERE stand_id = ?', [stand_id], (err) => {
    if (err) {
      console.error('Error unassigning stand:', err);
      return res.status(500).json({ error: 'Failed to unassign stand' });
    }

    // Now assign the stand to this club
    db.run('UPDATE clubs SET stand_id = ? WHERE id = ?', [stand_id, id], function(err) {
      if (err) {
        console.error('Error assigning stand to club:', err);
        return res.status(500).json({ error: 'Failed to assign stand to club' });
      }
      console.log('Stand assigned successfully:', { club_id: id, stand_id });
      res.json({ success: true, message: 'Stand assigned successfully' });
    });
  });
});

// Get all students
app.get('/api/admin/students', authenticateToken, (req, res) => {
  db.all('SELECT * FROM students ORDER BY class, name', (err, students) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(students);
  });
});

// Add student
app.post('/api/admin/students', authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const ticketCode = uuidv4().substring(0, 8).toUpperCase();

  try {
    const qrDataUrl = await QRCode.toDataURL(ticketCode, { width: 300 });

    db.run(
      'INSERT INTO students (name, class, ticket_code, qr_code) VALUES (?, ?, ?, ?)',
      [name, null, ticketCode, qrDataUrl],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to add student' });
        }
        res.json({
          id: this.lastID,
          name,
          class: null,
          ticket_code: ticketCode,
          qr_code: qrDataUrl,
          has_voted: 0
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Bulk add students
app.post('/api/admin/students/bulk', authenticateToken, async (req, res) => {
  const { students } = req.body;

  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ error: 'Invalid students data' });
  }

  const addedStudents = [];

  for (const student of students) {
    const ticketCode = uuidv4().substring(0, 8).toUpperCase();

    try {
      const qrDataUrl = await QRCode.toDataURL(ticketCode, { width: 300 });

      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO students (name, class, ticket_code, qr_code) VALUES (?, ?, ?, ?)',
          [student.name, student.class, ticketCode, qrDataUrl],
          function(err) {
            if (err) reject(err);
            else {
              addedStudents.push({
                id: this.lastID,
                name: student.name,
                class: student.class,
                ticket_code: ticketCode,
                qr_code: qrDataUrl,
                has_voted: 0
              });
              resolve();
            }
          }
        );
      });
    } catch (err) {
      console.error('Error adding student:', err);
    }
  }

  res.json({ success: true, count: addedStudents.length, students: addedStudents });
});

// Batch generate students
app.post('/api/admin/students/batch-generate', authenticateToken, async (req, res) => {
  const { count } = req.body;

  if (!count || count < 1 || count > 50) {
    return res.status(400).json({ error: 'Count must be between 1 and 50' });
  }

  const addedStudents = [];

  for (let i = 0; i < count; i++) {
    const ticketCode = uuidv4().substring(0, 8).toUpperCase();
    const studentName = `Student ${String(i + 1).padStart(3, '0')}`;

    try {
      const qrDataUrl = await QRCode.toDataURL(ticketCode, { width: 300 });

      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO students (name, class, ticket_code, qr_code) VALUES (?, ?, ?, ?)',
          [studentName, null, ticketCode, qrDataUrl],
          function(err) {
            if (err) reject(err);
            else {
              addedStudents.push({
                id: this.lastID,
                name: studentName,
                class: null,
                ticket_code: ticketCode,
                qr_code: qrDataUrl,
                has_voted: 0
              });
              resolve();
            }
          }
        );
      });
    } catch (err) {
      console.error('Error generating student:', err);
    }
  }

  res.json({ success: true, count: addedStudents.length, students: addedStudents });
});

// Delete all students - MUST come before /:id route to avoid Express matching "all" as an ID
console.log('Registering DELETE /api/admin/students/all route');
app.delete('/api/admin/students/all', authenticateToken, async (req, res) => {
  console.log('=== DELETE /api/admin/students/all endpoint called ===');
  console.log('User role:', req.user ? req.user.role : 'undefined');

  if (req.user.role !== 'superadmin') {
    console.log('Access denied: user is not superadmin');
    return res.status(403).json({ error: 'Only superadmin can delete all students' });
  }

  console.log('Starting deletion of all students...');

  try {
    console.log('About to delete votes...');
    // Delete all votes first
    const votesDeleted = await new Promise((resolve, reject) => {
      console.log('Running DELETE FROM votes...');
      db.run('DELETE FROM votes', function(err) {
        console.log('Votes delete callback called, err:', err, 'changes:', this.changes);
        if (err) {
          console.error('Error deleting votes:', err);
          reject(err);
          return;
        }
        console.log('Votes deleted successfully, deleted', this.changes, 'votes');
        resolve(this.changes);
      });
    });
    console.log('Votes promise resolved with:', votesDeleted);

    console.log('About to delete students...');
    // Then delete all students
    const studentsDeleted = await new Promise((resolve, reject) => {
      console.log('Running DELETE FROM students...');
      db.run('DELETE FROM students', function(err) {
        console.log('Students delete callback called, err:', err, 'changes:', this.changes);
        if (err) {
          console.error('Error deleting students:', err);
          reject(err);
          return;
        }
        console.log('Students deleted successfully, deleted', this.changes, 'students');
        resolve(this.changes);
      });
    });
    console.log('Students promise resolved with:', studentsDeleted);

    console.log('=== DELETE OPERATION COMPLETED ===');
    console.log('Sending success response...');
    res.json({
      success: true,
      message: 'All students have been deleted successfully',
      deleted: { students: studentsDeleted, votes: votesDeleted }
    });
    console.log('Response sent');

  } catch (error) {
    console.error('Error in delete all students:', error);
    res.status(500).json({ error: 'Failed to delete all students' });
  }
});

// Delete single student - MUST come after /all route to avoid matching "all" as an ID
app.delete('/api/admin/students/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete student' });
    }
    res.json({ success: true });
  });
});

// Get statistics
app.get('/api/admin/statistics', authenticateToken, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total FROM students', (err, result) => {
    stats.totalStudents = result ? result.total : 0;

    db.get('SELECT COUNT(*) as total FROM students WHERE has_voted = 1', (err, result) => {
      stats.votedStudents = result ? result.total : 0;

      db.get('SELECT COUNT(*) as total FROM clubs', (err, result) => {
        stats.totalClubs = result ? result.total : 0;

        stats.votingPercentage = stats.totalStudents > 0
          ? ((stats.votedStudents / stats.totalStudents) * 100).toFixed(1)
          : 0;

        res.json(stats);
      });
    });
  });
});

// Quick students count endpoint (admin only)
app.get('/api/admin/students/count', authenticateToken, (req, res) => {
  db.get('SELECT COUNT(*) as total FROM students', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ total: row ? row.total : 0 });
  });
});

// Reset votes
app.post('/api/admin/reset-votes', authenticateToken, (req, res) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Only superadmin can reset votes' });
  }

  db.serialize(() => {
    db.run('UPDATE students SET has_voted = 0, voted_for = NULL, voted_at = NULL');
    db.run('UPDATE clubs SET vote_count = 0');
    db.run('DELETE FROM votes', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to reset votes' });
      }
      res.json({ success: true, message: 'All votes have been reset' });
    });
  });
});

// Update stands configuration
app.put('/api/admin/stands', authenticateToken, (req, res) => {
  const { stands } = req.body;

  if (!stands || !Array.isArray(stands)) {
    return res.status(400).json({ error: 'Invalid stands data' });
  }

  const standsJson = JSON.stringify(stands);

  db.run(
    'UPDATE stands_config SET config_value = ?, updated_at = CURRENT_TIMESTAMP WHERE config_key = ?',
    [standsJson, 'stands_layout'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update stands configuration' });
      }
      res.json({ success: true, message: 'Stands configuration updated' });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🎓 ENSAM Event Management System');
  console.log('📡 Server running on http://localhost:' + PORT);
  console.log('� Secure admin authentication enabled\n');
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\n✅ Database connection closed');
    }
    process.exit(0);
  });
});
