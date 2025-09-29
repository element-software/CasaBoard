"use client";
import { useState, useTransition } from "react";
import { HAInstanceActions, LinkService } from "@repo/lib";
import { Card, CardBody, Link, Button, Spinner, Skeleton } from "@heroui/react";
import { connect } from "@repo/ha";
import { useRouter } from "next/navigation";
import { useHA } from "@repo/ha";
import { useEntitlementCheck } from "@repo/hooks/useEntitlements";
import Icon from "@mdi/react";
import { mdiHomeAssistant, mdiPlus, mdiArrowRight, mdiAlertCircle } from "@mdi/js";
import { InstancesHeader } from "./InstancesHeader";
import { HAInstance } from "./HAInstance";
import { AddInstance } from "./AddInstance";

interface HAInstanceManagerProps {
  compact?: boolean;
  haInstances: HAInstance[];
}

export function HAInstanceManager({
  compact = false,
  haInstances,
}: HAInstanceManagerProps) {
  const { connection } = useHA();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", hass_url: "" });
  const router = useRouter();

  // Get entitlements for conditional rendering
  const { 
    entitlements, 
    loading: entitlementsLoading, 
    error: entitlementsError,
    canCreateHAInstance,
    getRemainingHAInstances 
  } = useEntitlementCheck();

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
        await connect({ homeAssistantUrl: formattedUrl });
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
        <HAInstance
          key={i.id}
          instance={i}
          compact={compact}
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
          <Icon 
            path={mdiHomeAssistant} 
            className="w-8 h-8 text-primary-600" 
          />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Home Assistant instances yet
        </h3>
        <p className="text-foreground-500 text-center mb-6 max-w-sm">
          Connect your Home Assistant instance to start managing your smart home devices and creating beautiful dashboards.
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

  // Show loading state for entitlements
  if (entitlementsLoading) {
    return (
      <Skeleton className="w-full h-full rounded-lg" />
    );
  }

  // Show error state for entitlements
  if (entitlementsError) {
    return (
      <Card className="w-full">
        <CardBody className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-danger-100 rounded-2xl flex items-center justify-center">
            <Icon path={mdiAlertCircle} className="w-8 h-8 text-danger" />
          </div>
          <h3 className="text-lg font-semibold text-theme-text mb-2">
            Error Loading Entitlements
          </h3>
          <p className="text-theme-text-secondary mb-4">
            {entitlementsError}
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardBody>
      </Card>
    );
  }

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
          renderEmptyState()
        ) : (
          renderInstancesList())
        }

        {!compact && (
          canCreate() ? (
            <div data-create-form>
              {renderCreateForm()}
            </div>
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
