import { HAConfiguration } from '@repo/ui/components/Setup/HAConfiguration';
import Icon from '@mdi/react';
import { mdiHomeAssistant } from '@mdi/js';

// Force dynamic rendering for this page since it's under the authenticated layout that uses cookies
export const dynamic = 'force-dynamic';

export default function HAConfigPage() {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
              <Icon path={mdiHomeAssistant} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-theme-text">Home Assistant Configuration</h1>
              <p className="text-theme-text-secondary">
                Configure your Home Assistant connection and settings
              </p>
            </div>
          </div>
        </div>

        <HAConfiguration />
      </div>
  );
}
