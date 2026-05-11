"use client";

import { useState } from "react";
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
  const [banner, setBanner] = useState("");

  async function handleSubmit(payload) {
    setSaving(true);
    setBanner("");
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
      await refetch();
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setBanner("");
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
      await refetch();
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Delete failed");
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
        <div className="flex flex-wrap items-center gap-2">
          <ExportCSVButton
            exportUrl={exportPath}
            filename="export.csv"
            search={effectiveSearch}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
          <button
            type="button"
            onClick={() => {
              setPanelKey((k) => k + 1);
              setPanelOpen(true);
            }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            Add entry
          </button>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {banner ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">{banner}</p> : null}

      <DataTable columns={columns} data={entries} isLoading={isLoading} onDelete={(id) => setDeleteId(id)} />

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
