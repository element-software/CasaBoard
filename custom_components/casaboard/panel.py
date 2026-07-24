"""Panel registration for CasaBoard."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_SIDEBAR_ICON,
    CONF_SIDEBAR_TITLE,
    CONF_URL,
    DEFAULT_SIDEBAR_ICON,
    DEFAULT_SIDEBAR_TITLE,
    DOMAIN,
    PANEL_FILENAME,
    PANEL_STATIC_URL,
    PANEL_URL_PATH,
    PANEL_WEBCOMPONENT,
)

_LOGGER = logging.getLogger(__name__)

_STATIC_REGISTERED = False


async def async_setup_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Serve the panel module and register the sidebar entry."""
    global _STATIC_REGISTERED

    if not _STATIC_REGISTERED:
        www_path = Path(__file__).parent / "www"
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    PANEL_STATIC_URL,
                    str(www_path),
                    cache_headers=False,
                )
            ]
        )
        _STATIC_REGISTERED = True

    # Avoid duplicate panel registration across reloads / multiple entries.
    if PANEL_URL_PATH in hass.data.get("frontend_panels", {}):
        _LOGGER.debug("CasaBoard panel already registered")
        return

    title = entry.options.get(
        CONF_SIDEBAR_TITLE, entry.data.get(CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE)
    )
    icon = entry.options.get(
        CONF_SIDEBAR_ICON, entry.data.get(CONF_SIDEBAR_ICON, DEFAULT_SIDEBAR_ICON)
    )
    url = entry.data[CONF_URL]

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_WEBCOMPONENT,
        sidebar_title=title,
        sidebar_icon=icon,
        module_url=f"{PANEL_STATIC_URL}/{PANEL_FILENAME}",
        embed_iframe=True,
        require_admin=False,
        config={"url": url},
    )


async def async_unload_panel(hass: HomeAssistant) -> None:
    """Remove the CasaBoard sidebar panel if present."""
    if PANEL_URL_PATH in hass.data.get("frontend_panels", {}):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
