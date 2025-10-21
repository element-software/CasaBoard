"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Connection } from "home-assistant-js-websocket";
import { useHA } from "../provider/HAProvider";

export interface EntityHistoryPoint {
  s: string;
  lu: string;
}

type HistoryMode = "history" | "statistics";

export function useEntityHistory(
  entityId: string | null | undefined,
  limit: number = 50,
  lookbackMs: number = 24 * 60 * 60 * 1000,
  mode: HistoryMode = "history",
) {
  const { connection } = useHA();
  const [points, setPoints] = useState<EntityHistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    async function run(conn: Connection, id: string) {
      setLoading(true);
      setError(null);

       const end = new Date();
       const start = new Date(end.getTime() - lookbackMs);
       
       // Try a longer time range if the default doesn't work
       const extendedStart = new Date(end.getTime() - (lookbackMs * 7)); // 7 days instead of 1

      console.log(
        "useEntityHistory: Starting fetch for entity:",
        id,
        "mode:",
        mode,
        "limit:",
        limit,
        "lookbackMs:",
        lookbackMs
      );

      try {
        if (mode === "statistics") {
          // Long-term statistics (downsampled, efficient for long ranges)
          +console.log(
            "useEntityHistory: Fetching statistics for",
            id,
            "from",
            start.toISOString(),
            "to",
            end.toISOString()
          );
          const stats = await conn.sendMessagePromise<any>({
            type: "recorder/statistics_during_period",
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            statistic_ids: [id],
            period: "hour", // or "5minute" | "day"
          });
          +console.log("useEntityHistory: Statistics response:", stats);

          const series = stats?.[id] ?? [];
          +console.log(
            "useEntityHistory: Statistics series for",
            id,
            ":",
            series.length,
            "points"
          );
          const parsed: EntityHistoryPoint[] = series
            .map((s: any) => ({
              state: typeof s.mean === "number" ? s.mean : Number(s.mean),
              last_changed: s.start, // bucket start
              last_updated: s.end, // bucket end
            }))
            .filter((p: EntityHistoryPoint) => Number.isFinite(p.s))
            .sort((a: { last_changed: any }, b: { last_changed: any }) =>
              a.last_changed! > b.last_changed! ? 1 : -1
            );

          +console.log(
            "useEntityHistory: Statistics parsed points:",
            parsed.length
          );
          if (!cancelled) setPoints(parsed.slice(-limit));
          return;
        }

        // Raw state history (exact state changes)
        +console.log(
          "useEntityHistory: Fetching raw history for",
          id,
          "from",
          start.toISOString(),
          "to",
          end.toISOString()
        );
         // Try extended time range first
         let data = await conn.sendMessagePromise<any>({
           type: "history/history_during_period",
           start_time: extendedStart.toISOString(),
           end_time: end.toISOString(),
           entity_ids: [id],
           minimal_response: true,
           no_attributes: true,
           include_start_time_state: true,
         });
         
         // If still null, try the original time range
         if (data === null) {
           console.log("useEntityHistory: Extended range returned null, trying original range");
           data = await conn.sendMessagePromise<any>({
             type: "history/history_during_period",
             start_time: start.toISOString(),
             end_time: end.toISOString(),
             entity_ids: [id],
             minimal_response: true,
             no_attributes: true,
             include_start_time_state: true,
           });
         }
        +console.log("useEntityHistory: Raw history response:", data);

        // Handle null response - might mean no history or different response format
        if (data === null) {
          console.log("useEntityHistory: Received null response, trying statistics mode");
          // Try statistics mode as fallback
          try {
            const stats = await conn.sendMessagePromise<any>({
              type: "recorder/statistics_during_period",
              start_time: extendedStart.toISOString(),
              end_time: end.toISOString(),
              statistic_ids: [id],
              period: "hour",
            });
            console.log("useEntityHistory: Statistics fallback response:", stats);
            
            const series = stats?.[id] ?? [];
            if (series.length > 0) {
              const parsed: EntityHistoryPoint[] = series
                .map((s: any) => ({
                  s: s.s,
                  lu: s.start,
                }))
                .sort((a: { last_changed: any }, b: { last_changed: any }) =>
                  a.last_changed! > b.last_changed! ? 1 : -1
                );
              
              console.log("useEntityHistory: Statistics fallback parsed points:", parsed.length);
              if (!cancelled) setPoints(parsed.slice(-limit));
              return;
            }
          } catch (statsErr: any) {
            console.log("useEntityHistory: Statistics fallback also failed:", statsErr);
          }
          
          console.log("useEntityHistory: All websocket methods failed, trying REST fallback");
          throw new Error("Websocket returned null - no history data");
        }

        // Parse the response - it's an object with entity_id as key, not an array
        let list: any[] = [];
        if (data && typeof data === 'object') {
          // Response format: {entity_id: [history_points]}
          list = data[id] || [];
          console.log(`useEntityHistory: Found ${list.length} points for entity ${id}`);
        } else if (Array.isArray(data)) {
          // Fallback: if it's an array, take the first element
          list = data[0] ?? [];
        }
        
        +console.log(
          "useEntityHistory: Raw history list length:",
          list.length,
          "first few items:",
          list.slice(0, 3)
        );

        if (!cancelled) setPoints(list.slice(-limit));
      } catch (wsErr: any) {
        // REST fallback (helps if WS command is blocked)
        +console.log(
          "useEntityHistory: Websocket failed, trying REST fallback:",
          wsErr
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

     if (connection && entityId) {
       console.log(
         "useEntityHistory: Connection available, entityId:",
         entityId
       );
       run(connection as any, entityId);
      
       
       // Also listen to state changes for real-time updates
       let unsubscribe: (() => void) | null = null;
       connection.subscribeEvents((event: any) => {
         if (event.data?.entity_id === entityId) {
           console.log("useEntityHistory: State change detected, refreshing data");
           run(connection as any, entityId);
         }
       }, "state_changed").then((unsub) => {
         unsubscribe = unsub;
       });
       
       return () => {
         cancelled = true;
         abortRef.current?.abort();
         if (unsubscribe) {
           unsubscribe();
         }
       };
     } else {
       console.log(
         "useEntityHistory: Missing connection or entityId - connection:",
         !!connection,
         "entityId:",
         entityId
       );
       return () => {
         cancelled = true;
         abortRef.current?.abort();
       };
     }
   }, [connection, entityId, limit, lookbackMs, mode]);

  const history = useMemo(() => points, [points]);
  return { history, loading, error };
}
