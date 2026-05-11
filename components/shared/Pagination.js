"use client";

export function Pagination({ page, totalPages, onPageChange }) {
  const last = Math.max(1, totalPages);
  return (
    <div className="flex items-center justify-between gap-4 text-sm text-zinc-600">
      <p>
        Page <span className="font-semibold text-zinc-900">{page}</span> of{" "}
        <span className="font-semibold text-zinc-900">{last}</span>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= last}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-zinc-300 px-4 py-2 font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
