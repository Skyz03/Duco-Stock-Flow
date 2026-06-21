"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEntries } from "../../hooks/useEntries";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { DataTable } from "./DataTable";
import { EntryForm } from "./EntryForm";
import { ExportCSVButton } from "./ExportCSVButton";
import { Pagination } from "./Pagination";
import { SearchAndFilter } from "./SearchAndFilter";
import { SlideOver } from "./SlideOver";

export function EntriesWorkbench({
  title,
  apiPath,
  exportPath,
  accentColor,
  fields,
  columns,
  stockCheck,
  packWarning,
}) {
  const {
    entries,
    totalCount,
    page,
    totalPages,
    search,
    setSearch,
    effectiveSearch,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    setPage,
    isLoading,
    error,
    refetch,
  } = useEntries(apiPath);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelKey, setPanelKey] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasFilters = Boolean(search || dateFrom || dateTo);

  async function handleSubmit(payload) {
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let json = {};
      try {
        json = await res.json();
      } catch {
        json = {};
      }
      if (!res.ok) {
        throw new Error(json.error || "Save failed");
      }
      setPanelOpen(false);
      toast.success("Entry saved");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${apiPath}?id=${deleteId}`, { method: "DELETE" });
      let json = {};
      try {
        json = await res.json();
      } catch {
        json = {};
      }
      if (!res.ok) {
        throw new Error(json.error || "Delete failed");
      }
      setDeleteId(null);
      toast.success("Entry deleted");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-zinc-600">Search, export, add, and remove entries.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <SearchAndFilter
            search={search}
            setSearch={setSearch}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <ExportCSVButton
            exportUrl={exportPath}
            filename="export.csv"
            search={effectiveSearch}
            dateFrom={dateFrom}
            dateTo={dateTo}
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={() => {
              setPanelKey((k) => k + 1);
              setPanelOpen(true);
            }}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto sm:text-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add entry
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="ml-4 shrink-0 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      ) : null}

      <DataTable
        columns={columns}
        data={entries}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(id)}
        hasFilters={hasFilters}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <p className="text-sm text-zinc-500">{totalCount} entries found</p>

      <SlideOver isOpen={panelOpen} onClose={() => setPanelOpen(false)} title="Add entry">
        {panelOpen ? (
          <EntryForm
            key={panelKey}
            fields={fields}
            onSubmit={handleSubmit}
            isLoading={saving}
            stockCheck={stockCheck}
            packWarning={packWarning}
            accentColor={accentColor}
          />
        ) : null}
      </SlideOver>

      <ConfirmDeleteDialog
        isOpen={Boolean(deleteId)}
        isDeleting={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
