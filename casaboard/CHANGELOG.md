# Changelog

All notable changes to the CasaBoard Home Assistant App are documented here.

## [0.2.0] - 2026-10-18

- Add an opt-in kiosk port for full-screen dashboards.

## [0.1.2] - 2026-10-18

- Fix Ingress returning Forbidden under Home Assistant.

## [0.1.1] - 2026-10-18

- Remove the leftover hacs-panel docs folder.
- Ship CasaBoard as a Home Assistant App with Ingress and one-click releases.
- Add per-page event-triggered camera popups (phase 1).
- Show a chevron on every sidebar nav item, not just Media.
- Open a full-gauge control modal when tapping the Thermostat card.
- Fix duplicate React keys in EntitiesCard when entity ids are empty or repeated.

## [0.1.0] - 2026-07-28

### Added

- Initial Home Assistant App packaging with Ingress
- Multi-arch image `ghcr.io/element-software/casaboard`
- Persistent `/data` for pages and HA connection
- Watchdog on `/api/health`
