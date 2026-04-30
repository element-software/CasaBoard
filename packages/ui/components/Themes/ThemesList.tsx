"use client";

import { useState, useTransition } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import type { Theme } from "@repo/types/theme";
import {
  createTheme,
  deleteTheme,
  duplicateTheme,
} from "@repo/lib/actions/themeActions";
import { useRouter } from "next/navigation";

type ThemesListProps = {
  initialThemes: Theme[];
};

export function ThemesList({ initialThemes }: ThemesListProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const create = () => {
    setError(null);
    startTransition(async () => {
      try {
        const t = await createTheme({
          name: name.trim() || "New theme",
        });
        setName("");
        router.push(`/setup/themes/${t.id}/edit`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not create theme");
      }
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTheme(id);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not delete");
      }
    });
  };

  const dup = (id: string) => {
    startTransition(async () => {
      try {
        const t = await duplicateTheme(id);
        router.push(`/setup/themes/${t.id}/edit`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not duplicate");
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-800">
          {error}
        </div>
      )}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-theme-border p-4 bg-theme-surface">
        <Input
          label="New theme name"
          placeholder="e.g. Midnight lounge"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-sm"
        />
        <Button color="primary" onPress={create} isLoading={pending}>
          Add theme
        </Button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {initialThemes.map((t) => (
          <li
            key={t.id}
            className="rounded-xl border border-theme-border bg-theme-background p-4 flex flex-col gap-3"
          >
            <div>
              <p className="font-semibold text-theme-text">{t.name}</p>
              <p className="text-xs text-theme-text-secondary">
                Updated {new Date(t.updated_at).toLocaleString("en-GB")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              <Link href={`/setup/themes/${t.id}/edit`}>
                <Button size="sm" color="primary">
                  Edit
                </Button>
              </Link>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => dup(t.id)}
                isDisabled={pending}
              >
                Duplicate
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => remove(t.id)}
                isDisabled={pending}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {initialThemes.length === 0 && (
        <p className="text-theme-text-secondary text-sm">
          No custom themes yet. Add one above or use the default built-in palette on each page.
        </p>
      )}
    </div>
  );
}
