# Deployment Guide - Convivencia on Vercel

This guide explains how to deploy the Convivencia application to Vercel with a free database.

## Prerequisites

- GitHub account
- Vercel account (free at https://vercel.com)
- Database account (PlanetScale or Supabase)

## Step 1: Set Up a Free Database

### Option A: PlanetScale (Recommended for MySQL)

1. Go to https://planetscale.com and sign up (free tier available)
2. Create a new database
3. Create a development branch
4. Get the connection string from "Connect" button
5. Copy the MySQL connection string (format: `mysql://user:password@host/database`)

### Option B: Supabase (PostgreSQL)

1. Go to https://supabase.com and sign up (free tier available)
2. Create a new project
3. Go to Settings > Database > Connection String
4. Copy the PostgreSQL connection string

## Step 2: Configure Environment Variables on Vercel

1. Go to https://vercel.com/dashboard
2. Click "Import Project" or select your repository
3. Select the GitHub repository: `0rwa11/convivencia`
4. In "Environment Variables", add:

```
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
VITE_APP_TITLE=Convivencia
VITE_APP_ID=convivencia
NODE_ENV=production
```

**Important:** Generate a strong JWT_SECRET (at least 32 characters). Example:
```
JWT_SECRET=aB3$xY9@mK2#pL8&qW5!rT4%sU7^vN6*
```

## Step 3: Deploy to Vercel

### Automatic Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to `main` branch
3. Watch the deployment progress in Vercel dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Step 4: Initialize Database

After deployment, you need to set up the database schema:

```bash
# Clone the repository
git clone https://github.com/0rwa11/convivencia.git
cd convivencia

# Install dependencies
pnpm install

# Set environment variables
export DATABASE_URL="your-database-url"
export JWT_SECRET="your-jwt-secret"

# Run migrations
pnpm db:push
```

## Step 5: Create Admin User

Once the database is initialized, create an admin user:

```bash
# Using the API endpoint
curl -X POST https://your-vercel-app.vercel.app/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-secure-password",
    "name": "Administrator",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

Or use the tRPC endpoint directly in your application.

## Step 6: Access Your Application

Your application is now live at: `https://your-app.vercel.app`

### Default Login
- Username: `admin`
- Password: (the password you set)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL/PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | Yes |
| `VITE_APP_TITLE` | Application title | No |
| `VITE_APP_ID` | Application ID | No |
| `NODE_ENV` | Set to `production` | Yes |

## Troubleshooting

### Database Connection Issues
- Verify the DATABASE_URL is correct
- Check if the database server is accessible from Vercel
- For PlanetScale: ensure your branch is promoted to production
- For Supabase: check firewall rules

### Migration Errors
- Run migrations locally first: `pnpm db:push`
- Check database logs for detailed error messages
- Ensure database user has proper permissions

### Build Failures
- Check Vercel build logs
- Verify all dependencies are installed: `pnpm install`
- Ensure TypeScript compilation passes: `pnpm check`

## Performance Optimization

### For Better Performance:
1. Use PlanetScale's connection pooling
2. Enable Vercel's Edge Caching
3. Optimize database queries
4. Use Vercel Analytics

### Monitoring:
- Vercel Dashboard: https://vercel.com/dashboard
- Database Monitoring: PlanetScale/Supabase dashboard
- Application Logs: Vercel > Deployments > Logs

## Scaling

### Free Tier Limits:
- **Vercel**: 100GB bandwidth/month, 6 serverless function executions/second
- **PlanetScale**: 5GB storage, unlimited queries
- **Supabase**: 500MB database, 2GB bandwidth/month

### When You Need to Scale:
- Upgrade Vercel Pro ($20/month)
- Upgrade PlanetScale ($39/month)
- Upgrade Supabase ($25/month)

## Security Best Practices

1. **Never commit secrets** - Use environment variables only
2. **Rotate JWT_SECRET** periodically
3. **Use HTTPS** - Vercel provides free SSL/TLS
4. **Enable 2FA** on Vercel and database accounts
5. **Regular backups** - Enable automatic backups in database settings
6. **Monitor logs** - Check for suspicious activity

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://docs.planetscale.com
- Supabase Docs: https://supabase.com/docs
- Project Issues: https://github.com/0rwa11/convivencia/issues

---

**Deployment Status:** Ready for production ✅
