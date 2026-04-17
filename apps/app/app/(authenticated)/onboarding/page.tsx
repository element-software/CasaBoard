"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import Icon from "@mdi/react";
import {
  mdiCloudOutline,
  mdiDatabaseOutline,
  mdiCheckCircleOutline,
  mdiLockOutline,
  mdiSyncCircle,
  mdiDevices,
  mdiShieldLockOutline,
} from "@mdi/js";
import { useStorageMode, StorageMode } from "@repo/ui/components/Shared/util/StorageModeProvider";

export default function OnboardingPage() {
  const router = useRouter();
  const { storageMode, isOnboarded, setStorageMode, isLoading } = useStorageMode();
  const [selected, setSelected] = useState<StorageMode | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // If already onboarded on this device, skip straight to setup
  useEffect(() => {
    if (!isLoading && isOnboarded && storageMode) {
      router.replace("/setup");
    }
  }, [isLoading, isOnboarded, storageMode, router]);

  // Check whether this user has an active paid subscription
  useEffect(() => {
    async function checkSub() {
      try {
        const res = await fetch("/api/check-trial-status");
        if (res.ok) {
          const data = await res.json();
          setIsPaidUser(data.isTrial || data.isActive);
        }
      } catch {
        // silently fail — cloud option just stays disabled
      } finally {
        setCheckingSubscription(false);
      }
    }
    checkSub();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setStorageMode(selected);
    router.push("/setup");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome to CasaBoard</h1>
          <p className="text-foreground-500 text-lg">
            Where would you like to store your dashboard data?
          </p>
          <p className="text-sm text-foreground-400">
            This preference is saved <span className="font-medium">per device</span>{" "}
            and can be changed later in your profile settings.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Local Mode */}
          <button
            type="button"
            onClick={() => setSelected("local")}
            className={`text-left rounded-2xl border-2 transition-all p-0 focus:outline-none ${
              selected === "local"
                ? "border-primary shadow-lg"
                : "border-divider hover:border-primary/50"
            }`}
          >
            <Card
              className={`h-full border-none shadow-none rounded-2xl ${
                selected === "local" ? "bg-primary/5" : "bg-content1"
              }`}
            >
              <CardBody className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon path={mdiDatabaseOutline} className="w-7 h-7 text-primary" />
                  </div>
                  {selected === "local" && (
                    <Icon path={mdiCheckCircleOutline} className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold">Local Storage</h2>
                    <Chip size="sm" color="success" variant="flat">Free</Chip>
                  </div>
                  <p className="text-sm text-foreground-500">
                    Your dashboard config is stored <strong>in this browser</strong>.
                    Fast, private, and available offline once loaded.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  {[
                    { icon: mdiShieldLockOutline, label: "Private — data never leaves your device" },
                    { icon: mdiLockOutline, label: "HA credentials always stored locally" },
                    { icon: mdiDevices, label: "Per-device — different browsers = different data" },
                  ].map(({ icon, label }) => (
                    <li key={label} className="flex items-start gap-2 text-foreground-600">
                      <Icon path={icon} className="w-4 h-4 mt-0.5 flex-shrink-0 text-success" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </button>

          {/* Cloud Mode */}
          <button
            type="button"
            onClick={() => isPaidUser && setSelected("cloud")}
            disabled={!isPaidUser && !checkingSubscription}
            className={`text-left rounded-2xl border-2 transition-all p-0 focus:outline-none ${
              !isPaidUser && !checkingSubscription
                ? "border-divider opacity-60 cursor-not-allowed"
                : selected === "cloud"
                  ? "border-secondary shadow-lg"
                  : "border-divider hover:border-secondary/50"
            }`}
          >
            <Card
              className={`h-full border-none shadow-none rounded-2xl ${
                selected === "cloud" ? "bg-secondary/5" : "bg-content1"
              }`}
            >
              <CardBody className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Icon path={mdiCloudOutline} className="w-7 h-7 text-secondary" />
                  </div>
                  <div className="flex items-center gap-1">
                    {!isPaidUser && !checkingSubscription && (
                      <Chip size="sm" color="default" variant="flat">Paid plans only</Chip>
                    )}
                    {selected === "cloud" && (
                      <Icon path={mdiCheckCircleOutline} className="w-6 h-6 text-secondary" />
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold">Cloud Sync</h2>
                    <Chip size="sm" color="secondary" variant="flat">Paid</Chip>
                  </div>
                  <p className="text-sm text-foreground-500">
                    Dashboard configs are <strong>backed up and synced</strong> via
                    CasaBoard servers. Access from any device.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  {[
                    { icon: mdiSyncCircle, label: "Sync across all your devices" },
                    { icon: mdiCloudOutline, label: "Automatic cloud backups" },
                    { icon: mdiLockOutline, label: "HA credentials remain local always" },
                  ].map(({ icon, label }) => (
                    <li key={label} className="flex items-start gap-2 text-foreground-600">
                      <Icon path={icon} className="w-4 h-4 mt-0.5 flex-shrink-0 text-secondary" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
                {!isPaidUser && !checkingSubscription && (
                  <p className="text-xs text-foreground-400 border-t border-divider pt-3">
                    Upgrade to a paid plan to enable cloud sync.
                  </p>
                )}
              </CardBody>
            </Card>
          </button>
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-3">
          <Button
            color="primary"
            size="lg"
            className="w-full sm:w-auto sm:px-12"
            isDisabled={!selected}
            onPress={handleContinue}
          >
            Continue
          </Button>
          <p className="text-xs text-foreground-400">
            You can change this preference at any time in{" "}
            <strong>Profile → Storage</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
