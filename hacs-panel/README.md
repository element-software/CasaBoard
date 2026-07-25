# CasaBoard — Home Assistant integration

Companion custom component for [CasaBoard](https://github.com/element-software/CasaBoard). The app still runs as Docker/Node; this integration embeds it in Home Assistant and exposes health sensors.

> End-user install, Docker, and publish steps live in the [root README](../README.md).

## Features

1. **Sidebar panel** — iframe of your CasaBoard URL (title/icon in integration options)
2. **Health sensors** — polls CasaBoard `/api/health`
3. **`casaboard.refresh`** — re-poll on demand

## Install

1. HACS → custom repository `https://github.com/element-software/CasaBoard` → category **Integration**
2. Download **CasaBoard**, restart Home Assistant
3. [Add the integration](https://my.home-assistant.io/redirect/config_flow_start/?domain=casaboard) and enter your CasaBoard base URL

Manual: copy `custom_components/casaboard` into `<config>/custom_components/casaboard`.

## Entities

| Entity | Meaning |
| --- | --- |
| `binary_sensor.casaboard_online` | `/api/health` reachable |
| `sensor.casaboard_pages` | Total pages |
| `sensor.casaboard_published_pages` | Published pages |
| `sensor.casaboard_ha_connection` | App has stored HA credentials (`connected` / `disconnected`) |

## Brand assets

Icons for Home Assistant / HACS live in [`custom_components/casaboard/brand/`](../custom_components/casaboard/brand/) (`icon.png`, `logo.png`, dark variants).
