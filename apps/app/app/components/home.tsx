"use client";
import { Button, Link, Card, CardBody } from "@heroui/react";
import { LinkService } from "@repo/lib";
import Icon from "@mdi/react";
import { mdiHomeAssistant, mdiShieldCheck, mdiPuzzle, mdiLightningBolt } from "@mdi/js";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border bg-theme-surface/60 backdrop-blur">
              <Icon path={mdiHomeAssistant} className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-theme-text-secondary">CasaBoard for Home Assistant</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-theme-text">
              Build beautiful dashboards for your smart home
            </h1>
            <p className="max-w-3xl mx-auto text-theme-text-secondary">
              CasaBoard lets you design, manage and share rich Home Assistant dashboards with a modern visual editor, powerful widgets and seamless device integration.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button as={Link} color="primary" className="px-6 text-base" href="/auth/login">
                Login
              </Button>
              <Button as={Link} variant="bordered" href={LinkService.crossAppHref("public", "/about")}>
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-6">
        <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border">
          <CardBody className="p-6 space-y-3">
            <Icon path={mdiPuzzle} className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold text-theme-text">Drag-and-drop editor</h3>
            <p className="text-theme-text-secondary text-sm">
              Compose pages with ready-made components for lights, sensors, graphs and more. No YAML required.
            </p>
          </CardBody>
        </Card>
        <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border">
          <CardBody className="p-6 space-y-3">
            <Icon path={mdiLightningBolt} className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold text-theme-text">Live Home Assistant data</h3>
            <p className="text-theme-text-secondary text-sm">
              Connect to your HA instance securely and control devices in real time from any page.
            </p>
          </CardBody>
        </Card>
        <Card className="bg-theme-surface/60 backdrop-blur border border-theme-border">
          <CardBody className="p-6 space-y-3">
            <Icon path={mdiShieldCheck} className="w-8 h-8 text-primary" />
            <h3 className="text-lg font-semibold text-theme-text">Profiles & permissions</h3>
            <p className="text-theme-text-secondary text-sm">
              Sign in, manage your pages and share safely. Subscriptions unlock more dashboards and instances.
            </p>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
