"use client";
import { Card, CardBody, Button, Avatar, Chip, Divider } from "@heroui/react";
import { Profile } from "@repo/types/user";
import { useRouter } from "next/navigation";
import { DataPortabilityPanel } from "@repo/ui/components/Shared/util/DataPortability";

export default function ProfileClient({
  profile,
}: {
  profile: Profile;
}) {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-theme-text">Profile</h1>
        <p className="text-theme-text-secondary">
          Manage your account and data
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-theme-background border border-theme-border">
          <CardBody className="p-6 flex flex-col items-stretch">
            <div className="flex items-start gap-4">
              <Avatar
                name={(profile.email || "?")[0].toUpperCase()}
                size="lg"
                className="bg-theme-primary text-black"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-theme-text font-medium truncate">
                    {profile.email}
                  </p>
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
                <div className="mt-2 space-y-1 text-sm text-theme-text-secondary">
                  <p className="truncate">User ID: {profile.id}</p>
                  {profile.lastSignIn && (
                    <p>
                      Last sign in:{" "}
                      {new Date(profile.lastSignIn).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex flex-row gap-3 h-full items-end">
              <Button
                color="primary"
                variant="bordered"
                onPress={() => router.push("/setup")}
              >
                Go to Dashboard
              </Button>
              <Button color="danger" as="a" href="/auth/login?signout=1">
                Sign out
              </Button>
            </div>
          </CardBody>
        </Card>

        <DataPortabilityPanel />
      </div>
    </div>
  );
}
