"use client";
import React from "react";
import { Card, CardBody, Button, Chip, Switch } from "@heroui/react";
import { useComponentTheme } from "@repo/hooks/useTheme";
import { useTheme } from "@repo/hooks/useTheme";
import Icon from "@mdi/react";
import { mdiLightbulb, mdiLightbulbOff, mdiCheck, mdiClose } from "@mdi/js";

export const ThemeDemo: React.FC = () => {
  const { setTheme, currentTheme } = useTheme();
  const themeUtils = useComponentTheme();

  const states = ["on", "off", "unavailable", "unknown"];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: themeUtils.getTextColor("primary") }}>
          Theme Demo
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            color={currentTheme === "dark" ? "primary" : "default"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
          <Button
            size="sm"
            color={currentTheme === "light" ? "primary" : "default"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {states.map((state) => (
          <Card
            key={state}
            style={{
              ...themeUtils.getCardStyles(state),
              ...themeUtils.getShadowStyles(state),
            }}
          >
            <CardBody className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Icon
                  path={state === "on" ? mdiLightbulb : mdiLightbulbOff}
                  className="h-6 w-6"
                  style={{ color: themeUtils.getIconColor(state) }}
                />
                <Switch
                  isSelected={state === "on"}
                  color={themeUtils.getChipColor(state)}
                  size="sm"
                />
              </div>
              
              <div className="space-y-2">
                <h3 
                  className="font-medium capitalize"
                  style={{ color: themeUtils.getTextColor("primary") }}
                >
                  {state} State
                </h3>
                
                <Chip
                  size="sm"
                  color={themeUtils.getChipColor(state)}
                  variant="flat"
                  startContent={
                    <Icon 
                      path={state === "on" ? mdiCheck : mdiClose} 
                      className="h-3 w-3" 
                    />
                  }
                >
                  {state}
                </Chip>
                
                <div 
                  className="text-xs"
                  style={{ color: themeUtils.getTextColor("secondary") }}
                >
                  Color: {themeUtils.getEntityStateColor(state)}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card style={themeUtils.getCardStyles()}>
        <CardBody className="p-4">
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: themeUtils.getTextColor("primary") }}
          >
            Theme Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Current Theme:</span> {currentTheme}
            </div>
            <div>
              <span className="font-medium">Background:</span> {themeUtils.getBackgroundColor("background")}
            </div>
            <div>
              <span className="font-medium">Surface:</span> {themeUtils.getBackgroundColor("surface")}
            </div>
            <div>
              <span className="font-medium">Primary:</span> {themeUtils.getButtonColor("primary")}
            </div>
            <div>
              <span className="font-medium">Success:</span> {themeUtils.getButtonColor("success")}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
