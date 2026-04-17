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
        <div className="text-center mb-12">
          <p className="text-violet-600 text-sm font-semibold uppercase tracking-wider mb-3">
            Why CasaBoard
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Powerful dashboards, without the trade-offs
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Privacy-first by design: Home Assistant credentials stay local unless you
            explicitly opt into cloud sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-md transition-all duration-300 bg-white border border-slate-100 shadow-sm"
            >
              <CardBody className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center group-hover:bg-violet-100 transition-colors duration-300">
                    <Icon
                      path={feature.icon}
                      className="w-6 h-6 text-violet-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
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
                      variant="light"
                      size="sm"
                      className="mt-2"
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

        <div className="mt-12">
          <div className="bg-violet-50 border border-violet-100 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Icon path={mdiCodeTags} className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No coding experience required
              </h3>
            </div>
            <p className="text-slate-500 text-base max-w-2xl mx-auto">
              CasaBoard is for everyone—from power users to newcomers. An intuitive
              drag-and-drop interface helps you create polished dashboards while your
              Home Assistant credentials stay under your control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
