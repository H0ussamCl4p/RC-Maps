# 🚀 Quick Deployment to Vercel

## Step-by-Step Guide

### 1️⃣ Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### 2️⃣ Deploy Your Project

#### Option A: Using the Deploy Script (Easiest)
```bash
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
.\deploy.bat
```

#### Option B: Manual Deployment
```bash
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → ensam-event (or your preferred name)
- **In which directory is your code located?** → ./
- **Want to override settings?** → No

### 3️⃣ Deploy to Production
```bash
vercel --prod
```

## ⚠️ Important: After Deployment

### Configure Environment Variables in Vercel Dashboard

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

### Update Frontend API URL

The frontend currently points to `http://localhost:5000`. After deployment, you need to:

1. Get your Vercel backend URL (e.g., `https://your-app.vercel.app`)
2. Update the API base URL in frontend files to use your Vercel URL

**OR** use environment variables:
- Create `frontend/.env.production`:
  ```
  VITE_API_BASE_URL=https://your-app.vercel.app
  ```

- Update frontend code to use:
  ```javascript
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  ```

## 🗄️ Database Migration Required

**SQLite won't work on Vercel!** You need to migrate to a cloud database:

### Recommended: Vercel Postgres (Easiest)

1. In Vercel Dashboard, go to **Storage** → **Create Database**
2. Select **Postgres**
3. Follow setup instructions
4. Copy the `DATABASE_URL` to your environment variables

### Alternative: Use Supabase (Free PostgreSQL)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get your database URL from Settings → Database
4. Add to Vercel environment variables

## 📝 Checklist

- [ ] Vercel CLI installed and logged in
- [ ] Project deployed to Vercel
- [ ] Environment variables configured
- [ ] Database migrated from SQLite to cloud database
- [ ] Frontend API URL updated
- [ ] CORS settings configured for your domain
- [ ] Admin credentials secured

## 🎉 You're Done!

Your app should now be live at: `https://your-app-name.vercel.app`

---

**Need Help?**
- Read the full guide: `VERCEL_DEPLOYMENT.md`
- Vercel Docs: https://vercel.com/docs
