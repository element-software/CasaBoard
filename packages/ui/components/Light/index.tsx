"use client";
import { useCallback, useState, useEffect } from "react";
import { Card, CardBody, cn } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiAlert, mdiLightbulb } from "@mdi/js";
import EntityIcon from "@repo/ui/components/EntityIcon";
import { useDebouncedSlider } from "@repo/hooks/useDebounce";
import { LightUtils } from "@repo/utils";
import { useEntity } from "@repo/ha";

interface LightProps {
  entityId: string;
  dimmer?: boolean;
  temperature?: boolean;
  color?: boolean;
  [key: string]: any;
}

export const Light = ({
  entityId,
  dimmer = false,
  temperature = false,
  color = false,
  ...props
}: LightProps) => {
  console.log("Light:: entityId", entityId);

  // Hook
  const entity = useEntity(entityId);

  console.log("Light:: entity", entity);

  // Local drag state
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // Simple actions via the new hook helpers
  const handleTurnOn = () => entity?.turn_on?.();
  const handleTurnOff = () => entity?.turn_off?.();
  const handleToggle = () => entity?.toggle?.();

  // Immediate handlers using callService
  const setBrightnessImmediate = (value: number) => {
    entity?.callService?.("turn_on", { brightness: value });
  };

  const setTemperatureImmediate = (value: number) => {
    entity?.callService?.("turn_on", {
      // @ts-ignore Home Assistant service data key
      color_temp_kelvin: value,
    });
  };

  // Debounced handlers for slider actions
  const debouncedSetBrightness = useDebouncedSlider(
    setBrightnessImmediate,
    150
  );
  const debouncedSetTemperature = useDebouncedSlider(
    setTemperatureImmediate,
    150
  );
  const setColorImmediate = (value: string) => {
    const r = parseInt(value.substring(1, 3), 16);
    const g = parseInt(value.substring(3, 5), 16);
    const b = parseInt(value.substring(5, 7), 16);
    entity?.callService?.("turn_on", { rgb_color: [r, g, b] });
  };

  const debouncedSetColor = useDebouncedSlider(setColorImmediate, 150);

  const handleBrightnessChange = useCallback(
    (value: number) => {
      debouncedSetBrightness(value);
    },
    [debouncedSetBrightness, entityId]
  );

  const handleTemperatureChange = useCallback(
    (value: number) => {
      debouncedSetTemperature(value);
    },
    [debouncedSetTemperature, entityId]
  );

  const handleColorChange = useCallback(
    (value: string) => {
      debouncedSetColor(value);
    },
    [debouncedSetColor, entityId]
  );


  // Calculate brightness percentage for background - use entity brightness for initial value
  const entityBrightness = entity?.attributes.brightness || 0;
  const currentBrightness = entityBrightness;
  const brightnessPercentage = Math.round((currentBrightness / 255) * 100);
  const isOn = entity?.state === "on";

  // Create background color based on brightness - make it look like a slider
  const getBackgroundColor = () => {
    if (!isOn) return "background";

    // For non-dimmable lights, fill the entire background when on
    if (!dimmer) {
      const primaryColor = "on";
      return primaryColor;
    }

    // For dimmable lights, use gradient based on brightness
    const percentage = brightnessPercentage;
    const primaryColor = "on";
    const baseColor = "background";

    // Create a linear gradient that fills the card based on brightness percentage
    // Add a subtle transition at the edge for better visual feedback
    return `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${percentage}%, ${baseColor} ${Math.min(percentage + 2, 100)}%, ${baseColor} 100%)`;
  };

  // Handle click for toggle (only if not dragging and hasn't dragged)
  const handleCardClick = useCallback(() => {
    if (entity && !isDragging && !hasDragged) {
      handleToggle();
    }
  }, [entity, isDragging, hasDragged]);

  // Handle drag for brightness adjustment (only if dimmer is enabled and light is on)
  const handleCardDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dimmer || !isOn || !isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      // Mark that we've dragged
      setHasDragged(true);

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const brightness = Math.round((percentage / 100) * 255);

      handleBrightnessChange(brightness);
    },
    [dimmer, isOn, isDragging, handleBrightnessChange]
  );

  // Handle mouse down to start dragging (only for dimmable lights)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (dimmer && isOn) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        handleCardDrag(e);
      }
    },
    [dimmer, isOn, handleCardDrag]
  );

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow for click detection
    setTimeout(() => setHasDragged(false), 100);
  }, []);

  // Handle mouse leave to stop dragging
  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    // Reset hasDragged after a short delay to allow for click detection
    setTimeout(() => setHasDragged(false), 100);
  }, []);

  // Add global mouse event listeners for proper drag handling
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      // Reset hasDragged after a short delay to allow for click detection
      setTimeout(() => setHasDragged(false), 100);
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("mouseleave", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mouseleave", handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Early return for missing entityId - must come after all hooks
  if (!entityId) {
    return (
      <Card
        className="p-4 border-2 border-dashed"
        style={{
          borderColor: "border",
          backgroundColor: "background",
        }}
      >
        <CardBody className="text-center">
          <Icon path={mdiLightbulb} className="h-12 w-12 mx-auto mb-2" />
          <p>Configure Light Entity</p>
        </CardBody>
      </Card>
    );
  }

  // Error state: treat only explicit 'unavailable' as error.
  if (!entity || entity.state === "unavailable") {
    return (
      <Card className="p-4 border-2 border-dashed">
        <CardBody className="text-center">
          <Icon path={mdiAlert} className="h-12 w-12 mx-auto mb-2" />
          <p>Light not available</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      key={entity.entity_id}
      className={cn(
        "w-full cursor-pointer transition-all duration-200 hover:shadow-lg select-none",
        // If no dimmer and on → full primary background; else base background
        isOn && !dimmer ? "bg-theme-primary text-white" : LightUtils.stateClassNameBg(entity)
      )}
      isPressable
      onPress={handleCardClick}
      onMouseMove={dimmer ? handleCardDrag : undefined}
      onMouseDown={dimmer ? handleMouseDown : undefined}
      onMouseUp={dimmer ? handleMouseUp : undefined}
      onMouseLeave={dimmer ? handleMouseLeave : undefined}
      style={
        dimmer && isOn
          ? {
              background: `linear-gradient(to right, var(--theme-primary) 0%, var(--theme-primary) ${brightnessPercentage}%, var(--theme-card-background) ${Math.min(
                brightnessPercentage + 2,
                100
              )}%, var(--theme-card-background) 100%)`,
            }
          : undefined
      }
    >
      <CardBody className="p-3 relative overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          {/* Entity Icon */}
          <EntityIcon
            entity={entity}
            className={cn(
              "h-8 w-8 flex-shrink-0",
              isOn && !dimmer ? "text-white" : LightUtils.stateClassNameIcon(entity)
            )}
          />

          {/* Entity Name and Brightness */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Entity Name */}
            <h3 className="text-sm font-semibold capitalize truncate">
              {entity.attributes?.friendly_name || entity.entity_id || entityId}
            </h3>

            {/* Brightness Percentage (only show if dimmer is enabled and light is on) */}
            {dimmer && isOn && (
              <div className="text-xs font-medium">{brightnessPercentage}%</div>
            )}
          </div>
        </div>

        {/* Visual brightness indicator line */}
        {dimmer && isOn && (
          <div
            className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
            style={{
              width: `${brightnessPercentage}%`,
              backgroundColor: "var(--theme-primary)",
              boxShadow: `0 0 4px var(--theme-primary)40`,
              maxWidth: "100%",
            }}
          />
        )}
      </CardBody>
    </Card>
  );
};
