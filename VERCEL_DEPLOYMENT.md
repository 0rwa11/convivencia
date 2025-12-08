# Convivencia - Vercel Deployment Guide

Deploy Convivencia to Vercel in 5 minutes with a free database!

## Quick Start

### 1️⃣ Fork/Clone the Repository

```bash
git clone https://github.com/0rwa11/convivencia.git
cd convivencia
```

### 2️⃣ Set Up a Free Database

Choose one:

**PlanetScale (MySQL)** - Recommended
- Visit https://planetscale.com
- Sign up (free tier)
- Create a database
- Get connection string from "Connect" button

**Supabase (PostgreSQL)**
- Visit https://supabase.com
- Sign up (free tier)
- Create a project
- Get connection string from Settings > Database

### 3️⃣ Deploy to Vercel

**Option A: One-Click Deploy (Easiest)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F0rwa11%2Fconvivencia&env=DATABASE_URL,JWT_SECRET&envDescription=Database%20connection%20and%20JWT%20secret&envLink=https%3A%2F%2Fgithub.com%2F0rwa11%2Fconvivencia%2Fblob%2Fmain%2FDEPLOYMENT_GUIDE.md)

**Option B: Manual Deployment**

1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Select "Import Git Repository"
4. Choose `0rwa11/convivencia`
5. Add environment variables:
   - `DATABASE_URL`: Your database connection string
   - `JWT_SECRET`: Generate a random 32+ character string
6. Click "Deploy"

### 4️⃣ Initialize Database

After deployment completes:

```bash
# Set environment variables
export DATABASE_URL="your-database-url"
export JWT_SECRET="your-jwt-secret"

# Run migrations
pnpm install
pnpm db:push
```

### 5️⃣ Create Admin User

Visit your Vercel deployment URL and:
1. Click "Sign In"
2. Use the admin creation form (if available)
3. Or create via API:

```bash
curl -X POST https://your-app.vercel.app/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-password",
    "name": "Administrator",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `aB3$xY9@mK2#pL8&qW5!rT4%sU7^vN6*` |
| `VITE_APP_TITLE` | App title | `Convivencia` |
| `NODE_ENV` | Environment | `production` |

## Free Tier Limits

### Vercel
- 100GB bandwidth/month
- 6 serverless function executions/second
- Unlimited deployments

### PlanetScale
- 5GB storage
- Unlimited queries
- 1 production branch

### Supabase
- 500MB database
- 2GB bandwidth/month
- 1 project

## Troubleshooting

### Build Fails
```bash
# Check locally
pnpm install
pnpm check
pnpm build
```

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database firewall rules
- For PlanetScale: promote branch to production
- For Supabase: check connection limits

### Can't Log In
- Verify admin user was created
- Check database migrations ran successfully
- Review Vercel function logs

## Features

✅ Full-stack application (React + Node.js)
✅ User authentication with password
✅ Evaluation management
✅ Group and session management
✅ Materials library
✅ Real-time data persistence
✅ Role-based access control

## Architecture

```
┌─────────────────────────────────────┐
│      Vercel Edge Network            │
├─────────────────────────────────────┤
│  Frontend (React/Vite)              │
│  ├─ Login Page                      │
│  ├─ Dashboard                       │
│  ├─ Evaluations                     │
│  ├─ Groups                          │
│  ├─ Sessions                        │
│  └─ Materials                       │
├─────────────────────────────────────┤
│  Backend (Node.js/Express/tRPC)     │
│  ├─ Authentication API              │
│  ├─ Evaluation CRUD                 │
│  ├─ Group Management                │
│  ├─ Session Management              │
│  └─ Materials API                   │
├─────────────────────────────────────┤
│  Database (PlanetScale/Supabase)    │
│  ├─ Users                           │
│  ├─ Groups                          │
│  ├─ Sessions                        │
│  ├─ Evaluations                     │
│  ├─ Materials                       │
│  └─ Audit Logs                      │
└─────────────────────────────────────┘
```

## Next Steps

1. **Customize** - Update app title, logo, and colors
2. **Add Users** - Create facilitator and user accounts
3. **Import Data** - Migrate existing evaluation data
4. **Monitor** - Set up Vercel Analytics and alerts
5. **Scale** - Upgrade when needed

## Support

- 📖 [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🐛 [GitHub Issues](https://github.com/0rwa11/convivencia/issues)
- 📚 [Vercel Docs](https://vercel.com/docs)
- 💾 [PlanetScale Docs](https://docs.planetscale.com)
- 🔐 [Supabase Docs](https://supabase.com/docs)

---

**Ready to deploy?** Click the button above or follow the manual steps! 🚀
