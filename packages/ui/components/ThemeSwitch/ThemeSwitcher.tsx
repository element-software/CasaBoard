"use client";
import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useTheme } from "@repo/hooks/useTheme";
import Icon from "@mdi/react";
import { mdiPalette, mdiCheck } from "@mdi/js";

const themes = [
  { key: "dark", name: "Dark", description: "Dark gray background with gold accent" },
  { key: "light", name: "Light", description: "White background with blue accent" },
];

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, theme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="ghost"
          startContent={<Icon path={mdiPalette} className="h-4 w-4" />}
          className="min-w-0"
        >
          {themes.find(t => t.key === currentTheme)?.name || "Theme"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[currentTheme]}
        onSelectionChange={(keys) => {
          const selectedTheme = Array.from(keys)[0] as string;
          if (selectedTheme) {
            setTheme(selectedTheme);
          }
        }}
      >
        {themes.map((themeOption) => (
          <DropdownItem
            key={themeOption.key}
            startContent={
              currentTheme === themeOption.key ? (
                <Icon path={mdiCheck} className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4" />
              )
            }
          >
            <div className="flex flex-col">
              <span className="font-medium">{themeOption.name}</span>
              <span className="text-xs text-gray-500">{themeOption.description}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
