import { useEffect, useState } from "react";

export function useDashboard(apiPath) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(apiPath, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Failed to load dashboard");
        }
        if (!cancelled) setStats(json);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load dashboard");
          setStats(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [apiPath]);

  return { stats, isLoading, error };
}
