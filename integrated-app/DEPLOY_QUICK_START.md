# 🚀 Quick Deployment Guide

## 📋 Recommended Approach

Since Vercel is optimized for frontend apps, here's the best deployment strategy:

### **Frontend → Vercel**
### **Backend → Render/Railway/Heroku**

---

## 🎨 Deploy Frontend to Vercel

### 1️⃣ Login to Vercel
```bash
vercel login
```

### 2️⃣ Deploy Frontend
```bash
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
vercel --prod
```

**Configuration:**
- Framework: Other (Vite)
- Root Directory: `./`
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`

Your frontend will be live at: `https://your-app.vercel.app`

---

## 🔧 Deploy Backend to Render (FREE)

### Option A: Deploy Backend to Render

1. **Create Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repo
   - Select the repository
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
   - **Plan**: Free

3. **Add Environment Variables**:
   ```
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   ```

4. **Get your backend URL**: `https://your-backend.onrender.com`

### Option B: Deploy Backend to Railway

1. **Create Account** at [railway.app](https://railway.app)

2. **New Project** → Deploy from GitHub
   - Select your repo
   - Railway will auto-detect Node.js

3. **Configure**:
   - Root Directory: `backend`
   - Start Command: `node server.js`

4. **Add Environment Variables** in Settings

---

## 🔗 Connect Frontend to Backend

After deploying both:

### Update Frontend API URL

**Create** `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Update all API calls** in frontend files:
Replace:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

With:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

Files to update:
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/pages/VotingPage.jsx`
- `frontend/src/pages/ResultsPage.jsx`
- `frontend/src/pages/AdminLogin.jsx`
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/StandsMapPage.jsx`

### Update Backend CORS

In `backend/server.js`, update CORS to allow your Vercel domain:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}));
```

---

## 📝 Complete Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway
- [ ] Environment variables configured on both platforms
- [ ] Frontend `.env.production` created with backend URL
- [ ] All frontend API calls updated to use env variable
- [ ] Backend CORS configured for Vercel domain
- [ ] Database setup (see below)
- [ ] Test login and all features

---

## 🗄️ Database Setup

**Important**: SQLite doesn't work on cloud platforms!

### Quick Solution: Supabase (Recommended)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. You'll need to migrate your SQLite schema to PostgreSQL

### Alternative: Vercel Postgres

1. In Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string
4. Add to backend environment variables

---

## 🎉 Quick Deploy Commands

```bash
# Navigate to project
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app

# Deploy frontend to Vercel
vercel --prod

# Push backend code to GitHub (for Render/Railway to pick up)
git add .
git commit -m "Update for deployment"
git push
```

---

## ⚠️ Important Notes

1. **Update API URLs** after backend deployment
2. **Configure CORS** on backend for your Vercel domain  
3. **Migrate database** from SQLite to cloud database
4. **Secure credentials** - use environment variables

---

**Need Help?**
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
- Railway: https://docs.railway.app
