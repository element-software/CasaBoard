"use client";
import { useEffect, useState, useTransition } from "react";
import { HAInstanceActions, UserSettingsActions } from "@repo/lib";
import { Button, Card, CardBody, CardHeader, Input, Link, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiHomeAssistant, mdiCheckCircle } from "@mdi/js";
interface InstanceSummary {
  id: string;
  name: string;
  hass_url: string;
  created_at: string;
}

interface EntitlementsInput {
  maxHAInstances: number;
  active: boolean;
}

export function HAInstanceManager({
  entitlements,
}: {
  entitlements: EntitlementsInput;
}) {
  const [instances, setInstances] = useState<InstanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", hass_url: "", hass_token: "" });
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await HAInstanceActions.listHAInstances();
      setInstances(data as InstanceSummary[]);
      const settings = await UserSettingsActions.getUserSettings();
      setActiveUrl(settings?.hass_url ?? null);
    } catch (e: any) {
      setError(e?.message || "Failed to load instances");
    } finally {
      setLoading(false);
    }
  };

  const canCreate = () => {
    if (!entitlements || !entitlements.active) return false;
    if (entitlements.maxHAInstances < 0) return true;
    return instances.length < entitlements.maxHAInstances;
  };

  const onCreate = () =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.createHAInstance({
          name: form.name || `Instance ${instances.length + 1}`,
          hass_url: form.hass_url,
          hass_token: form.hass_token,
        });
        setForm({ name: "", hass_url: "", hass_token: "" });
        await refresh();
      } catch (e: any) {
        setError(e?.message || "Failed to create instance");
      }
    });

  const onDelete = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.deleteHAInstance(id);
        await refresh();
      } catch (e: any) {
        setError(e?.message || "Failed to delete instance");
      }
    });

  const onSetActive = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.setActiveHAInstance(id);
        await refresh();
      } catch (e: any) {
        setError(e?.message || "Failed to set active instance");
      }
    });

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <Icon
            path={mdiHomeAssistant}
            className="w-6 h-6 text-theme-primary"
          />
          <h3 className="text-lg font-semibold">Home Assistant Instances</h3>
          {entitlements && entitlements.maxHAInstances >= 0 && (
            <span className="text-sm text-foreground-500">
              {instances.length}/{entitlements.maxHAInstances}
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

        {loading ? (
          <p>Loading instances…</p>
        ) : instances.length === 0 ? (
          <p className="text-foreground-500">
            No instances yet. Create one below.
          </p>
        ) : (
          <div className="space-y-3">
            {instances.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between gap-3 p-3 bg-content2 rounded"
              >
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="flex items-center gap-2 text-sm text-foreground-500">
                    <span>{i.hass_url}</span>
                    {activeUrl && i.hass_url === activeUrl && (
                      <Chip size="sm" color="success" variant="flat" startContent={<Icon path={mdiCheckCircle} className="w-3 h-3" />}>Active</Chip>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => onSetActive(i.id)}
                    isLoading={isPending}
                    isDisabled={instances.length === 1 || (activeUrl !== null && i.hass_url === activeUrl)}
                  >
                    Set active
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => onDelete(i.id)}
                    isLoading={isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {canCreate() && entitlements ? (
          <>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                description="The name for this instance"
              />
              <Input
                label="HA URL"
                value={form.hass_url}
                onChange={(e) => setForm({ ...form, hass_url: e.target.value })}
                description="Home Assistant URL (e.g., http://homeassistant.local:8123)"
              />
              <Input
                label="HA Token"
                type="password"
                value={form.hass_token}
                onChange={(e) =>
                  setForm({ ...form, hass_token: e.target.value })
                }
                description="Long-lived access token for this instance"
              />
            </div>
            <div className="flex justify-end">
              <Button
                color="primary"
                onPress={onCreate}
                isDisabled={!canCreate() || !form.hass_url || !form.hass_token}
                isLoading={isPending}
              >
                Add instance
              </Button>
            </div>
          </>
        ) : (
          <p className="text-white text-md w-full text-center">
            You've reached the limit of HA instances for your plan. Please <Link href="/billing" className="text-primary underline">upgrade your plan</Link> to add more instances.
          </p>
        )}
      </CardBody>
    </Card>
  );
}
