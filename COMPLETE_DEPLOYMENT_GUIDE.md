# Complete Deployment Guide - Convivencia on Vercel

This guide will help you deploy the Convivencia application to Vercel with a free PlanetScale database.

## Prerequisites

- GitHub account (already have: 0rwa11/convivencia)
- Vercel account (free)
- PlanetScale account (free)

## Step 1: Create PlanetScale Database

### 1.1 Sign up for PlanetScale
1. Go to https://planetscale.com
2. Click "Sign up" and create an account (free tier available)
3. Verify your email

### 1.2 Create a Database
1. Click "Create a new database"
2. Name it: `convivencia`
3. Select region: Choose closest to your location
4. Click "Create database"
5. Wait for the database to be created (takes ~1 minute)

### 1.3 Get Connection String
1. In your PlanetScale dashboard, click on the `convivencia` database
2. Click "Connect"
3. Select "Node.js" from the dropdown
4. Copy the connection string (looks like: `mysql://user:password@host/convivencia`)
5. **Save this connection string** - you'll need it for Vercel

## Step 2: Deploy to Vercel

### 2.1 Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Paste: `https://github.com/0rwa11/convivencia`
5. Click "Import"

### 2.2 Configure Environment Variables
1. In the "Environment Variables" section, add:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: (Paste the PlanetScale connection string from Step 1.3)

**Variable 2:**
- Name: `JWT_SECRET`
- Value: (Generate a random string - use this command in terminal):
  ```bash
  openssl rand -base64 32
  ```
  Or use any random 32+ character string

3. Click "Deploy"

### 2.3 Wait for Deployment
- Vercel will build and deploy your application
- This takes about 5-10 minutes
- You'll see a "Congratulations" message when complete

## Step 3: Initialize Database

### 3.1 Run Database Migrations
1. After deployment completes, go to your Vercel project
2. Click "Deployments" → Latest deployment
3. Click "View Function Logs"
4. The database migrations should run automatically on first deployment

### 3.2 Verify Database Connection
1. In Vercel, go to "Settings" → "Environment Variables"
2. Check that `DATABASE_URL` is set correctly
3. If there are errors, check the build logs

## Step 4: Access Your Live Application

### 4.1 Get Your Live URL
1. In Vercel dashboard, find your project
2. The URL will be displayed at the top (e.g., `convivencia-9d09111d.vercel.app`)
3. Click the link to open your live application

### 4.2 Create First Admin User
1. Open your live application
2. The database should be initialized
3. You'll need to create the first admin user via database directly

**To create admin user:**
1. Go to PlanetScale dashboard
2. Click your `convivencia` database
3. Click "Browse" to open the database explorer
4. Run this SQL command:
```sql
INSERT INTO users (username, passwordHash, name, email, role, isActive, createdAt, updatedAt, lastSignedIn)
VALUES ('admin', '$2b$10$...', 'Administrator', 'admin@convivencia.local', 'admin', true, NOW(), NOW(), NOW());
```

**Note:** For the password hash, use bcrypt. You can generate one at https://bcrypt-generator.com/
- Password: `admin123` (change this!)
- Copy the hash and replace `$2b$10$...` with it

### 4.3 Login
1. Go to your live application
2. Click "Sign In"
3. Enter username: `admin`
4. Enter password: `admin123` (or whatever you set)
5. You're in!

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Vercel, go to "Settings" → "Domains"
2. Enter your domain (e.g., `convivencia.example.com`)
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Issue: Database Connection Error
**Solution:**
1. Check `DATABASE_URL` in Vercel environment variables
2. Verify PlanetScale database is running
3. Check connection string format
4. Try creating a new PlanetScale branch if main branch is locked

### Issue: Application Won't Start
**Solution:**
1. Check Vercel build logs for errors
2. Ensure all environment variables are set
3. Check that Node.js version is compatible (18+)

### Issue: Can't Login
**Solution:**
1. Verify admin user was created in database
2. Check password hash is correct
3. Try resetting password via database

## Next Steps

1. **Change Admin Password:** Update the admin password in the database
2. **Create Users:** Use the Admin Dashboard to create facilitator and user accounts
3. **Import Data:** Use the Data Management page to import evaluation data
4. **Configure Settings:** Customize the application in the Admin Dashboard

## Support

For issues or questions:
1. Check the GitHub repository: https://github.com/0rwa11/convivencia
2. Review the application logs in Vercel
3. Check PlanetScale database status

## Security Notes

- Always use strong passwords
- Keep `JWT_SECRET` secure and never share it
- Regularly backup your data using the Data Management export feature
- Use HTTPS for all connections (Vercel provides this automatically)
- Keep your PlanetScale database credentials secure

---

**Deployment Complete!** Your Convivencia application is now live on Vercel.
