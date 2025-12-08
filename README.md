# Convivencia Website - Intercultural Coexistence Program

A fully static, responsive web application for managing and tracking the Convivencia Intercultural (Intercultural Coexistence) program. Built with React, Vite, TypeScript, and Tailwind CSS.

## 🎯 Overview

The Convivencia website is a comprehensive tool for:

- **Evaluation Management** — Record and track evaluation data from program sessions
- **Statistical Analysis** — Generate reports and compare data across groups
- **Session Scheduling** — Manage sessions with an integrated calendar
- **Resource Management** — Access educational materials and facilitator guides
- **Data Backup** — Export and import evaluation data in JSON/CSV formats

## ✨ Features

### Core Features

- 📊 **Dashboard** — Overview of all evaluations and statistics
- 📝 **Evaluation Forms** — Comprehensive evaluation recording
- 📅 **Session Calendar** — Schedule and view sessions
- 📈 **Statistics & Reports** — Charts, comparisons, and analysis
- 📚 **Materials Library** — Access to educational resources
- 👥 **Group Management** — Track evaluations by group
- 🔍 **Advanced Search** — Find evaluations quickly
- 💾 **Backup & Restore** — Export/import data in JSON and CSV

### Technical Features

- ✅ **Fully Static** — No backend required, runs entirely in browser
- ✅ **Responsive Design** — Works on desktop, tablet, and mobile
- ✅ **Dark/Light Theme** — Toggle between themes
- ✅ **Data Persistence** — All data stored locally in browser
- ✅ **No External Dependencies** — No API calls or external services
- ✅ **Offline Capable** — Works without internet connection

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- pnpm 10.4+

### Installation

```bash
# Clone the repository
git clone https://github.com/0rwa11/convivencia.git
cd convivencia

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Development

```bash
# Development server with hot reload
pnpm dev

# Type checking
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📦 Project Structure

```
convivencia/
├── client/
│   ├── public/
│   │   ├── pdfs/           # Educational materials
│   │   └── index.html      # Main HTML file
│   └── src/
│       ├── pages/          # Page components (14 pages)
│       ├── components/     # Reusable UI components
│       ├── contexts/       # React contexts for state management
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions and helpers
│       ├── App.tsx         # Main app component with routing
│       ├── main.tsx        # React entry point
│       └── index.css       # Global styles and theme
├── dist/                   # Production build output
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Landing page |
| Dashboard | `/dashboard` | Main dashboard with overview |
| Program Info | `/programa` | Program description |
| Sessions | `/sesiones` | Session management |
| Dynamics | `/dinamicas` | Activity descriptions |
| Materials | `/materiales` | Educational resources |
| Facilitator Guide | `/guia` | Guide for facilitators |
| Evaluation | `/evaluacion` | Evaluation form |
| Evaluation Tracking | `/registro-evaluaciones` | View evaluations |
| Comparison Charts | `/analisis-comparativo` | Statistical comparisons |
| Group Dashboard | `/dashboard-grupos` | Group-specific stats |
| Advanced Search | `/busqueda-avanzada` | Search evaluations |
| Executive Summary | `/resumen-ejecutivo` | Executive-level report |
| Session Calendar | `/calendario` | Calendar view |

## 💾 Data Management

### Storage

All data is stored in the browser's localStorage:

- **Key:** `convivencia_evaluations`
- **Format:** JSON array of evaluation records
- **Persistence:** Survives browser restarts
- **Clearing:** Lost if browser cache is cleared

### Import/Export

#### Export Data

1. Go to Dashboard → Backup & Restore
2. Click "Export as JSON" or "Export as CSV"
3. File downloads to your computer

#### Import Data

1. Go to Dashboard → Backup & Restore
2. Click "Choose File to Import"
3. Select a JSON or CSV file
4. Data merges with existing records

### Backup Recommendations

- **Frequency:** Weekly or before major changes
- **Format:** JSON for full preservation
- **Storage:** Keep backups in secure location
- **Rotation:** Keep multiple backup versions

## 🔧 Configuration

### Theme Customization

Edit `client/src/index.css` to customize:

- Color palette (OKLCH format)
- Typography and fonts
- Spacing and sizing
- Border radius and shadows

### Vite Configuration

`vite.config.ts` controls:

- Build output directory
- Asset optimization
- Development server settings
- Plugin configuration

## 📊 Data Structure

### Evaluation Record

```typescript
interface EvaluationRecord {
  id: string;                          // Unique identifier
  sessionNumber: number;               // Session number
  date: string;                        // Session date (YYYY-MM-DD)
  groupName: string;                   // Group name
  duringParticipation: string;         // Participation percentage
  beforeMixedInteractions: number;     // Before count
  afterMixedInteractions: number;      // After count
  beforeStereotypes: string;           // Before stereotype level
  afterStereotypes: string;            // After stereotype level
  facilitator: string;                 // Facilitator name
  notes: string;                       // Additional notes
}
```

## 🚀 Deployment

### GitHub Pages

The application is deployed to GitHub Pages at:
**https://0rwa11.github.io/convivencia/**

### Automatic Deployment

GitHub Actions automatically deploys on push to `main`:

1. Install dependencies
2. Build the project
3. Deploy to GitHub Pages

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy to GitHub Pages
git subtree push --prefix dist/public origin gh-pages
```

## 🔒 Security & Privacy

- ✅ **No Data Collection** — No analytics or tracking
- ✅ **Local Storage Only** — Data never leaves your browser
- ✅ **No External Calls** — No API requests
- ✅ **HTTPS by Default** — Secure connection on GitHub Pages
- ✅ **Open Source** — Code is transparent and auditable

## 📈 Performance

### Build Metrics

- **Bundle Size:** 1.7 MB (uncompressed)
- **Gzip Size:** 462 KB (compressed)
- **Load Time:** ~2-3 seconds
- **Lighthouse Score:** 85-90

### Optimization Tips

1. Keep browser cache enabled
2. Use modern browser for best performance
3. Clear cache if experiencing issues
4. Export data regularly for backup

## 🐛 Troubleshooting

### Data Not Saving

**Problem:** Changes don't persist after refresh

**Solutions:**
- Check browser's localStorage is enabled
- Try a different browser
- Clear browser cache and reload
- Check browser console for errors

### Import Failing

**Problem:** Cannot import JSON or CSV file

**Solutions:**
- Verify file format (JSON or CSV)
- Check file contains valid data
- Ensure required fields are present
- Try exporting and re-importing test data

### Features Not Working

**Problem:** Pages not loading or features broken

**Solutions:**
- Refresh page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Try a different browser
- Check browser console for errors

## 📚 Documentation

- **[TASK_1_AUDIT.md](./audit/summary.md)** — Audit findings
- **[TASK_2_SKELETON.md](./TASK_2_SKELETON.md)** — Project setup
- **[TASK_3_MIGRATION.md](./TASK_3_MIGRATION.md)** — Feature migration
- **[TASK_4_OPTIMIZATION.md](./TASK_4_OPTIMIZATION.md)** — Optimization details
- **[TASK_5_DEPLOYMENT.md](./TASK_5_DEPLOYMENT.md)** — Deployment guide

## 🤝 Contributing

To contribute improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👥 Support

For issues, questions, or suggestions:

1. Check existing GitHub Issues
2. Create a new Issue with details
3. Include reproduction steps if applicable
4. Attach screenshots or error logs

## 🎓 Learning Resources

### Technologies Used

- **React 19** — UI framework
- **Vite 7** — Build tool
- **TypeScript 5.6** — Type safety
- **Tailwind CSS 4** — Styling
- **Wouter 3** — Routing
- **Shadcn/ui** — UI components
- **Recharts 2** — Charts and graphs

### Getting Started with Development

1. Understand React hooks and functional components
2. Learn TypeScript basics
3. Familiarize with Tailwind CSS utilities
4. Review the existing component structure
5. Start with small feature additions

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial release with all features |
| 0.4.0 | Task 4 | Import/Export implementation |
| 0.3.0 | Task 3 | Feature migration |
| 0.2.0 | Task 2 | Project skeleton |
| 0.1.0 | Task 1 | Audit and analysis |

## 📞 Contact

For questions or feedback about the Convivencia program:

- **Project Repository:** https://github.com/0rwa11/convivencia
- **Live Application:** https://0rwa11.github.io/convivencia/

---

**Status:** ✅ Production Ready
**Last Updated:** December 2024
**Maintained By:** Manus AI Development Team
