ME TECHNOLOGIES — HOMEPAGE FIXES BUNDLE

WHAT CHANGED
- Uses the two official ME Technologies logo assets supplied in the brand folder:
  public/assets/brand/logo-mark.png (header and approach illustration)
  public/assets/brand/logo.png (full logo in the footer)
- Replaces the oversized “ME” monogram in the homepage approach section with an original engineering-orbit graphic using the official logo mark.
- Adds a network-error message that explains the common API connection/CORS causes.
- Pins Vite to http://localhost:5173, because the completed backend CORS configuration allows that origin.
- No npm dependencies added; backend files are not included or modified.

APPLY ON WINDOWS
1. Stop the client Vite terminal (Ctrl+C).
2. Open PowerShell in D:\Web Projects\ME-technologies\client.
3. Back up your current source if not already backed up:
   Copy-Item .\src "$env:TEMP\ME-technologies-src-backup-homefix" -Recurse
4. Extract this ZIP into the client folder so src, public, vite.config.js and .env.example sit beside package.json. Allow the two logo assets and vite.config.js to be overwritten.
5. Make sure client/.env exists with:
   VITE_API_URL=http://localhost:5000/api
   VITE_SERVER_URL=http://localhost:5000
   Never commit client/.env.
6. Start the backend in a separate terminal. Confirm http://localhost:5000/api/health returns JSON.
7. Start the frontend:
   npm run dev
   Open exactly http://localhost:5173 (not 127.0.0.1 and not port 5174).
8. If Vite says port 5173 is already in use, stop the other Vite process using Ctrl+C in its terminal, then run npm run dev again. Strict port mode is intentional: the backend only allows the localhost:5173 origin by default.
9. Validate:
   npm run lint
   npm run build

API TROUBLESHOOTING
“Failed to fetch” for several different content sections usually means the browser could not establish a permitted connection to the API; it is not an empty-data response. Ensure the API server is running on port 5000 and the browser origin is exactly http://localhost:5173. The updated error message gives these checks if the request is blocked.

No backend files, node_modules, or local environment secrets are included in this bundle.
