# CasaBoard Turbo Monorepo

A multi-app monorepo for CasaBoard, a cloud‑hosted smart‑home dashboard for Home Assistant. A DaaS (dashboard-as-a-service) for Home Assistant.

## Apps

- `apps/app` – Dashboard that requires authentication (Next.js App Router)
- `apps/public` – Marketing site / public landing (Next.js App Router)

## Packages

- `packages/ui` – Shared UI components (HeroUI, Material and Hero Icons, Puck page editor)
- `packages/config` – Various config items
- `packages/utils` – Entity utils (lights, binary sensors, icons)
- `packages/hooks` – Shared hooks (theme, pages, etc.)
- `packages/lib` – Services, Supabase clients, actions, encryption
- `packages/types` – Shared TypeScript types

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

Place environment variables per app:

- `apps/app/.env.local`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - `SUPABASE_SECRET_KEY`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`

Public app typically needs none (marketing only).

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

Currently deployed to Vercel. The CasaBoard app is available at [https://app.casaboard.dev](https://app.casaboard.dev) and the marketing website is at [https://casaboard.dev](https://casaboard.dev).

## Scripts

- `dev` – run all apps in dev
- `build` – build all apps/packages
- `lint` – ESLint across the repo
- `check-types` – typecheck

## License

MIT © CasaBoard
