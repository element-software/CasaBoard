# `@casaboard/ha`

Home Assistant connection helpers, React provider, and entity hooks used by
CasaBoard — published for reuse in other React apps.

## Install

```bash
npm install @casaboard/ha home-assistant-js-websocket
# peer: react, react-dom (^18 or ^19)
```

## Quick start

```tsx
import {
  HAProvider,
  useHA,
  useEntity,
  createLocalStorageTokenStore,
} from "@casaboard/ha";

const tokenStore = createLocalStorageTokenStore();

export function App() {
  return (
    <HAProvider
      haInstance={{ hass_url: "http://homeassistant.local:8123" }}
      tokenStore={tokenStore}
    >
      <Dashboard />
    </HAProvider>
  );
}

function Dashboard() {
  const { connected } = useHA();
  const light = useEntity("light.living_room");
  return (
    <p>
      {connected ? "Connected" : "Connecting…"} — {light?.state}
    </p>
  );
}
```

## What’s included

- **Connection** — `connect`, `reauthenticate`, long-lived token probe, OAuth
  callback completion, URL normalization, typed connection errors
- **React** — `HAProvider`, `useHA`, `useEntity`, `useEntities`, `useEntityHistory`
- **Camera helpers** — HLS/MJPEG URL builders and capability checks
- **Token stores** — `createLocalStorageTokenStore` (bring your own for servers)

## Auth notes

Prefer a [long-lived access token](https://www.home-assistant.io/docs/authentication/)
for headless / kiosk clients. OAuth (`getAuth` via `reauthenticate` /
`completeOAuthCallback`) needs a browser redirect back to your app.

## Publishing (maintainers)

From the monorepo:

```bash
npm run build -w @casaboard/ha
npm publish -w @casaboard/ha --access public
```

Or push a tag matching `ha-v*` (e.g. `ha-v0.1.0`) to run the GitHub Actions
publish workflow. Requires an `NPM_TOKEN` repository secret with publish rights
to the `@casaboard` npm scope.
