# CasaBoard

An open-source, self-hosted dashboard builder for Home Assistant. Build custom dashboards with a drag-and-drop editor (Puck), connect it to your own Home Assistant instance, and run the whole thing yourself with Docker — no account, no cloud, no login.

## Run it

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000). On first run you'll be guided through connecting to Home Assistant (URL + long-lived access token, or sign-in with HA); once connected, start building dashboards.

Your data (`pages.json`, `sidebars.json`, `themes.json`, `ha-connection.json`, `publish-settings.json`) lives in `./data`, bind-mounted into the container — back that directory up.

### Publish dashboards to Home Assistant `/local/`

Published pages are exported as static files (shared viewer JS/CSS + per-page JSON/HTML). Mount your HA `www/casaboard` folder into the container:

```bash
# Example: HA config at /home/pi/homeassistant
HA_WWW=/home/pi/homeassistant/www/casaboard docker compose up -d
```

Or set `HA_WWW` in a `.env` next to `docker-compose.yml`. Defaults to `./publish` for local smoke tests.

Then in CasaBoard → Setup → HA Settings, set **Public base URL** to e.g. `http://homeassistant.local:8123/local/casaboard`. Publishing a page writes to that mount; open `…/local/casaboard/<slug>/`. The static viewer asks for a long-lived access token once (browser localStorage only — tokens are never written into `www/`).

Drafts stay previewable in the app at `/dashboard/<slug>`.

To embed CasaBoard in the Home Assistant sidebar (with status sensors), see [`hacs-panel/README.md`](hacs-panel/README.md) — install the `custom_components/casaboard` integration via HACS.

## Apps

- `apps/app` – The dashboard builder (Next.js App Router). This is what runs in the Docker image.
- `apps/viewer` – Static dashboard runtime (Vite). Built into the Docker image and copied into `PUBLISH_DIR` on publish.
- `apps/public` – Documentation / project site (Next.js App Router, not part of the Docker image)

## Packages

- `packages/ui` – Shared UI components (HeroUI, Material and Hero Icons, Puck page editor)
- `packages/config` – Various config items
- `packages/utils` – Entity utils (lights, binary sensors, icons)
- `packages/hooks` – Shared hooks (theme, pages, etc.)
- `packages/lib` – Actions, services, and the flat-JSON-file persistence layer (`packages/lib/store`)
- `packages/types` – Shared TypeScript types
- `custom_components/casaboard` – Home Assistant integration (HACS): sidebar panel + health sensors for the running CasaBoard app (see [`hacs-panel/README.md`](hacs-panel/README.md))

## Local Development

Requirements: Node 18+, npm 10+, PNPM/NPM/Yarn (repo uses npm). From the repo root:

```bash
npm install
npm run dev
```

That starts both apps. Visit:

- App: http://localhost:3000
- Public: http://localhost:3001

To run a single app:

```bash
npm run dev --workspace=app
npm run dev --workspace=public
```

## Environment

- `DATA_DIR` – where `apps/app` stores its JSON data files. Defaults to `./data`; the Docker image sets it to `/data`.
- `PUBLISH_DIR` – filesystem path for static page exports. Defaults to `./publish`; Docker uses `/publish`.
- `VIEWER_DIST_DIR` – built viewer assets to copy on publish. Docker sets `/app/viewer-dist`.
- `HA_WWW` – compose-only host path mounted at `/publish` (point at `<ha-config>/www/casaboard`).
- `PORT` – optional, defaults to `3000`.

`apps/public` (docs site) needs no environment variables beyond an optional `RESEND_API_KEY` for the contact form.

## Tailwind CSS v4

Shared Tailwind + PostCSS lives in `packages/tailwind-config`. Each app:

- Imports `./app/globals.css` which in turn imports the shared CSS and adds `@source` globs for that app and `packages/ui`.
- Has a `postcss.config.js` re-exporting `@repo/tailwind-config/postcss` so Vercel picks up Tailwind during build.

## Theming

- Uses HeroUI Theme Provider and allows configuring the theme in `hero.ts` in the `tailwind-config` package.

## Analytics & Consent

- `AnalyticsWrapper` loads Vercel Analytics and Google Analytics only after consent.
- `CookieConsent` (HeroUI modal) persists choice in `localStorage` under `casaboard-cookie-consent`.

## Home Assistant Integration

- Uses the home-assistant-websocket-js library.

## Puck Editor

- Puck component registry under `packages/ui/components/puck/puck.config.tsx`.
- Import Puck config directly from that file to keep server bundles clean.

## Build & Deploy

```bash
npm run build
```

For production, build and run the Docker image directly (`docker compose up -d` does this for you) — see the root `Dockerfile`. Only `apps/app` is containerized; `apps/public` is docs and can be hosted separately (or not at all) if you're just running the tool.

## Scripts

- `dev` – run all apps in dev
- `build` – build all apps/packages
- `lint` – ESLint across the repo
- `check-types` – typecheck

## License

MIT © CasaBoard
