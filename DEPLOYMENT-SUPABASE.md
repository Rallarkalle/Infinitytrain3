# Quick Deployment Guide - Render + Supabase (100% Free)

## Overview

This application uses:
- **Render** - Free web hosting
- **Supabase** - Free PostgreSQL database (500MB, no expiration)  
- **SQLite** - Local development (no setup needed)

**Total Cost: $0/month** ✅

---

## Step-by-Step Setup

### Part 1: Set Up Supabase Database (5 minutes)

#### 1.1 Create Supabase Account
- Go to https://supabase.com
- Click "Start your project"
- Sign up with GitHub (easiest)

#### 1.2 Create New Project
- Click "New Project"
- **Organization**: Select or create one
- **Project Name**: `infinitytrain`
- **Database Password**: Create a strong password (SAVE THIS!)
- **Region**: Choose closest to your users
- Click "Create new project"
- ⏳ Wait 2-3 minutes for initialization

#### 1.3 Run Database Schema
- In Supabase dashboard, click **SQL Editor** (left sidebar)
- Click "+ New query"
- Open `supabase-schema.sql` from this repo
- Copy ALL the SQL code
- Paste into Supabase SQL editor
- Click **RUN** (or Ctrl/Cmd + Enter)
- ✅ Should see "Success. No rows returned"

#### 1.4 Get API Credentials
- Go to **Settings** → **API** (left sidebar)
- Copy these two values (you'll need them next):
  
  📋 **Project URL**:
  ```
  https://xxxxxxxxxxxxx.supabase.co
  ```
  
  📋 **anon public key** (under "Project API keys"):
  ```
  eyJhbGc...long string...
  ```

---

### Part 2: Deploy to Render (5 minutes)

#### 2.1 Push Code to GitHub
If you haven't already:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2.2 Create Render Web Service
- Go to https://dashboard.render.com/ (create free account if needed)
- Click **"New +"** → **"Web Service"**
- Click "Connect account" to link GitHub
- Find and select your `Infinitytrain3` repository
- Click "Connect"

#### 2.3 Configure Service
Fill in these settings:

**Basic Info:**
- **Name**: `infinitytrain` (or your choice)
- **Region**: Select closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Runtime**: Node

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Plan:**
- **Instance Type**: Free

#### 2.4 Add Environment Variables (CRITICAL!)
Scroll down to **Environment Variables** section:

Click "Add Environment Variable" and add **both** of these:

1. **Variable 1:**
   ```
   Key: SUPABASE_URL
   Value: <paste your Project URL from Supabase>
   ```

2. **Variable 2:**
   ```
   Key: SUPABASE_ANON_KEY
   Value: <paste your anon public key from Supabase>
   ```

#### 2.5 Deploy!
- Click **"Create Web Service"**
- ⏳ Wait 5-10 minutes for build & deployment
- ✅ Your app will be live at: `https://infinitytrain.onrender.com`

---

## First-Time Setup

Once deployed, the app automatically:
- ✅ Connects to your Supabase database
- ✅ Initializes with demo data (users & topics)
- ✅ Ready to use immediately!

### Demo Users
Log in with these accounts:
- **Admin**: `admin@oceaninfinity.com`
- **Employee**: `sarah@oceaninfinity.com` or `john@oceaninfinity.com`

(No password required in demo mode - add auth later if needed)

---

## Local Development

Want to run locally?

```bash
# Install dependencies
npm install

# Start dev server (uses SQLite locally)
npm run dev

# Open browser
http://localhost:5000
```

---

## Monitoring & Management

### View Logs
- **Render**: Dashboard → Your Service → Logs tab
- **Supabase**: Dashboard → Database → Logs

### Update Application
1. Make changes to code
2. Commit and push to GitHub
3. Render auto-deploys (2-5 minutes)
4. Database persists - no data loss!

### Database Management
- **View data**: Supabase → Table Editor
- **Run queries**: Supabase → SQL Editor
- **Backups**: Automatic (Supabase handles this)

---

## Free Tier Limits

### Render Free Tier
- ✅ Unlimited apps
- ⚠️ Spins down after 15 min inactivity (first request after is ~30 sec slow)
- ✅ 750 hours/month (enough for 24/7 for 1 app)
- ✅ Auto-deploys from GitHub

### Supabase Free Tier
- ✅ 500 MB database storage
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ 2 GB bandwidth
- ✅ No time limit (stays free forever)
- ✅ Automatic backups (7 days)

**Perfect for small-medium teams!**

---

## Troubleshooting

### Build Fails on Render
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies
- Common fix: Delete `package-lock.json`, `npm install`, and re-push

### App Shows "Application Error"
- Check runtime logs in Render
- Verify environment variables are set correctly:
  - `SUPABASE_URL` 
  - `SUPABASE_ANON_KEY`
- Both must be present!

### Database Connection Failed
- Verify Supabase project is running (not paused)
- Check API credentials are correct
- Ensure `supabase-schema.sql` was run successfully

### App is Slow
- First request after inactivity is slow (Render free tier)
- Subsequent requests are fast
- Upgrade to paid Render plan ($7/mo) for always-on

### Data Not Saving
- Check Supabase Table Editor to see if data appears
- View browser console for API errors
- Check Render logs for server errors

---

## Upgrading (Optional)

### Keep Free Forever
Current setup works indefinitely at no cost!

### Upgrade Render ($7/month)
- Always-on (no spin-down)
- Faster response times
- More resources

### Upgrade Supabase ($25/month)
- 8 GB database
- Daily backups (30 days)
- More bandwidth

---

## Support

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **This Project**: Open an issue on GitHub

---

## Summary Checklist

Before deploying, make sure you have:

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database schema run in SQL Editor
- [ ] Copied SUPABASE_URL
- [ ] Copied SUPABASE_ANON_KEY
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web Service created on Render
- [ ] Both environment variables added to Render
- [ ] Service deployed successfully

**That's it! Your app is live! 🎉**
