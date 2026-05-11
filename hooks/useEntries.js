import { useCallback, useEffect, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

export function useEntries(apiPath) {
  const [entries, setEntries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dateFrom, dateTo]);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);

      const res = await fetch(`${apiPath}?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load entries");
      }
      setEntries(json.data ?? []);
      setTotalCount(json.count ?? 0);
      setTotalPages(json.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiPath, page, debouncedSearch, dateFrom, dateTo]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return {
    entries,
    totalCount,
    page,
    totalPages,
    /** Raw input (for controlled field) */
    search,
    setSearch,
    /** Debounced value used for API + export */
    effectiveSearch: debouncedSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    setPage,
    isLoading,
    error,
    refetch: fetchEntries,
  };
}
