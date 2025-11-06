# 🚀 Deployment Guide

## Step 1: Push to GitHub

### Create a new repository on GitHub
1. Go to https://github.com/new
2. Repository name: `3d-stands-map` (or your preferred name)
3. Description: "Interactive 3D exhibition stands map"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Push your code
```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/3d-stands-map.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Link to existing project? **No**
- What's your project's name? **3d-stands-map**
- In which directory is your code located? **./**
- Want to override the settings? **No**

4. **Deploy to Production**:
```bash
vercel --prod
```

### Method 2: Vercel Dashboard (Easy)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **/**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
6. Click "Deploy"

## 🎉 Your site is live!

Vercel will provide you with URLs:
- **Production**: `https://3d-stands-map.vercel.app`
- **Preview**: Automatic deployments for every git push

## 📝 Environment Variables (if needed)

If you add environment variables later:
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add your variables
4. Redeploy

## 🔄 Automatic Deployments

Every time you push to GitHub:
- **main branch** → Production deployment
- **other branches** → Preview deployment

## 🛠️ Useful Commands

```bash
# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>

# Add custom domain
vercel domains add yourdomain.com
```

## ⚡ Performance Tips

Your site is already optimized with:
- ✅ Next.js 14 App Router
- ✅ Static optimization
- ✅ Image optimization
- ✅ Automatic code splitting
- ✅ Edge runtime support

## 🐛 Troubleshooting

### Build fails on Vercel?
1. Check that `npm run build` works locally
2. Ensure all dependencies are in `package.json`
3. Check the build logs on Vercel dashboard

### 3D scene not loading?
1. Check browser console for errors
2. Ensure WebGL is supported
3. Check that all Three.js dependencies are installed

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
