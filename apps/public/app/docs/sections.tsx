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
import React from "react";

export interface DocSection {
  slug: string;
  title: string;
  icon?: string;
  Content: React.FC;
}

const DocCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-8 bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden ${className ?? ""}`}>
    {children}
  </div>
);

const DocCardHeader = ({ icon, iconClass, title }: { icon: string; iconClass: string; title: string }) => (
  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
    <Icon path={icon} className={`w-5 h-5 ${iconClass}`} />
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
  </div>
);

const StepItem = ({ number, title, text }: { number: number; title: string; text: string }) => (
  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
    <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-600 text-sm">{text}</p>
    </div>
  </div>
);

const QuickStart: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiLightbulb} iconClass="text-violet-600" title="Quick Start Guide" />
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Login with Google", "Connect Home Assistant", "Create Your First Page", "Add Components"].map(
          (label, idx) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {idx + 1}
              </div>
              <span className="text-sm font-medium text-slate-900">{label}</span>
            </div>
          )
        )}
      </div>
    </div>
  </DocCard>
);

const GoogleOAuth: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiGoogle} iconClass="text-blue-500" title="1. Google OAuth Login" />
    <div className="p-6 space-y-3">
      <p className="text-slate-600">
        CasaBoard uses Google OAuth for secure authentication. Follow these steps to set up your account:
      </p>
      {[
        { title: "Access the Login Page", text: 'Navigate to the login page and click "Continue with Google".' },
        { title: "Google Account Selection", text: "Choose the Google account you want to use for CasaBoard. This will be your primary account for accessing the dashboard." },
        { title: "Grant Permissions", text: "Review and accept the permissions requested by CasaBoard. This allows secure access to your account." },
        { title: "Complete Authentication", text: "Once authenticated, you'll be redirected back to CasaBoard and can start setting up your dashboard." },
      ].map((step, i) => (
        <StepItem key={step.title} number={i + 1} title={step.title} text={step.text} />
      ))}
    </div>
  </DocCard>
);

const HAConnection: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiHomeAssistant} iconClass="text-cyan-500" title="2. Home Assistant Connection" />
    <div className="p-6 space-y-3">
      <p className="text-slate-600">
        Connect your Home Assistant instance to CasaBoard to start building your dashboard:
      </p>
      {[
        { title: "Get Your HA URL", text: "Find your Home Assistant URL (e.g. http://homeassistant.local:8123 or https://your-domain.com)" },
        { title: "Add it to the HA Instance section", text: "Once you add it, CasaBoard will let you know you'll be redirected to your Home Assistant instance." },
        { title: "Login to your Home Assistant instance", text: "Once you're logged in to your Home Assistant instance, you'll be redirected to CasaBoard and can start building your dashboard." },
      ].map((step, i) => (
        <StepItem key={step.title} number={i + 1} title={step.title} text={step.text} />
      ))}
    </div>
  </DocCard>
);

const CreateFirstPage: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiGrid} iconClass="text-purple-500" title="3. Creating Your First Page" />
    <div className="p-6 space-y-3">
      <p className="text-slate-600">Now you&apos;re ready to create your first dashboard page:</p>
      {[
        { title: "Go to Pages Management", text: "Navigate to Setup → Pages Management to see your dashboard pages." },
        { title: "Create New Page", text: 'Click "Create New Page" and give your page a name (e.g., "Living Room", "Kitchen", "Overview").' },
        { title: "Open Page Editor", text: "Click the edit button (pencil icon) next to your new page to open the drag-and-drop editor." },
      ].map((step, i) => (
        <StepItem key={step.title} number={i + 1} title={step.title} text={step.text} />
      ))}
    </div>
  </DocCard>
);

const AddingComponents: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiDrag} iconClass="text-orange-500" title="4. Adding Components" />
    <div className="p-6 space-y-6">
      <p className="text-slate-600">Use the drag-and-drop interface to add components to your dashboard:</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Available Components:</h3>
          <div className="space-y-3">
            {[
              { icon: mdiLightbulb, label: "Lights" },
              { icon: mdiCog, label: "Switches" },
              { icon: mdiGrid, label: "Entity Cards" },
              { icon: mdiInformation, label: "Sensors" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Icon path={c.icon} className="w-5 h-5 text-violet-600" />
                <span className="text-sm text-slate-900">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">How to Add:</h3>
          {["Drag from the left panel to your page", "Configure properties", "Choose the HA entity", "Customize appearance"].map(
            (txt, i) => (
              <div key={txt} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-600">{txt}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  </DocCard>
);

const Tips: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiInformation} iconClass="text-blue-500" title="Tips and Best Practices" />
    <div className="p-6 grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Organisation</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {[
            "Create separate pages for different rooms or functions",
            "Use descriptive names for your pages and components",
            "Group related components together",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Performance</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {[
            "Don't overload pages with too many components",
            "Use entity cards for multiple related entities",
            "Test your dashboard on mobile devices",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2">
              <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </DocCard>
);

const Troubleshooting: React.FC = () => (
  <DocCard>
    <DocCardHeader icon={mdiAlertCircle} iconClass="text-red-500" title="Troubleshooting" />
    <div className="p-6 space-y-4">
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
        <h3 className="font-semibold text-red-700 mb-2">Connection Issues</h3>
        <ul className="text-sm text-red-700 space-y-1 ml-4">
          <li>• Check that your HA URL is correct and accessible</li>
          <li>• Verify your access token is valid and not expired</li>
          <li>• Ensure your HA instance is running and accessible</li>
          <li>• Check your network connection</li>
        </ul>
      </div>
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
        <h3 className="font-semibold text-amber-700 mb-2">Component Issues</h3>
        <ul className="text-sm text-amber-700 space-y-1 ml-4">
          <li>• Verify the entity ID is correct in Home Assistant</li>
          <li>• Check that the entity is available and not disabled</li>
          <li>• Try refreshing the page or reconnecting to HA</li>
          <li>• Check the browser console for error messages</li>
        </ul>
      </div>
    </div>
  </DocCard>
);

const Help: React.FC = () => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
      <Icon path={mdiEye} className="w-5 h-5 text-indigo-500" />
      <h2 className="text-lg font-semibold text-slate-900">Getting Help</h2>
    </div>
    <div className="p-6 grid gap-4 sm:grid-cols-2">
      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
        <p className="text-sm text-slate-600">
          Send an email to{" "}
          <a href="mailto:support@casaboard.dev" className="text-violet-600 hover:underline">
            support@casaboard.dev
          </a>
        </p>
      </div>
      <div className="p-4 bg-slate-50 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-2">Community Support</h3>
        <p className="text-sm text-slate-600">Coming soon</p>
      </div>
    </div>
  </div>
);

export const sections: DocSection[] = [
  { slug: "quick-start", title: "Quick Start", icon: mdiLightbulb, Content: QuickStart },
  { slug: "google-login", title: "Google OAuth Login", icon: mdiGoogle, Content: GoogleOAuth },
  { slug: "ha-connection", title: "Home Assistant Connection", icon: mdiHomeAssistant, Content: HAConnection },
  { slug: "first-page", title: "Creating Your First Page", icon: mdiGrid, Content: CreateFirstPage },
  { slug: "components", title: "Adding Components", icon: mdiDrag, Content: AddingComponents },
  { slug: "tips", title: "Tips & Best Practices", icon: mdiInformation, Content: Tips },
  { slug: "troubleshooting", title: "Troubleshooting", icon: mdiAlertCircle, Content: Troubleshooting },
  { slug: "help", title: "Getting Help", icon: mdiEye, Content: Help },
];
