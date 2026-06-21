"use client";

export function ConfirmDeleteDialog({ isOpen, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-4">
      <button type="button" className="absolute inset-0 bg-black/40" aria-label="Cancel" onClick={onCancel} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        className="animate-slide-up relative z-10 w-full max-w-md rounded-t-2xl border border-zinc-200 bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl md:animate-none md:rounded-2xl md:pb-6"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200 md:hidden" aria-hidden />
        <p id="confirm-delete-title" className="text-lg font-semibold text-zinc-900">Delete entry</p>
        <p className="mt-2 text-sm text-zinc-600">Are you sure you want to delete this entry?</p>
        <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            autoFocus
            className="min-h-[44px] w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-base font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 md:w-auto md:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-h-[44px] w-full rounded-xl bg-red-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-red-700 disabled:opacity-50 md:w-auto md:text-sm"
          >
            {isDeleting ? "Deleting…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
