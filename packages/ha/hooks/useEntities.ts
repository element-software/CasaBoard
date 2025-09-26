"use client";
import { useMemo } from "react";
import { useHA } from "../provider/HAProvider";

export interface HAEntitySummary {
  id: string; // entity_id
  domain: string;
  entity: any;
}

export function useEntities(domain?: string): HAEntitySummary[] {
  const { entities } = useHA();

  return useMemo(() => {
    const entries = Object.entries(entities ?? {});
    let mapped = entries.map(([entityId, entity]) => ({
      id: entityId,
      domain: String(entityId).split(".")[0],
      entity,
    }));

    if (domain && typeof domain === "string") {
      const domainLower = domain.toLowerCase();
      mapped = mapped.filter((e) => e.domain === domainLower);
    }

    return mapped;
  }, [entities, domain]);
}


