import { useCallback, useEffect, useState } from "react";

export function useBreakdown(apiPath) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load breakdown");
      }
      setRows(Array.isArray(json) ? json : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load breakdown");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return { rows, isLoading, error, refetch: load };
}
