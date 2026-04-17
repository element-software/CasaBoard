"use client";
import { Button, Link } from "@heroui/react";
import { Icon } from "@mdi/react";
import { LinkService } from "@repo/lib";
import { CasaBoardLogo } from "@repo/ui/components/Logo/index";
import { mdiArrowRight } from "@mdi/js";

export const Hero = () => {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-6">
        <CasaBoardLogo size="large" />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-theme-text mb-6">
        CasaBoard
      </h1>
      <p className="text-xl md:text-2xl text-theme-text-secondary mb-8 max-w-3xl mx-auto">
        Privacy-first smart home dashboards
      </p>
      <p className="text-lg text-theme-text-secondary mb-12 max-w-4xl mx-auto">
        Build beautiful dashboards for Home Assistant with a drag-and-drop editor. By default,
        your Home Assistant URL and tokens stay on your device—never on our database. Your layouts
        and pages sync through CasaBoard so you can edit and publish from anywhere. Prefer the
        cloud? Paid plans can opt in to sync your HA connection details across devices.
      </p>
      <p className="text-xs pb-6 w-full">
        Currently under development, so expect some bugs! FREE to use whilst in
        development - your trial will simply auto-renew when it ends. Please see {" "}
        <Link href="/terms" className="text-xs"> terms</Link> for more details.
      </p>
      <Button
        size="lg"
        className="bg-theme-primary text-black font-semibold px-8 py-3"
        endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
        href={LinkService.crossAppHref("app", "/auth/login")}
        as={Link}
      >
        Start 14-Day Free Trial
      </Button>
    </div>
  );
};
