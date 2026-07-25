"""Config flow for CasaBoard."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_URL
from homeassistant.core import callback

from .api import CasaBoardApiError, async_fetch_status, normalize_base_url
from .const import (
    CONF_SCAN_INTERVAL,
    CONF_SIDEBAR_ICON,
    CONF_SIDEBAR_TITLE,
    DEFAULT_SCAN_INTERVAL,
    DEFAULT_SIDEBAR_ICON,
    DEFAULT_SIDEBAR_TITLE,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_URL): str,
        vol.Optional(CONF_SIDEBAR_TITLE, default=DEFAULT_SIDEBAR_TITLE): str,
        vol.Optional(CONF_SIDEBAR_ICON, default=DEFAULT_SIDEBAR_ICON): str,
        vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL): vol.All(
            vol.Coerce(int),
            vol.Range(min=MIN_SCAN_INTERVAL, max=MAX_SCAN_INTERVAL),
        ),
    }
)


class CasaBoardConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for CasaBoard."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            url = normalize_base_url(user_input[CONF_URL].strip())
            await self.async_set_unique_id(url.lower())
            self._abort_if_unique_id_configured()

            try:
                await async_fetch_status(self.hass, url)
            except CasaBoardApiError:
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(
                    title=user_input.get(CONF_SIDEBAR_TITLE) or DEFAULT_SIDEBAR_TITLE,
                    data={
                        CONF_URL: url,
                        CONF_SIDEBAR_TITLE: user_input.get(
                            CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE
                        ),
                        CONF_SIDEBAR_ICON: user_input.get(
                            CONF_SIDEBAR_ICON, DEFAULT_SIDEBAR_ICON
                        ),
                        CONF_SCAN_INTERVAL: user_input.get(
                            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
                        ),
                    },
                )

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_DATA_SCHEMA,
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        """Return the options flow handler."""
        return CasaBoardOptionsFlow()


class CasaBoardOptionsFlow(OptionsFlow):
    """Handle CasaBoard options."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage CasaBoard options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        entry = self.config_entry
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_SIDEBAR_TITLE,
                        default=entry.options.get(
                            CONF_SIDEBAR_TITLE,
                            entry.data.get(CONF_SIDEBAR_TITLE, DEFAULT_SIDEBAR_TITLE),
                        ),
                    ): str,
                    vol.Optional(
                        CONF_SIDEBAR_ICON,
                        default=entry.options.get(
                            CONF_SIDEBAR_ICON,
                            entry.data.get(CONF_SIDEBAR_ICON, DEFAULT_SIDEBAR_ICON),
                        ),
                    ): str,
                    vol.Optional(
                        CONF_SCAN_INTERVAL,
                        default=entry.options.get(
                            CONF_SCAN_INTERVAL,
                            entry.data.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL),
                        ),
                    ): vol.All(
                        vol.Coerce(int),
                        vol.Range(min=MIN_SCAN_INTERVAL, max=MAX_SCAN_INTERVAL),
                    ),
                }
            ),
        )
