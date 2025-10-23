"use client";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiCloud,
  mdiDrag,
  mdiPalette,
  mdiCodeTags,
  mdiAccountGroup,
  mdiCog,
  mdiShield,
  mdiRocket,
} from "@mdi/js";
import Link from "next/link";

interface WhyFeature {
  icon: any;
  title: string;
  description: string;
  highlight: string;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
  cta?: {
    text: string;
    href: string;
  }
}

const whyFeatures: WhyFeature[] = [
  {
    icon: mdiCloud,
    title: "Cloud-Native",
    description: "No need for locally installed dashboards on Home Assistant. Access your dashboard from anywhere, anytime.",
    highlight: "Always Available",
    color: "primary"
  },
  {
    icon: mdiDrag,
    title: "Drag & Drop Editor",
    description: "Customizable interface that requires no coding experience. Build beautiful dashboards with simple drag and drop.",
    highlight: "No Code Required",
    color: "success"
  },
  {
    icon: mdiAccountGroup,
    title: "Community-Driven",
    description: "Features and improvements are driven by the community and users. Your feedback shapes the platform.",
    highlight: "User-Powered",
    color: "secondary"
  },
  {
    icon: mdiPalette,
    title: "Advanced Theming",
    description: "Complete customization with themes, layouts, and visual elements. Make it truly yours. Planned for the future.",
    highlight: "Fully Customizable",
    color: "warning"
  },
  {
    icon: mdiShield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with encrypted connections and OAuth authentication. Your data is safe.",
    highlight: "Enterprise Security",
    color: "success",
    cta: {
      text: "Learn More",
      href: "/security"
    }
  },
  {
    icon: mdiRocket,
    title: "Easy Setup",
    description: "Get up and running in minutes with our streamlined setup process. No complex configurations needed.",
    highlight: "Quick Start",
    color: "primary",
    cta: {
      text: "View docs",
      href: "/docs"
    }
  }
];

export const Why = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-theme-text mb-4">
            Why Choose CasaBoard?
          </h2>
          <p className="text-xl text-theme-text-secondary max-w-3xl mx-auto">
            The modern way to manage your smart home with powerful features, 
            beautiful design, and zero technical complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 bg-theme-surface/50 backdrop-blur-sm border border-secondary hover:border-theme-primary/30"
            >
              <CardBody className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-theme-primary/20 to-theme-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon 
                      path={feature.icon} 
                      className="w-8 h-8 text-theme-primary" 
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-theme-text group-hover:text-theme-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-theme-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Highlight Chip */}
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

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-theme-primary/10 to-theme-accent/10 border border-theme-primary/20">
            <CardBody className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon path={mdiCodeTags} className="w-6 h-6 text-theme-primary" />
                <h3 className="text-2xl font-bold text-theme-text">
                  No Coding Experience Required
                </h3>
              </div>
              <p className="text-theme-text-secondary text-lg max-w-2xl mx-auto">
                CasaBoard is designed for everyone. Whether you're a tech enthusiast or just getting started 
                with smart home automation, our intuitive drag-and-drop interface makes it easy to create 
                professional-looking dashboards.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};