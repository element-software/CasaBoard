"use client"
import { Card, CardBody, Button, Link } from "@heroui/react";
import { Icon } from "@mdi/react";
import { LinkService } from "@repo/lib";
import { mdiArrowRight, mdiCog } from "@mdi/js";

export const CTA = () => {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 border border-theme-primary/20">
        <CardBody className="p-12 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-theme-text mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-center text-theme-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Join smart home enthusiasts who want powerful dashboards without giving up control.
            Local-first Home Assistant credentials, with optional cloud sync when you choose it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-theme-primary text-black font-semibold px-8 py-3"
              endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
              href={LinkService.crossAppHref("app", "/auth/login")}
              as={Link}
            >
              Start Building Now
            </Button>
            <Button
              size="lg"
              variant="bordered"
              className="border-theme-primary text-theme-primary font-semibold px-8 py-3"
              startContent={<Icon path={mdiCog} className="w-5 h-5" />}
              href={LinkService.crossAppHref("public", "/about")}
              as={Link}
            >
              Learn More
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
