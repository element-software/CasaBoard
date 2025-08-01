"use client";
import { useState } from "react";
import classNames from "classnames";
import { DashboardConfig, SidebarConfig, GlobalConfig } from "@/config/dashboard.types";
import { dashboardConfig } from "@/config/dashboard.config";
import { predefinedThemes } from "@/config/themes";

export default function ConfigEditor() {
  const [config, setConfig] = useState<DashboardConfig>(dashboardConfig);
  const [selectedPage, setSelectedPage] = useState<string>("kitchen");
  const [activeTab, setActiveTab] = useState<"pages" | "sidebar" | "global">("pages");

  const handleSidebarConfigChange = (newSidebarConfig: SidebarConfig) => {
    setConfig(prev => ({
      ...prev,
      sidebar: newSidebarConfig
    }));
  };

  const handleGlobalConfigChange = (newGlobalConfig: GlobalConfig) => {
    setConfig(prev => ({
      ...prev,
      global: newGlobalConfig
    }));
  };

  const exportConfig = () => {
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          setConfig(parsed);
        } catch (error) {
          console.error("Invalid JSON file:", error);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const renderSidebarForm = () => {
    const sidebarConfig = config.sidebar || {
      thermostat: "climate.central_heating_and_hot_water_tank_heat",
      weather: "weather.home",
      showClock: true,
      showWeather: true,
      showThermostat: true,
      showBranding: true,
      brandingImage: "",
      brandingText: "Powered by",
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Thermostat Entity</label>
          <input
            type="text"
            value={sidebarConfig.thermostat}
            onChange={(e) => handleSidebarConfigChange({
              ...sidebarConfig,
              thermostat: e.target.value as any
            })}
            className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary"
            placeholder="climate.your_thermostat"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Weather Entity</label>
          <input
            type="text"
            value={sidebarConfig.weather}
            onChange={(e) => handleSidebarConfigChange({
              ...sidebarConfig,
              weather: e.target.value as any
            })}
            className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary"
            placeholder="weather.home"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sidebarConfig.showClock}
              onChange={(e) => handleSidebarConfigChange({
                ...sidebarConfig,
                showClock: e.target.checked
              })}
              className="rounded bg-gray-800 border-gray-700"
            />
            <span>Show Clock</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sidebarConfig.showWeather}
              onChange={(e) => handleSidebarConfigChange({
                ...sidebarConfig,
                showWeather: e.target.checked
              })}
              className="rounded bg-gray-800 border-gray-700"
            />
            <span>Show Weather</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sidebarConfig.showThermostat}
              onChange={(e) => handleSidebarConfigChange({
                ...sidebarConfig,
                showThermostat: e.target.checked
              })}
              className="rounded bg-gray-800 border-gray-700"
            />
            <span>Show Thermostat</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sidebarConfig.showBranding}
              onChange={(e) => handleSidebarConfigChange({
                ...sidebarConfig,
                showBranding: e.target.checked
              })}
              className="rounded bg-gray-800 border-gray-700"
            />
            <span>Show Branding</span>
          </label>
        </div>

        {sidebarConfig.showBranding && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Branding Text</label>
              <input
                type="text"
                value={sidebarConfig.brandingText || ""}
                onChange={(e) => handleSidebarConfigChange({
                  ...sidebarConfig,
                  brandingText: e.target.value
                })}
                className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="Powered by"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Branding Image URL</label>
              <input
                type="text"
                value={sidebarConfig.brandingImage || ""}
                onChange={(e) => handleSidebarConfigChange({
                  ...sidebarConfig,
                  brandingImage: e.target.value
                })}
                className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderGlobalForm = () => {
    const globalConfig = config.global || {
      theme: "dark",
      enableThemeSwitch: true,
      defaultIcons: {
        light: "mdiLightbulb",
        alarm: "mdiShieldHome",
        binary_sensor: "mdiSensorOn",
        sensor: "mdiGauge",
      },
    };

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select
            value={globalConfig.theme || "dark"}
            onChange={(e) => handleGlobalConfigChange({
              ...globalConfig,
              theme: e.target.value
            })}
            className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            {Object.entries(predefinedThemes).map(([themeKey, themeConfig]) => (
              <option key={themeKey} value={themeKey}>
                {themeConfig.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={globalConfig.enableThemeSwitch ?? true}
              onChange={(e) => handleGlobalConfigChange({
                ...globalConfig,
                enableThemeSwitch: e.target.checked
              })}
              className="rounded bg-gray-800 border-gray-700"
            />
            <span>Enable Theme Switch</span>
          </label>
          <p className="text-sm text-gray-400 mt-1">
            Allow users to change themes via the theme switcher in the UI
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Default Icons</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(globalConfig.defaultIcons || {}).map(([entityType, iconName]) => (
              <div key={entityType}>
                <label className="block text-xs text-gray-400 mb-1 capitalize">
                  {entityType.replace('_', ' ')}
                </label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => handleGlobalConfigChange({
                    ...globalConfig,
                    defaultIcons: {
                      ...globalConfig.defaultIcons,
                      [entityType]: e.target.value
                    }
                  })}
                  className="w-full p-2 bg-theme-surface border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary text-sm"
                  placeholder="mdiIcon"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Raw JSON Configuration</label>
          <textarea
            value={JSON.stringify(globalConfig, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleGlobalConfigChange(parsed);
              } catch (error) {
                // Invalid JSON, ignore
              }
            }}
            className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
            placeholder="Advanced configuration..."
          />
        </div>
      </div>
    );
  };

  return (
    <main className="flex flex-col min-h-screen p-4 sm:p-6 lg:p-8 bg-theme-background text-theme-text">
      <div className="flex flex-col xl:flex-row w-full gap-4 lg:gap-8 h-full">
        {/* Configuration Editor */}
        <div className="flex flex-col xl:w-1/2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard Configuration</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
                id="import-config"
              />
              <label
                htmlFor="import-config"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer text-center"
              >
                Import Config
              </label>
              <button
                onClick={exportConfig}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Export Config
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-4 border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab("pages")}
              className={classNames(
                "px-4 py-2 transition-colors whitespace-nowrap",
                {
                  "text-blue-400 border-b-2 border-blue-400": activeTab === "pages",
                  "text-theme-text-secondary hover:text-theme-text": activeTab !== "pages"
                }
              )}
            >
              Pages
            </button>
            <button
              onClick={() => setActiveTab("sidebar")}
              className={classNames(
                "px-4 py-2 transition-colors whitespace-nowrap",
                {
                  "text-blue-400 border-b-2 border-blue-400": activeTab === "sidebar",
                  "text-theme-text-secondary hover:text-theme-text": activeTab !== "sidebar"
                }
              )}
            >
              Sidebar
            </button>
            <button
              onClick={() => setActiveTab("global")}
              className={classNames(
                "px-4 py-2 transition-colors whitespace-nowrap",
                {
                  "text-blue-400 border-b-2 border-blue-400": activeTab === "global",
                  "text-theme-text-secondary hover:text-theme-text": activeTab !== "global"
                }
              )}
            >
              Global
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 min-h-[300px] lg:min-h-[500px]">
            {activeTab === "pages" && (
              <textarea
                value={JSON.stringify(config.pages, null, 2)}
                onChange={(e) => {
                  try {
                    const pages = JSON.parse(e.target.value);
                    setConfig(prev => ({ ...prev, pages }));
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full h-full p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
                placeholder="Pages configuration..."
              />
            )}

            {activeTab === "sidebar" && (
              <div className="h-full overflow-y-auto p-4 bg-gray-800 border border-gray-700 rounded-lg">
                {renderSidebarForm()}
              </div>
            )}

            {activeTab === "global" && (
              <div className="h-full overflow-y-auto p-4 bg-gray-800 border border-gray-700 rounded-lg">
                {renderGlobalForm()}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col xl:w-1/2 min-h-[400px] lg:min-h-[600px]">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h2 className="text-lg sm:text-xl font-bold">Preview</h2>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(config.pages).map((pageName) => (
                <option key={pageName} value={pageName}>
                  {config.pages[pageName].title.value}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
            <iframe
              src={`${selectedPage}`}
              className="w-full h-full border-none"
              title="Dashboard Preview"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
