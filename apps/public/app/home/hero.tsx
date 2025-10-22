"use client"
import { Button, Link } from "@heroui/react"
import { Icon } from "@mdi/react"
import { LinkService } from "@repo/lib"
import { CasaBoardLogo } from "@repo/ui/components/Logo/index"
import { mdiArrowRight } from "@mdi/js"

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
      Cloud-Hosted Smart Home Dashboard
    </p>
    <p className="text-lg text-theme-text-secondary mb-12 max-w-4xl mx-auto">
      Create beautiful, customizable dashboards for your Home Assistant
      setup. Drag, drop, and design your perfect smart home interface with
      ease.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
  </div>
  )
}