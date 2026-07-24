"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Connection,
  getStates,
  subscribeEntities,
  Auth,
} from "home-assistant-js-websocket";
import { connect, type HATokenStore } from "../connection";
import { HAConnection } from "../types";

export interface HAContextType {
  connection: Connection | null;
  auth: Auth | null;
  hassUrl: string | null;
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
  auth: null,
  hassUrl: null,
  error: null,
  loading: true,
  retry: () => {},
});

export interface HAProviderProps {
  haInstance: HAConnection;
  tokenStore: HATokenStore;
  redirectUrl?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const HAProvider: React.FC<HAProviderProps> = ({
  haInstance,
  tokenStore,
  redirectUrl,
  children,
}) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [entities, setEntities] = useState<{ [entityId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const run = async () => {
    let unsubscribe: (() => void) | undefined;

    setLoading(true);
    setError(null);
    try {
      const { connection: activeConnection, auth: activeAuth } = await connect({
        haInstance,
        tokenStore,
        redirectUrl,
      });
      setConnection(activeConnection);
      setAuth(activeAuth);

      const initial = await getStates(activeConnection);
      const initialMap = initial.reduce((acc: any, s: any) => {
        acc[s.entity_id] = s;
        return acc;
      }, {} as Record<string, any>);
      setEntities(initialMap);

      unsubscribe = subscribeEntities(activeConnection, (ents) => {
        setEntities(ents as any);
      });

      setLoading(false);
    } catch (e: any) {
      const classified =
        e instanceof Error
          ? e
          : new Error(
              typeof e?.message === "string"
                ? e.message
                : "Home Assistant connection failed"
            );
      // Preserve typed HAConnectionError when thrown from connect()
      setError(classified);
      setConnection(null);
      setAuth(null);
      setEntities({});
      setLoading(false);
    }

    return unsubscribe;
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const executeRun = async () => {
      unsubscribe = await run();
    };

    executeRun();

    return () => {
      if (unsubscribe) unsubscribe();
      setConnection(null);
      setAuth(null);
      setEntities({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect on url / retry / token store identity
  }, [haInstance.hass_url, retryCount, tokenStore, redirectUrl]);

  const getEntityById = (entityId: string) => entities[entityId];
  const getAllEntities = () => Object.values(entities);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <HAContext.Provider
      value={{
        connection,
        auth,
        hassUrl: haInstance.hass_url,
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
