"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useEntries } from "../../hooks/useEntries";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { DataTable } from "./DataTable";
import { EntryForm } from "./EntryForm";
import { Pagination } from "./Pagination";
import { SearchAndFilter } from "./SearchAndFilter";
import { SlideOver } from "./SlideOver";

export function EntriesWorkbench({
  title,
  apiPath,
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
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    setPage,
    isLoading,
    error,
    refetch,
  } = useEntries(apiPath);

  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);

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
        <p className="mt-1 text-sm text-zinc-600">Add and manage entries.</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-sm font-semibold text-zinc-700">New entry</p>
        <EntryForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={saving}
          stockCheck={stockCheck}
          packWarning={packWarning}
          accentColor={accentColor}
        />
      </div>

      <SearchAndFilter
        search={search}
        setSearch={setSearch}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

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
        onView={(row) => setViewEntry(row)}
        hasFilters={hasFilters}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <p className="text-sm text-zinc-500">{totalCount} entries found</p>

      <SlideOver isOpen={viewEntry !== null} onClose={() => setViewEntry(null)} title="Entry details">
        {viewEntry && (
          <dl className="divide-y divide-zinc-100">
            {fields.filter((f) => f.type !== "hidden").map((f) => (
              <div key={f.name} className="flex flex-col gap-1 py-3">
                <dt className="text-xs font-medium text-zinc-500">{f.label}</dt>
                <dd className="text-sm text-zinc-900">
                  {f.type === "image_url" && viewEntry[f.name] ? (
                    <Image src={viewEntry[f.name]} alt="" width={96} height={96} className="h-24 w-24 rounded-lg object-cover" />
                  ) : f.type === "date" && viewEntry[f.name] ? (
                    new Date(viewEntry[f.name]).toLocaleDateString()
                  ) : (
                    viewEntry[f.name] ?? "—"
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
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
