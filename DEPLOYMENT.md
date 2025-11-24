# Quick Deployment Guide for Render

## Step-by-Step Instructions

### 1. Prerequisites
- GitHub account with this repository pushed
- Render account (free tier available at https://render.com)

### 2. Deploy to Render

#### Option A: Using Render Blueprint (Recommended - Easiest)

1. Push your code to GitHub
2. Go to https://dashboard.render.com/
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repository
5. Select the repository
6. Render will automatically detect `render.yaml` and configure everything
7. Click **"Apply"** to create the service
8. Wait for the build and deployment to complete (5-10 minutes)
9. Your app will be live at the provided URL!

#### Option B: Manual Configuration

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `infinitytrain` (or your choice)
   - **Region**: Select closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or your preference)

5. **Add Persistent Disk** (CRITICAL for database):
   - Scroll to **"Disks"** section
   - Click **"Add Disk"**
   - **Name**: `infinitytrain-data`
   - **Mount Path**: `/opt/render/project/data`
   - **Size**: 1 GB (increase if needed)

6. Click **"Create Web Service"**
7. Wait for deployment to complete
8. Access your app at the provided URL

### 3. First-Time Setup

Once deployed, your app will:
- ✅ Automatically create the SQLite database
- ✅ Initialize with demo users and sample training topics
- ✅ Be ready to use immediately

### 4. Accessing the Application

Default demo users:
- **Admin**: `admin@oceaninfinity.com`
- **Employee**: `sarah@oceaninfinity.com`
- **Employee**: `john@oceaninfinity.com`

(Note: This is a demo app - add proper authentication for production use)

### 5. Monitoring

- View logs in Render Dashboard → Your Service → Logs
- Monitor deployments in the Events tab
- Check database size in the Disks section

### 6. Updating the Application

1. Push changes to your GitHub repository
2. Render will automatically detect and deploy changes
3. The persistent disk ensures data survives deployments

## Important Notes

- **Persistent Disk**: Essential for keeping data between deployments
- **Free Tier**: Spins down after 15 minutes of inactivity (first request after may be slow)
- **Paid Plans**: Get always-on services and more resources
- **Database Backups**: Available automatically with Render Disks

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Database Not Persisting
- Verify persistent disk is mounted at `/opt/render/project/data`
- Check disk is properly configured in service settings

### Service Won't Start
- Review start command: `npm start`
- Check that build completed successfully
- View runtime logs for error messages

## Support

For issues with:
- **Render Platform**: https://render.com/docs
- **This Application**: Open an issue in the GitHub repository
