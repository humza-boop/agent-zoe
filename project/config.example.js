/*
 * Survey endpoint configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * Copy this file to config.js (same directory) and fill in your Apps Script URL.
 * config.js is listed in .gitignore — never commit it.
 *
 * SETUP STEPS
 * 1. Open google-apps-script/Code.gs in this repo.
 * 2. At script.google.com, create a new project, paste Code.gs contents.
 * 3. In the script editor: Run → "setup" (once) to create the header row.
 * 4. Deploy → New deployment → Web app
 *    Execute as: Me  |  Who has access: Anyone
 * 5. Copy the deployment URL (https://script.google.com/macros/s/...exe)
 * 6. Paste it below, save as config.js.
 */

window.SURVEY_CONFIG = {
  endpoint: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
};
