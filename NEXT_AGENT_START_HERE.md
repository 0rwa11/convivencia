# 🚀 START HERE - Next Agent Deployment Guide

## Welcome! 👋

This document is your entry point to deploy the Convivencia application to Vercel with a free Supabase database.

**Status:** ✅ Application is ready for deployment
**Time Required:** ~20 minutes
**Cost:** FREE (Supabase + Vercel free tiers)

---

## 📋 Quick Checklist

Follow these steps in order:

### Step 1: Read Documentation (5 min)
- [ ] Read `HANDOFF_GUIDE.md` - Understand project status
- [ ] Read `DEPLOYMENT_STEPS.md` - Exact deployment instructions
- [ ] Read `SUPABASE_DEPLOYMENT_GUIDE.md` - Database setup details

### Step 2: Update Database Driver (15 min) ⚠️ CRITICAL
The application currently uses MySQL but we need PostgreSQL (free).

**Files to update:**
1. `drizzle.config.ts` - Change driver to "pg"
2. `server/db.ts` - Update database connection
3. `package.json` - Remove mysql2, add pg

**See:** SUPABASE_DEPLOYMENT_GUIDE.md for exact code changes

### Step 3: Deploy to Vercel (20 min)
Follow the exact steps in `DEPLOYMENT_STEPS.md`:
1. Create Supabase account & database (5 min)
2. Create Vercel account & deploy (10 min)
3. Initialize database & create admin user (2 min)
4. Access live application (1 min)

### Step 4: Verify Everything Works (10 min)
- [ ] Login with admin user
- [ ] Create a new user
- [ ] Create an evaluation
- [ ] View analytics dashboard
- [ ] Test data export

---

## 📂 Important Files

| File | Purpose | Action |
|------|---------|--------|
| **DEPLOYMENT_STEPS.md** | ⭐ Exact deployment instructions | **START HERE** |
| **HANDOFF_GUIDE.md** | Project status & remaining tasks | Read first |
| **SUPABASE_DEPLOYMENT_GUIDE.md** | Database setup details | Reference |
| **drizzle.config.ts** | Database configuration | ⚠️ UPDATE |
| **server/db.ts** | Database connection | ⚠️ UPDATE |
| **package.json** | Dependencies | ⚠️ UPDATE |

---

## 🎯 Critical Tasks

### 1️⃣ Update Database Driver (MUST DO FIRST)

**File: `drizzle.config.ts`**
```typescript
// Change from:
driver: "mysql2",

// To:
driver: "pg",
```

**File: `server/db.ts`**
```typescript
// Replace the entire database connection with:
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

**File: `package.json`**
```bash
pnpm remove mysql2
pnpm add pg
```

### 2️⃣ Follow Deployment Steps
See `DEPLOYMENT_STEPS.md` for exact instructions.

### 3️⃣ Test Live Application
After deployment, verify all features work.

---

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/0rwa11/convivencia
- **Supabase (Database):** https://supabase.com
- **Vercel (Hosting):** https://vercel.com
- **Documentation:** See files in this repository

---

## ⚡ Quick Start Commands

```bash
# Test locally
pnpm dev

# Run tests
pnpm test

# Check TypeScript
pnpm check

# Format code
pnpm format

# Build for production
pnpm build
```

---

## 🆘 Need Help?

1. **Database driver errors?** → See SUPABASE_DEPLOYMENT_GUIDE.md
2. **Deployment issues?** → See DEPLOYMENT_STEPS.md troubleshooting
3. **General questions?** → See HANDOFF_GUIDE.md
4. **Feature questions?** → Check README.md

---

## ✅ Success Criteria

You'll know deployment is successful when:

- ✅ Vercel shows "Congratulations" after deployment
- ✅ Live URL is accessible (e.g., convivencia-xyz.vercel.app)
- ✅ You can login with admin/password123
- ✅ Admin Dashboard loads without errors
- ✅ Analytics page shows charts
- ✅ Data export works

---

## 📝 After Deployment

1. **Change admin password** - Use the Settings page
2. **Create additional users** - Use Admin Dashboard
3. **Import sample data** - Use Data Management page
4. **Configure custom domain** - (Optional) In Vercel settings

---

## 🎓 Project Overview

**Convivencia** is a full-stack application for managing intercultural coexistence programs:

- **Evaluations:** Track participant evaluations and progress
- **Groups:** Organize participants into groups
- **Sessions:** Schedule and manage program sessions
- **Analytics:** View statistics and trends
- **Admin:** Manage users and system settings
- **Data Management:** Import/export and backup data

**Tech Stack:**
- Frontend: React 19, TypeScript, Tailwind CSS
- Backend: Express, tRPC, Node.js
- Database: PostgreSQL (Supabase)
- Deployment: Vercel

---

## 🚀 Ready to Deploy?

**Next step:** Open `DEPLOYMENT_STEPS.md` and follow the exact instructions.

Good luck! 💪

---

**Questions?** Check the troubleshooting section in DEPLOYMENT_STEPS.md or review HANDOFF_GUIDE.md for more context.
