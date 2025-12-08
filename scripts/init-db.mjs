#!/usr/bin/env node

/**
 * Database initialization script for Vercel deployment
 * Run this after deploying to Vercel to set up the database schema
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

console.log("🚀 Convivencia Database Initialization");
console.log("=====================================\n");

// Check environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing environment variables:");
  missingEnvVars.forEach((v) => console.error(`   - ${v}`));
  console.error("\nPlease set these variables before running this script.");
  process.exit(1);
}

console.log("✅ Environment variables configured\n");

try {
  console.log("📦 Running database migrations...");
  execSync("pnpm db:push", {
    cwd: projectRoot,
    stdio: "inherit",
  });
  console.log("✅ Database migrations completed\n");

  console.log("📝 Database initialization summary:");
  console.log("   - Tables created: users, groups, sessions, evaluations, materials, auditLogs");
  console.log("   - Indexes created for performance");
  console.log("   - Relations configured\n");

  console.log("🔐 Next steps:");
  console.log("   1. Create an admin user via the API or application UI");
  console.log("   2. Log in with your admin credentials");
  console.log("   3. Start using the application\n");

  console.log("✨ Database initialization complete!");
} catch (error) {
  console.error("❌ Database initialization failed:");
  console.error(error.message);
  process.exit(1);
}
