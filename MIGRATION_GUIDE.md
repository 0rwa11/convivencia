# Migration Guide: Static → Full-Stack

This guide helps users transition from the static Convivencia v1.0 to the new full-stack Convivencia v2.0.

## 🔄 What Changed?

### Before (v1.0 - Static)
- ❌ All data stored in browser localStorage
- ❌ Single-user only (no authentication)
- ❌ No persistent data across devices
- ❌ No user management
- ❌ No server-side processing
- ❌ Data lost if browser cache cleared

### After (v2.0 - Full-Stack)
- ✅ Data stored in MySQL/TiDB database
- ✅ Multi-user with role-based access
- ✅ Data persists across devices
- ✅ Admin user management
- ✅ Server-side processing & validation
- ✅ Secure authentication with JWT
- ✅ Audit logging of changes

## 📋 Migration Checklist

### Step 1: Backup Old Data
Before migrating, export your existing data from v1.0:

1. Open the old Convivencia application
2. Go to Dashboard → Backup & Restore
3. Click "Export as JSON"
4. Save the file to your computer (e.g., `convivencia_backup.json`)

### Step 2: Set Up New Environment

```bash
# Clone the new repository
git clone https://github.com/0rwa11/convivencia.git
cd convivencia

# Install dependencies
pnpm install

# Create .env file with database credentials
cat > .env << EOF
DATABASE_URL=mysql://user:password@localhost:3306/convivencia
JWT_SECRET=your-secure-secret-key-here
NODE_ENV=development
PORT=3000
EOF

# Run database migrations
pnpm db:push
```

### Step 3: Create Admin User

The first user must be created manually via database:

```bash
# Connect to your database
mysql -u user -p convivencia

# Insert admin user (password: admin123)
INSERT INTO users (username, passwordHash, name, email, role, isActive, createdAt, updatedAt, lastSignedIn)
VALUES (
  'admin',
  '$2b$10$...',  # bcrypt hash of 'admin123'
  'Administrator',
  'admin@example.com',
  'admin',
  true,
  NOW(),
  NOW(),
  NOW()
);
```

Or use a script:
```bash
node scripts/create-admin.js
```

### Step 4: Start New Application

```bash
# Start development server
pnpm dev

# Open http://localhost:3000
```

### Step 5: Login & Create Users

1. Login with admin credentials
2. Go to Admin Panel → Manage Users
3. Create user accounts for your team
4. Share credentials with team members

### Step 6: Migrate Data

#### Option A: Manual Re-entry
1. Open old backup JSON file
2. Manually enter data into new application
3. Use the Evaluation form to create records

#### Option B: Bulk Import (if available)
1. Format old data to match new schema
2. Use bulk import feature
3. Verify data integrity

#### Option C: Database Import Script
```bash
# Create import script
node scripts/import-data.js convivencia_backup.json
```

## 🔑 Key Differences

### Authentication

**v1.0:**
```
No login required
Data stored in localStorage
```

**v2.0:**
```
Login with username/password
Data stored in database
Session expires after 7 days
```

### Data Storage

**v1.0:**
```
localStorage key: "convivencia_evaluations"
Format: JSON array
Accessible from: Browser only
```

**v2.0:**
```
Database table: evaluations
Format: Relational schema
Accessible from: Any authenticated user
```

### User Roles

**v1.0:**
```
No roles - single user
```

**v2.0:**
```
- Admin: Full access + user management
- Facilitator: Create/edit evaluations & sessions
- User: View-only access
```

## 🚀 Deployment Changes

### v1.0 Deployment
```bash
pnpm build
# Deploy dist/ to GitHub Pages
```

### v2.0 Deployment
```bash
pnpm build
pnpm start
# Deploy to server with Node.js + MySQL
```

## 🔒 Security Considerations

### New Security Features
- ✅ Password hashing (bcryptjs)
- ✅ JWT session tokens
- ✅ HTTP-only cookies
- ✅ CSRF protection
- ✅ Input validation (Zod)
- ✅ Role-based access control
- ✅ Audit logging

### Best Practices
1. **Change default passwords** immediately after setup
2. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
3. **Keep JWT_SECRET secure** - never commit to version control
4. **Rotate JWT_SECRET** periodically
5. **Enable HTTPS** in production
6. **Regular backups** of database
7. **Monitor audit logs** for suspicious activity

## 📊 Data Schema Mapping

### Evaluation Record Mapping

**v1.0 Format:**
```json
{
  "id": "uuid",
  "sessionNumber": 1,
  "date": "2024-01-01",
  "groupName": "Group A",
  "duringParticipation": "80%",
  "beforeMixedInteractions": 5,
  "afterMixedInteractions": 8,
  "beforeStereotypes": "high",
  "afterStereotypes": "low",
  "facilitator": "John Doe",
  "notes": "Good progress"
}
```

**v2.0 Format:**
```json
{
  "id": 1,
  "sessionId": 1,
  "groupId": 1,
  "userId": 1,
  "duringParticipation": "80%",
  "beforeMixedInteractions": 5,
  "afterMixedInteractions": 8,
  "beforeStereotypes": "high",
  "afterStereotypes": "low",
  "notes": "Good progress",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Mapping:**
- `groupName` → Create group record, use `groupId`
- `sessionNumber` → Create session record, use `sessionId`
- `facilitator` → Store in session record
- `date` → Store in session record
- `userId` → Set to current user ID

## 🆘 Troubleshooting

### "Database connection failed"
**Solution:** Check DATABASE_URL in .env file
```bash
# Test connection
mysql -u user -p -h host -D convivencia
```

### "JWT_SECRET not set"
**Solution:** Add JWT_SECRET to .env file
```bash
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### "Login fails with valid credentials"
**Solution:** Verify password hash is correct
```bash
# Check user record
SELECT username, passwordHash FROM users WHERE username='admin';
```

### "Data not showing after import"
**Solution:** Verify data format matches schema
```bash
# Check table structure
DESCRIBE evaluations;
```

## 📞 Support

For migration issues:
1. Check this guide first
2. Review error messages in browser console
3. Check server logs: `pnpm dev` output
4. Open GitHub issue with error details

## ✅ Verification Checklist

After migration, verify:

- [ ] Admin user can login
- [ ] New users can be created
- [ ] Users can login with credentials
- [ ] Evaluations can be created
- [ ] Groups can be created
- [ ] Sessions can be created
- [ ] Data persists after logout/login
- [ ] Logout works correctly
- [ ] Role-based access works
- [ ] Audit logs record changes

## 🎓 Learning Resources

- **tRPC Documentation:** https://trpc.io/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **Express.js:** https://expressjs.com
- **JWT:** https://jwt.io
- **bcryptjs:** https://www.npmjs.com/package/bcryptjs

---

**Need Help?** Open an issue on GitHub: https://github.com/0rwa11/convivencia/issues
