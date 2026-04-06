"use client";

import { useState, useRef } from "react";
import { DataPortability } from "@repo/lib";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiDownload, mdiUpload, mdiAlert } from "@mdi/js";

export function DataPortabilityPanel() {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      await DataPortability.downloadUserData();
      setMessage({ type: "success", text: "Backup downloaded successfully." });
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message ?? "Export failed." });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage(null);
    try {
      const json = await file.text();
      await DataPortability.importUserData(json);
      setMessage({
        type: "success",
        text: "Data imported. Reload the page to see your restored data.",
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message ?? "Import failed." });
    } finally {
      setImporting(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div>
          <h3 className="text-lg font-semibold text-theme-text">
            Data Portability
          </h3>
          <p className="text-sm text-theme-text-secondary mt-1">
            Export your dashboard configuration as a backup file, or import a
            previous backup. Your Home Assistant tokens are excluded from
            exports for security.
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.type === "error" && (
              <Icon path={mdiAlert} className="w-4 h-4 flex-shrink-0" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            color="primary"
            variant="flat"
            startContent={<Icon path={mdiDownload} className="w-4 h-4" />}
            onPress={handleExport}
            className="flex-1"
          >
            Export Backup
          </Button>

          <Button
            color="default"
            variant="flat"
            startContent={<Icon path={mdiUpload} className="w-4 h-4" />}
            onPress={handleImportClick}
            isLoading={importing}
            className="flex-1"
          >
            Import Backup
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="text-xs text-theme-text-secondary">
          <strong>Note:</strong> Your dashboard data is stored locally in your
          browser. Clearing browser data or switching devices will remove it.
          Export regularly to keep a backup.
        </p>
      </CardBody>
    </Card>
  );
}
