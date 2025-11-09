# 🚀 COMPLETE DEPLOYMENT GUIDE - Two-Part Strategy

## 📦 What We're Deploying

- **Frontend (React + Vite)** → Vercel
- **Backend (Node.js + Express)** → Render

---

## PART 1: Deploy Backend to Render 🔧

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easiest)

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: **RC-Maps**
3. Configure the service:
   
   ```
   Name: ensam-event-backend
   Region: Frankfurt (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   Instance Type: Free
   ```

4. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   JWT_SECRET=Sailor@houssam@luffy1212-super-secret-jwt
   PORT=5000
   ```

5. Click **"Create Web Service"**

6. **Wait for deployment** (3-5 minutes)

7. **Copy your backend URL**: 
   ```
   https://ensam-event-backend.onrender.com
   ```
   ⚠️ **IMPORTANT: Save this URL!**

---

## PART 2: Update Frontend Configuration 🎨

### Step 1: Update Environment Variable

1. Open `frontend/.env.production`
2. Replace with YOUR backend URL:
   ```env
   VITE_API_BASE_URL=https://ensam-event-backend.onrender.com
   ```
   (Use your actual Render URL from Part 1)

### Step 2: Commit Changes
```bash
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
git add .
git commit -m "Update API URL for production deployment"
git push
```

---

## PART 3: Deploy Frontend to Vercel 🌐

### Step 1: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: **RC-Maps**
4. Configure:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/dist
   Install Command: cd frontend && npm install
   ```

5. Click **"Deploy"**

### Step 2: Get Your Frontend URL
After deployment completes, you'll get a URL like:
```
https://rc-maps.vercel.app
```

### Step 3: Update Backend CORS

⚠️ **IMPORTANT**: Your backend needs to allow requests from your frontend!

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **Environment** tab
4. Add new environment variable:
   ```
   FRONTEND_URL=https://rc-maps.vercel.app
   ```
   (Use your actual Vercel URL)

5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## ✅ VERIFICATION CHECKLIST

Test everything:

- [ ] Backend is live at Render URL
- [ ] Frontend is live at Vercel URL
- [ ] Open frontend URL in browser
- [ ] Navigate to different pages (Homepage, Vote, Results)
- [ ] Try admin login:
  - Username: `Sailing`
  - Password: `Sailor@houssam@luffy1212`
- [ ] Check browser console for errors
- [ ] Test voting functionality
- [ ] View results page

---

## 🐛 TROUBLESHOOTING

### Frontend shows "Network Error"
- ✅ Check `frontend/.env.production` has correct backend URL
- ✅ Rebuild and redeploy frontend on Vercel
- ✅ Check browser console for CORS errors

### Backend CORS Error
- ✅ Add `FRONTEND_URL` env variable on Render
- ✅ Service will auto-redeploy

### Database Not Working
- ✅ SQLite works on Render Free tier
- ✅ Check Render logs for errors
- ✅ Render Dashboard → Logs

### 404 Errors on Page Refresh
- ✅ This is normal for SPAs - Vercel handles it automatically
- ✅ If issues persist, we can add redirect rules

---

## 📊 Your Live URLs

After deployment:

🌐 **Frontend**: https://rc-maps.vercel.app
🔧 **Backend**: https://ensam-event-backend.onrender.com

---

## 🎉 YOU'RE DONE!

Your ENSAM Event Management System is now live and accessible worldwide!

---

## 📝 Quick Commands Reference

```bash
# Navigate to project
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app

# Make changes and deploy
git add .
git commit -m "Your message"
git push

# Vercel will auto-deploy frontend
# Render will auto-deploy backend
```

---

## 🔐 Admin Credentials (Production)

**Username**: Sailing
**Password**: Sailor@houssam@luffy1212

⚠️ Change these after first production login!

---

Need help? Check the logs:
- **Vercel Logs**: Project → Deployments → Click deployment → Logs
- **Render Logs**: Service → Logs tab
