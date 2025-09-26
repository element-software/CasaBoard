"use client";
import { useState, useTransition } from "react";
import { HAInstanceActions, LinkService } from "@repo/lib";
import { Card, CardBody, Link } from "@heroui/react";
import { connect } from "@repo/ha";
import { useRouter } from "next/navigation";
import { useHA } from "@repo/ha";
import { InstancesHeader } from "./InstancesHeader";
import { HAInstance } from "./HAInstance";
import { AddInstance } from "./AddInstance";

interface HAInstanceManagerProps {
  entitlements: EntitlementsInput;
  compact?: boolean;
  haInstances: HAInstance[];
}

interface EntitlementsInput {
  maxHAInstances: number;
  active: boolean;
}

export function HAInstanceManager({
  entitlements,
  compact = false,
  haInstances,
}: HAInstanceManagerProps) {
  const { connection } = useHA();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", hass_url: "" });
  const router = useRouter();

  const canCreate = () => {
    if (!entitlements || !entitlements.active) return false;
    if (entitlements.maxHAInstances < 0) return true;
    return haInstances.length < entitlements.maxHAInstances;
  };

  const onCreate = () =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.createHAInstance({
          name: form.name || `Instance ${haInstances.length + 1}`,
          hass_url: form.hass_url,
        });
        await connect({ homeAssistantUrl: form.hass_url });
      } catch (e: any) {
        setError(e?.message || "Failed to create instance");
      }
    });

  const onDelete = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.deleteHAInstance(id);
        await connection?.close();
        router.push("/setup/ha-config");
      } catch (e: any) {
        setError(e?.message || "Failed to delete instance");
      }
    });

  const onSetActive = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.setActiveHAInstance(id);
      } catch (e: any) {
        setError(e?.message || "Failed to set active instance");
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
        <HAInstance
          key={i.id}
          instance={i}
          compact={compact}
          onSetActive={onSetActive}
          onDelete={onDelete}
        />
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

  return (
    <Card className="w-full">
      {renderHeader()}
      <CardBody className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {haInstances.length === 0 ? (
          <p className="text-foreground-500">
            {compact ? "No instances yet." : "No instances yet. Create one below."}
          </p>
        ) : (
          renderInstancesList())
        }

        {!compact && (
          canCreate() && entitlements ? (
            renderCreateForm()
          ) : (
            <p className="text-white text-md w-full text-center">
              You've reached the limit of HA instances for your plan. Please{" "}
              <Link
                href="/auth/profile/billing"
                className="text-primary underline"
              >
                upgrade your plan
              </Link>{" "}
              to add more instances.
            </p>
          )
        )}
      </CardBody>
    </Card>
  );
}
