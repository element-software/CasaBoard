"""Constants for the CasaBoard integration."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "casaboard"

CONF_URL: Final = "url"
CONF_SIDEBAR_TITLE: Final = "sidebar_title"
CONF_SIDEBAR_ICON: Final = "sidebar_icon"
CONF_SCAN_INTERVAL: Final = "scan_interval"

DEFAULT_SIDEBAR_TITLE: Final = "CasaBoard"
DEFAULT_SIDEBAR_ICON: Final = "mdi:view-dashboard"
DEFAULT_SCAN_INTERVAL: Final = 60

PANEL_URL_PATH: Final = "casaboard"
PANEL_WEBCOMPONENT: Final = "casaboard-panel"
PANEL_STATIC_URL: Final = f"/{DOMAIN}_static"
PANEL_FILENAME: Final = "casaboard-panel.js"

MIN_SCAN_INTERVAL: Final = 15
MAX_SCAN_INTERVAL: Final = 3600

ATTR_PAGES: Final = "pages"
ATTR_PUBLISHED: Final = "published"
ATTR_HA_CONNECTED: Final = "ha_connected"
ATTR_HASS_URL: Final = "hass_url"
ATTR_URL: Final = "url"

SERVICE_REFRESH: Final = "refresh"

UPDATE_INTERVAL = timedelta(seconds=DEFAULT_SCAN_INTERVAL)
