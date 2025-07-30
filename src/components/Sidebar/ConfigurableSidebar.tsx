"use client";
import { EntityName } from "@hakit/core";
import Clock from "@/components/Clock";
import { WeatherCard } from "@hakit/components";
import Thermostat from "@/components/Thermostat";
import Image from "next/image";
import { SidebarConfig } from "@/config/dashboard.types";

interface ConfigurableSidebarProps {
  children: React.ReactNode;
  config: SidebarConfig;
}

export const ConfigurableSidebar = ({ children, config }: ConfigurableSidebarProps) => {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col gap-y-5 overflow-y-auto p-8 pb-4">
            {config.showClock && (
              <div className="flex flex-col">
                <Clock />
              </div>
            )}
            
            {config.showWeather && (
              <div className="flex flex-1 flex-col w-full">
                <WeatherCard
                  entity={config.weather as `weather.${string}`}
                  className="w-full bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-2xl shadow-card shadow-neutral-800"
                  onlyFunctionality
                  disableRipples
                  disableScale
                  disableActiveState
                  cssStyles={`
                    .button-group, h4.title {
                      display: none;
                    },
                    .icon {
                      color: #FA9703 !important;
                    }
                  `}
                  xlg={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  xxs={12}
                  apparentTemperatureAttribute="temperature"
                />
              </div>
            )}
            
            {config.showThermostat && (
              <div className="flex flex-1 flex-col w-full">
                <Thermostat entityId={config.thermostat as EntityName}/>
              </div>
            )}
            
            {config.showBranding && (
              <div className="flex flex-1 flex-row w-full text-center items-center justify-center gap-2 text-white text-xs">
                {config.brandingText}
                {config.brandingImage && (
                  <Image 
                    src={config.brandingImage} 
                    alt="branding" 
                    width={100} 
                    height={100} 
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute bg-neutral-900 left-0 top-0 w-screen h-screen opacity-35" style={{ zIndex: "-1" }} />
            <div className="lg:pl-64">
              {children}
          </div>
        </div>
      </div>
    </>
  );
};
