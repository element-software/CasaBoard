# CasaBoard

An open-source, self-hosted dashboard builder for Home Assistant. Build custom dashboards with a drag-and-drop editor (Puck), connect it to your own Home Assistant instance, and run the whole thing yourself with Docker — no account, no cloud, no login.

## Run it

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000). On first run you'll be redirected to connect to your Home Assistant instance; once connected, start building dashboards.

Your data (`pages.json`, `sidebars.json`, `themes.json`, `ha-connection.json`) lives in `./data`, bind-mounted into the container — back that directory up.

To embed CasaBoard in the Home Assistant sidebar (with status sensors), see [`hacs-panel/README.md`](hacs-panel/README.md) — install the `custom_components/casaboard` integration via HACS.

## Apps

- `apps/app` – The dashboard builder (Next.js App Router). This is what runs in the Docker image.
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
