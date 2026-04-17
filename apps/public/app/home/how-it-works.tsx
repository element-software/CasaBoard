"use client";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { mdiDrag, mdiEye, mdiGoogle, mdiHomeAssistant } from "@mdi/js";
import Icon from "@mdi/react";

const steps = [
  {
    title: "Sign Up",
    description: "Create an account with your Google account for secure authentication",
    icon: mdiGoogle,
  },
  {
    title: "Connect HA",
    description:
      "Sign in to Home Assistant from your browser. Tokens stay encrypted locally by default; optional paid cloud sync can store your HA URL if you want the same setup on every device.",
    icon: mdiHomeAssistant,
  },
  {
    title: "Design",
    description: "Drag and drop components to build your perfect dashboard",
    icon: mdiDrag,
  },
  {
    title: "Enjoy",
    description: "Access your beautiful dashboard from anywhere",
    icon: mdiEye,
  },
]

export const HowItWorks = () => {
  return (
    <Card className="mb-16 p-8">
      <CardHeader className="text-center flex flex-col pb-4">
        <h2 className="text-3xl font-bold text-theme-text">How It Works</h2>
        <p className="text-theme-text-secondary text-lg">
          Get a 14-day free trial with CasaBoard in just a few simple steps
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div className="text-center" key={index}>
            <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-theme-text mb-2">
              {step.title}
            </h3>
            <Icon path={step.icon} className="w-6 h-6 text-theme-primary mx-auto mb-4" />
            <p className="text-theme-text-secondary text-sm">
              {step.description}
            </p>
          </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
