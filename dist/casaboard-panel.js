// Home Assistant custom panel: embeds a self-hosted CasaBoard instance via iframe.
// Home Assistant sets `panel` (with `panel.config` = the `config:` block from
// panel_custom in configuration.yaml) and `hass` as properties, not via setConfig
// (setConfig is the Lovelace *card* API, not the panel API).
class CasaboardPanel extends HTMLElement {
  set panel(panel) {
    this._config = (panel && panel.config) || {};
    this._render();
  }

  set hass(_hass) {
    // CasaBoard talks to Home Assistant directly (its own stored connection),
    // so no hass state needs to be forwarded into the iframe.
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    if (!this._config || this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host { display: block; width: 100%; height: 100%; }
      iframe { width: 100%; height: 100%; border: 0; display: block; }
    `;

    const iframe = document.createElement("iframe");
    iframe.src = this._config.url;
    iframe.title = "CasaBoard";

    shadow.append(style, iframe);
  }
}

customElements.define("casaboard-panel", CasaboardPanel);
