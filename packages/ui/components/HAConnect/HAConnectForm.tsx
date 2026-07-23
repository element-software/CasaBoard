"use client";

import { useState, useTransition } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Input } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiCheckCircle, mdiAlertCircle, mdiHomeAssistant } from "@mdi/js";
import { HAConnectionActions } from "@repo/lib";
import { reauthenticate, useHA } from "@repo/ha";
import type { HAConnection } from "@repo/types/ha";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";

function ConnectionStatus({ haInstance }: { haInstance: HAConnection }) {
  const { connected, entities } = useHA();
  const entityCount = Object.keys(entities ?? {}).length;

  return (
    <div className="flex items-center gap-2">
      <Chip
        size="sm"
        color={connected ? "success" : "warning"}
        variant="flat"
        startContent={
          <Icon path={connected ? mdiCheckCircle : mdiAlertCircle} className="w-3 h-3" />
        }
      >
        {connected ? "Connected" : "Connecting…"}
      </Chip>
      {connected && (
        <Chip size="sm" color="default" variant="flat">
          {entityCount} entities
        </Chip>
      )}
    </div>
  );
}

export interface HAConnectFormProps {
  compact?: boolean;
  initialConnection: HAConnection | null;
}

export function HAConnectForm({ compact = false, initialConnection }: HAConnectFormProps) {
  const [hassUrl, setHassUrl] = useState(initialConnection?.hass_url ?? "");
  const [connection, setConnection] = useState<HAConnection | null>(initialConnection);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onConnect = () => {
    setError(null);
    const formattedUrl = `http://${hassUrl}`;
    startTransition(async () => {
      try {
        await HAConnectionActions.saveHAConnection(formattedUrl, null);
        setConnection({ hass_url: formattedUrl });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save connection");
      }
    });
  };

  const onDisconnect = () => {
    startTransition(async () => {
      await HAConnectionActions.clearHAConnection();
      setConnection(null);
      setHassUrl("");
    });
  };

  const onReconnect = () => {
    if (!connection) return;
    startTransition(async () => {
      try {
        await reauthenticate({ haInstance: connection });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to re-authenticate");
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-3 p-4 sm:p-6">
        <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon path={mdiHomeAssistant} className="w-6 h-6 text-violet-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold">Home Assistant</h3>
          {connection && (
            <span className="text-sm text-foreground-500 truncate block">
              {connection.hass_url}
            </span>
          )}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {!connection ? (
          <div className="grid gap-3">
            <Input
              label="Home Assistant URL"
              value={hassUrl}
              onChange={(e) => setHassUrl(e.target.value)}
              description="e.g. your-domain.com, homeassistant.local:8123, or 192.168.1.x:8123 — protocol optional, defaults to http:// if omitted"
              placeholder="your-domain.com or 192.168.1.x:8123"
            />
            <div className="flex justify-end">
              <Button
                color="primary"
                onPress={onConnect}
                isDisabled={!hassUrl}
                isLoading={isPending}
              >
                Connect
              </Button>
            </div>
          </div>
        ) : (
          <HassConnectWrapper haInstance={connection}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ConnectionStatus haInstance={connection} />
              {!compact && (
                <div className="flex gap-2">
                  <Button size="sm" variant="bordered" onPress={onReconnect} isDisabled={isPending}>
                    Reconnect
                  </Button>
                  <Button size="sm" color="danger" variant="flat" onPress={onDisconnect} isDisabled={isPending}>
                    Disconnect
                  </Button>
                </div>
              )}
            </div>
          </HassConnectWrapper>
        )}
      </CardBody>
    </Card>
  );
}
