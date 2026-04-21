# DegreeGate Netlify Deployment Protocol

To host this high-performance application on Netlify, follow these extraction steps:

## Step 1: Initialize Deployment Configuration
1. Move the `netlify.toml` file to your project's **root directory**.
2. Create a folder at the project root named `netlify/functions` and move `contact.ts` into it.

## Step 2: Strategic Code Adjustment
In `src/App.tsx`, update the contact form's `fetch` URL:
- **Current**: `/api/contact`
- **Netlify Path**: `/.netlify/functions/contact`

## Step 3: Deployment Options

### Option A: Tactical Drag-and-Drop (Easiest)
1. Run `npm run build` locally.
2. Drag the `dist/` folder into the Netlify "Sites" dashboard.
3. *Note: Serverless functions require specialized bundling if using drag-and-drop. Option B is recommended.*

### Option B: Continuous Intelligence (Recommended)
1. Connect your GitHub repository to Netlify.
2. Set the Build Command: `npm run build`
3. Set the Publish Directory: `dist`
4. Netlify will automatically detect the `netlify.toml` and deploy the site + functions.

## Step 4: Environment Security
Add your operational credentials to the Netlify Dashboard (Site Settings -> Environment Variables):
- `EMAIL_SERVICE_API_KEY` (If using automated notifications)

Direct extraction intelligence available via help@degreegate.com.
