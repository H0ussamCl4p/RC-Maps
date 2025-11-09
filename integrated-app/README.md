# 🎓 ENSAM Event Management System

A comprehensive, secure, full-stack event management platform integrating **3D stand visualization**, **voting system**, and **live results** into one unified application.

## ✨ Features

### 🗺️ **3D Stand Locations**
- Interactive 3D map with React Three Fiber
- 13 customizable stands positioned around event venue
- Hover to view stand details and sizes
- Fully responsive with orbit controls (rotate, zoom, pan)

### 🗳️ **Secure Voting System**
- Unique ticket codes with QR generation
- One vote per student with duplicate prevention
- Real-time vote counting
- Anonymous voting with JWT authentication for admins

### 📊 **Live Results Dashboard**
- Auto-refreshing charts (updates every 5 seconds)
- Bar charts with Recharts
- Detailed results table with percentages
- Current leader display

### 🔐 **Admin Panel**
- Secure JWT-based authentication
- Club management (Create, Read, Delete)
- Student management with bulk CSV import
- QR code ticket generation and export
- Vote reset functionality
- Real-time statistics dashboard

### 🛡️ **Security Features**
- Helmet.js for HTTP security headers
- Express rate limiting (prevents spam)
- JWT token authentication
- Bcrypt password hashing
- CORS protection
- Input validation and sanitization

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **SQLite3** - Lightweight database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Express Rate Limit** - API protection
- **qrcode** - QR code generation
- **uuid** - Unique ticket codes

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **React Router** - Navigation
- **React Three Fiber** - 3D graphics
- **@react-three/drei** - 3D helpers
- **Three.js** - 3D engine
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **TailwindCSS** - Styling
- **Lucide React** - Icons

## 📁 Project Structure

```
integrated-app/
├── backend/
│   ├── server.js          # Express server with all API routes
│   ├── package.json       # Backend dependencies
│   └── event.db          # SQLite database (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Main welcome page
│   │   │   ├── StandsMapPage.jsx     # 3D stand visualization
│   │   │   ├── VotingPage.jsx        # Student voting interface
│   │   │   ├── ResultsPage.jsx       # Live results dashboard
│   │   │   ├── AdminLogin.jsx        # Admin authentication
│   │   │   └── AdminDashboard.jsx    # Admin control panel
│   │   ├── App.jsx        # Main app with routing
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── start.bat              # Windows batch startup script
├── start.ps1              # PowerShell startup script
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm installed
- Windows OS (for batch scripts) or any OS (manual start)

### Option 1: Automated Start (Windows)

#### Using Batch File:
```bash
# Double-click start.bat or run:
start.bat
```

#### Using PowerShell:
```powershell
# Right-click start.ps1 → Run with PowerShell or:
.\start.ps1
```

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd backend
npm install
npm start
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Admin Panel:** http://localhost:3000/admin

### Default Admin Credentials
```
Username: admin
Password: admin123
```

## 📖 User Guide

### For Students

#### 1. View 3D Stand Map
- Navigate to **"Stand Locations"** from home page
- Explore interactive 3D map
- Hover over stands to see details
- Use mouse to rotate, zoom, and pan

#### 2. Cast Your Vote
- Navigate to **"Cast Your Vote"**
- Enter your unique ticket code (8 characters)
- Select your favorite club
- Submit your vote
- View confirmation

#### 3. Check Live Results
- Navigate to **"Live Results"**
- See real-time voting statistics
- View bar charts and percentages
- Check current leader

### For Administrators

#### 1. Login to Admin Panel
- Click **"Admin"** button on home page
- Enter credentials (admin/admin123)
- Access admin dashboard

#### 2. Manage Clubs
- Switch to **"Clubs"** tab
- Add new clubs with name and description
- View current vote counts
- Delete clubs if needed

#### 3. Manage Students
- Switch to **"Students"** tab
- **Add single student:** Name + Class
- **Bulk add:** Paste CSV format (name,class per line)
- View generated ticket codes
- Export QR code tickets for printing
- See voting status (Voted/Pending)
- Delete students if needed

#### 4. Monitor Statistics
- View dashboard cards:
  - Total Students
  - Students Voted
  - Total Clubs
  - Voting Rate %

#### 5. Reset Votes
- Click **"Reset Votes"** button
- Confirm action (⚠️ cannot be undone)
- All votes cleared, students can revote

## 🔌 API Endpoints

### Public Routes
```
GET  /api/stands              # Get stands configuration
GET  /api/clubs               # Get all clubs
GET  /api/results             # Get voting results
POST /api/vote/verify         # Verify ticket code
POST /api/vote/submit         # Submit vote
GET  /api/health              # Health check
```

### Admin Routes (Require JWT Token)
```
POST   /api/admin/login               # Admin authentication
GET    /api/admin/clubs               # Get clubs (admin view)
POST   /api/admin/clubs               # Create new club
DELETE /api/admin/clubs/:id           # Delete club
GET    /api/admin/students            # Get all students
POST   /api/admin/students            # Add single student
POST   /api/admin/students/bulk       # Bulk add students
DELETE /api/admin/students/:id        # Delete student
GET    /api/admin/statistics          # Get voting stats
POST   /api/admin/reset-votes         # Reset all votes
PUT    /api/admin/stands              # Update stands config
```

## 🗄️ Database Schema

### Tables

#### `clubs`
- `id` - Primary key
- `name` - Club name
- `description` - Club description
- `logo` - Logo URL (optional)
- `vote_count` - Current vote count
- `created_at` - Timestamp

#### `students`
- `id` - Primary key
- `name` - Student name
- `class` - Student class
- `ticket_code` - Unique 8-character code
- `qr_code` - QR code data URL
- `has_voted` - Boolean flag
- `voted_for` - Foreign key to clubs
- `voted_at` - Timestamp
- `created_at` - Timestamp

#### `votes`
- `id` - Primary key
- `student_id` - Foreign key to students
- `club_id` - Foreign key to clubs
- `voted_at` - Timestamp
- `ip_address` - Request IP

#### `admins`
- `id` - Primary key
- `username` - Admin username
- `password` - Hashed password
- `role` - Admin role
- `created_at` - Timestamp

#### `stands_config`
- `id` - Primary key
- `config_key` - Configuration key
- `config_value` - JSON configuration
- `updated_at` - Timestamp

## 🔒 Security Best Practices

1. **Change Default Credentials:**
   ```javascript
   // In backend/server.js, update:
   const defaultPassword = bcrypt.hashSync('YOUR_NEW_PASSWORD', 10);
   ```

2. **Use Environment Variables:**
   ```bash
   # Create .env file:
   PORT=5000
   JWT_SECRET=your-secret-key-here
   ```

3. **Enable HTTPS in Production:**
   - Use SSL/TLS certificates
   - Configure reverse proxy (nginx/Apache)

4. **Rate Limiting:**
   - Already configured (100 requests/15min globally)
   - Voting: 5 requests/minute per IP

5. **Regular Updates:**
   ```bash
   npm audit
   npm update
   ```

## 🎨 Customization

### Update Stand Configuration
Modify stands in `backend/server.js`:
```javascript
const defaultStands = JSON.stringify([
  { id: 1, name: 'S1', position: [-4.5, 0, -3.5], color: '#ef4444', available: true, sizeMeters: [36, 36] },
  // Add more stands...
]);
```

### Change Theme Colors
Edit `frontend/src/index.css` and component styles.

### Modify Auto-Refresh Interval
In `ResultsPage.jsx`:
```javascript
const interval = setInterval(fetchResults, 5000); // Change 5000 (5s) to desired ms
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend):
npx kill-port 5000

# Kill process on port 3000 (frontend):
npx kill-port 3000
```

### Database Locked Error
```bash
# Close all connections and restart backend
# Delete event.db and restart (⚠️ loses all data)
```

### Module Not Found
```bash
# Reinstall dependencies:
cd backend && npm install
cd ../frontend && npm install
```

### CORS Errors
- Ensure backend is running on port 5000
- Check vite.config.js proxy configuration

## 📊 Performance Tips

1. **Optimize 3D Scene:**
   - Reduce polygon count for stands
   - Use LOD (Level of Detail) for distant objects

2. **Database Optimization:**
   - Add indexes for frequently queried fields
   - Consider PostgreSQL for large datasets

3. **Caching:**
   - Implement Redis for frequently accessed data
   - Cache stands configuration

## 🚢 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Add Procfile:
web: node backend/server.js

# Set environment variables:
heroku config:set JWT_SECRET=your-secret
```

### Frontend Deployment (Example: Vercel)
```bash
# Build frontend:
cd frontend
npm run build

# Deploy dist/ folder
```

### Full Stack (Example: DigitalOcean)
```bash
# Install Node.js on server
# Clone repository
# Set up PM2 for process management:
pm2 start backend/server.js --name ensam-backend
pm2 start "npm run dev" --cwd frontend --name ensam-frontend
pm2 startup
pm2 save
```

## 📝 License

MIT License - Feel free to use for educational purposes.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Contact: [Your Contact Info]

## 🎉 Acknowledgments

- React Three Fiber for 3D rendering
- TailwindCSS for styling
- Recharts for data visualization
- ENSAM for inspiration

---

**Made with ❤️ for ENSAM Event Management**
