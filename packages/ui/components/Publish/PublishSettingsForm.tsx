"use client";

import { useState, useTransition } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiFolderUpload } from "@mdi/js";
import { savePublishSettings } from "@repo/lib/actions/publishSettingsActions";
import type { PublishSettings } from "@repo/lib";

export function PublishSettingsForm({
  initialSettings,
}: {
  initialSettings: PublishSettings;
}) {
  const [publishDir, setPublishDir] = useState(initialSettings.publishDir);
  const [publicBaseUrl, setPublicBaseUrl] = useState(
    initialSettings.publicBaseUrl
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await savePublishSettings({ publishDir, publicBaseUrl });
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save settings");
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-3 p-4 sm:p-6">
        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon path={mdiFolderUpload} className="w-6 h-6 text-cyan-700" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">Static publish</h3>
          <p className="text-sm text-foreground-500">
            Write published pages into a directory Home Assistant serves at{" "}
            <code className="text-xs">/local/…</code>
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        {saved && (
          <div className="p-3 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
            Publish settings saved.
          </div>
        )}

        <Input
          label="Publish directory"
          value={publishDir}
          onValueChange={setPublishDir}
          description="Filesystem path inside the CasaBoard container/host (Docker default: /publish). Mount HA config/www/casaboard here."
          placeholder="/publish"
        />
        <Input
          label="Public base URL"
          value={publicBaseUrl}
          onValueChange={setPublicBaseUrl}
          description="Used for copy-link, e.g. http://homeassistant.local:8123/local/casaboard"
          placeholder="http://homeassistant.local:8123/local/casaboard"
        />
        <div className="flex justify-end">
          <Button color="primary" onPress={onSave} isLoading={isPending}>
            Save publish settings
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
