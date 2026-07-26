# CasaBoard

[![HACS](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub release](https://img.shields.io/github/v/release/element-software/CasaBoard?style=for-the-badge&include_prereleases)](https://github.com/element-software/CasaBoard/releases)
[![HA](https://img.shields.io/badge/Home%20Assistant-%3E%3D%202024.6-41BDF5.svg?style=for-the-badge&logo=home-assistant&logoColor=white)](https://www.home-assistant.io/)
[![License](https://img.shields.io/github/license/element-software/CasaBoard?style=for-the-badge)](https://github.com/element-software/CasaBoard/blob/main/LICENSE)
[![Website](https://img.shields.io/badge/Website-casaboard.dev-8B5CF6.svg?style=for-the-badge)](https://casaboard.dev)

![CasaBoard icon](https://casaboard.dev/brand/icon.png)

**Open-source, self-hosted dashboard builder for Home Assistant.**

Drag-and-drop editing, Docker Compose (or Node) for the app, optional HACS integration for a sidebar panel and health sensors — **no account, no cloud, no login**.

![CasaBoard — local-only Home Assistant dashboards](https://casaboard.dev/brand/hero.png)

## What you get

| Piece | What it does |
| --- | --- |
| **CasaBoard app** | Self-hosted editor + live dashboards (Docker recommended) |
| **HACS integration** | Sidebar panel (iframe), online/page sensors, `casaboard.refresh` service |

Your layouts and Home Assistant credentials stay on **your** machine. Nothing phones home.

## Requirements

- A running [Home Assistant](https://www.home-assistant.io/) instance (**2024.6+** for the HACS integration)
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose (for the recommended install)
- Optional: [HACS](https://hacs.xyz/) to install the sidebar integration

## Quick start (app)

```bash
git clone https://github.com/element-software/CasaBoard.git
cd CasaBoard
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) (or `http://<host-ip>:3000`).

On first launch you connect to Home Assistant (URL + long-lived access token, or HA sign-in). After that, create a page and build in the drag-and-drop editor.

Dashboard data lives in `./data` (bind-mounted into the container) — back that directory up.

> Full walkthrough: [casaboard.dev/docs](https://casaboard.dev/docs)

## Install the HACS integration

The integration does **not** replace the CasaBoard app — it bridges a running instance into Home Assistant.

### 1. Add the repository in HACS

1. HACS → **Integrations** → ⋮ → **Custom repositories**
2. Repository: `https://github.com/element-software/CasaBoard`
3. Category: **Integration**
4. Download **CasaBoard**, then **restart Home Assistant**

### 2. Add the integration

[![Open your Home Assistant instance and start setting up CasaBoard.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=casaboard)

Or: **Settings → Devices & services → Add integration → CasaBoard**

Enter the base URL of your CasaBoard app, for example:

- `http://homeassistant.local:3000`
- `http://casaboard:3000` (same Docker network as HA)
- `http://192.168.x.x:3000`

### What the integration provides

| Entity / feature | Meaning |
| --- | --- |
| Sidebar **CasaBoard** panel | Opens the app in an iframe (title/icon configurable in options) |
| `binary_sensor.casaboard_online` | CasaBoard `/api/health` is reachable |
| `sensor.casaboard_pages` | Total pages |
| `sensor.casaboard_ha_connection` | `connected` / `disconnected` (stored HA credentials in the app) |
| `casaboard.refresh` | Service to re-poll health (optional `entry_id`) |

### Manual install (without HACS)

Copy `custom_components/casaboard` into `<config>/custom_components/casaboard`, restart Home Assistant, then add the integration from the UI.

### Sidebar only (no sensors)

If you only want an iframe and no custom component:

```yaml
# configuration.yaml
panel_iframe:
  casaboard:
    title: CasaBoard
    icon: mdi:view-dashboard
    url: http://homeassistant.local:3000
```

## Viewing dashboards

Open any page in the CasaBoard app at `/dashboard/<slug>` (for example `http://<host>:3000/dashboard/upstairs`). Wall tablets and bookmarks should point at that URL.

## Environment variables

| Variable | Default (Docker) | Purpose |
| --- | --- | --- |
| `DATA_DIR` | `/data` | JSON store (`pages`, sidebars, themes, HA connection) |
| `PORT` | `3000` | HTTP port |

## Privacy

No analytics or tracking in the app or the marketing site. No cookie consent banner — there is nothing to consent to. Your Home Assistant credentials and dashboard JSON never leave the server you run.

## Support

- Docs: [casaboard.dev/docs](https://casaboard.dev/docs)
- Issues: [GitHub Issues](https://github.com/element-software/CasaBoard/issues)
- Email: [support@casaboard.dev](mailto:support@casaboard.dev)

---

## Development

Requirements: Node 18+, npm 10+. From the repo root:

```bash
npm install
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Public site: [http://localhost:3001](http://localhost:3001)

```bash
npm run build        # all apps/packages
npm run lint
npm run check-types
```

### Repository layout

| Path | Role |
| --- | --- |
| `apps/app` | Dashboard builder (Next.js) — what the Docker image runs |
| `apps/public` | Documentation / marketing site ([casaboard.dev](https://casaboard.dev)) |
| `packages/ui` | Shared UI (HeroUI, icons, Puck editor) |
| `packages/lib` | Actions, services, flat-JSON persistence |
| `packages/ha` | Home Assistant websocket helpers (`@casaboard/ha`) |
| `custom_components/casaboard` | HACS integration (panel + sensors); brand assets in `brand/` |

Integration-focused notes: [`hacs-panel/README.md`](hacs-panel/README.md).

## License

MIT © CasaBoard
