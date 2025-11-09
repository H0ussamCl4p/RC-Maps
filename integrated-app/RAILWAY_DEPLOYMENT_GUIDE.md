# 🚂 Deploy Backend to Railway - Quick Guide

## Why Railway?
- ✅ **Fastest deployment** (30 seconds vs 5 minutes on Render)
- ✅ **SQLite works perfectly** (persistent disk included)
- ✅ **$5 free credit every month** (enough for small apps)
- ✅ **Auto-deploys from GitHub**
- ✅ **Better interface than Render**

---

## 🚀 PART 1: Deploy Backend to Railway

### Step 1: Sign Up
1. Go to **[railway.app](https://railway.app)**
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: **RC-Maps**
4. Railway will detect Node.js automatically ✅

### Step 3: Configure Service
1. Click on the deployed service
2. Go to **Settings** tab
3. Under **Root Directory**, enter: `backend`
4. Under **Start Command**, it should auto-detect: `node server.js`

### Step 4: Add Environment Variables
1. Go to **Variables** tab
2. Click **"New Variable"** and add:

```
NODE_ENV=production
JWT_SECRET=Sailor@houssam@luffy1212-super-secret-jwt
PORT=5000
```

3. Click **"Deploy"** (or it auto-deploys)

### Step 5: Get Your Backend URL
1. Go to **Settings** tab
2. Click **"Generate Domain"** under **Public Networking**
3. Your URL will look like:
   ```
   https://rc-maps-production.up.railway.app
   ```
4. **SAVE THIS URL!** ⚠️

---

## 🎨 PART 2: Update Frontend Configuration

### Step 1: Update Environment Variable
Open `frontend/.env.production` and replace with YOUR Railway URL:

```env
VITE_API_BASE_URL=https://rc-maps-production.up.railway.app
```

### Step 2: Commit and Push
```bash
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
git add frontend/.env.production
git commit -m "Update API URL to Railway backend"
git push
```

---

## 🌐 PART 3: Deploy Frontend to Vercel

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Import** your **RC-Maps** repository
3. Configuration auto-fills from `vercel.json`
4. Click **"Deploy"**
5. Get your frontend URL: `https://rc-maps.vercel.app`

---

## 🔗 PART 4: Update Backend CORS

### Add Frontend URL to Railway Variables:

1. Back to **Railway Dashboard**
2. Your backend service → **Variables** tab
3. Add new variable:
   ```
   FRONTEND_URL=https://rc-maps.vercel.app
   ```
4. Railway auto-redeploys ✅

---

## ✅ VERIFICATION

Test your deployed app:

1. **Backend Health Check**:
   ```
   https://rc-maps-production.up.railway.app/api/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend**:
   ```
   https://rc-maps.vercel.app
   ```
   All pages should work!

3. **Admin Login**:
   - Username: `Sailing`
   - Password: `Sailor@houssam@luffy1212`

---

## 📊 Monitor Your App

### Railway Dashboard:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time backend logs
- **Usage**: Track your $5 credit

### Vercel Dashboard:
- **Analytics**: Page views, performance
- **Logs**: Deployment and runtime logs

---

## 💰 Railway Pricing

**Free Tier:**
- $5 in credits every month
- ~500 hours of usage
- Perfect for small projects

**After Free Tier:**
- Pay only for what you use
- ~$5-10/month for small apps

---

## 🆚 Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Deployment Speed | ⚡ 30 seconds | 🐌 5-10 minutes |
| Free Tier | $5 credit/month | 750 hours/month |
| SQLite Support | ✅ YES | ✅ YES |
| Interface | 🎨 Modern | 📋 Basic |
| Monitoring | ✅ Built-in | ✅ Built-in |
| Auto-deploy | ✅ YES | ✅ YES |

**Winner: Railway** for speed and developer experience! 🏆

---

## 🔧 Troubleshooting

### Backend not responding:
1. Check Railway **Logs** tab
2. Verify environment variables are set
3. Check domain is generated in Settings

### Frontend CORS errors:
1. Add `FRONTEND_URL` variable on Railway
2. Wait for auto-redeploy (30 seconds)

### Database issues:
1. Railway provides persistent storage for SQLite ✅
2. Check logs for any database errors

---

## 🎉 You're Done!

Your app is now live on:
- 🔧 **Backend**: https://rc-maps-production.up.railway.app
- 🎨 **Frontend**: https://rc-maps.vercel.app

**Deployment time: ~5 minutes total!** 🚀

---

## 📝 Quick Deploy Commands

```bash
# Update backend URL
cd c:\Users\HoussamClap\Documents\Projects-app\stands\integrated-app
code frontend/.env.production
# (Edit with your Railway URL)

# Commit and push
git add .
git commit -m "Deploy to Railway + Vercel"
git push

# Railway auto-deploys backend ✅
# Vercel auto-deploys frontend ✅
```

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Vercel Docs**: https://vercel.com/docs

---

**Made with ❤️ by CHOUBIK Houssam**
