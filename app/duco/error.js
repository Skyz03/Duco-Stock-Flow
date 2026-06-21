"use client";

import { useRouter } from "next/navigation";

export default function DucoError({ reset }) {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-zinc-900">Something went wrong</h2>
      <p className="text-sm text-zinc-500">An error occurred loading this page.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/duco")}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
