"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  Connection,
  getStates,
  subscribeEntities,
} from "home-assistant-js-websocket";
import { connect } from "../connect"; // Import your connect logic

export interface HAContextType {
  connection: Connection | null;
  connected: boolean;
  entities: { [entityId: string]: any };
  getEntity: (entityId: string) => any | undefined;
  getAllEntities: () => any[];
}

const HAContext = createContext<HAContextType>({
  connected: false,
  entities: {},
  getEntity: () => undefined,
  getAllEntities: () => [],
  connection: null,
});

export interface HAProviderProps {
  hassUrl: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const HAProvider: React.FC<HAProviderProps> = ({ hassUrl, children, fallback = null }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [entities, setEntities] = useState<{ [entityId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        let { connection } = await connect({ homeAssistantUrl: hassUrl });
        if (!active) return;
        setConnection(connection);

        // Initial entity states
        const initial = await getStates(connection);
        if (!active) return;
        const initialMap = initial.reduce((acc: any, s: any) => {
          acc[s.entity_id] = s;
          return acc;
        }, {} as Record<string, any>);
        setEntities(initialMap);

        // Subscribe to live updates
        unsubscribe = subscribeEntities(connection, (ents) => {
          if (!active) return;
          setEntities(ents as any);
        });

        setLoading(false);
      } catch (e: any) {
        setError(e);
        setConnection(null);
        setEntities({});
        setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
      setConnection(null);
      setEntities({});
    };
  }, [hassUrl]);

  const getEntityById = (entityId: string) => entities[entityId];
  const getAllEntities = () => Object.values(entities);

  if (error) return <>{fallback}</>;

  return (
    <HAContext.Provider
      value={{
        connection,
        connected: Boolean(connection),
        entities,
        getEntity: getEntityById,
        getAllEntities,
      }}
    >
      {children}
    </HAContext.Provider>
  );
};

export function useHA(): HAContextType {
  const ctx = useContext(HAContext);
  if (!ctx) throw new Error("useHA must be used within a HAProvider");
  return ctx;
}