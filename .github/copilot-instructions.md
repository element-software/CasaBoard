# CasaBoard Copilot Instructions

## Project Overview

CasaBoard is a **cloud-hosted smart-home dashboard for Home Assistant**, delivered as DaaS (Dashboard-as-a-Service). This is a **Turbo monorepo** with ~196 TypeScript/TSX files containing:

- **2 Next.js 15+ apps** (App Router) with React 19
- **10 shared packages** for UI components, utilities, types, and services
- **Total size**: ~790MB with dependencies

**Technology Stack:**

- **Runtime**: Node 18+ (tested with v20.19.5), npm 10+ (tested with v10.8.2)
- **Framework**: Next.js 15.5+ with Turbopack
- **UI**: HeroUI components, Tailwind CSS v4, Material & Hero Icons
- **State/Auth**: Supabase (authentication, database)
- **Page Builder**: Puck editor (@measured/puck)
- **Home Assistant**: home-assistant-js-websocket library
- **Build Tool**: Turbo (monorepo orchestration)
- **Languages**: TypeScript 5.9.2, React 19.1.0

## Repository Structure

### Apps (`/apps`)

- **`apps/app`** - Main authenticated dashboard (port 3000)
  - Routes: `/(authenticated)`, `/auth`, `/setup`, `/config`, `/dashboard/[page]`
  - Environment: `.env.local` (Supabase keys, Google OAuth)
  - Middleware: Custom auth protection via `@repo/lib/SupabaseMiddleware`
- **`apps/public`** - Marketing/landing site (port 3001)
  - No environment variables needed (marketing only)

### Packages (`/packages`)

- **`ui`** - 72 component files (HeroUI, Puck, shared widgets)
  - Components: Clock, Light, Toggle, Switch, Alarm, Sidebars, GraphCard, EntityAutocomplete, Puck editor configs
- **`lib`** - Services, Supabase clients, actions, encryption, logging
  - Services: subscriptionService, billingService
  - Actions: pageActions, haInstanceActions (CRUD with plan limit checks)
- **`types`** - Shared TypeScript types (ha.ts, page.ts, subscription.ts, user.ts, etc.)
- **`hooks`** - Shared React hooks (theme, pages, etc.)
- **`utils`** - Entity utilities (lights, binary sensors, icons, alarm, tools)
- **`ha`** - Home Assistant websocket integration
- **`tailwind-config`** - Shared Tailwind CSS v4 + PostCSS + theme config
- **`eslint-config`** - ESLint flat configs (base.js, next.js, react-internal.js)
- **`typescript-config`** - Shared TypeScript config (base.json)
- **`config`** - Miscellaneous config exports
- **`middleware.ts`** - Reusable auth middleware logic (also exists in `apps/app`)

### Configuration Files (Root)

- **`turbo.json`** - Turbo build orchestration, task dependencies
- **`package.json`** - Root workspace config, scripts, engines
- **`.npmrc`** - npm configuration (empty but present)
- **`.gitignore`** - Standard ignores: node_modules, .next, .turbo, .env\*, dist, build

## Build & Development Commands

### Installation

**ALWAYS run this first after cloning or when package.json changes:**

```bash
npm install
```

- **Time**: ~60 seconds
- **Output**: Installs ~742 packages
- **Note**: May show 1 high severity vulnerability (normal, requires review)

### Development Server

```bash
npm run dev
```

- **What it does**: Runs both apps concurrently via Turbo
- **Ports**: App at http://localhost:3000, Public at http://localhost:3001
- **Uses**: Turbopack (--turbopack flag) for faster dev builds
- **Persistent**: Runs indefinitely until stopped (Ctrl+C)

**Single app development:**

```bash
npm run dev --workspace=app      # App only (port 3000)
npm run dev --workspace=public   # Public only (port 3001)
```

### Building

```bash
npm run build
```

- **Time**: ~2-5 minutes (depends on network for Google Fonts)
- **Known Issue**: Fails if Google Fonts (fonts.googleapis.com) is unreachable
  - **Error**: `getaddrinfo ENOTFOUND fonts.googleapis.com`
  - **Cause**: Both apps use `next/font/google` to load Inter font in `app/layout.tsx`
  - **Workaround**: Ensure network access to fonts.googleapis.com, or comment out font imports for local builds
- **Output**: `.next/` directories in each app
- **Turbo behavior**: Builds packages first (^build dependency), then apps

### Linting

```bash
npm run lint
```

- **Known Issue**: Packages `@repo/types`, `@repo/utils`, and others are missing `eslint.config.js`
  - **Error**: `ESLint couldn't find an eslint.config.(js|mjs|cjs) file`
  - **Current state**: Lint will fail for packages without eslint.config.js
  - **Workaround**: Apps (app, public) have eslint.config.js and will lint successfully
  - **Expected behavior**: Packages should either have eslint configs or be excluded from linting
- **Apps use**: ESLint flat config from `@repo/eslint-config/next.js`
- **Flag**: `--max-warnings 0` (zero tolerance for warnings)

### Type Checking

```bash
npm run check-types
```

- **Known Issue**: Some packages (e.g., `@repo/utils`) lack `tsconfig.json`
  - **Error**: TypeScript prints help text instead of type-checking
  - **Workaround**: Type checking works for apps and packages with tsconfig.json
- **What it does**: Runs `tsc --noEmit` across all packages via Turbo
- **Time**: ~10-30 seconds

### Formatting

```bash
npm run format
```

- **What it does**: Runs Prettier on all `**/*.{ts,tsx,md}` files
- **Uses**: Prettier ^3.6.2

## Environment Setup

### Required for `apps/app` (.env.local)

Create `apps/app/.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-key>
SUPABASE_SECRET_KEY=<your-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Required for `apps/public`

**None** - marketing site runs without environment variables.

### Turbo Environment

- **Global env**: `RESEND_API_KEY` (declared in turbo.json but optional)
- **Detection**: Turbo watches `.env*` files (globalDependencies in turbo.json)

## Key Architectural Details

### Tailwind CSS v4 Setup

- **Shared config**: `packages/tailwind-config`
  - `globals.css` - Base styles
  - `theme.css` - Custom theme variables
  - `hero.ts` - HeroUI theme config
  - `postcss.config.js` - PostCSS setup for Tailwind v4
- **App integration**:
  - Each app has `app/globals.css` importing shared CSS
  - Each app has `postcss.config.js` re-exporting `@repo/tailwind-config/postcss`
  - `@source` globs in CSS include that app's files + `packages/ui`

### Authentication & Middleware

- **Primary middleware**: `apps/app/middleware.ts`
  - Protects routes: `/setup`, `/config`, `/api/pages`, top-level authenticated routes
  - Uses `@repo/lib/SupabaseMiddleware.createClient` for auth state
  - Redirects unauthenticated users to `/auth/login?redirectTo=<path>`
- **Secondary middleware**: `packages/middleware.ts` (similar logic, may be legacy)
- **Session refresh**: Middleware refreshes Supabase session for Server Components

### Puck Page Editor

- **Config location**: `packages/ui/components/puck/puck.config.tsx`
- **Components**: Custom components registered for drag-and-drop page building
- **Usage**: Import Puck config directly to keep server bundles clean

### Analytics & Consent

- **Component**: `AnalyticsWrapper` (from `@repo/ui`)
- **Loads**: Vercel Analytics, Google Analytics (after user consent)
- **Consent**: `CookieConsent` component stores choice in `localStorage` as `casaboard-cookie-consent`

### Event Listener Setup (Development Hack)

- **File**: `apps/app/lib/event-listener-setup.js`
- **Purpose**: Prevent MaxListenersExceededWarning in development
- **Imported**: In `apps/app/next.config.js` at top
- **Sets**: `process.setMaxListeners(20)` in dev, 10 in prod

## Common Pitfalls & Workarounds

1. **Build fails with Google Fonts error**
   - **Symptom**: `getaddrinfo ENOTFOUND fonts.googleapis.com`
   - **Fix**: Ensure network allows fonts.googleapis.com, or temporarily comment out `import { Inter } from "next/font/google"` in `apps/app/app/layout.tsx` and `apps/public/app/layout.tsx`

2. **Lint fails for packages**
   - **Symptom**: `ESLint couldn't find an eslint.config.js file` in @repo/types, @repo/utils, etc.
   - **Fix**: Add `eslint.config.js` to each package (see `apps/public/eslint.config.js` for reference)
   - **Example**:
     ```js
     import { config } from "@repo/eslint-config/base";
     export default config;
     ```

3. **Type checking fails for packages**
   - **Symptom**: TypeScript prints help text for packages without tsconfig.json
   - **Fix**: Add `tsconfig.json` to each package extending `@repo/typescript-config/base.json`
   - **Example**:
     ```json
     {
       "extends": "@repo/typescript-config/base.json",
       "compilerOptions": {},
       "include": ["**/*.ts", "**/*.tsx"],
       "exclude": ["node_modules"]
     }
     ```

4. **Dependency installation warnings**
   - **Symptom**: "1 high severity vulnerability" after `npm install`
   - **Action**: Run `npm audit` to review; may require dependency updates

5. **MaxListenersExceededWarning in development**
   - **Already handled**: `apps/app/lib/event-listener-setup.js` suppresses this
   - **If it still appears**: Check import in `next.config.js` is present

## Validation Steps Before Committing

1. **Install dependencies**: `npm install`
2. **Type check**: `npm run check-types` (expect warnings from packages without tsconfig.json)
3. **Lint**: `npm run lint` (expect errors from packages without eslint.config.js; apps should pass)
4. **Build** (if network allows): `npm run build` (may fail on Google Fonts)
5. **Dev server**: `npm run dev` and verify both apps start

## File Locations Reference

**Root files:**

- `package.json`, `turbo.json`, `.npmrc`, `.gitignore`, `README.md`

**App configs:**

- `apps/app/next.config.js`, `apps/app/middleware.ts`, `apps/app/tsconfig.json`, `apps/app/postcss.config.js`
- `apps/public/next.config.js`, `apps/public/eslint.config.js`, `apps/public/tsconfig.json`

**Package configs:**

- `packages/eslint-config/base.js`, `packages/eslint-config/next.js`
- `packages/typescript-config/base.json`
- `packages/tailwind-config/globals.css`, `packages/tailwind-config/hero.ts`, `packages/tailwind-config/postcss.config.js`

**Key source files:**

- `apps/app/app/layout.tsx` (root layout, font import, AnalyticsWrapper)
- `apps/app/middleware.ts` (auth protection logic)
- `packages/ui/components/puck/puck.config.tsx` (Puck editor config)
- `packages/lib/index.ts` (exports services, Supabase clients)

## Instructions for Agents

- **Trust these instructions** and only search the codebase if information here is incomplete or incorrect.
- **Always run `npm install`** before building or running commands.
- **Expect linting failures** in packages without eslint.config.js; focus on linting apps.
- **Expect type-checking issues** in packages without tsconfig.json; this is a known limitation.
- **Be aware of network dependencies** (Google Fonts) when building.
- **Use Turbo workspace filtering** for single-app development: `--workspace=app` or `--workspace=public`.
- **Check for environment variables** if the app behaves unexpectedly (Supabase, Google OAuth).
- **Consult the README** for high-level context; this file provides operational details.
