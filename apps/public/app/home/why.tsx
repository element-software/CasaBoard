"use client";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiCloudOutline,
  mdiDrag,
  mdiPalette,
  mdiCodeTags,
  mdiAccountGroup,
  mdiShieldLock,
  mdiShield,
} from "@mdi/js";
import Link from "next/link";

interface WhyFeature {
  icon: string;
  title: string;
  description: string;
  highlight: string;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
  cta?: {
    text: string;
    href: string;
  };
}

const whyFeatures: WhyFeature[] = [
  {
    icon: mdiShieldLock,
    title: "Privacy-first & local",
    description:
      "By default your Home Assistant URL and OAuth tokens stay in your browser—encrypted—not on our servers. You stay in control of what leaves your device.",
    highlight: "Local by default",
    color: "success",
  },
  {
    icon: mdiCloudOutline,
    title: "Optional cloud sync",
    description:
      "On paid plans you can opt in to store your Home Assistant URL in the cloud so the same instance details follow you across browsers and devices. Tokens still stay local.",
    highlight: "You choose",
    color: "primary",
  },
  {
    icon: mdiDrag,
    title: "Drag & drop editor",
    description:
      "Build dashboards without code. Arrange cards and widgets with a simple drag-and-drop interface.",
    highlight: "No code required",
    color: "success",
  },
  {
    icon: mdiAccountGroup,
    title: "Community-driven",
    description:
      "Features and improvements are shaped by feedback from people who use CasaBoard every day.",
    highlight: "User-powered",
    color: "secondary",
  },
  {
    icon: mdiPalette,
    title: "Advanced theming",
    description:
      "Themes, layouts, and visual polish—roadmapped so your dashboards can look and feel like yours.",
    highlight: "Fully customizable",
    color: "warning",
  },
  {
    icon: mdiShield,
    title: "Secure connections",
    description:
      "Industry-standard encryption for tokens in the browser and secure OAuth with Home Assistant. Read how we approach security end to end.",
    highlight: "Built to protect",
    color: "success",
    cta: {
      text: "Security",
      href: "/security",
    },
  },
];

export const Why = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-theme-text mb-4">
            Why choose CasaBoard?
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            Privacy-first by design: Home Assistant credentials stay local unless you
            explicitly opt into cloud sync on a paid plan. Powerful dashboards without
            trading away control of your smart home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 bg-theme-surface/50 backdrop-blur-sm border border-secondary hover:border-theme-primary/30"
            >
              <CardBody className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-theme-primary/20 to-theme-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      path={feature.icon}
                      className="w-8 h-8 text-theme-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-theme-text group-hover:text-theme-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <Chip
                    color={feature.color}
                    variant="flat"
                    size="sm"
                    className="font-medium"
                  >
                    {feature.highlight}
                  </Chip>
                  {feature.cta && (
                    <Button
                      as={Link}
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="mt-4"
                      href={feature.cta.href}
                    >
                      {feature.cta.text}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 border border-theme-primary/20">
            <CardBody className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon path={mdiCodeTags} className="w-6 h-6 text-theme-primary" />
                <h3 className="text-2xl font-bold text-theme-text">
                  No coding experience required
                </h3>
              </div>
              <p className="text-theme-text-secondary text-lg max-w-2xl mx-auto">
                CasaBoard is for everyone—from power users to newcomers. An intuitive
                drag-and-drop interface helps you create polished dashboards while your
                Home Assistant credentials stay under your control.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
