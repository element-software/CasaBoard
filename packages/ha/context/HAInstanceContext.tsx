"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { HAInstanceActions } from "@repo/lib";
import { HAInstance } from "@repo/ui/components/InstanceManager/HAInstance";

interface HAInstanceContextType {
  instances: HAInstance[];
  currentInstance: HAInstance | null;
  setCurrentInstance: (instance: HAInstance | null) => void;
  setCurrentInstanceById: (instanceId: string) => void;
  loading: boolean;
  error: string | null;
}

const HAInstanceContext = createContext<HAInstanceContextType | undefined>(undefined);

export function useHAInstance() {
  const context = useContext(HAInstanceContext);
  if (context === undefined) {
    throw new Error("useHAInstance must be used within a HAInstanceProvider");
  }
  return context;
}

interface HAInstanceProviderProps {
  children: React.ReactNode;
  initialInstanceId?: string;
}

export function HAInstanceProvider({ children, initialInstanceId }: HAInstanceProviderProps) {
  const [instances, setInstances] = useState<HAInstance[]>([]);
  const [currentInstance, setCurrentInstance] = useState<HAInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all instances on mount
  useEffect(() => {
    const loadInstances = async () => {
      try {
        setLoading(true);
        setError(null);
        const allInstances = await HAInstanceActions.listHAInstances();
        setInstances(allInstances);
        
        // Set current instance based on initialInstanceId or first instance
        if (initialInstanceId) {
          const specificInstance = allInstances.find(instance => instance.id === initialInstanceId);
          setCurrentInstance(specificInstance || null);
        } else if (allInstances.length > 0) {
          setCurrentInstance(allInstances[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load HA instances");
        console.error("Failed to load HA instances:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInstances();
  }, [initialInstanceId]);

  const setCurrentInstanceById = (instanceId: string) => {
    const instance = instances.find(inst => inst.id === instanceId);
    setCurrentInstance(instance || null);
  };

  return (
    <HAInstanceContext.Provider
      value={{
        instances,
        currentInstance,
        setCurrentInstance,
        setCurrentInstanceById,
        loading,
        error,
      }}
    >
      {children}
    </HAInstanceContext.Provider>
  );
}
