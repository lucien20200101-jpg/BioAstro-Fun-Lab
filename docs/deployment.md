# Vercel Deployment

## Build settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## SPA routing fallback (React Router)
This project uses React Router with browser history mode, so direct refresh on nested routes requires a Vercel rewrite fallback.

Configured in `vercel.json`:
- Rewrite all paths to `/index.html`

## Post-deploy route checks
After deployment, verify these routes can be opened and refreshed without 404:
- `/`
- `/bio`
- `/astro`
- `/bioastro`
- `/admin`
- `/bio/random-facts`
- `/astro/random-facts`
- `/bio/organelle-quiz`
- `/astro/planet-quiz`
- `/bio/dna-translator`
- `/bioastro/habitability`
