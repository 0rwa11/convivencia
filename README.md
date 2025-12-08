# Convivencia - Intercultural Coexistence Program

A comprehensive full-stack application for managing and tracking intercultural coexistence program evaluations, groups, sessions, and resources.

**🎉 Version 2.0 - Now Full-Stack with Database & Authentication!**

## 🎯 Overview

**Convivencia** is a production-ready web application designed to help facilitators and administrators manage intercultural coexistence programs. It provides tools for:

- **Evaluation Management** - Record and track detailed evaluation data from program sessions
- **Group Management** - Organize and manage participant groups
- **Session Scheduling** - Schedule and track program sessions
- **Analytics & Reporting** - Generate statistics and comprehensive reports
- **User Management** - Admin-controlled user creation and role assignment
- **Secure Authentication** - Password-based authentication with JWT sessions

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS 4 for styling
- Wouter for client-side routing
- tRPC for type-safe API calls
- Zod for schema validation

**Backend:**
- Express.js 4 server
- tRPC 11 for RPC framework
- Drizzle ORM for database access
- MySQL/TiDB database
- JWT for session management
- bcryptjs for password hashing

**Testing:**
- Vitest for unit tests
- 17 passing tests covering auth, validation, and procedures

### Database Schema

The application uses a relational database with the following tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts with roles (admin, facilitator, user) |
| `evaluations` | Program evaluation records with metrics |
| `groups` | Participant groups |
| `sessions` | Program sessions with dates and facilitators |
| `materials` | Educational resources and materials |
| `auditLogs` | Audit trail of changes |

See `drizzle/schema.ts` for complete schema definition.

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL 8+ or TiDB

### Installation

```bash
# Clone the repository
git clone https://github.com/0rwa11/convivencia.git
cd convivencia

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check

# Build for production
pnpm build

# Start production server
pnpm start

# Format code
pnpm format

# Push database migrations
pnpm db:push
```

## 🔐 Authentication

### Login Flow

1. User navigates to `/login`
2. Enters username and password
3. Server validates credentials against hashed password in database
4. On success, JWT token is created and stored in HTTP-only cookie
5. User is redirected to `/dashboard`

### User Creation

Only administrators can create new users:

1. Admin logs in and navigates to admin panel
2. Clicks "Manage Users"
3. Fills in user details (username, password, name, email, role)
4. System creates user with hashed password
5. New user can log in with provided credentials

### Roles

- **Admin** - Full access to all features including user management
- **Facilitator** - Can create and manage evaluations and sessions
- **User** - Can view evaluations and materials (read-only)

## 📊 API Documentation

All API endpoints are defined using tRPC procedures in `server/routers.ts`.

### Authentication Procedures

```typescript
// Get current user info
trpc.auth.me.useQuery()

// Login
trpc.auth.login.useMutation({ username, password })

// Logout
trpc.auth.logout.useMutation()

// Create user (admin only)
trpc.auth.createUser.useMutation({ username, password, name, email, role })
```

### Evaluation Procedures

```typescript
// Create evaluation
trpc.evaluations.create.useMutation({
  sessionId, groupId, duringParticipation, 
  beforeMixedInteractions, afterMixedInteractions,
  beforeStereotypes, afterStereotypes, notes
})

// List evaluations by group
trpc.evaluations.listByGroup.useQuery({ groupId })

// Update evaluation
trpc.evaluations.update.useMutation({ id, ...updates })

// Delete evaluation
trpc.evaluations.delete.useMutation({ id })
```

### Group Procedures

```typescript
// Create group
trpc.groups.create.useMutation({ name, description })

// List all groups
trpc.groups.list.useQuery()

// Get group by ID
trpc.groups.getById.useQuery({ id })
```

### Session Procedures

```typescript
// Create session
trpc.sessions.create.useMutation({
  sessionNumber, groupId, date, facilitator, topic, notes
})

// List sessions by group
trpc.sessions.listByGroup.useQuery({ groupId })
```

### Materials Procedures

```typescript
// Create material (protected)
trpc.materials.create.useMutation({
  title, description, category, url, fileKey
})

// List all materials
trpc.materials.list.useQuery()

// List by category
trpc.materials.listByCategory.useQuery({ category })
```

## 📁 Project Structure

```
convivencia/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Login.tsx           # Login page
│   │   │   ├── Dashboard.tsx       # Main dashboard
│   │   │   ├── Home.tsx            # Landing page
│   │   │   └── NotFound.tsx        # 404 page
│   │   ├── components/             # Reusable components
│   │   ├── _core/
│   │   │   └── hooks/
│   │   │       └── useAuth.ts      # Authentication hook
│   │   ├── App.tsx                 # Main app component
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/                     # Static assets
│   └── index.html                  # HTML template
├── server/                          # Express backend
│   ├── _core/
│   │   ├── authService.ts          # Authentication service
│   │   ├── authRoutes.ts           # Auth REST endpoints
│   │   ├── context.ts              # tRPC context
│   │   ├── trpc.ts                 # tRPC setup
│   │   └── index.ts                # Server entry point
│   ├── auth.ts                     # Auth utilities
│   ├── routers.ts                  # tRPC procedures
│   ├── db.ts                       # Database helpers
│   ├── auth.test.ts                # Auth tests
│   ├── auth.logout.test.ts         # Logout tests
│   └── evaluations.test.ts         # Evaluation tests
├── drizzle/                         # Database
│   ├── schema.ts                   # Database schema
│   └── migrations/                 # Migration files
├── shared/                          # Shared code
│   └── const.ts                    # Constants
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── vitest.config.ts                # Vitest config
```

## 🧪 Testing

The project includes comprehensive tests for authentication and data validation:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/auth.test.ts

# Run with coverage
pnpm test -- --coverage
```

### Test Coverage

- ✅ Password hashing and verification (4 tests)
- ✅ JWT token creation and verification (5 tests)
- ✅ Session management (2 tests)
- ✅ Input validation (6 tests)

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Sessions** - 7-day expiry with HTTP-only cookies
- **CSRF Protection** - SameSite cookie attribute
- **Input Validation** - Zod schema validation on all inputs
- **SQL Injection Prevention** - Drizzle ORM parameterized queries
- **Role-Based Access Control** - Protected procedures check user role
- **Secure Headers** - Configured in Express middleware

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/convivencia

# JWT
JWT_SECRET=your-secret-key-here-change-in-production

# Environment
NODE_ENV=development

# Server
PORT=3000
```

## 🚢 Deployment

### Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t convivencia .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  convivencia
```

### GitHub Actions

The project includes GitHub Actions workflows for:
- Automated testing on push
- Type checking
- Build verification

See `.github/workflows/` for configuration.

## 📚 Documentation

- **[DEPLOYMENT_CHANGELOG.md](./DEPLOYMENT_CHANGELOG.md)** - Detailed changelog of all changes
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Original project overview
- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - CI/CD configuration
- **[TASK_2_SKELETON.md](./TASK_2_SKELETON.md)** - Project setup
- **[TASK_3_MIGRATION.md](./TASK_3_MIGRATION.md)** - Feature migration
- **[TASK_4_OPTIMIZATION.md](./TASK_4_OPTIMIZATION.md)** - Optimization details
- **[TASK_5_DEPLOYMENT.md](./TASK_5_DEPLOYMENT.md)** - Deployment guide

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Last Updated:** December 8, 2024  
**Version:** 2.0.0 (Full-Stack)  
**Status:** ✅ Production Ready
