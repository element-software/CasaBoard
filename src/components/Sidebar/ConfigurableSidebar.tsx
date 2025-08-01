"use client";
import { EntityName } from "@hakit/core";
import Clock from "@/components/Clock";
import { WeatherCard } from "@hakit/components";
import Thermostat from "@/components/Thermostat";
import Image from "next/image";
import { SidebarConfig } from "@/config/dashboard.types";
import { MobileHeader } from "@/components/Header/MobileHeader";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useState, useEffect } from "react";

interface ConfigurableSidebarProps {
  children: React.ReactNode;
  config: SidebarConfig;
}

export const ConfigurableSidebar = ({ children, config }: ConfigurableSidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const SidebarContent = () => (
    <div className="flex flex-col gap-y-5 overflow-y-auto p-8 pb-4 h-full">
      {config.showClock && (
        <div className="flex flex-col">
          <Clock />
        </div>
      )}
      
      {config.showWeather && (
        <div className="flex flex-1 flex-col w-full">
          <WeatherCard
            entity={config.weather as `weather.${string}`}
            className="w-full bg-gradient-to-br-theme text-theme-text rounded-2xl shadow-card shadow-theme-surface"
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
        <div className="flex flex-1 flex-row w-full text-center items-center justify-center gap-2 text-theme-text text-xs">
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
      
      {/* Theme switch for desktop */}
      <div className="mt-auto pt-4 border-t border-theme-border">
        <ThemeSwitch />
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-theme-background">
        {/* Mobile header */}
        <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* Mobile sidebar overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Overlay backdrop */}
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar panel */}
            <div className="relative flex flex-col w-80 max-w-sm bg-theme-background border-r border-theme-border">
              {/* Close button */}
              <div className="absolute top-1 right-1">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-theme-text hover:bg-theme-surface rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-theme-background border-r border-theme-border">
          <SidebarContent />
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          <div className="relative min-h-screen pt-24 lg:pt-0">
            <div className="absolute bg-theme-background left-0 top-0 w-full h-full opacity-35 pointer-events-none" style={{ zIndex: "-1" }} />
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
