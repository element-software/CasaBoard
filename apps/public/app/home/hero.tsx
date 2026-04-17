"use client";
import { Button, Chip, Link } from "@heroui/react";
import { Icon } from "@mdi/react";
import { LinkService } from "@repo/lib";
import { mdiArrowRight } from "@mdi/js";

export const Hero = () => {
  return (
    <div className="text-center pb-20 bg-gradient-to-b from-violet-50 via-violet-50/30 to-white px-8 pt-48 w-full">
      <div className="flex justify-center mb-6">
        <Chip
          variant="flat"
          className="bg-violet-100 text-violet-700 font-medium px-2"
          size="sm"
        >
          Privacy-first · Local by default
        </Chip>
      </div>
      <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
        <span className="bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">
          CasaBoard
        </span>
      </h1>
      <p className="text-2xl md:text-3xl font-medium text-slate-700 mb-5 max-w-2xl mx-auto leading-snug">
        Beautiful smart home dashboards for Home Assistant
      </p>
      <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
        Build drag-and-drop dashboards with your credentials staying on your device by default.
        Optional cloud sync available on paid plans.
      </p>
      <p className="text-xs pb-8 text-slate-400 max-w-xl mx-auto">
        Currently in development — free to use whilst we build.{" "}
        <Link href="/terms" className="text-xs text-violet-600 hover:underline">See terms</Link>
        {" "}for details.
      </p>
      <Button
        size="lg"
        color="primary"
        className="font-semibold px-8 shadow-lg shadow-violet-200"
        endContent={<Icon path={mdiArrowRight} className="w-5 h-5" />}
        href={LinkService.crossAppHref("app", "/auth/login")}
        as={Link}
      >
        Start 14-Day Free Trial
      </Button>
    </div>
  );
};
