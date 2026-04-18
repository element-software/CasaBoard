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
  mdiCheck,
  mdiAlertDecagram,
} from "@mdi/js";
import React from "react";

export interface DocSection {
  slug: string;
  title: string;
  icon?: string;
  Content: React.FC;
}

// ── Shared primitives ────────────────────────────────────────────────────────

const SectionHeading = ({
  icon,
  iconBg,
  iconColor,
  label,
  title,
  intro,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  title: string;
  intro: string;
}) => (
  <div className="mb-10">
    <div className="flex items-start gap-4 mb-5">
      <div className={`p-2.5 rounded-xl ${iconBg} flex-shrink-0 mt-0.5`}>
        <Icon path={icon} className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
      </div>
    </div>
    <div className="pl-1 border-l-2 border-slate-100">
      <p className="text-slate-600 leading-relaxed pl-4">{intro}</p>
    </div>
  </div>
);

const TimelineStep = ({
  number,
  title,
  text,
  isLast = false,
}: {
  number: number;
  title: string;
  text: string;
  isLast?: boolean;
}) => (
  <div className="flex gap-5">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-violet-200">
        {number}
      </div>
      {!isLast && <div className="w-px flex-1 bg-slate-100 mt-2 mb-0" />}
    </div>
    <div className={`${isLast ? "pb-0" : "pb-8"} pt-0.5 min-w-0`}>
      <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

const Callout = ({
  type,
  title,
  children,
}: {
  type: "info" | "warning" | "success" | "error";
  title?: string;
  children: React.ReactNode;
}) => {
  const styles = {
    info: { bg: "bg-blue-50", border: "border-blue-200", icon: mdiInformation, iconColor: "text-blue-500", titleColor: "text-blue-800", textColor: "text-blue-700" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: mdiAlertDecagram, iconColor: "text-amber-500", titleColor: "text-amber-800", textColor: "text-amber-700" },
    success: { bg: "bg-green-50", border: "border-green-200", icon: mdiCheckCircle, iconColor: "text-green-500", titleColor: "text-green-800", textColor: "text-green-700" },
    error: { bg: "bg-red-50", border: "border-red-200", icon: mdiAlertCircle, iconColor: "text-red-500", titleColor: "text-red-800", textColor: "text-red-700" },
  }[type];

  return (
    <div className={`flex gap-3 p-4 ${styles.bg} border ${styles.border} rounded-xl my-6`}>
      <Icon path={styles.icon} className={`w-5 h-5 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        {title && <p className={`font-semibold text-sm ${styles.titleColor} mb-1`}>{title}</p>}
        <div className={`text-sm ${styles.textColor} leading-relaxed`}>{children}</div>
      </div>
    </div>
  );
};

const CheckList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 my-4">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon path={mdiCheck} className="w-3 h-3 text-green-600" />
        </div>
        {item}
      </li>
    ))}
  </ul>
);

// ── Sections ─────────────────────────────────────────────────────────────────

const QuickStart: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiLightbulb}
      iconBg="bg-amber-50"
      iconColor="text-amber-500"
      label="Introduction"
      title="Quick Start Guide"
      intro="Get your CasaBoard dashboard up and running in under 10 minutes. Follow these four steps to go from zero to a working smart home dashboard."
    />

    <div className="mb-8">
      <TimelineStep number={1} title="Login with Google" text="Head to casaboard.dev and click 'Login'. Sign in using your Google account — this creates your CasaBoard profile and keeps your account secure." />
      <TimelineStep number={2} title="Connect Home Assistant" text="Navigate to Setup → HA Instances and enter your Home Assistant URL (e.g. https://homeassistant.local:8123). You'll be redirected to authorise CasaBoard." />
      <TimelineStep number={3} title="Create your first page" text="Go to Setup → Pages and click 'New Page'. Give it a name like 'Living Room' and open the drag-and-drop editor to start building." isLast />
    </div>

    <Callout type="success" title="Privacy-first by default">
      Your Home Assistant tokens are encrypted in your browser and never sent to CasaBoard servers. You're in full control.
    </Callout>

    <Callout type="info" title="What you'll need">
      <CheckList items={[
        "A running Home Assistant instance (local or remote)",
        "Your HA instance URL (e.g. https://ha.yourname.com)",
        "A Google account for login",
      ]} />
    </Callout>
  </div>
);

const GoogleOAuth: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiGoogle}
      iconBg="bg-blue-50"
      iconColor="text-blue-500"
      label="Authentication"
      title="Google OAuth Login"
      intro="CasaBoard uses Google OAuth for secure authentication. No passwords to remember — your Google account handles identity."
    />

    <TimelineStep number={1} title="Navigate to the login page" text='Go to the CasaBoard login page and click "Continue with Google".' />
    <TimelineStep number={2} title="Select your Google account" text="Choose the Google account you want associated with CasaBoard. This becomes your primary identity for the dashboard." />
    <TimelineStep number={3} title="Review permissions" text="CasaBoard only requests basic profile info (name and email). It does not request access to your Google Drive, Gmail, or any other Google services." />
    <TimelineStep number={4} title="You're in" text="Once authenticated, you'll land on the Setup dashboard and can start configuring your Home Assistant connection." isLast />

    <Callout type="info" title="Session management">
      Sessions are managed by Supabase Auth using industry-standard JWT tokens with automatic refresh. You stay logged in until you explicitly sign out.
    </Callout>
  </div>
);

const HAConnection: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiHomeAssistant}
      iconBg="bg-cyan-50"
      iconColor="text-cyan-600"
      label="Setup"
      title="Home Assistant Connection"
      intro="Connect your Home Assistant instance to CasaBoard. The connection happens directly in your browser — your tokens never touch CasaBoard's servers."
    />

    <TimelineStep number={1} title="Find your HA URL" text="Locate your Home Assistant base URL. This is typically something like https://homeassistant.local:8123 for local installs, or https://ha.yourdomain.com for remote access." />
    <TimelineStep number={2} title="Add the instance" text='Go to Setup → HA Instances and enter your URL in the "Add Instance" field. Give it a display name (e.g. "Home").' />
    <TimelineStep number={3} title="Authorise CasaBoard" text="You'll be redirected to your Home Assistant login screen. Sign in and approve the CasaBoard connection. You'll be sent back automatically." isLast />

    <Callout type="info" title="Multiple instances">
      You can connect multiple Home Assistant instances (e.g. home + holiday home) and assign different ones to different dashboard pages.
    </Callout>

    <Callout type="warning" title="Tokens stay local">
      OAuth tokens are encrypted with AES-GCM in your browser and stored in local storage only. If you clear browser data or switch devices, you'll need to re-authorise HA.
    </Callout>
  </div>
);

const CreateFirstPage: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiGrid}
      iconBg="bg-purple-50"
      iconColor="text-purple-600"
      label="Pages"
      title="Creating Your First Page"
      intro="Pages are the heart of CasaBoard — each one is a full dashboard you can embed on a TV, tablet, or share publicly. Here's how to create your first."
    />

    <TimelineStep number={1} title="Open Pages management" text="From the Setup dashboard, click 'Pages' in the sidebar or use the 'All Pages' quick action." />
    <TimelineStep number={2} title="Create a new page" text='Click the "+ New" button at the top right. Enter a name for your page — e.g. "Living Room", "Kitchen Overview", or "Security".' />
    <TimelineStep number={3} title="Open the editor" text="Click the pencil (edit) icon next to your new page. This opens the drag-and-drop builder where you'll add components." isLast />

    <Callout type="info" title="Page visibility">
      Pages can be set to Live (publicly accessible at /view/your-slug) or Draft (only visible to you). You can toggle this from the Pages list.
    </Callout>
  </div>
);

const AddingComponents: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiDrag}
      iconBg="bg-orange-50"
      iconColor="text-orange-500"
      label="Editor"
      title="Adding Components"
      intro="The page editor uses a drag-and-drop system powered by Puck. Drag components from the left panel onto your canvas to build your layout."
    />

    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      {[
        { icon: mdiLightbulb, label: "Lights", desc: "Toggle and dim individual lights or groups" },
        { icon: mdiCog, label: "Switches", desc: "Control smart plugs, fans, and binary switches" },
        { icon: mdiGrid, label: "Entity Cards", desc: "Display sensor readings, temperatures, and states" },
        { icon: mdiInformation, label: "Status badges", desc: "Compact indicators for quick at-a-glance info" },
      ].map((c) => (
        <div key={c.label} className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon path={c.icon} className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-900 mb-0.5">{c.label}</p>
            <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
          </div>
        </div>
      ))}
    </div>

    <TimelineStep number={1} title="Drag from the left panel" text="Click and drag any component from the left sidebar onto the canvas. Drop it where you want it to appear." />
    <TimelineStep number={2} title="Configure the entity" text="Click the component to open its settings. Select the Home Assistant entity you want to link (e.g. light.living_room)." />
    <TimelineStep number={3} title="Customise appearance" text="Adjust the label, icon colour, size, and display format in the component settings panel." isLast />
  </div>
);

const Tips: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiInformation}
      iconBg="bg-blue-50"
      iconColor="text-blue-500"
      label="Best Practices"
      title="Tips & Best Practices"
      intro="These patterns will help you get the most out of CasaBoard and keep your dashboards fast and maintainable."
    />

    <div className="space-y-8">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          Organisation
        </h3>
        <CheckList items={[
          "Create separate pages for different rooms or functions (e.g. 'Kitchen', 'Security', 'Energy')",
          "Use descriptive page names — these become the public URL slug",
          "Group related components visually so the page is scannable at a glance",
          "Keep each page focused — fewer components means faster load and less cognitive overhead",
        ]} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
          Performance
        </h3>
        <CheckList items={[
          "Avoid loading more than 20–30 entity cards on a single page",
          "Use entity cards for multiple related entities rather than individual components",
          "Test your dashboard on the device you'll actually display it on (TV, tablet, phone)",
        ]} />
      </div>

      <Callout type="info" title="Display tip">
        For always-on wall displays, set the page to 'Live' and open it in a kiosk browser in fullscreen mode. Most smart TVs support this natively.
      </Callout>
    </div>
  </div>
);

const Troubleshooting: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiAlertCircle}
      iconBg="bg-red-50"
      iconColor="text-red-500"
      label="Support"
      title="Troubleshooting"
      intro="Running into issues? These are the most common problems and how to fix them."
    />

    <div className="space-y-5">
      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="font-semibold text-sm text-slate-800">Can't connect to Home Assistant</p>
        </div>
        <ul className="p-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Verify the URL is reachable from your current network</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Check that HA is running and accessible (try opening the URL directly)</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> If using HTTPS, confirm your SSL certificate is valid</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Clear browser storage and try re-authorising the connection</li>
        </ul>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="font-semibold text-sm text-slate-800">Entity shows as unavailable</p>
        </div>
        <ul className="p-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Check the entity exists and is enabled in Home Assistant</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Verify the entity ID matches exactly (case-sensitive)</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Reload the page to re-establish the WebSocket connection</li>
        </ul>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <p className="font-semibold text-sm text-slate-800">Tokens expired / forced to re-login to HA</p>
        </div>
        <ul className="p-4 space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> This is expected if browser storage was cleared</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Tokens are stored locally only — switching devices requires re-auth</li>
          <li className="flex items-start gap-2"><span className="text-slate-300 mt-0.5 font-bold">→</span> Use optional cloud sync (paid plans) to persist HA instance metadata across devices</li>
        </ul>
      </div>
    </div>
  </div>
);

const Help: React.FC = () => (
  <div>
    <SectionHeading
      icon={mdiEye}
      iconBg="bg-indigo-50"
      iconColor="text-indigo-500"
      label="Support"
      title="Getting Help"
      intro="If you can't find an answer in the docs, we're happy to help directly."
    />

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-1">Email support</h3>
        <p className="text-sm text-slate-500 mb-3">Send us a message and we'll get back to you as soon as possible.</p>
        <a href="mailto:support@casaboard.dev" className="text-sm font-medium text-violet-600 hover:underline">
          support@casaboard.dev
        </a>
      </div>
      <div className="p-5 bg-white border border-slate-100 shadow-sm rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-1">Community</h3>
        <p className="text-sm text-slate-500 mb-3">Join the community to share dashboards, get ideas, and find answers.</p>
        <span className="text-sm text-slate-400 italic">Coming soon</span>
      </div>
    </div>

    <Callout type="info" title="Before reaching out">
      Include your browser, whether you're on a local or remote HA setup, and any error messages from the browser console. This helps us respond much faster.
    </Callout>
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
