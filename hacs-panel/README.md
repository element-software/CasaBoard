# CasaBoard Home Assistant Integration

HACS-installable Home Assistant integration that:

1. Registers a **sidebar panel** embedding your self-hosted CasaBoard UI
2. Polls CasaBoard `/api/health` and exposes **sensors** (online, page counts, HA connection)
3. Provides a **`casaboard.refresh`** service to re-poll on demand

CasaBoard itself still runs as a Docker/Node app. This integration is the HA-native bridge.

## Install via HACS

1. In HACS, add this GitHub repository as a custom repository (category: **Integration**).
2. Install **CasaBoard**, then restart Home Assistant.
3. Settings → Devices & Services → Add Integration → **CasaBoard**.
4. Enter the base URL of your running CasaBoard instance (e.g. `http://homeassistant.local:3000` or `http://casaboard:3000` on the HA Docker network).

> **Note:** The GitHub repository must be **public** for HACS to fetch it.

## What you get

| Entity | Meaning |
| --- | --- |
| `binary_sensor.casaboard_online` | CasaBoard `/api/health` reachable |
| `sensor.casaboard_pages` | Total pages |
| `sensor.casaboard_published_pages` | Published pages |
| `sensor.casaboard_ha_connection` | Whether CasaBoard has stored HA credentials (`connected` / `disconnected`) |

Sidebar: a **CasaBoard** entry loads the app in an iframe (title/icon configurable in the integration options).

Service: `casaboard.refresh` — optional `entry_id` to refresh one config entry.

## Manual install (without HACS)

Copy `custom_components/casaboard` into `<config>/custom_components/casaboard`, restart HA, then add the integration from the UI.

## Simpler native alternative (panel only)

If you only want the sidebar iframe and no sensors, Home Assistant's built-in `panel_iframe` still works with zero custom code:

```yaml
panel_iframe:
  casaboard:
    title: CasaBoard
    icon: mdi:view-dashboard
    url: http://homeassistant.local:3000
```
