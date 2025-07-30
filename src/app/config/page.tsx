"use client";
import { useState } from "react";
import { DashboardConfig, SidebarConfig } from "@/config/dashboard.types";
import { dashboardConfig } from "@/config/dashboard.config";

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
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="weather.home"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <main className="flex h-screen p-8 bg-gray-900 text-white">
      <div className="flex w-full gap-8">
        {/* Configuration Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Dashboard Configuration</h1>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
                id="import-config"
              />
              <label
                htmlFor="import-config"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
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
          <div className="flex mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("pages")}
              className={`px-4 py-2 transition-colors ${
                activeTab === "pages"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Pages
            </button>
            <button
              onClick={() => setActiveTab("sidebar")}
              className={`px-4 py-2 transition-colors ${
                activeTab === "sidebar"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sidebar
            </button>
            <button
              onClick={() => setActiveTab("global")}
              className={`px-4 py-2 transition-colors ${
                activeTab === "global"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Global
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
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
                className="w-full h-full p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <textarea
                value={JSON.stringify(config.global || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const global = JSON.parse(e.target.value);
                    setConfig(prev => ({ ...prev, global }));
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full h-full p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                spellCheck={false}
                placeholder="Global configuration..."
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="w-1/2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview</h2>
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
              src={`/local/nextjs-dashboard/${selectedPage}`}
              className="w-full h-full border-none"
              title="Dashboard Preview"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
