# Commga

A browser-games discovery platform built with Cloudflare Workers, D1, and static assets.

## Architecture

- **Worker API**: authentication, sessions, catalog proxy, play history, likes, feedback, admin bootstrap.
- **D1**: user accounts, hashed sessions, likes, activity, feedback, game flags.
- **Static assets**: responsive web app, PWA manifest, service worker.
- **Catalog source**: the existing Commga CloudFront catalog is fetched server-side at `/api/catalog`. The import script can snapshot it into `public/catalog.json`.

## Requirements

- Node.js 20+
- Cloudflare account and Wrangler authentication
- D1 database `commga-db`

## Setup

```bash
npm install
npx wrangler login
npm run db:remote
npm run dev
```

Set the first-admin bootstrap secret as a Worker secret:

```bash
npx wrangler secret put ADMIN_BOOTSTRAP_KEY
```

Create an account in Commga, sign in, then make a POST request to `/api/admin/bootstrap` with header `x-admin-bootstrap: YOUR_SECRET` while signed in. Remove or rotate the bootstrap secret after promoting the first administrator.

## Import the catalog into Git

```bash
npm run catalog:import
git add public/catalog.json
git commit -m "Import Commga game catalog"
git push
```

The catalog import step is deliberately separate so it can be rerun when the upstream catalog changes. Game binaries are not copied into this repository; game launch paths remain on the upstream host until you have permission to mirror those assets.

## Deploy

```bash
npm run db:remote
npm run deploy
```

Wrangler deploys the Worker and serves the `public/` directory as static assets. The D1 binding is already configured in `wrangler.jsonc`.

## Security notes

- Passwords are PBKDF2-SHA-256 hashed with per-user random salts.
- Session tokens are random, stored only as SHA-256 hashes, and issued in Secure, HttpOnly, SameSite cookies.
- API requests reject cross-origin mutation requests.
- User data is not cached by the service worker.
- The service worker caches only same-origin GET assets and excludes API routes.
- Set `ADMIN_BOOTSTRAP_KEY` as a secret; never commit it.
