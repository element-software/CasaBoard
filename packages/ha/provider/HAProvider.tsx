"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { clientLogger } from "@repo/lib";
import { Connection, getStates, subscribeEntities, Auth, ERR_INVALID_AUTH } from "home-assistant-js-websocket";
import { connect } from "../connection"; // Import your connect logic

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
    let unsubscribe: (() => void) | undefined;
    let activeConnection: Connection | null = null;
    let activeAuth: Auth | null = null;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        clientLogger.info('HAProvider', `connecting to Home Assistant at ${hassUrl}`);
        const { connection, auth } = await connect({ homeAssistantUrl: hassUrl });
        clientLogger.info('HAProvider', 'connected to Home Assistant', connection);
        activeConnection = connection;
        activeAuth = auth;
        setConnection(activeConnection);


        // Initial states
        const initial = await getStates(activeConnection);
        const initialMap = initial.reduce((acc: any, s: any) => {
          acc[s.entity_id] = s;
          return acc;
        }, {} as Record<string, any>);
        setEntities(initialMap);

        // Live updates
        unsubscribe = subscribeEntities(activeConnection, (ents) => {
          setEntities(ents as any);
        });

        setLoading(false);
      } catch (e: any) {
        setError(e);
        setConnection(null);
        setEntities({});
        setLoading(false);
        clientLogger.error('HAProvider', 'error', e);
      }
    };

    run();
    return () => {
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