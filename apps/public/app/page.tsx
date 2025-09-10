"use client";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiGoogle,
  mdiHomeAssistant,
  mdiGrid,
  mdiMagnify,
  mdiCheckCircle,
  mdiInformation,
  mdiLightbulb,
  mdiAlertCircle,
  mdiArrowRight,
  mdiCodeBlockBraces,
  mdiCog,
  mdiEye,
  mdiDrag,
  mdiPlus,
} from "@mdi/js";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-text mb-4">
          How to use CasaBoard
        </h1>
        <p className="text-theme-text-secondary text-lg">
          Learn how to set up and use CasaBoard to create your smart home
          dashboard for Home Assistant
        </p>
      </div>

      {/* Quick Start */}
      <Card className="mb-8 border-l-4 border-l-theme-primary">
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
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
              <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                1
              </div>
              <span className="text-sm font-medium text-theme-text">
                Login with Google
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
              <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                2
              </div>
              <span className="text-sm font-medium text-theme-text">
                Connect Home Assistant
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
              <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                3
              </div>
              <span className="text-sm font-medium text-theme-text">
                Create Your First Page
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
              <div className="w-8 h-8 bg-theme-primary rounded-full flex items-center justify-center text-sm font-bold text-black">
                4
              </div>
              <span className="text-sm font-medium text-theme-text">
                Add Components
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Google OAuth Login */}
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

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Access the Login Page
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Navigate to the login page and click &quot;Continue with
                  Google&quot;
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Google Account Selection
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Choose the Google account you want to use for CasaBoard. This
                  will be your primary account for accessing the dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Grant Permissions
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Review and accept the permissions requested by CasaBoard. This
                  allows secure access to your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Dashboard Access
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  You&apos;ll be redirected to the CasaBoard dashboard where you
                  can start setting up your smart home interface.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Icon
                path={mdiInformation}
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                  Security Note
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Your Google account credentials are never stored by CasaBoard.
                  We only use OAuth for secure authentication.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Home Assistant Setup */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiHomeAssistant} className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              2. Home Assistant Connection
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            Connect CasaBoard to your Home Assistant instance using a long-lived
            access token for secure communication.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Generate Long-Lived Access Token
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    In your Home Assistant instance:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      Go to your profile (click your avatar in the bottom left)
                    </li>
                    <li>Scroll down to &quot;Long-lived access tokens&quot;</li>
                    <li>Click &quot;Create token&quot;</li>
                    <li>Give it a name like &quot;CasaBoard Dashboard&quot;</li>
                    <li>
                      Copy the generated token (you won&apos;t see it again!)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Configure CasaBoard
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    In CasaBoard setup:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>Navigate to the Setup Dashboard</li>
                    <li>Click on &quot;Home Assistant&quot; configuration</li>
                    <li>
                      Enter your Home Assistant URL (e.g.,
                      https://ha.yourdomain.com)
                    </li>
                    <li>Paste your long-lived access token</li>
                    <li>Click &quot;Test Connection&quot; to verify</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Verify Connection
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Once connected, you should see a green &quot;Connected to Home
                  Assistant&quot; status with your HA URL displayed.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <Icon
                path={mdiCheckCircle}
                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                  Connection Tips
                </h4>
                <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                  <li>
                    • Make sure your Home Assistant instance is accessible from
                    the internet
                  </li>
                  <li>• Use HTTPS for secure communication</li>
                  <li>
                    • Keep your access token secure and don&apos;t share it
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Page Builder */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiGrid} className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              3. Page Builder & Grid System
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            Create and customize your dashboard pages using the intuitive page
            builder with drag-and-drop functionality.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Create a New Page
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    Start by creating a new dashboard page:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      Go to &quot;Setup&quot; → &quot;Pages&quot; → &quot;New
                      Page&quot;
                    </li>
                    <li>
                      Enter a page name (e.g., &quot;Living Room&quot;,
                      &quot;Kitchen&quot;)
                    </li>
                    <li>
                      Choose a URL slug (e.g., &quot;living-room&quot;,
                      &quot;kitchen&quot;)
                    </li>
                    <li>Click &quot;Create Page&quot;</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Using the Grid System
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    The page builder uses a responsive grid system:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      <strong>Grid Container:</strong> The main layout area for
                      your components
                    </li>
                    <li>
                      <strong>Grid Items:</strong> Individual components that
                      can be resized and repositioned
                    </li>
                    <li>
                      <strong>Drag & Drop:</strong> Click and drag components to
                      reposition them
                    </li>
                    <li>
                      <strong>Resize Handles:</strong> Use corner handles to
                      resize components
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Adding Components
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    Add smart home components to your grid:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      Click the &quot;+&quot; button in an empty grid area
                    </li>
                    <li>
                      Select from available component types (Lights, Switches,
                      Sensors, etc.)
                    </li>
                    <li>Configure the component settings</li>
                    <li>Save and preview your changes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Grid Layout Tips
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    Optimize your dashboard layout:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>Group related components together</li>
                    <li>Use different sizes for visual hierarchy</li>
                    <li>Test on mobile devices for responsiveness</li>
                    <li>Keep frequently used controls easily accessible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Icon
                path={mdiDrag}
                className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                  Pro Tips
                </h4>
                <ul className="text-purple-700 dark:text-purple-300 text-sm space-y-1">
                  <li>• Hold Shift while dragging to snap to grid</li>
                  <li>• Use the preview mode to test your layout</li>
                  <li>• Save frequently to avoid losing changes</li>
                </ul>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Entity Autocomplete */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiMagnify} className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              4. Entity Selection & Autocomplete
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            Easily find and select Home Assistant entities using the intelligent
            autocomplete system.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Using Entity Autocomplete
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    When configuring components, you&apos;ll see entity
                    selection fields:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      Start typing the entity name (e.g., &quot;light&quot;,
                      &quot;switch&quot;, &quot;sensor&quot;)
                    </li>
                    <li>
                      Autocomplete will show matching entities from your Home
                      Assistant
                    </li>
                    <li>Click on the desired entity to select it</li>
                    <li>Use arrow keys to navigate suggestions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Entity Types & Icons
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    Different entity types are automatically detected and
                    displayed:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    <div className="flex items-center gap-2 p-2 bg-theme-background rounded">
                      <Icon
                        path={mdiLightbulb}
                        className="w-4 h-4 text-yellow-500"
                      />
                      <span className="text-xs text-theme-text">Lights</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-theme-background rounded">
                      <Icon path={mdiCog} className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-theme-text">Switches</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-theme-background rounded">
                      <Icon path={mdiEye} className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-theme-text">Sensors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Search Tips
                </h3>
                <div className="space-y-2">
                  <p className="text-theme-text-secondary text-sm">
                    Get the most out of entity search:
                  </p>
                  <ul className="list-disc list-inside text-theme-text-secondary text-sm space-y-1 ml-4">
                    <li>
                      Search by room name (e.g., &quot;kitchen&quot;,
                      &quot;bedroom&quot;)
                    </li>
                    <li>
                      Search by device type (e.g., &quot;motion&quot;,
                      &quot;temperature&quot;)
                    </li>
                    <li>
                      Use partial matches (e.g., &quot;liv&quot; for
                      &quot;living room&quot;)
                    </li>
                    <li>
                      Filter by entity domain (light, switch, sensor, etc.)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-3">
              <Icon
                path={mdiMagnify}
                className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                  Entity Naming
                </h4>
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  For best results, use descriptive entity names in Home
                  Assistant like &quot;kitchen_light&quot; or
                  &quot;bedroom_motion_sensor&quot;.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Component Types */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon
              path={mdiCodeBlockBraces}
              className="w-6 h-6 text-indigo-500"
            />
            <h2 className="text-xl font-semibold text-theme-text">
              5. Available Components
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            CasaBoard supports various Home Assistant component types for
            comprehensive smart home control.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiLightbulb} className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-theme-text">Lights</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Control smart lights with brightness, color, and on/off
                functionality.
              </p>
              <Chip size="sm" variant="flat" color="success">
                On/Off
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Brightness
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Color
              </Chip>
            </div>

            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiCog} className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-theme-text">Switches</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Toggle switches for outlets, fans, and other binary devices.
              </p>
              <Chip size="sm" variant="flat" color="success">
                On/Off
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Toggle
              </Chip>
            </div>

            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiEye} className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-theme-text">Sensors</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Display sensor readings like temperature, humidity, and motion.
              </p>
              <Chip size="sm" variant="flat" color="success">
                Temperature
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Motion
              </Chip>
            </div>

            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiAlertCircle} className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-theme-text">Alarms</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Monitor and control security alarm systems.
              </p>
              <Chip size="sm" variant="flat" color="success">
                Status
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Arm/Disarm
              </Chip>
            </div>

            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiGrid} className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-theme-text">Thermostats</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Control heating and cooling systems with temperature settings.
              </p>
              <Chip size="sm" variant="flat" color="success">
                Temperature
              </Chip>
              <Chip size="sm" variant="flat" color="success" className="ml-1">
                Mode
              </Chip>
            </div>

            <div className="p-4 bg-theme-surface rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Icon path={mdiPlus} className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-theme-text">More Coming</h3>
              </div>
              <p className="text-theme-text-secondary text-sm mb-2">
                Additional component types are being added regularly.
              </p>
              <Chip size="sm" variant="flat" color="warning">
                In Development
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Troubleshooting */}
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
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                Google Login Issues
              </h3>
              <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                <li>• Clear your browser cache and cookies</li>
                <li>• Try logging out and back in</li>
                <li>• Check if pop-ups are blocked</li>
                <li>• Ensure you&apos;re using a supported browser</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Home Assistant Connection Issues
              </h3>
              <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                <li>
                  • Verify your Home Assistant URL is correct and accessible
                </li>
                <li>
                  • Check that your long-lived token is valid and not expired
                </li>
                <li>• Ensure your Home Assistant instance is running</li>
                <li>• Try regenerating the access token</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Page Builder Issues
              </h3>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Refresh the page if components don&apos;t load</li>
                <li>• Check that your Home Assistant connection is active</li>
                <li>• Verify entity names are correct in the autocomplete</li>
                <li>• Save your changes frequently</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiInformation} className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              Need Help?
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-theme-text-secondary mb-4">
            If you&apos;re still having issues or need additional help, here are
            some resources:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 bg-theme-surface rounded-lg">
              <h3 className="font-semibold text-theme-text mb-1">
                Documentation
              </h3>
              <p className="text-theme-text-secondary text-sm">
                Check the full documentation for detailed guides and API
                references.
              </p>
            </div>
            <div className="p-3 bg-theme-surface rounded-lg">
              <h3 className="font-semibold text-theme-text mb-1">
                Community Support
              </h3>
              <p className="text-theme-text-secondary text-sm">
                Join our community forum for help from other users and
                developers.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
