# CasaBoard HACS Panel

Embeds your self-hosted [CasaBoard](../README.md) instance in the Home Assistant sidebar.

The panel lives at [`dist/casaboard-panel.js`](../dist/casaboard-panel.js). Root [`hacs.json`](../hacs.json) tells HACS how to install it from this repository.

## Install via HACS

1. In HACS, add this GitHub repository as a custom repository (category: **Dashboard** / plugin).
2. Install **CasaBoard Panel**. HACS copies `casaboard-panel.js` into `<config>/www/community/CasaBoard/`.

Alternatively, without HACS: copy `dist/casaboard-panel.js` into `<config>/www/casaboard-panel.js` manually.

> **Note:** The GitHub repository must be **public** for HACS to fetch it. Private repos are not supported by HACS.

## Configure

Add to `configuration.yaml` (adjust `module_url` if you installed manually into `www/` instead of via HACS, and `config.url` to point at wherever your CasaBoard container is reachable):

```yaml
panel_custom:
  - name: casaboard-panel
    sidebar_title: CasaBoard
    sidebar_icon: mdi:view-dashboard
    module_url: /hacsfiles/CasaBoard/casaboard-panel.js
    config:
      url: http://homeassistant.local:3000
```

Restart Home Assistant (or reload). A "CasaBoard" entry appears in the sidebar and opens your dashboard in an iframe.

No login/auth handoff is needed — CasaBoard itself has no login gate, and it holds its own connection to Home Assistant, so the iframe loads straight into your dashboard.

## Simpler native alternative

Home Assistant also ships a built-in `panel_iframe` integration that does the same iframe-embedding with zero custom code — no HACS install required:

```yaml
panel_iframe:
  casaboard:
    title: CasaBoard
    icon: mdi:view-dashboard
    url: http://homeassistant.local:3000
```

Use whichever you prefer; the custom panel here exists mainly so CasaBoard has its own HACS-installable entry rather than requiring a YAML edit.
