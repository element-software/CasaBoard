"use client";
import { Button, User } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiAccount, mdiLogout } from "@mdi/js";
import Link from "next/link";
import { SupabaseClient } from "@repo/lib";
import { useRouter } from "next/navigation";

export function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const supabase = SupabaseClient.createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  if (!user) return null;
  return (
    <div className="flex items-center gap-2 w-full">
      <User
        name={user.email}
        avatarProps={{
          src: user.avatar_url,
          className:
            "border border-theme-border bg-theme-background p-2 w-4 h-4",
        }}
        classNames={{
          base: "border border-theme-border bg-theme-background p-2 w-full",
          name: "text-theme-text text-xs",
        }}
      />
      <Button
        size="sm"
        color="danger"
        onPress={handleLogout}
        className="min-w-24"
      >
        <Icon path={mdiLogout} className="w-4 h-4 text-white" />
        Sign out
      </Button>
    </div>
  );
}
