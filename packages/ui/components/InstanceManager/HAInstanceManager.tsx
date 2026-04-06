"use client";
import { useState, useEffect } from "react";
import { HAInstanceStorage, LinkService } from "@repo/lib";
import { Card, CardBody, Link, Button } from "@heroui/react";
import { connect } from "@repo/ha";
import { useRouter } from "next/navigation";
import { useHA } from "@repo/ha";
import Icon from "@mdi/react";
import {
  mdiHomeAssistant,
} from "@mdi/js";
import { InstancesHeader } from "./InstancesHeader";
import { HAInstance } from "./HAInstance";
import { HAInstance as HAInstanceType } from "@repo/types/ha";
import { AddInstance } from "./AddInstance";
import { HassConnectWrapper } from "../Shared/util/HassConnectWrapper";
import { StoredHAInstance } from "@repo/lib/storage/haInstanceStorage";

interface HAInstanceManagerProps {
  compact?: boolean;
}

export function HAInstanceManager({
  compact = false,
}: HAInstanceManagerProps) {
  const { connection } = useHA();

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ name: "", hass_url: "" });
  const [haInstances, setHaInstances] = useState<StoredHAInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    HAInstanceStorage.listHAInstances()
      .then(setHaInstances)
      .catch((e) => setError(e?.message || "Failed to load instances"))
      .finally(() => setLoading(false));
  }, []);

  const onCreate = async () => {
    setIsPending(true);
    setError(null);
    const formattedUrl = `https://${form.hass_url}`;
    try {
      const created = await HAInstanceStorage.createHAInstance({
        name: form.name || `Instance ${haInstances.length + 1}`,
        hass_url: formattedUrl,
      });
      setHaInstances((prev) => [...prev, created]);
      await connect({
        haInstance: {
          hass_url: formattedUrl,
          name: created.name,
          id: created.id,
          hass_token: "",
          created_at: created.created_at,
        },
      });
    } catch (e: any) {
      setError(e?.message || "Failed to create instance");
    } finally {
      setIsPending(false);
    }
  };

  const onDelete = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await HAInstanceStorage.deleteHAInstance(id);
      setHaInstances((prev) => prev.filter((i) => i.id !== id));
      connection?.close();
      router.push("/setup/ha-config");
    } catch (e: any) {
      setError(e?.message || "Failed to delete instance");
    } finally {
      setIsPending(false);
    }
  };

  const renderHeader = () => (
    <InstancesHeader
      count={haInstances?.length ?? 0}
      compact={compact}
      manageHref={LinkService.crossAppHrefClient("app", "/setup/ha-config")}
    />
  );

  const renderInstancesList = () => (
    <div className="space-y-3">
      {haInstances.map((i) => {
        const instanceForHA: HAInstanceType = {
          ...i,
          hass_token: "",
        };
        return (
          <HassConnectWrapper key={i.id} haInstance={instanceForHA} onDelete={onDelete}>
            <HAInstance
              key={i.id}
              instance={instanceForHA}
              compact={compact}
              onDelete={onDelete}
            />
          </HassConnectWrapper>
        );
      })}
    </div>
  );

  const renderCreateForm = () => (
    <AddInstance
      form={form}
      setForm={setForm}
      onCreate={onCreate}
      canCreate={() => true}
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

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-foreground-500 text-sm">Loading...</div>
          </div>
        ) : haInstances.length === 0 ? (
          renderEmptyState()
        ) : (
          renderInstancesList()
        )}

        {!compact && !loading && renderCreateForm()}
      </CardBody>
    </Card>
  );
}
