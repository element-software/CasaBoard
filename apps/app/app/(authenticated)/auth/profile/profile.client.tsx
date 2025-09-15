"use client";
import { Card, CardBody, Button, Avatar, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";

type Profile = {
  email: string | null;
  id: string | null;
  verified: boolean;
  lastSignIn: string | null;
};

type Entitlements = {
  planId: string;
  active: boolean;
  trialEndsAt: string | null;
  maxDashboards: number;
  maxHAInstances: number;
};

export default function ProfileClient({ profile, entitlements }: { profile: Profile; entitlements: Entitlements }) {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-theme-text mb-4">Your Profile</h1>
      <Card className="bg-theme-background border border-theme-border">
        <CardBody className="p-6">
          <div className="flex items-start gap-4">
            <Avatar
              name={(profile.email || "?")[0].toUpperCase()}
              size="lg"
              className="bg-theme-primary text-black"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-theme-text font-medium">{profile.email}</p>
                {profile.verified ? (
                  <Chip size="sm" color="success" variant="flat">
                    Verified
                  </Chip>
                ) : (
                  <Chip size="sm" variant="flat">
                    Unverified
                  </Chip>
                )}
              </div>
              <p className="text-theme-text-secondary text-sm">
                User ID: {profile.id}
              </p>
              {profile.lastSignIn && (
                <p className="text-theme-text-secondary text-sm">
                  Last sign in: {new Date(profile.lastSignIn).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex items-center flex-wrap gap-2">
              <Chip color={entitlements.active ? "success" : "warning"} variant="flat">
                {entitlements.active ? "Active" : "Inactive"}
              </Chip>
              <Chip variant="flat">Plan: {entitlements.planId}</Chip>
              {entitlements.trialEndsAt && (
                <Chip variant="flat">Trial ends: {new Date(entitlements.trialEndsAt).toLocaleDateString()}</Chip>
              )}
              <Chip variant="flat">Dashboards: {entitlements.maxDashboards < 0 ? "∞" : entitlements.maxDashboards}</Chip>
              <Chip variant="flat">HA Instances: {entitlements.maxHAInstances < 0 ? "∞" : entitlements.maxHAInstances}</Chip>
            </div>

            <div className="flex gap-3">
              <Button
                color="primary"
                variant="bordered"
                onPress={() => router.push("/setup")}
              >
                Go to Dashboard
              </Button>
              <Button
                as="a"
                href="/billing"
                color="primary"
              >
                Manage billing
              </Button>
              <Button color="danger" as="a" href="/auth/login?signout=1">
                Sign out
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
