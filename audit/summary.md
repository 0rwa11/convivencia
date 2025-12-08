# Audit Summary: Convivencia Website Rebuild

This audit was performed on the provided `convivencia.zip` source code to determine the current state, identify the technology stack, and outline the necessary steps for the static rebuild.

## Problems Identified

*   **Vestigial Backend Components:** The codebase contains remnants of a full-stack project template, including a `server/` directory, `drizzle.config.ts`, and `drizzle/` files for a MySQL/TiDB database. These components are incompatible with a fully static architecture and must be completely removed.
*   **Missing Import/Export Logic:** The original files for data backup and cloud sync (`backupUtils.ts`, `cloudSync.ts`, etc.) are missing. The critical **Import/Export** feature must be reimplemented using client-side file I/O (e.g., JSON/CSV) to maintain feature parity.
*   **Dependency Instability:** The presence of a `patches/` directory suggests that the original project required patched dependencies (`wouter@3.7.1.patch`). This indicates potential dependency conflicts that should be resolved by updating to stable, modern versions during the rebuild.

## Features to Preserve

The core application logic is client-side, relying on `localStorage` for data persistence, which is ideal for a static site. All the following features must be preserved with 100% fidelity:

*   **Calendar:** Session Calendar (`SessionCalendar.tsx`).
*   **Statistics & Reporting:** Comparison Charts, Group Dashboard, Executive Summary.
*   **Evaluation Tools:** Evaluation forms and tracking (`Evaluation.tsx`, `EvaluationTracking.tsx`).
*   **Data Management:** Import/Export functionality (to be reimplemented).
*   **User Interface:** All forms, UI pages, multilingual routes (Spanish/Catalan), and responsiveness.
