"use client";

import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
  mdiGrid,
  mdiCheckCircle,
  mdiInformation,
  mdiLightbulb,
} from "@mdi/js";

export default function AboutPageContent() {
  return (
    <div>
      {/* About – Hero */}
      <section className="relative overflow-hidden mb-10 pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border bg-theme-surface/60 backdrop-blur">
              <Icon path={mdiInformation} className="w-4 h-4 text-primary" />
              <span className="text-sm text-theme-text-secondary">
                About CasaBoard
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-theme-text">
              A modern dashboard builder for Home Assistant
            </h1>
            <p className="max-w-3xl mx-auto text-theme-text-secondary">
              Design beautiful, responsive pages with a drag‑and‑drop editor and
              real‑time controls. Connect multiple Home Assistant instances,
              choose the right one per page, and share dashboards across your
              home.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="p-3 bg-theme-surface rounded-lg flex items-center gap-2 justify-center">
                <Icon path={mdiGrid} className="w-5 h-5 text-primary" />
                <span className="text-sm text-theme-text">
                  Drag‑and‑drop editor
                </span>
              </div>
              <div className="p-3 bg-theme-surface rounded-lg flex items-center gap-2 justify-center">
                <Icon
                  path={mdiHomeAssistant}
                  className="w-5 h-5 text-cyan-400"
                />
                <span className="text-sm text-theme-text">Live HA data</span>
              </div>
              <div className="p-3 bg-theme-surface rounded-lg flex items-center gap-2 justify-center">
                <Icon
                  path={mdiCheckCircle}
                  className="w-5 h-5 text-green-500"
                />
                <span className="text-sm text-theme-text">
                  Multi‑instance ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-theme-text mb-2">
            How to use CasaBoard
          </h2>
          <p className="text-theme-text-secondary">
            Follow this quick start and detailed steps to set up your smart home
            dashboard.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader className="bg-theme-primary/10">
            <div className="flex items-center gap-3">
              <Icon
                path={mdiLightbulb}
                className="w-6 h-6 text-theme-primary"
              />
              <h2 className="text-xl font-semibold text-theme-text">
                Quick Start Guide
              </h2>
            </div>
          </CardHeader>
          <CardBody className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                  1
                </div>
                <span className="text-sm font-medium text-theme-text">
                  Login with Google
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                  2
                </div>
                <span className="text-sm font-medium text-theme-text">
                  Connect Home Assistant
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                  3
                </div>
                <span className="text-sm font-medium text-theme-text">
                  Create Your First Page
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                  4
                </div>
                <span className="text-sm font-medium text-theme-text">
                  Add Components
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-theme-surface/60 border border-theme-border rounded-xl p-6 text-center">
            <p className="text-theme-text-secondary">
              Looking for the full guide?
            </p>
            <Button as={Link} href="/docs" color="primary" className="mt-3">
              Open documentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
