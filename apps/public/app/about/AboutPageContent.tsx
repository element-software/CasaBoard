"use client";

import { Card, CardBody, CardHeader } from '@heroui/react';
import Icon from '@mdi/react';
import { 
  mdiGoogle, 
  mdiHomeAssistant, 
  mdiGrid, 
  mdiCheckCircle,
  mdiInformation,
  mdiLightbulb,
  mdiDrag,
  mdiAlertCircle,
  mdiCog,
  mdiEye,
} from '@mdi/js';

export default function AboutPageContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-text mb-4">How to use CasaBoard</h1>
        <p className="text-theme-text-secondary text-lg">
          Learn how to set up and use CasaBoard to create your smart home dashboard for Home Assistant
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
                  Complete Authentication
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Once authenticated, you&apos;ll be redirected back to CasaBoard
                  and can start setting up your dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Home Assistant Connection */}
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
            Connect your Home Assistant instance to CasaBoard to start building
            your dashboard:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Get Your HA URL
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Find your Home Assistant URL (e.g., http://homeassistant.local:8123
                  or https://your-domain.com)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Create a Long-Lived Access Token
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  In Home Assistant, go to Profile → Long-lived access tokens →
                  Create token. Give it a name like &quot;CasaBoard&quot; and copy
                  the token.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Enter Connection Details
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  In CasaBoard, go to Setup → Home Assistant Configuration and
                  enter your HA URL and access token.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Test Connection
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Click &quot;Test Connection&quot; to verify that CasaBoard can
                  connect to your Home Assistant instance.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Creating Your First Page */}
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
            Now you&apos;re ready to create your first dashboard page:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Go to Pages Management
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Navigate to Setup → Pages Management to see your dashboard
                  pages.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Create New Page
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Click &quot;Create New Page&quot; and give your page a name
                  (e.g., &quot;Living Room&quot;, &quot;Kitchen&quot;,
                  &quot;Overview&quot;).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-semibold text-theme-text mb-2">
                  Open Page Editor
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Click the edit button (pencil icon) next to your new page to
                  open the drag-and-drop editor.
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Adding Components */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiDrag} className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              4. Adding Components
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            Use the drag-and-drop interface to add components to your dashboard:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-theme-text">Available Components:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                  <Icon path={mdiLightbulb} className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-theme-text">Lights</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                  <Icon path={mdiCog} className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-theme-text">Switches</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                  <Icon path={mdiGrid} className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-theme-text">Entity Cards</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-theme-surface rounded-lg">
                  <Icon path={mdiInformation} className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-theme-text">Sensors</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-theme-text">How to Add:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-sm text-theme-text-secondary">
                    Drag a component from the left panel to your page
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-sm text-theme-text-secondary">
                    Select the component to configure its properties
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-sm text-theme-text-secondary">
                    Choose the Home Assistant entity to control
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-sm text-theme-text-secondary">
                    Customize appearance and behavior as needed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tips and Best Practices */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiInformation} className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              Tips and Best Practices
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-theme-text mb-3">Organization</h3>
              <ul className="space-y-2 text-sm text-theme-text-secondary">
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Create separate pages for different rooms or functions
                </li>
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use descriptive names for your pages and components
                </li>
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Group related components together
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-theme-text mb-3">Performance</h3>
              <ul className="space-y-2 text-sm text-theme-text-secondary">
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Don&apos;t overload pages with too many components
                </li>
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Use entity cards for multiple related entities
                </li>
                <li className="flex items-start gap-2">
                  <Icon path={mdiCheckCircle} className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  Test your dashboard on mobile devices
                </li>
              </ul>
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">
                Connection Issues
              </h3>
              <p className="text-sm text-red-700 mb-2">
                If you can&apos;t connect to Home Assistant:
              </p>
              <ul className="text-sm text-red-700 space-y-1 ml-4">
                <li>• Check that your HA URL is correct and accessible</li>
                <li>• Verify your access token is valid and not expired</li>
                <li>• Ensure your HA instance is running and accessible</li>
                <li>• Check your network connection</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Component Issues
              </h3>
              <p className="text-sm text-yellow-700 mb-2">
                If components aren&apos;t working properly:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1 ml-4">
                <li>• Verify the entity ID is correct in Home Assistant</li>
                <li>• Check that the entity is available and not disabled</li>
                <li>• Try refreshing the page or reconnecting to HA</li>
                <li>• Check the browser console for error messages</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Getting Help */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon path={mdiEye} className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-theme-text">
              Getting Help
            </h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <p className="text-theme-text-secondary">
            If you need additional help or have questions:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 bg-theme-surface rounded-lg">
              <h3 className="font-semibold text-theme-text mb-2">
                Documentation
              </h3>
              <p className="text-sm text-theme-text-secondary">
                Check our comprehensive documentation for detailed guides and API references.
              </p>
            </div>
            <div className="p-4 bg-theme-surface rounded-lg">
              <h3 className="font-semibold text-theme-text mb-2">
                Community Support
              </h3>
              <p className="text-sm text-theme-text-secondary">
                Join our community forum to ask questions and share your experiences.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
