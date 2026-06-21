"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Error</p>
      <h1 className="text-3xl font-semibold text-zinc-900">Something went wrong</h1>
      <p className="max-w-md text-zinc-600">{error?.message || "An unexpected error occurred."}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
