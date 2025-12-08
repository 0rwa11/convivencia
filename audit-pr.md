# Task 1: Audit of Convivencia Website Source Code

This pull request contains the results of the initial audit of the provided `convivencia.zip` source code. The goal of this task was to understand the existing architecture, identify the technology stack, and create a clear plan for the static rebuild.

## Deliverables

*   `audit/report.json`: Detailed technical report including the file tree, tech stack, architecture assessment, and feature list.
*   `audit/summary.md`: Concise summary of problems and features to keep.
*   `audit-pr.md`: This pull request description.

## Key Findings & Next Steps

The original project is a **React/Vite/TypeScript** application that uses **localStorage** for all core data persistence (Evaluation records). This makes the application fundamentally compatible with a static architecture.

### Problems to Address in Task 2

1.  **Remove Vestigial Backend:** The entire `server/` directory, `drizzle` configuration, and related files must be deleted to create a clean, fully static project.
2.  **Reimplement Data Management:** The logic for **Import/Export** (Backup/Restore) is missing and must be reimplemented using client-side file I/O.
3.  **Dependency Cleanup:** The `patches/` directory suggests dependency issues. We will attempt to resolve these by updating dependencies in the new project skeleton.

### Next Step: Task 2 — New Project Skeleton

The next phase will involve creating a new, clean **Vite + React + TypeScript** project skeleton. We will then configure GitHub Actions for automatic build and deployment to GitHub Pages, setting the stage for the feature migration.

### Instructions for Future AI Agents

*   **Focus on Client-Side Logic:** The core application is entirely client-side. All future work must focus on the `client/src` directory and ensuring all data operations use `localStorage` or client-side file I/O.
*   **Do Not Reintroduce Backend:** Absolutely no server-side code, database connections, or API calls should be introduced. The final product must be a pure static site.
*   **Prioritize Feature Parity:** The most critical and complex part will be reimplementing the data management and statistics logic to ensure 100% feature parity with the original.
