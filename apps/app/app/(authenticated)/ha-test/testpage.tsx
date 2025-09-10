"use client";
import { UserSettings } from "@repo/types/userSettings";
import { Button } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiCheckCircle, mdiHomeAssistant } from "@mdi/js";
import Link from "next/link";
import { Test } from "@repo/ui/components/Test/index";

export interface TestPageProps {
  settings: UserSettings;
}

export const TestPage = ({ settings }: TestPageProps) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon
                path={mdiHomeAssistant}
                className="w-8 h-8 text-green-500 mr-3"
              />
              <div>
                <h1 className="text-3xl font-bold text-theme-text">
                  Home Assistant Test
                </h1>
                <p className="text-theme-text-secondary">
                  Testing connection to: {settings.hass_url}
                </p>
              </div>
            </div>
            <Link href="/setup">
              <Button variant="bordered">Back to Setup</Button>
            </Link>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-theme-secondary border border-theme-border rounded-lg p-6 mb-6">
          <div className="flex items-center text-green-600">
            <Icon path={mdiCheckCircle} className="w-6 h-6 mr-3" />
            <div>
              <div className="font-semibold">
                Successfully connected to Home Assistant!
              </div>
              <div className="text-sm text-green-500 mt-1">
                Using long-lived token authentication
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Configuration Details
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <strong>HA URL:</strong> {settings.hass_url}
            </div>
            <div>
              <strong>Token:</strong> ✓ Configured (encrypted)
            </div>
            <div>
              <strong>Authentication:</strong> Long-lived token
            </div>
          </div>
        </div>

        {/* Test Content */}
        <div className="bg-theme-secondary border border-theme-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-theme-text mb-4">
            Connection Test
          </h2>
          <p className="text-theme-text-secondary mb-4">
            Your Home Assistant integration is working correctly! The
            HassConnect component has successfully authenticated using your
            long-lived token.
          </p>
          <p className="text-theme-text-secondary mb-4">
            You will be able to see all binary sensor and light entities in the
            test components below.
          </p>
          <Test />
          <p className="text-theme-text-secondary my-6">
            You can now go back to setup and create dashboard pages with Home
            Assistant components.
          </p>
        </div>
      </div>
  );
}