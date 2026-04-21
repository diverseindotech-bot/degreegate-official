# DegreeGate WordPress Deployment Protocol

To host this high-performance React application inside your WordPress instance, follow these extraction and deployment steps:

## Step 1: Build the Tactical Assets
Run the build command in your terminal:
```bash
npm run build
```
This generates the optimized `dist/` sector.

## Step 2: Prepare the Package
1. Create a folder locally named `degreegate-theme`.
2. Copy the contents of `/wordpress-theme-package/` (index.php, functions.php, style.css) into this folder.
3. Create a subfolder inside `degreegate-theme` named `assets`.
4. Copy all `.js` and `.css` files from your local `dist/assets/` directory into this new `assets/` subfolder.

## Step 3: Deployment
1. Zip the `degreegate-theme` folder.
2. Go to your WordPress Dashboard -> Appearance -> Themes -> Add New -> Upload Theme.
3. Upload `degreegate-theme.zip` and activate it.

## Handling the Contact Form (API)
When moving to WordPress, you have two tactical choices for the contact form:
1. **Maintain the Express Server**: Keep hosting the `server.ts` logic as a standalone backend and update the `fetch` URL in `App.tsx` from `/api/contact` to your absolute server URL (e.g., `https://api.degreegate.com/api/contact`).
2. **WordPress Native**: Reconfigure the fetch call to use the WordPress REST API (`wpData.restUrl`) and create a PHP handler in `functions.php`.

Direct extraction intelligence available via help@degreegate.com.
