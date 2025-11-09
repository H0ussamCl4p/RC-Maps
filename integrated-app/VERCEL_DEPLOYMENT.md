# ENSAM Event Management System - Vercel Deployment Guide

## 📋 Prerequisites

Before deploying to Vercel, make sure you have:

1. A [Vercel account](https://vercel.com/signup) (free tier works fine)
2. [Vercel CLI](https://vercel.com/docs/cli) installed globally: `npm install -g vercel`
3. Git initialized in your project

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Navigate to your project directory**
   ```bash
   cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   
   - Follow the prompts
   - Choose "Yes" when asked to link to existing project or create new one
   - Select your project settings
   - Choose the `integrated-app` directory as the root

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (or select `integrated-app` if needed)
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Output Directory**: `frontend/dist`
   - Click "Deploy"

## ⚠️ Important Notes

### Database Considerations

Vercel uses serverless functions, which means:
- **SQLite won't work in production** because serverless functions are stateless
- You need to migrate to a cloud database

### Recommended Database Solutions:

1. **Vercel Postgres** (Recommended)
   - Free tier available
   - Integrated with Vercel
   - Easy setup

2. **Supabase** (PostgreSQL)
   - Free tier available
   - Provides REST API
   - Real-time features

3. **PlanetScale** (MySQL)
   - Free tier available
   - Serverless MySQL

### Environment Variables

After deployment, add these environment variables in Vercel Dashboard:

- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Your JWT secret key (generate a secure one)

Go to: **Project Settings → Environment Variables**

## 🔧 Post-Deployment Configuration

1. **Update API Base URL** in `frontend/src/pages/*.jsx`:
   Replace `http://localhost:5000` with your Vercel backend URL

2. **Update CORS Settings** in `backend/server.js`:
   Add your Vercel frontend URL to CORS configuration

## 📝 Current Limitations

- SQLite database needs migration to cloud database
- File uploads (if any) need cloud storage solution (AWS S3, Cloudinary, etc.)
- Admin credentials are currently hardcoded (should use environment variables)

## 🔐 Security Recommendations

1. Move sensitive credentials to environment variables
2. Use a managed database service
3. Enable CORS only for your domain
4. Use strong JWT secrets
5. Implement rate limiting for API endpoints

## 📞 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

---

**Admin Credentials:**
- Username: `Sailing`
- Password: `Sailor@houssam@luffy1212`

⚠️ **Remember to change these in production!**
