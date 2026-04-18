"use client";

import { useState, useTransition, useEffect } from "react";
import {
  HAInstanceActions,
  LinkService,
  SupabaseClient,
  UserSettingsActions,
} from "@repo/lib";
import { Card, CardBody, Link, Button, Switch } from "@heroui/react";
import {
  connect,
  addLocalInstance,
  upsertLocalEntry,
  removeLocalEntry,
  useHA,
} from "@repo/ha";
import { Entitlements } from "@repo/types/subscription";
import Icon from "@mdi/react";
import { mdiHomeAssistant, mdiArrowRight } from "@mdi/js";
import { InstancesHeader } from "./InstancesHeader";
import { HAInstance } from "./HAInstance";
import { HAInstance as HAInstanceType } from "@repo/types/ha";
import { AddInstance } from "./AddInstance";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";
import { useMergedHAInstances } from "@repo/hooks";

interface HAInstanceManagerProps {
  compact?: boolean;
  entitlements: Entitlements;
}

export function HAInstanceManager({
  compact = false,
  entitlements,
}: HAInstanceManagerProps) {
  const { connection } = useHA();
  const { instances: haInstances, loading, refresh } =
    useMergedHAInstances(entitlements);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", hass_url: "" });
  const [userId, setUserId] = useState<string>("");
  const [haCloudSync, setHaCloudSync] = useState(false);

  useEffect(() => {
    const supabase = SupabaseClient.createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user?.id) return;
      setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    UserSettingsActions.getHaCloudSyncPreference().then(setHaCloudSync);
  }, []);

  const useCloudStorage =
    entitlements.haCloudSync && entitlements.active && haCloudSync;

  const canCreateHAInstance = (currentCount: number) => {
    if (!entitlements?.active) return false;
    return (
      entitlements.maxHAInstances === -1 ||
      currentCount < entitlements.maxHAInstances
    );
  };

  const canCreate = () => canCreateHAInstance(haInstances.length);

  const onCloudSyncChange = (next: boolean) => {
    startTransition(async () => {
      setError(null);
      try {
        await UserSettingsActions.setHaCloudSyncPreference(next);
        setHaCloudSync(next);
        await refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update preference");
      }
    });
  };

  const onCreate = () =>
    startTransition(async () => {
      setError(null);
      const formattedUrl = `https://${form.hass_url}`;
      const name = form.name || `Instance ${haInstances.length + 1}`;
      try {
        let ha: HAInstanceType;

        if (useCloudStorage) {
          const row = await HAInstanceActions.createHAInstance({
            name,
            hass_url: formattedUrl,
          });
          upsertLocalEntry({
            id: row.id,
            name: row.name,
            hass_url: row.hass_url,
            source: "cloud",
          });
          ha = {
            id: row.id,
            name: row.name,
            hass_url: row.hass_url,
            hass_token: "",
            created_at: row.created_at ?? new Date().toISOString(),
            source: "cloud",
          };
        } else {
          const entry = addLocalInstance(name, formattedUrl);
          ha = {
            id: entry.id,
            name: entry.name,
            hass_url: entry.hass_url,
            hass_token: "",
            created_at: new Date().toISOString(),
            source: "local",
          };
        }

        await connect({
          userId,
          haInstance: ha,
        });
        await refresh();
        setForm({ name: "", hass_url: "" });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to create instance");
      }
    });

  const onDelete = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        const inst = haInstances.find((i) => i.id === id);
        if (inst?.source === "cloud" && useCloudStorage) {
          await HAInstanceActions.deleteHAInstance(id);
        }
        removeLocalEntry(id);
        connection?.close();
        await refresh();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete instance");
      }
    });

  const renderHeader = () => (
    <InstancesHeader
      count={haInstances?.length ?? 0}
      max={entitlements?.maxHAInstances ?? null}
      compact={compact}
      manageHref={LinkService.crossAppHrefClient("app", "/setup/ha-config")}
    />
  );

  const renderInstancesList = () => (
    <div className="space-y-3">
      {haInstances.map((i) => (
        <HassConnectWrapper key={i.id} haInstance={i} onDelete={onDelete}>
          <HAInstance
            key={i.id}
            instance={i}
            compact={compact}
            onDelete={onDelete}
          />
        </HassConnectWrapper>
      ))}
    </div>
  );

  const renderCreateForm = () => (
    <AddInstance
      form={form}
      setForm={setForm}
      onCreate={onCreate}
      canCreate={canCreate}
      isPending={isPending}
    />
  );

  const renderEmptyState = () => {
    if (compact) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <Icon
              path={mdiHomeAssistant}
              className="w-8 h-8 text-foreground-400 mx-auto mb-2"
            />
            <p className="text-foreground-500 text-sm">No instances yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Icon path={mdiHomeAssistant} className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Home Assistant instances yet
        </h3>
        <p className="text-foreground-500 text-center mb-6 max-w-sm">
          Connect your Home Assistant instance to start managing your smart home
          devices and creating beautiful dashboards.
        </p>
        {!canCreate() && !entitlements?.active && (
          <div className="text-center">
            <p className="text-foreground-500 mb-3">
              You need an active subscription to add instances.
            </p>
            <Button
              as={Link}
              href="/auth/profile/billing"
              color="primary"
              variant="flat"
              endContent={<Icon path={mdiArrowRight} className="w-4 h-4" />}
            >
              View Plans
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="py-12 text-center text-foreground-500">
          Loading…
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      {renderHeader()}
      <CardBody className="space-y-4">
        {entitlements.haCloudSync && entitlements.active && (
          <div className="flex flex-col gap-2 rounded-lg border border-default-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">Sync Home Assistant across devices</p>
                <p className="text-xs text-foreground-500">
                  When enabled, your Home Assistant base URL and display name are stored on
                  CasaBoard servers. Tokens always stay in this browser only.
                </p>
              </div>
              <Switch
                isSelected={haCloudSync}
                onValueChange={onCloudSyncChange}
                isDisabled={isPending}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {haInstances.length === 0 ? renderEmptyState() : renderInstancesList()}

        {!compact &&
          (canCreate() ? (
            <div data-create-form>{renderCreateForm()}</div>
          ) : (
            <p className="text-slate-500 text-sm w-full text-center">
              You&apos;ve reached the limit of HA instances for your plan. Please{" "}
              <Link
                href="/auth/profile/billing"
                className="text-primary underline"
              >
                upgrade your plan
              </Link>{" "}
              to add more instances.
            </p>
          ))}
      </CardBody>
    </Card>
  );
}
