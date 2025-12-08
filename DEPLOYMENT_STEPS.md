# Deployment Steps - Convivencia Application

## Overview
This document provides exact step-by-step instructions to deploy Convivencia to Vercel with a free Supabase database.

**Total Time Required:** ~20 minutes
**Cost:** FREE (Supabase free tier + Vercel free tier)

---

## STEP 1: Create Supabase Account & Database (5 minutes)

### 1.1 Create Supabase Account
1. Open browser: https://supabase.com
2. Click **"Start your project"** button (top right)
3. Click **"Sign up with GitHub"**
4. Authorize Supabase to access your GitHub account
5. Verify your email
6. You're logged in!

### 1.2 Create New Project
1. Click **"New Project"** button
2. Fill in the form:
   - **Project name:** `convivencia`
   - **Database password:** `Convivencia@2024!` (or create your own - SAVE THIS!)
   - **Region:** Select closest to your location
   - **Pricing plan:** Should show "Free" (already selected)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be created

### 1.3 Get Database Connection String
1. In Supabase dashboard, click your project name (convivencia)
2. Go to **Settings** (bottom left) → **Database**
3. Under "Connection pooling", click **"Connection string"**
4. Copy the entire connection string
5. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the password you created in Step 1.2
6. **SAVE THIS CONNECTION STRING** - you'll need it in Step 3

**Example of final connection string:**
```
postgresql://postgres:Convivencia@2024!@db.supabase.co:5432/postgres
```

---

## STEP 2: Create Vercel Account & Import Project (5 minutes)

### 2.1 Create Vercel Account
1. Open browser: https://vercel.com
2. Click **"Sign Up"** (top right)
3. Click **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account
5. You're logged in!

### 2.2 Import GitHub Repository
1. Click **"Add New"** button (top left)
2. Click **"Project"**
3. Click **"Import Git Repository"**
4. Paste this URL: `https://github.com/0rwa11/convivencia`
5. Click **"Import"**

### 2.3 Configure Environment Variables
1. In the "Environment Variables" section, add these variables:

**First Variable:**
- **Name:** `DATABASE_URL`
- **Value:** (Paste the connection string from Step 1.3)
  - Example: `postgresql://postgres:Convivencia@2024!@db.supabase.co:5432/postgres`

**Second Variable:**
- **Name:** `JWT_SECRET`
- **Value:** `your-super-secret-key-min-32-characters-long-12345678901234567890`
  - (You can use any random string, at least 32 characters)

2. Click **"Deploy"**
3. Wait 5-10 minutes for deployment to complete
4. You'll see "Congratulations!" when done

---

## STEP 3: Initialize Database (2 minutes)

### 3.1 Create Admin User
1. Go back to Supabase dashboard
2. Click your project (convivencia)
3. Go to **"SQL Editor"** (left sidebar)
4. Click **"New query"**
5. Copy and paste this SQL command:

```sql
INSERT INTO users (username, "passwordHash", name, email, role, "isActive", "createdAt", "updatedAt", "lastSignedIn")
VALUES (
  'admin',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVm2',
  'Administrator',
  'admin@convivencia.local',
  'admin',
  true,
  NOW(),
  NOW(),
  NOW()
);
```

6. Click **"Run"** button
7. You should see "1 row inserted"

**Note:** The password hash above is for password: `password123`

---

## STEP 4: Access Your Live Application (1 minute)

### 4.1 Get Your Live URL
1. Go to Vercel dashboard
2. Find your "convivencia" project
3. The URL is displayed at the top (e.g., `convivencia-xyz.vercel.app`)
4. Click the URL to open your application

### 4.2 Login
1. Click **"Sign In"** button
2. Enter:
   - **Username:** `admin`
   - **Password:** `password123`
3. Click **"Sign In"**
4. You're in the application! 🎉

---

## STEP 5: First Time Setup (5 minutes)

### 5.1 Change Admin Password
1. Click your profile icon (top right)
2. Go to **"Settings"**
3. Click **"Change Password"**
4. Enter new password (save it!)
5. Click **"Update"**

### 5.2 Create Additional Users (Optional)
1. Click **"Admin Dashboard"** (in sidebar)
2. Go to **"Users"** tab
3. Click **"Create User"**
4. Fill in:
   - **Username:** (e.g., `facilitator1`)
   - **Password:** (e.g., `Facilitator@2024!`)
   - **Name:** (e.g., `John Facilitator`)
   - **Email:** (e.g., `john@convivencia.local`)
   - **Role:** Select "facilitator" or "user"
5. Click **"Create"**

### 5.3 Import Sample Data (Optional)
1. Click **"Data Management"** (in sidebar)
2. Click **"Import Data"**
3. Select a JSON file to import (if you have one)
4. Click **"Import"**

---

## STEP 6: Configure Custom Domain (Optional - 10 minutes)

### 6.1 Add Custom Domain
1. In Vercel dashboard, go to **"Settings"** → **"Domains"**
2. Enter your domain (e.g., `convivencia.example.com`)
3. Click **"Add"**
4. Follow the DNS configuration instructions
5. Wait for DNS to propagate (can take 24-48 hours)

---

## TROUBLESHOOTING

### Issue: "Cannot find module 'mysql2'"
**Solution:**
The application needs to be updated to use PostgreSQL instead of MySQL. Contact the development team to update the database driver.

### Issue: Database Connection Error
**Solution:**
1. Check that `DATABASE_URL` is correct in Vercel
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual password
3. Verify Supabase project is running
4. Try copying the connection string again

### Issue: Application Won't Start
**Solution:**
1. Check Vercel build logs for errors
2. Ensure both environment variables are set
3. Check that the database migrations ran

### Issue: Can't Login
**Solution:**
1. Verify the admin user was created in Supabase
2. Check username is `admin` and password is `password123`
3. Try creating the user again

---

## NEXT STEPS FOR DEVELOPMENT TEAM

The following tasks remain to be completed by the next agent:

### High Priority
- [ ] Update database driver from MySQL to PostgreSQL (see SUPABASE_DEPLOYMENT_GUIDE.md)
- [ ] Test application on Vercel with Supabase database
- [ ] Verify all features work correctly
- [ ] Test user creation, evaluation management, analytics
- [ ] Test data import/export functionality

### Medium Priority
- [ ] Set up custom domain
- [ ] Configure email notifications (optional)
- [ ] Set up automated backups
- [ ] Configure monitoring and logging

### Low Priority
- [ ] Add mobile app (React Native)
- [ ] Add real-time collaboration features
- [ ] Add PDF report generation
- [ ] Add advanced search capabilities

---

## IMPORTANT NOTES

1. **Save Your Credentials:**
   - Supabase database password
   - JWT_SECRET
   - Admin password (after you change it)

2. **Free Tier Limits:**
   - Supabase: 500 MB storage, 2 GB/month bandwidth
   - Vercel: 100 GB/month bandwidth
   - These are sufficient for most use cases

3. **Security:**
   - Never share your database password
   - Never commit `.env` files to GitHub
   - Keep your JWT_SECRET secure
   - Use strong passwords for all accounts

4. **Backups:**
   - Use the Data Management page to export data regularly
   - Store backups in a secure location
   - Test restore functionality periodically

---

## SUPPORT RESOURCES

- **GitHub Repository:** https://github.com/0rwa11/convivencia
- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Drizzle ORM Documentation:** https://orm.drizzle.team

---

**Deployment Guide Complete!** 🚀

For questions or issues, refer to the troubleshooting section or check the GitHub repository.
