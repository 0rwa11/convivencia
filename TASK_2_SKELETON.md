# Task 2: New Project Skeleton

This document describes the clean, static project skeleton created for the Convivencia website rebuild.

## Overview

A new **Vite + React + TypeScript + Tailwind CSS** project has been initialized with the following characteristics:

- **Fully Static:** No backend server, database, or API dependencies. All data persists via `localStorage`.
- **GitHub Pages Compatible:** Configured for automatic build and deployment via GitHub Actions.
- **Modern Stack:** React 19, Vite 7, TypeScript 5.6, Tailwind CSS 4, Radix UI components.
- **Clean Architecture:** Removed all vestigial backend components (drizzle, server code, database config).

## Project Structure

```
convivencia_rebuild/
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions workflow for build & deploy
├── client/
│   ├── index.html                 # HTML entry point
│   ├── public/                    # Static assets (PDFs, images)
│   │   └── pdfs/                  # Educational materials (copied from original)
│   └── src/
│       ├── App.tsx                # Main router and layout
│       ├── main.tsx               # React entry point
│       ├── index.css              # Global styles and design tokens
│       ├── pages/                 # Page components (to be migrated)
│       ├── components/            # Reusable UI components
│       │   └── ui/                # Shadcn/ui components
│       ├── contexts/              # React contexts (EvaluationContext, ThemeContext, etc.)
│       ├── hooks/                 # Custom React hooks
│       └── lib/                   # Utility functions (PDF generation, data export, etc.)
├── server/                        # Placeholder (not used in static build)
├── shared/                        # Shared types and constants
├── package.json                   # Dependencies and build scripts
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── .github/workflows/deploy.yml   # GitHub Actions deployment
```

## Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.1.1 | UI framework |
| Vite | 7.1.7 | Build tool and dev server |
| TypeScript | 5.6.3 | Type safety |
| Tailwind CSS | 4.1.14 | Utility-first styling |
| Radix UI | Latest | Accessible component primitives |
| Recharts | 2.15.2 | Data visualization |
| jsPDF | 3.0.4 | PDF generation |
| wouter | 3.3.5 | Client-side routing |
| React Hook Form | 7.64.0 | Form state management |

## Build and Deployment

### Local Development

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:5173` (Vite default).

### Production Build

```bash
pnpm build
```

Output is generated in `dist/public/` for GitHub Pages deployment.

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Installs dependencies using pnpm
2. Builds the project with `pnpm build`
3. Deploys the `dist/public/` directory to GitHub Pages on every push to `main`

## Data Persistence Strategy

All data persists via **localStorage** (no backend required):

- **Evaluation Records:** Stored in `convivencia_evaluations` key
- **Theme Preference:** Stored in `theme` key
- **Session Data:** Stored as needed by individual contexts

### Import/Export Implementation

The original `backupUtils.ts` is missing. The new implementation will use:

- **Export:** Convert `localStorage` data to JSON/CSV and trigger browser download
- **Import:** Parse uploaded JSON/CSV files and restore to `localStorage`

This keeps the feature fully client-side and compatible with static hosting.

## Next Steps: Task 3

The skeleton is ready for feature migration. Task 3 will involve:

1. Copying all page components from the original source
2. Reimplementing the Evaluation context and data management
3. Migrating the Calendar, Statistics, and other features
4. Implementing the missing Import/Export functionality
5. Ensuring 100% feature parity with the original

## Instructions for Future AI Agents

### Core Principles

1. **Keep It Static:** No backend code, no API calls, no database. All logic must be client-side.
2. **Preserve Features:** Every feature from the original must be reimplemented with 100% fidelity.
3. **Use localStorage:** All persistent data goes to `localStorage`. No external services.
4. **Document Changes:** Every modification must be logged in the Manus log and committed to git.

### Development Workflow

1. **Migrate Pages:** Copy page components from `convivencia_source/convivencia_website/client/src/pages/` to `client/src/pages/`.
2. **Update Contexts:** Ensure all React contexts (EvaluationContext, ThemeContext, etc.) are properly migrated and use `localStorage`.
3. **Implement Features:** Recreate Calendar, Statistics, Evaluation tools, and Import/Export using client-side logic only.
4. **Test Thoroughly:** Verify all features work in the browser before committing.
5. **Commit and Document:** After each feature, commit to git with a clear message and update the Manus log.

### Common Gotchas

- **Do Not Add Backend:** Absolutely no server-side code, API calls, or database connections.
- **localStorage Keys:** Use consistent, namespaced keys (e.g., `convivencia_evaluations`, `convivencia_theme`).
- **PDF Assets:** All PDFs are in `client/public/pdfs/`. Reference them with absolute paths (`/pdfs/filename.pdf`).
- **Responsive Design:** Use Tailwind CSS and Radix UI components. Test on mobile, tablet, and desktop.

## Files Changed in Task 2

- Created `.github/workflows/deploy.yml` for GitHub Actions
- Copied clean project skeleton from Manus template
- Removed all backend-related files (drizzle, server code, database config)
- Prepared structure for feature migration in Task 3
