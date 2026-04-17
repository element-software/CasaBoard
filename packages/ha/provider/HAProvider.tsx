"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { clientLogger, SupabaseClient } from "@repo/lib";
import { Connection, getStates, subscribeEntities, Auth, ERR_INVALID_AUTH } from "home-assistant-js-websocket";
import { connect } from "../connection"; // Import your connect logic
import { HAInstance } from "@repo/types/ha";

export interface HAContextType {
  connection: Connection | null;
  connected: boolean;
  entities: { [entityId: string]: any };
  getEntity: (entityId: string) => any | undefined;
  getAllEntities: () => any[];
  error: Error | null;
  loading: boolean;
  retry: () => void;
}

const HAContext = createContext<HAContextType>({
  connected: false,
  entities: {},
  getEntity: () => undefined,
  getAllEntities: () => [],
  connection: null,
  error: null,
  loading: true,
  retry: () => {},
});

export interface HAProviderProps {
  haInstance: HAInstance;
  children: ReactNode;
  fallback?: ReactNode;
}

export const HAProvider: React.FC<HAProviderProps> = ({ haInstance, children, fallback = null }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [entities, setEntities] = useState<{ [entityId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [userId, setUserId] = useState<string>("");

  // Resolve the Supabase user ID on mount (browser-side only)
  useEffect(() => {
    const supabase = SupabaseClient.createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user?.id) {
        clientLogger.error('HAProvider', 'Could not resolve user ID — HA connection aborted', error);
        setError(new Error('Unable to verify your session. Please refresh the page.'));
        setLoading(false);
        return;
      }
      setUserId(data.user.id);
    });
  }, []);

  const run = async (resolvedUserId: string) => {
    let unsubscribe: (() => void) | undefined;
    let activeConnection: Connection | null = null;
    let activeAuth: Auth | null = null;

    setLoading(true);
    setError(null);
    try {
      clientLogger.info('HAProvider', `connecting to Home Assistant at ${haInstance.hass_url}`);
      const { connection, auth } = await connect({ haInstance, userId: resolvedUserId });
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

    return unsubscribe;
  };

  useEffect(() => {
    // Wait until userId is resolved before connecting
    if (!userId) return;

    let unsubscribe: (() => void) | undefined;

    const executeRun = async () => {
      unsubscribe = await run(userId);
    };

    executeRun();

    return () => {
      if (unsubscribe) unsubscribe();
      setConnection(null);
      setEntities({});
    };
  }, [haInstance.hass_url, retryCount, userId]);

  const getEntityById = (entityId: string) => entities[entityId];
  const getAllEntities = () => Object.values(entities);
  
  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <HAContext.Provider
      value={{
        connection,
        connected: Boolean(connection),
        entities,
        getEntity: getEntityById,
        getAllEntities,
        error,
        loading,
        retry,
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