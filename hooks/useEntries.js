import { useCallback, useEffect, useRef, useState } from "react";
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

  // Stable ref for the current page so fetchEntries can read it without
  // being re-created on every page change (which would cause a double fetch
  // when filters reset the page back to 1).
  const pageRef = useRef(1);

  // When filters change, immediately reset the ref to 1. The display state
  // (page) is also set to 1, but fetchEntries reads from the ref so the
  // single effect below fires exactly once with page=1.
  useEffect(() => {
    pageRef.current = 1;
    setPage(1);
  }, [debouncedSearch, dateFrom, dateTo]);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pageRef.current));
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
    // `page` is intentionally omitted — read from pageRef instead to avoid
    // a double fetch when filters reset the page.
  }, [apiPath, debouncedSearch, dateFrom, dateTo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Pagination handler: update the ref AND the display state, then fetch.
  const handleSetPage = useCallback(
    (p) => {
      pageRef.current = p;
      setPage(p);
      fetchEntries();
    },
    [fetchEntries]
  );

  return {
    entries,
    totalCount,
    page,
    totalPages,
    search,
    setSearch,
    effectiveSearch: debouncedSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    setPage: handleSetPage,
    isLoading,
    error,
    refetch: fetchEntries,
  };
}
