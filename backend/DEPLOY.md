# Render.com Deployment Guide

This project is configured for **Render.com** free hosting with automatic GitHub deployment.

## Architecture

- **Backend (PHP + MySQL)**: Deployed as a Web Service on Render
- **Frontend (React)**: Deployed as a Static Site on Render
- **Database**: MySQL (free tier)
- **Auto-deploy**: Both services auto-deploy when you push to GitHub

## Prerequisites

1. GitHub account with this repository pushed
2. Render.com account (free)
3. Your repository URL: `https://github.com/medshk/scandiweb-test`

## Step 1: Deploy Backend (PHP + MySQL)

### 1. Create New Blueprint
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository: `medshk/scandiweb-test`
4. Click **"Apply"**

### 2. Configure Environment Variables
The `render.yaml` will automatically create the database. After deployment, add these environment variables to your Web Service:

```
DB_CONNECTION=mysql
DB_HOST=[auto-generated from database]
DB_PORT=3306
DB_DATABASE=scandiweb_ecommerce
DB_USERNAME=[auto-generated]
DB_PASSWORD=[auto-generated]
```

### 3. Import Database Schema
1. Go to your MySQL database on Render Dashboard
2. Click **"Connect"** to get connection details
3. Use MySQL Workbench or CLI to connect
4. Run the SQL script:
   ```bash
   mysql -h [host] -u [user] -p [database] < schema.sql
   ```

### 4. Backend URL
After deployment, your backend will be at:
`https://scandiweb-backend.onrender.com`

**Note**: Free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

## Step 2: Deploy Frontend (React)

### 1. Create Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Configure:
   - **Name**: `scandiweb-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `../public`

### 2. Configure Environment Variables
Add this environment variable:
```
VITE_GRAPHQL_ENDPOINT=https://scandiweb-backend.onrender.com/graphql
```

Replace with your actual backend URL from Step 1.

### 3. Deploy
Click **"Create Static Site"**

Your frontend will be at:
`https://scandiweb-frontend.onrender.com`

## Step 3: Update CORS (One-time setup)

Update your backend CORS to allow your frontend domain. Edit `public/index.php`:

```php
// Change line 5 from:
header('Access-Control-Allow-Origin: *');

// To:
$allowed_origins = ['https://scandiweb-frontend.onrender.com', 'http://localhost:5173'];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
```

Then push to GitHub - it will auto-deploy!

## Updates

Any push to `main` branch will automatically deploy both services.

## Troubleshooting

### Database Connection Failed
- Check environment variables in Render dashboard
- Verify database is "Available" (not suspended)

### CORS Errors
- Make sure CORS headers match your frontend URL exactly
- Include `https://` and no trailing slash

### 502 Bad Gateway
- Check build logs in Render dashboard
- Verify `composer install` ran successfully

## Free Tier Limits

- **Web Service**: Sleeps after 15 min inactivity
- **MySQL**: 90-day expiration (can recreate)
- **Static Site**: Always available, no sleep

## Support

- Render Docs: https://render.com/docs
- MySQL on Render: https://render.com/docs/databases
