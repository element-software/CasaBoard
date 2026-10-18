# CasaBoard App

CasaBoard is a local-only dashboard builder for Home Assistant. This App runs the CasaBoard container under Supervisor with **Ingress** for the UI and **Updates** for new versions.

## Install

1. In Home Assistant go to **Settings → Add-ons → Add-on store** (Apps store).
2. Open the menu (⋮) → **Repositories**.
3. Add: `https://github.com/element-software/CasaBoard`
4. Install **CasaBoard**, start it, then use **Open Web UI** (Ingress).

No official Community Store submission is required for this custom repository flow.

## First-run setup

Inside CasaBoard, connect to your Home Assistant instance (URL + long-lived token, or HA sign-in). Pages and connection data are stored in the App’s persistent `/data` volume and survive updates.

## Updates

When a newer App version is published, Home Assistant shows it under **Settings → System → Updates**. Install from there — Supervisor pulls the new image from GHCR.

## HACS integration (optional)

The optional [HACS CasaBoard integration](https://github.com/element-software/CasaBoard) exposes health sensors (`online`, pages count, HA connection). It does **not** register a sidebar iframe panel; on HAOS use this App’s Ingress for the UI.

Sensors need a plain HTTP base URL to your CasaBoard instance. The Ingress URL is not a stable poll target. Compose (or any direct URL) installs are the usual fit for sensors.

## Compose fallback

Non-HAOS hosts can run the same image with Docker Compose — see the [root README](https://github.com/element-software/CasaBoard/blob/main/README.md).

## Support

- Issues: https://github.com/element-software/CasaBoard/issues
- Site: https://casaboard.dev
