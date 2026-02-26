"use client";
import { useState, useTransition } from "react";
import { HAInstanceActions, LinkService } from "@repo/lib";
import { Card, CardBody, Link, Button } from "@heroui/react";
import { connect } from "@repo/ha";
import { useRouter } from "next/navigation";
import { useHA } from "@repo/ha";
import { Entitlements } from "@repo/types/subscription";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
  mdiArrowRight,
} from "@mdi/js";
import { InstancesHeader } from "./InstancesHeader";
import { HAInstance } from "./HAInstance";
import { HAInstance as HAInstanceType } from "@repo/types/ha";
import { AddInstance } from "./AddInstance";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";

interface HAInstanceManagerProps {
  compact?: boolean;
  haInstances: HAInstanceType[];
  entitlements: Entitlements;
}

export function HAInstanceManager({
  compact = false,
  haInstances,
  entitlements,
}: HAInstanceManagerProps) {
  const { connection } = useHA();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", hass_url: "" });
  const router = useRouter();

  // Helper functions for entitlements
  const canCreateHAInstance = (currentCount: number) => {
    if (!entitlements?.active) return false;
    return (
      entitlements.maxHAInstances === -1 ||
      currentCount < entitlements.maxHAInstances
    );
  };

  const canCreate = () => {
    return canCreateHAInstance(haInstances.length);
  };

  const onCreate = () =>
    startTransition(async () => {
      setError(null);
      const formattedUrl = `https://${form.hass_url}`;
      try {
        await HAInstanceActions.createHAInstance({
          name: form.name || `Instance ${haInstances.length + 1}`,
          hass_url: formattedUrl,
        });
        await connect({
          haInstance: { 
            hass_url: formattedUrl,
            name: form.name || `Instance ${haInstances.length + 1}`,
            id: "",
            hass_token: "",
            created_at: "",
          }
        });
      } catch (e: any) {
        setError(e?.message || "Failed to create instance");
      }
    });

  const onDelete = (id: string) =>
    startTransition(async () => {
      setError(null);
      try {
        await HAInstanceActions.deleteHAInstance(id);
        connection?.close();
        router.push("/setup/ha-config");
      } catch (e: any) {
        setError(e?.message || "Failed to delete instance");
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
        {!canCreate() && !entitlements && (
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

  return (
    <Card className="w-full">
      {renderHeader()}
      <CardBody className="space-y-4">
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
          ))}
      </CardBody>
    </Card>
  );
}
