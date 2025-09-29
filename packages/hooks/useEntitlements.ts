"use client";

import { useState, useEffect } from "react";
import { Entitlements } from "@repo/types/subscription";

interface UseEntitlementsReturn {
  entitlements: Entitlements | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage user entitlements from Stripe
 * Can be used in client components for conditional rendering
 */
export function useEntitlements(): UseEntitlementsReturn {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/entitlements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch entitlements: ${response.status}`);
      }

      const data = await response.json();
      setEntitlements(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch entitlements';
      setError(errorMessage);
      console.error('useEntitlements error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntitlements();
  }, []);

  return {
    entitlements,
    loading,
    error,
    refetch: fetchEntitlements,
  };
}

/**
 * Hook to check if user can perform a specific action based on entitlements
 */
export function useEntitlementCheck() {
  const { entitlements, loading, error } = useEntitlements();

  const canCreateDashboard = (currentCount: number): boolean => {
    if (!entitlements || !entitlements.active) return false;
    if (entitlements.maxDashboards === -1) return true; // unlimited
    return currentCount < entitlements.maxDashboards;
  };

  const canCreateHAInstance = (currentCount: number): boolean => {
    if (!entitlements || !entitlements.active) return false;
    if (entitlements.maxHAInstances === -1) return true; // unlimited
    return currentCount < entitlements.maxHAInstances;
  };

  const isTrialUser = (): boolean => {
    return entitlements?.trialEndsAt !== null;
  };

  const isTrialExpired = (): boolean => {
    if (!entitlements?.trialEndsAt) return false;
    return new Date(entitlements.trialEndsAt) < new Date();
  };

  const getRemainingDashboards = (currentCount: number): number => {
    if (!entitlements || !entitlements.active) return 0;
    if (entitlements.maxDashboards === -1) return -1; // unlimited
    return Math.max(0, entitlements.maxDashboards - currentCount);
  };

  const getRemainingHAInstances = (currentCount: number): number => {
    if (!entitlements || !entitlements.active) return 0;
    if (entitlements.maxHAInstances === -1) return -1; // unlimited
    return Math.max(0, entitlements.maxHAInstances - currentCount);
  };

  return {
    entitlements,
    loading,
    error,
    canCreateDashboard,
    canCreateHAInstance,
    isTrialUser,
    isTrialExpired,
    getRemainingDashboards,
    getRemainingHAInstances,
  };
}
