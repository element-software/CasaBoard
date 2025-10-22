"use client"
import { Card, CardBody } from "@heroui/react";

import {
  mdiDrag,
  mdiShield,
  mdiCloud,
  mdiTablet,
  mdiPalette,
  mdiRocket,
} from "@mdi/js";
import Icon from "@mdi/react";

const featureCards = [
  {
    icon: mdiDrag,
    title: "Drag & Drop",
    text: "Build your dashboard with intuitive drag-and-drop components. No coding required.",
  },
  {
    icon: mdiPalette,
    title: "Customizable",
    text: "Choose from multiple themes and customize every aspect of your dashboard.",
  },
  {
    icon: mdiCloud,
    title: "Cloud Hosted",
    text: "Access your dashboard from anywhere with our secure cloud hosting.",
  },
  {
    icon: mdiTablet,
    title: "Mobile Ready",
    text: "Responsive design that works perfectly on all devices and screen sizes.",
  },
  {
    icon: mdiShield,
    title: "Secure",
    text: "Enterprise-grade security with encrypted connections and OAuth authentication.",
  },
  {
    icon: mdiRocket,
    title: "Fast Setup",
    text: "Get up and running in minutes with our streamlined setup process.",
  },
];

export const Features = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {featureCards.map(({ icon, title, text }) => (
        <Card
          key={title}
          className="bg-theme-surface/50 backdrop-blur-sm hover:bg-theme-background hover:cursor-pointer border border-secondary"
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-theme-primary/20 rounded-lg flex items-center justify-center">
                <Icon path={icon} className="w-6 h-6 text-theme-primary" />
              </div>
              <h3 className="text-xl font-semibold text-theme-text">{title}</h3>
            </div>
            <p className="text-theme-text-secondary">{text}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
