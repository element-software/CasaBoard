"use client";

import Icon from "@mdi/react";
import {
  mdiGoogle,
  mdiHomeAssistant,
  mdiGrid,
  mdiDrag,
  mdiInformation,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiCog,
  mdiLightbulb,
  mdiEye,
} from "@mdi/js";
import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

export interface DocSection {
  slug: string;
  title: string;
  icon?: string;
  Content: React.FC;
}

const QuickStart: React.FC = () => (
  <Card className="mb-8">
    <CardHeader className="bg-theme-primary/10">
      <div className="flex items-center gap-3">
        <Icon path={mdiLightbulb} className="w-6 h-6 text-theme-primary" />
        <h2 className="text-xl font-semibold text-theme-text">
          Quick Start Guide
        </h2>
      </div>
    </CardHeader>
    <CardBody className="pt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Login with Google",
          "Connect Home Assistant",
          "Create Your First Page",
          "Add Components",
        ].map((label, idx) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg"
          >
            <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
              {idx + 1}
            </div>
            <span className="text-sm font-medium text-theme-text">{label}</span>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const GoogleOAuth: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiGoogle} className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-theme-text">
          1. Google OAuth Login
        </h2>
      </div>
    </CardHeader>
    <CardBody className="space-y-4">
      <p className="text-theme-text-secondary">
        CasaBoard uses Google OAuth for secure authentication. Follow these
        steps to set up your account:
      </p>
      {[
        {
          title: "Access the Login Page",
          text: 'Navigate to the login page and click "Continue with Google".',
        },
        {
          title: "Google Account Selection",
          text: "Choose the Google account you want to use for CasaBoard. This will be your primary account for accessing the dashboard.",
        },
        {
          title: "Grant Permissions",
          text: "Review and accept the permissions requested by CasaBoard. This allows secure access to your account.",
        },
        {
          title: "Complete Authentication",
          text: "Once authenticated, you'll be redirected back to CasaBoard and can start setting up your dashboard.",
        },
      ].map((step, i) => (
        <div
          key={step.title}
          className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg"
        >
          <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div>
            <h3 className="font-semibold text-theme-text mb-2">{step.title}</h3>
            <p className="text-theme-text-secondary text-sm">{step.text}</p>
          </div>
        </div>
      ))}
    </CardBody>
  </Card>
);

const HAConnection: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiHomeAssistant} className="w-6 h-6 text-cyan-400" />
        <h2 className="text-xl font-semibold text-theme-text">
          2. Home Assistant Connection
        </h2>
      </div>
    </CardHeader>
    <CardBody className="space-y-4">
      <p className="text-theme-text-secondary">
        Connect your Home Assistant instance to CasaBoard to start building your
        dashboard:
      </p>
      {[
        {
          title: "Get Your HA URL",
          text: "Find your Home Assistant URL (e.g. http://homeassistant.local:8123 or https://your-domain.com)",
        },
        {
          title: "Create a Long‑Lived Access Token",
          text: 'In Home Assistant, go to Profile → Long-lived access tokens → Create token. Give it a name like "CasaBoard" and copy the token.',
        },
        {
          title: "Enter Connection Details",
          text: "In CasaBoard, go to Setup → Home Assistant Configuration and enter your HA URL and access token.",
        },
        {
          title: "Test Connection",
          text: 'Click "Test Connection" to verify that CasaBoard can connect to your Home Assistant instance.',
        },
      ].map((step, i) => (
        <div
          key={step.title}
          className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg"
        >
          <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div>
            <h3 className="font-semibold text-theme-text mb-2">{step.title}</h3>
            <p className="text-theme-text-secondary text-sm">{step.text}</p>
          </div>
        </div>
      ))}
    </CardBody>
  </Card>
);

const CreateFirstPage: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiGrid} className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-semibold text-theme-text">
          3. Creating Your First Page
        </h2>
      </div>
    </CardHeader>
    <CardBody className="space-y-4">
      <p className="text-theme-text-secondary">
        Now you're ready to create your first dashboard page:
      </p>
      {[
        {
          title: "Go to Pages Management",
          text: "Navigate to Setup → Pages Management to see your dashboard pages.",
        },
        {
          title: "Create New Page",
          text: 'Click "Create New Page" and give your page a name (e.g., "Living Room", "Kitchen", "Overview").',
        },
        {
          title: "Open Page Editor",
          text: "Click the edit button (pencil icon) next to your new page to open the drag-and-drop editor.",
        },
      ].map((step, i) => (
        <div
          key={step.title}
          className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg"
        >
          <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
            {i + 1}
          </div>
          <div>
            <h3 className="font-semibold text-theme-text mb-2">{step.title}</h3>
            <p className="text-theme-text-secondary text-sm">{step.text}</p>
          </div>
        </div>
      ))}
    </CardBody>
  </Card>
);

const AddingComponents: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiDrag} className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold text-theme-text">
          4. Adding Components
        </h2>
      </div>
    </CardHeader>
    <CardBody className="space-y-6">
      <p className="text-theme-text-secondary">
        Use the drag-and-drop interface to add components to your dashboard:
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-theme-text">
            Available Components:
          </h3>
          <div className="space-y-3">
            {[
              { icon: mdiLightbulb, label: "Lights" },
              { icon: mdiCog, label: "Switches" },
              { icon: mdiGrid, label: "Entity Cards" },
              { icon: mdiInformation, label: "Sensors" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg"
              >
                <Icon path={c.icon} className="w-5 h-5 text-theme-primary" />
                <span className="text-sm text-theme-text">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-theme-text">How to Add:</h3>
          {[
            "Drag from the left panel to your page",
            "Configure properties",
            "Choose the HA entity",
            "Customize appearance",
          ].map((txt, i) => (
            <div key={txt} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-theme-text-secondary">{txt}</p>
            </div>
          ))}
        </div>
      </div>
    </CardBody>
  </Card>
);

const Tips: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiInformation} className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-theme-text">
          Tips and Best Practices
        </h2>
      </div>
    </CardHeader>
    <CardBody className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-theme-text mb-3">Organization</h3>
        <ul className="space-y-2 text-sm text-theme-text-secondary">
          {[
            "Create separate pages for different rooms or functions",
            "Use descriptive names for your pages and components",
            "Group related components together",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Icon
                path={mdiCheckCircle}
                className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
              />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-theme-text mb-3">Performance</h3>
        <ul className="space-y-2 text-sm text-theme-text-secondary">
          {[
            "Don't overload pages with too many components",
            "Use entity cards for multiple related entities",
            "Test your dashboard on mobile devices",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Icon
                path={mdiCheckCircle}
                className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
              />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </CardBody>
  </Card>
);

const Troubleshooting: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiAlertCircle} className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-semibold text-theme-text">
          Troubleshooting
        </h2>
      </div>
    </CardHeader>
    <CardBody className="space-y-4">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Connection Issues</h3>
        <ul className="text-sm text-red-700 space-y-1 ml-4">
          <li>• Check that your HA URL is correct and accessible</li>
          <li>• Verify your access token is valid and not expired</li>
          <li>• Ensure your HA instance is running and accessible</li>
          <li>• Check your network connection</li>
        </ul>
      </div>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Component Issues</h3>
        <ul className="text-sm text-yellow-700 space-y-1 ml-4">
          <li>• Verify the entity ID is correct in Home Assistant</li>
          <li>• Check that the entity is available and not disabled</li>
          <li>• Try refreshing the page or reconnecting to HA</li>
          <li>• Check the browser console for error messages</li>
        </ul>
      </div>
    </CardBody>
  </Card>
);

const Help: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        <Icon path={mdiEye} className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-theme-text">Getting Help</h2>
      </div>
    </CardHeader>
    <CardBody className="grid gap-4 sm:grid-cols-2">
      <div className="p-4 bg-theme-surface rounded-lg">
        <h3 className="font-semibold text-theme-text mb-2">Email</h3>
        <p className="text-sm text-theme-text-secondary">
          Send an email to{" "}
          <a href="mailto:support@casaboard.dev" className="text-theme-primary">
            support@casaboard.com
          </a>
        </p>
      </div>
      <div className="p-4 bg-theme-surface rounded-lg">
        <h3 className="font-semibold text-theme-text mb-2">
          Community Support
        </h3>
        <p className="text-sm text-theme-text-secondary">
          Coming soon
        </p>
      </div>
    </CardBody>
  </Card>
);

export const sections: DocSection[] = [
  {
    slug: "quick-start",
    title: "Quick Start",
    icon: mdiLightbulb,
    Content: QuickStart,
  },
  {
    slug: "google-login",
    title: "Google OAuth Login",
    icon: mdiGoogle,
    Content: GoogleOAuth,
  },
  {
    slug: "ha-connection",
    title: "Home Assistant Connection",
    icon: mdiHomeAssistant,
    Content: HAConnection,
  },
  {
    slug: "first-page",
    title: "Creating Your First Page",
    icon: mdiGrid,
    Content: CreateFirstPage,
  },
  {
    slug: "components",
    title: "Adding Components",
    icon: mdiDrag,
    Content: AddingComponents,
  },
  {
    slug: "tips",
    title: "Tips & Best Practices",
    icon: mdiInformation,
    Content: Tips,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    icon: mdiAlertCircle,
    Content: Troubleshooting,
  },
  { slug: "help", title: "Getting Help", icon: mdiEye, Content: Help },
];
