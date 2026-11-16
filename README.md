# Batch Code Checker

A beginner-friendly Progressive Web App (PWA) starter. It works in modern mobile and desktop browsers and can be added to a phone Home Screen.

## Current version: what it does
- Collects Company / Brand Name and Batch Code.
- Shows shortcuts to CheckFresh, SkinCarisma, LotDate and BatchCode.org.
- Lets the user record manufacturing date, expiry date, date type and notes.
- Saves a local history in the current browser/device.
- Includes a web app manifest and service worker for installability/offline shell.

## Important limitations
This starter does **not** automatically query the four third-party websites, verify batch codes, or sync history between devices. The sites may not provide public APIs, and browser security/CORS restrictions prevent a static app from safely reading their pages. The current version opens the four sites for manual checking. Dates must be entered only after checking the source or packaging. Do not treat estimates as confirmed expiry dates.

Cross-device history requires a backend/database and user authentication. Automated lookups require documented APIs or permission from each provider. Never put private API keys in browser JavaScript.

## Test locally
Use a local web server (not opening `index.html` as a file). For example, with Python installed:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Publish free with GitHub Pages
1. Create a GitHub account at https://github.com/.
2. Create a new **public** repository named `batch-code-checker`.
3. Upload all files in this folder to the repository root (not the ZIP file itself).
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose branch **main** and folder **/(root)**, then Save.
7. Wait for deployment. Your link will look like:
   `https://YOUR-USERNAME.github.io/batch-code-checker/`
8. Open the link on Android Chrome or iPhone Safari and use the browser's install/Add to Home Screen option.

## Before sharing
- Test the form on phone and computer.
- Confirm all four source links open.
- Remember saved history is currently device/browser-specific.
