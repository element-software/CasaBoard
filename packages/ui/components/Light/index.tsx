"use client";
import { EntityName, useEntity, useHass } from "@hakit/core";
import { useCallback, useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import Icon from "@mdi/react";
import { mdiAlert, mdiLightbulb } from "@mdi/js";
import EntityIcon from "@repo/ui/components/EntityIcon";
import { useComponentTheme } from "@repo/hooks/useTheme";
import { useDebouncedSlider } from "@repo/hooks/useDebounce";

interface LightProps {
  entityId: EntityName;
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
  const themeUtils = useComponentTheme();

  // Local state for immediate slider feedback
  const [localBrightness, setLocalBrightness] = useState<number | null>(null);
  const [localTemperature, setLocalTemperature] = useState<number | null>(null);
  const [localColor, setLocalColor] = useState<string | null>(null);

  // Track dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // All hooks must be called before any conditional returns
  const entity = useEntity(entityId, { returnNullIfNotFound: true });
  const { callService } = useHass();

  // All other hooks must also be called before conditional returns
  const handleTurnOn = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const handleTurnOff = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_off",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  const handleToggle = useCallback(
    (entityId: EntityName) => {
      callService({
        domain: "light",
        service: "toggle",
        target: {
          entity_id: entityId,
        },
      });
    },
    [callService]
  );

  // Immediate handlers for non-slider actions
  const setBrightnessImmediate = useCallback(
    (value: number, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          brightness: value,
        },
      });
    },
    [callService]
  );

  const setTemperatureImmediate = useCallback(
    (value: number, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          // @ts-ignore
          color_temp_kelvin: value,
        },
      });
    },
    [callService]
  );

  const setColorImmediate = useCallback(
    (value: string, entityId: EntityName) => {
      callService({
        domain: "light",
        service: "turn_on",
        target: {
          entity_id: entityId,
        },
        serviceData: {
          rgb_color: [
            parseInt(value.substring(1, 3), 16),
            parseInt(value.substring(3, 5), 16),
            parseInt(value.substring(5, 7), 16),
          ],
        },
      });
    },
    [callService]
  );

  // Debounced handlers for slider actions
  const debouncedSetBrightness = useDebouncedSlider(setBrightnessImmediate, 150);
  const debouncedSetTemperature = useDebouncedSlider(setTemperatureImmediate, 150);
  const debouncedSetColor = useDebouncedSlider(setColorImmediate, 150);

  const handleBrightnessChange = useCallback(
    (value: number) => {
      setLocalBrightness(value);
      debouncedSetBrightness(value, entityId as EntityName);
    },
    [debouncedSetBrightness, entityId]
  );

  const handleTemperatureChange = useCallback(
    (value: number) => {
      setLocalTemperature(value);
      debouncedSetTemperature(value, entityId as EntityName);
    },
    [debouncedSetTemperature, entityId]
  );

  const handleColorChange = useCallback(
    (value: string) => {
      setLocalColor(value);
      debouncedSetColor(value, entityId as EntityName);
    },
    [debouncedSetColor, entityId]
  );

  // Sync local state with entity state when entity changes
  useEffect(() => {
    if (entity) {
      if (localBrightness === null) {
        setLocalBrightness(entity.attributes.brightness || 0);
      }
      if (localTemperature === null) {
        setLocalTemperature(entity.attributes.color_temp_kelvin || 0);
      }
      if (localColor === null) {
        setLocalColor(entity.custom.hexColor || "#ffffff");
      }
    }
  }, [entity, localBrightness, localTemperature, localColor]);


  // Get theme styles
  const cardStyles = themeUtils.getCardStyles(entity?.state);
  const shadowStyles = themeUtils.getShadowStyles(entity?.state);
  const hoverStyles = themeUtils.getHoverStyles(entity?.state);

  // Calculate brightness percentage for background - use entity brightness for initial value
  const entityBrightness = entity?.attributes.brightness || 0;
  const currentBrightness = localBrightness ?? entityBrightness;
  const brightnessPercentage = Math.round((currentBrightness / 255) * 100);
  const isOn = entity?.state === "on";
  
  // Create background color based on brightness - make it look like a slider
  const getBackgroundColor = () => {
    if (!isOn) return themeUtils.getCardStyles().backgroundColor;
    
    // For non-dimmable lights, fill the entire background when on
    if (!dimmer) {
      const primaryColor = themeUtils.getEntityStateColor("on");
      return primaryColor;
    }
    
    // For dimmable lights, use gradient based on brightness
    const percentage = brightnessPercentage;
    const primaryColor = themeUtils.getEntityStateColor("on");
    const baseColor = themeUtils.getCardStyles().backgroundColor;
    
    // Create a linear gradient that fills the card based on brightness percentage
    // Add a subtle transition at the edge for better visual feedback
    return `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${percentage}%, ${baseColor} ${Math.min(percentage + 2, 100)}%, ${baseColor} 100%)`;
  };

  // Handle click for toggle (only if not dragging and hasn't dragged)
  const handleCardClick = useCallback(() => {
    if (entity && !isDragging && !hasDragged) {
      handleToggle(entity.entity_id as EntityName);
    }
  }, [entity, isDragging, hasDragged, handleToggle]);

  // Handle drag for brightness adjustment (only if dimmer is enabled and light is on)
  const handleCardDrag = useCallback((e: React.MouseEvent) => {
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
  }, [dimmer, isOn, isDragging, handleBrightnessChange]);

  // Handle mouse down to start dragging (only for dimmable lights)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dimmer && isOn) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      handleCardDrag(e);
    }
  }, [dimmer, isOn, handleCardDrag]);

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
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isDragging]);

   // Early return for missing entityId - must come after all hooks
   if (!entityId) {
    return (
      <Card
        className="p-4 border-2 border-dashed"
        style={{
          borderColor: themeUtils.getBorderColor(),
          backgroundColor: themeUtils.getCardStyles().backgroundColor,
        }}
      >
        <CardBody
          className="text-center"
          style={{ color: themeUtils.getTextColor("secondary") }}
        >
          <Icon
            path={mdiLightbulb}
            className="h-12 w-12 mx-auto mb-2"
            style={{ color: themeUtils.getTextColor("secondary") }}
          />
          <p>Configure Light Entity</p>
        </CardBody>
      </Card>
    );
  }

  // Error state
  if (!entity || entity.state === "unavailable" || entity.state === "unknown") {
    return (
      <Card
        className="p-4 border-2 border-dashed"
        style={{
          borderColor: themeUtils.getBorderColor(),
          backgroundColor: themeUtils.getCardStyles().backgroundColor,
        }}
      >
        <CardBody
          className="text-center"
          style={{ color: themeUtils.getTextColor("secondary") }}
        >
          <Icon
            path={mdiAlert}
            className="h-12 w-12 mx-auto mb-2"
            style={{ color: themeUtils.getTextColor("secondary") }}
          />
          <p>Light not available</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      key={entity.entity_id}
      className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg select-none"
      style={{
        ...shadowStyles,
        ...hoverStyles,
        background: getBackgroundColor(),
        borderColor: isOn ? themeUtils.getEntityStateColor("on") : themeUtils.getBorderColor(),
        color: isOn ? themeUtils.getTextColor("primary") : themeUtils.getTextColor("secondary"),
        position: 'relative',
      }}
      isPressable
      onPress={handleCardClick}
      onMouseMove={dimmer ? handleCardDrag : undefined}
      onMouseDown={dimmer ? handleMouseDown : undefined}
      onMouseUp={dimmer ? handleMouseUp : undefined}
      onMouseLeave={dimmer ? handleMouseLeave : undefined}
    >
      <CardBody className="p-3 relative overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          {/* Entity Icon */}
          <EntityIcon
            entity={entity}
            className="h-8 w-8 flex-shrink-0"
            style={{ 
              color: isOn ? '#ffffff' : themeUtils.getTextColor("secondary"),
              filter: isOn ? 'none' : 'grayscale(100%)',
              textShadow: isOn ? '0 0 6px rgba(0,0,0,0.5)' : 'none',
              backgroundColor: isOn ? 'rgba(0,0,0,0.2)' : 'transparent',
              borderRadius: '50%',
              padding: '4px'
            }}
          />
          
          {/* Entity Name and Brightness */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Entity Name */}
            <h3
              className="text-sm font-semibold capitalize truncate"
              style={{ 
                color: isOn ? '#ffffff' : themeUtils.getTextColor("secondary"),
                textShadow: isOn ? '0 0 4px rgba(0,0,0,0.7)' : 'none'
              }}
            >
              {entity.attributes.friendly_name}
            </h3>
            
            {/* Brightness Percentage (only show if dimmer is enabled and light is on) */}
            {dimmer && isOn && (
              <div
                className="text-xs font-medium"
                style={{ 
                  color: '#ffffff',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}
              >
                {brightnessPercentage}%
              </div>
            )}
          </div>
        </div>
        
        {/* Visual brightness indicator line */}
        {dimmer && isOn && (
          <div 
            className="absolute bottom-0 left-0 h-0.5 rounded-b-lg"
            style={{
              width: `${brightnessPercentage}%`,
              backgroundColor: themeUtils.getEntityStateColor("on"),
              boxShadow: `0 0 4px ${themeUtils.getEntityStateColor("on")}40`,
              maxWidth: '100%'
            }}
          />
        )}
      </CardBody>
    </Card>
  );
};