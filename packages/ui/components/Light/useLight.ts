"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedSlider } from "@repo/hooks/useDebounce";
import { useEntityLoading } from "@repo/hooks/useEntityLoading";

export interface UseLightControllerOptions {
  dimmer: boolean;
}

export function useLightLoading(entity: any, timeoutMs: number = 10000) {
  return useEntityLoading(entity, { timeoutMs });
}

export function useLightController(entity: any, entityId: string, options: UseLightControllerOptions) {
  const { dimmer } = options;

  // Local drag state
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  // Derived state
  const entityBrightness: number = entity?.attributes?.brightness || 0;
  const currentBrightness: number = entityBrightness;
  const brightnessPercentage: number = Math.round((currentBrightness / 255) * 100);
  const isOn: boolean = entity?.state === "on";

  // Immediate service calls
  const setBrightnessImmediate = useCallback(
    (value: number) => {
      entity?.callService?.("turn_on", { brightness: value });
    },
    [entity]
  );

  const setTemperatureImmediate = useCallback(
    (value: number) => {
      entity?.callService?.("turn_on", {
        // @ts-ignore Home Assistant service data key
        color_temp_kelvin: value,
      });
    },
    [entity]
  );

  const setColorImmediate = useCallback(
    (value: string) => {
      const r = parseInt(value.substring(1, 3), 16);
      const g = parseInt(value.substring(3, 5), 16);
      const b = parseInt(value.substring(5, 7), 16);
      entity?.callService?.("turn_on", { rgb_color: [r, g, b] });
    },
    [entity]
  );

  // Debounced handlers for slider actions
  const debouncedSetBrightness = useDebouncedSlider(setBrightnessImmediate, 150);
  const debouncedSetTemperature = useDebouncedSlider(setTemperatureImmediate, 150);
  const debouncedSetColor = useDebouncedSlider(setColorImmediate, 150);

  const handleBrightnessChange = useCallback(
    (value: number) => {
      debouncedSetBrightness(value);
    },
    [debouncedSetBrightness, entityId]
  );

  const handleCardClick = useCallback(() => {
    if (entity && !isDragging && !hasDragged) {
      entity?.toggle?.();
    }
  }, [entity, isDragging, hasDragged]);

  const handleCardDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dimmer || !isOn || !isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      setHasDragged(true);
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const brightness = Math.round((percentage / 100) * 255);
      handleBrightnessChange(brightness);
    },
    [dimmer, isOn, isDragging, handleBrightnessChange]
  );

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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 100);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
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

  const cardStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (dimmer && isOn) {
      const fillEnd = Math.max(0, brightnessPercentage - 6);
      const fadeEnd = Math.min(brightnessPercentage + 6, 100);
      return {
        background: `linear-gradient(to right, var(--theme-slider-active) 0%, var(--theme-slider-active) ${fillEnd}%, var(--theme-card-background) ${fadeEnd}%, var(--theme-card-background) 100%)`,
        color: "var(--theme-text-on)",
      };
    }
    return undefined;
  }, [dimmer, isOn, brightnessPercentage]);

  return {
    // state
    isOn,
    brightnessPercentage,
    // styles
    cardStyle,
    // interactions
    handleCardClick,
    handleCardDrag,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    // expose unused debounced setters for future UI extensions
    debouncedSetTemperature,
    debouncedSetColor,
  };
}


