# Deployment Guide - Convivencia on Vercel + Supabase

This guide will help you deploy the Convivencia application to Vercel with a **free Supabase PostgreSQL database**.

## Prerequisites

- GitHub account (you have: 0rwa11/convivencia)
- Vercel account (free - https://vercel.com)
- Supabase account (free - https://supabase.com)

---

## Step 1: Create Supabase Database (FREE)

### 1.1 Sign up for Supabase
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest option)
4. Verify your email

### 1.2 Create a New Project
1. Click "New Project"
2. Fill in the form:
   - **Project name:** `convivencia`
   - **Database password:** Create a strong password (save it!)
   - **Region:** Choose closest to your location
   - **Pricing plan:** Select "Free" (it's already selected)
3. Click "Create new project"
4. Wait for the project to be created (takes ~2 minutes)

### 1.3 Get Connection String
1. In Supabase dashboard, go to "Settings" → "Database"
2. Under "Connection pooling", select "Connection string"
3. Copy the connection string (looks like: `postgresql://user:password@host:5432/postgres`)
4. **Important:** Replace `[YOUR-PASSWORD]` with the database password you created
5. **Save this connection string** - you'll need it for Vercel

**Example:**
```
postgresql://postgres:MyStrongPassword123@db.supabase.co:5432/postgres
```

---

## Step 2: Update Application for PostgreSQL

Your application uses MySQL/Drizzle ORM. We need to update it to work with PostgreSQL.

### 2.1 Update Drizzle Configuration
Edit `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg", // Changed from "mysql2"
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
});
```

### 2.2 Update Database Driver in package.json
Remove MySQL and add PostgreSQL:
```bash
pnpm remove mysql2
pnpm add pg
```

### 2.3 Update Database Connection in server/db.ts
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
```

---

## Step 3: Deploy to Vercel

### 3.1 Import Project to Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Paste: `https://github.com/0rwa11/convivencia`
5. Click "Import"

### 3.2 Configure Environment Variables
1. In the "Environment Variables" section, add:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: (Paste the Supabase connection string from Step 1.3)
  - Example: `postgresql://postgres:MyPassword@db.supabase.co:5432/postgres`

**Variable 2:**
- Name: `JWT_SECRET`
- Value: Generate a random string (use this command):
  ```bash
  openssl rand -base64 32
  ```
  Or use any random 32+ character string

3. Click "Deploy"

### 3.3 Wait for Deployment
- Vercel will build and deploy your application
- This takes about 5-10 minutes
- You'll see a "Congratulations" message when complete

---

## Step 4: Initialize Database

### 4.1 Run Database Migrations
1. After deployment completes, the migrations should run automatically
2. Check Vercel logs to confirm migrations ran successfully

### 4.2 Verify Database Connection
1. In Vercel, go to "Settings" → "Environment Variables"
2. Check that `DATABASE_URL` is set correctly
3. If there are errors, check the build logs

---

## Step 5: Access Your Live Application

### 5.1 Get Your Live URL
1. In Vercel dashboard, find your project
2. The URL will be displayed (e.g., `convivencia-xyz.vercel.app`)
3. Click the link to open your live application

### 5.2 Create First Admin User
1. Go to Supabase dashboard
2. Click your `convivencia` project
3. Go to "SQL Editor"
4. Click "New query"
5. Run this SQL command to create admin user:

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

**Note:** This password hash is for `password123`. To use a different password:
1. Go to https://bcrypt-generator.com/
2. Enter your desired password
3. Copy the hash and replace it in the SQL command above

### 5.3 Login to Your Application
1. Go to your live application URL
2. Click "Sign In"
3. Username: `admin`
4. Password: `password123` (or whatever you set)
5. You're in! 🎉

---

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In Vercel, go to "Settings" → "Domains"
2. Enter your domain (e.g., `convivencia.example.com`)
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

---

## Troubleshooting

### Issue: "Cannot find module 'mysql2'"
**Solution:**
- You need to update the database driver (see Step 2)
- Run: `pnpm remove mysql2 && pnpm add pg`
- Update `server/db.ts` to use PostgreSQL

### Issue: Database Connection Error
**Solution:**
1. Check `DATABASE_URL` in Vercel environment variables
2. Verify the connection string includes the password
3. Check that Supabase project is running
4. Try copying the connection string again from Supabase

### Issue: Application Won't Start
**Solution:**
1. Check Vercel build logs for errors
2. Ensure all environment variables are set
3. Check that migrations ran successfully

### Issue: Can't Login
**Solution:**
1. Verify admin user was created in Supabase
2. Check the password hash is correct
3. Try creating the user again

---

## Next Steps

1. **Change Admin Password:** Update via the application settings
2. **Create Users:** Use Admin Dashboard to create facilitator and user accounts
3. **Import Data:** Use Data Management page to import evaluation data
4. **Configure Settings:** Customize in Admin Dashboard

---

## Free Tier Limits (Supabase)

- **Database:** 500 MB storage
- **Bandwidth:** 2 GB/month
- **Auth:** Unlimited users
- **API:** Unlimited requests

These limits are sufficient for most use cases. Upgrade anytime if needed.

---

**Your Convivencia application is now live on Vercel!** 🚀
