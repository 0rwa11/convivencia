# GitHub Actions Setup for Automatic Deployment

This document provides instructions for manually setting up the GitHub Actions workflow to automatically build and deploy the Convivencia website to GitHub Pages.

## Why Manual Setup?

Due to GitHub App permission restrictions, the workflow file could not be pushed directly via the CLI. You will need to create it manually through the GitHub UI or by pushing it directly to the repository.

## Option 1: Create via GitHub UI (Recommended)

1. Go to your repository: https://github.com/0rwa11/convivencia
2. Click on the **Actions** tab
3. Click **New workflow** → **set up a workflow yourself**
4. Name the file `deploy.yml` and paste the configuration below
5. Click **Commit changes**

## Option 2: Create via Git Command

If you have local git access with proper permissions:

```bash
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'dist/public'

  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
EOF

git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for automatic deployment to GitHub Pages"
git push origin main
```

## Workflow Configuration Explained

The workflow performs the following steps:

### Build Job

1. **Checkout:** Clones the repository code
2. **Setup Node.js:** Installs Node.js v22
3. **Install pnpm:** Installs the pnpm package manager
4. **Cache Dependencies:** Caches pnpm dependencies for faster builds
5. **Install Dependencies:** Runs `pnpm install --frozen-lockfile`
6. **Build:** Runs `pnpm build` to generate the static site in `dist/public/`
7. **Setup Pages:** Configures GitHub Pages settings
8. **Upload Artifact:** Uploads the `dist/public/` directory as a GitHub Pages artifact

### Deploy Job

1. **Deploy to GitHub Pages:** Uses the official GitHub Pages deployment action to publish the artifact

## Enabling GitHub Pages

After the workflow is created, you need to enable GitHub Pages in your repository settings:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

The workflow will automatically deploy to your GitHub Pages URL (typically `https://0rwa11.github.io/convivencia/`).

## Verifying the Workflow

After creating the workflow:

1. Go to the **Actions** tab in your repository
2. You should see the **Build and Deploy to GitHub Pages** workflow
3. On the next push to `main`, the workflow will automatically run
4. Check the workflow logs to verify successful build and deployment

## Troubleshooting

### Workflow Not Running

- Ensure the workflow file is in `.github/workflows/deploy.yml`
- Verify the file name ends with `.yml` or `.yaml`
- Check that the branch is `main` (the workflow only triggers on pushes to `main`)

### Build Failures

- Check the workflow logs in the **Actions** tab
- Common issues:
  - Missing dependencies: Run `pnpm install` locally and commit the updated `pnpm-lock.yaml`
  - TypeScript errors: Run `pnpm check` locally to identify issues
  - Build errors: Run `pnpm build` locally to debug

### Pages Not Updating

- Ensure GitHub Pages is enabled in **Settings** → **Pages**
- Verify the source is set to **GitHub Actions**
- Check that the artifact upload path is correct (`dist/public/`)

## Next Steps

Once the workflow is set up, every push to the `main` branch will automatically:

1. Install dependencies
2. Build the project
3. Deploy to GitHub Pages

You can monitor the deployment status in the **Actions** tab and verify the live site at your GitHub Pages URL.
